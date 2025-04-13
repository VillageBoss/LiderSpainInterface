import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertInquirySchema, 
  insertUserFavoriteSchema,
  insertUserSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // Middleware to handle zod validation errors
  const validateBody = (schema: any) => (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(400).json({ message: "Invalid request body" });
      }
    }
  };

  // Get all properties with optional filters
  apiRouter.get("/properties", async (req, res) => {
    try {
      const { 
        featured, 
        category, 
        location, 
        minPrice, 
        maxPrice, 
        bedrooms, 
        limit 
      } = req.query;
      
      const properties = await storage.getProperties({
        featured: featured === "true",
        category: category as string,
        location: location as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        limit: limit ? Number(limit) : undefined
      });
      
      res.json(properties);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching properties" });
    }
  });

  // Get property by ID with images and features
  apiRouter.get("/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getPropertyById(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const images = await storage.getPropertyImages(propertyId);
      const features = await storage.getPropertyFeatures(propertyId);
      
      res.json({
        ...property,
        images,
        features
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching property details" });
    }
  });

  // Search properties
  apiRouter.get("/properties/search", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const properties = await storage.searchProperties(query);
      res.json(properties);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error searching properties" });
    }
  });

  // Get agents
  apiRouter.get("/agents", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching agents" });
    }
  });

  // Get agent by ID
  apiRouter.get("/agents/:id", async (req, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const agent = await storage.getAgentById(agentId);
      
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      
      res.json(agent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching agent details" });
    }
  });

  // Create or fetch user by Telegram ID
  apiRouter.post("/users/telegram", validateBody(insertUserSchema), async (req, res) => {
    try {
      const { telegramId, username, fullName, email, phone } = req.body;
      
      if (!telegramId) {
        return res.status(400).json({ message: "Telegram ID is required" });
      }
      
      let user = await storage.getUserByTelegramId(telegramId);
      
      if (!user) {
        // Create a new user if not found
        user = await storage.createUser({
          telegramId,
          username: username || `tg_${telegramId}`,
          password: Math.random().toString(36).substring(2, 15), // Generate random password
          fullName,
          email,
          phone
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error processing user" });
    }
  });

  // Get user favorites
  apiRouter.get("/users/:userId/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getFavoritesByUserId(userId);
      res.json(favorites);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching favorites" });
    }
  });

  // Get favorite properties
  apiRouter.get("/users/:userId/favorite-properties", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favoriteProperties = await storage.getFavoriteProperties(userId);
      res.json(favoriteProperties);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching favorite properties" });
    }
  });

  // Add favorite
  apiRouter.post("/favorites", validateBody(insertUserFavoriteSchema), async (req, res) => {
    try {
      const { userId, propertyId } = req.body;
      
      // Check if property exists
      const property = await storage.getPropertyById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Add to favorites
      const favorite = await storage.addFavorite({ userId, propertyId });
      res.status(201).json(favorite);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding favorite" });
    }
  });

  // Remove favorite
  apiRouter.delete("/favorites", async (req, res) => {
    try {
      const { userId, propertyId } = req.body;
      
      if (!userId || !propertyId) {
        return res.status(400).json({ message: "User ID and Property ID are required" });
      }
      
      // Remove from favorites
      const success = await storage.removeFavorite(Number(userId), Number(propertyId));
      
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error removing favorite" });
    }
  });

  // Submit inquiry/contact form
  apiRouter.post("/inquiries", validateBody(insertInquirySchema), async (req, res) => {
    try {
      const inquiry = await storage.createInquiry(req.body);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error submitting inquiry" });
    }
  });

  // Register API routes
  app.use("/api", apiRouter);

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
