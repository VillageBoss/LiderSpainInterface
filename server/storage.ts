import {
  users, type User, type InsertUser,
  properties, type Property, type InsertProperty,
  propertyImages, type PropertyImage, type InsertPropertyImage,
  propertyFeatures, type PropertyFeature, type InsertPropertyFeature,
  agents, type Agent, type InsertAgent,
  userFavorites, type UserFavorite, type InsertUserFavorite,
  inquiries, type Inquiry, type InsertInquiry,
  PropertyCategories, PropertyLocations
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property operations
  getProperties(options?: { 
    featured?: boolean;
    category?: string; 
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    limit?: number;
  }): Promise<Property[]>;
  getPropertyById(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;

  // Property Images operations
  getPropertyImages(propertyId: number): Promise<PropertyImage[]>;
  createPropertyImage(image: InsertPropertyImage): Promise<PropertyImage>;

  // Property Features operations
  getPropertyFeatures(propertyId: number): Promise<PropertyFeature[]>;
  createPropertyFeature(feature: InsertPropertyFeature): Promise<PropertyFeature>;

  // Agent operations
  getAgents(): Promise<Agent[]>;
  getAgentById(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;

  // Favorites operations
  getFavoritesByUserId(userId: number): Promise<number[]>;
  addFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFavorite(userId: number, propertyId: number): Promise<boolean>;
  getFavoriteProperties(userId: number): Promise<Property[]>;

  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;

  // Search operations
  searchProperties(query: string): Promise<Property[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private propertyImages: Map<number, PropertyImage[]>;
  private propertyFeatures: Map<number, PropertyFeature[]>;
  private agents: Map<number, Agent>;
  private userFavorites: Map<number, Set<number>>;
  private inquiries: Inquiry[];
  
  // Auto increment counters
  private userIdCounter: number;
  private propertyIdCounter: number;
  private propertyImageIdCounter: number;
  private propertyFeatureIdCounter: number;
  private agentIdCounter: number;
  private userFavoriteIdCounter: number;
  private inquiryIdCounter: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.propertyImages = new Map();
    this.propertyFeatures = new Map();
    this.agents = new Map();
    this.userFavorites = new Map();
    this.inquiries = [];

    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.propertyImageIdCounter = 1;
    this.propertyFeatureIdCounter = 1;
    this.agentIdCounter = 1;
    this.userFavoriteIdCounter = 1;
    this.inquiryIdCounter = 1;

    // Initialize with sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property operations
  async getProperties(options?: { 
    featured?: boolean;
    category?: string; 
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    limit?: number;
  }): Promise<Property[]> {
    let properties = Array.from(this.properties.values());

    // Apply filters if options are provided
    if (options) {
      if (options.featured !== undefined) {
        properties = properties.filter(p => p.featured === options.featured);
      }

      if (options.category) {
        properties = properties.filter(p => p.category === options.category);
      }

      if (options.location) {
        properties = properties.filter(p => p.location.includes(options.location!));
      }

      if (options.minPrice !== undefined) {
        properties = properties.filter(p => Number(p.price) >= options.minPrice!);
      }

      if (options.maxPrice !== undefined) {
        properties = properties.filter(p => Number(p.price) <= options.maxPrice!);
      }

      if (options.bedrooms !== undefined) {
        properties = properties.filter(p => p.bedrooms >= options.bedrooms!);
      }

      if (options.limit) {
        properties = properties.slice(0, options.limit);
      }
    }

    return properties;
  }

  async getPropertyById(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const property: Property = { 
      ...insertProperty, 
      id, 
      createdAt: new Date() 
    };
    this.properties.set(id, property);
    return property;
  }

  // Property Images operations
  async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    return this.propertyImages.get(propertyId) || [];
  }

  async createPropertyImage(insertImage: InsertPropertyImage): Promise<PropertyImage> {
    const id = this.propertyImageIdCounter++;
    const image: PropertyImage = { ...insertImage, id };
    
    if (!this.propertyImages.has(insertImage.propertyId)) {
      this.propertyImages.set(insertImage.propertyId, []);
    }
    
    this.propertyImages.get(insertImage.propertyId)!.push(image);
    return image;
  }

  // Property Features operations
  async getPropertyFeatures(propertyId: number): Promise<PropertyFeature[]> {
    return this.propertyFeatures.get(propertyId) || [];
  }

  async createPropertyFeature(insertFeature: InsertPropertyFeature): Promise<PropertyFeature> {
    const id = this.propertyFeatureIdCounter++;
    const feature: PropertyFeature = { ...insertFeature, id };
    
    if (!this.propertyFeatures.has(insertFeature.propertyId)) {
      this.propertyFeatures.set(insertFeature.propertyId, []);
    }
    
    this.propertyFeatures.get(insertFeature.propertyId)!.push(feature);
    return feature;
  }

  // Agent operations
  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgentById(id: number): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = this.agentIdCounter++;
    const agent: Agent = { ...insertAgent, id };
    this.agents.set(id, agent);
    return agent;
  }

  // Favorites operations
  async getFavoritesByUserId(userId: number): Promise<number[]> {
    const userFavorites = this.userFavorites.get(userId);
    return userFavorites ? Array.from(userFavorites) : [];
  }

  async addFavorite(insertFavorite: InsertUserFavorite): Promise<UserFavorite> {
    const id = this.userFavoriteIdCounter++;
    const favorite: UserFavorite = { ...insertFavorite, id };
    
    if (!this.userFavorites.has(insertFavorite.userId)) {
      this.userFavorites.set(insertFavorite.userId, new Set());
    }
    
    this.userFavorites.get(insertFavorite.userId)!.add(insertFavorite.propertyId);
    return favorite;
  }

  async removeFavorite(userId: number, propertyId: number): Promise<boolean> {
    const userFavorites = this.userFavorites.get(userId);
    if (!userFavorites) return false;
    
    return userFavorites.delete(propertyId);
  }

  async getFavoriteProperties(userId: number): Promise<Property[]> {
    const favoriteIds = await this.getFavoritesByUserId(userId);
    return favoriteIds.map(id => this.properties.get(id)!).filter(Boolean);
  }

  // Inquiry operations
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.inquiryIdCounter++;
    const inquiry: Inquiry = { ...insertInquiry, id, createdAt: new Date() };
    this.inquiries.push(inquiry);
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return this.inquiries;
  }

  // Search operations
  async searchProperties(query: string): Promise<Property[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.properties.values()).filter(property => {
      return (
        property.title.toLowerCase().includes(lowercaseQuery) ||
        property.description.toLowerCase().includes(lowercaseQuery) ||
        property.location.toLowerCase().includes(lowercaseQuery) ||
        property.category.toLowerCase().includes(lowercaseQuery) ||
        property.reference.toLowerCase().includes(lowercaseQuery)
      );
    });
  }

  // Initialize sample data
  private async initializeData() {
    // Create a sample user
    await this.createUser({
      username: "telegramuser",
      password: "password123",
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+123456789",
      telegramId: "12345"
    });

    // Create some sample agents
    const agent1 = await this.createAgent({
      name: "Maria Rodriguez",
      title: "Senior Luxury Real Estate Consultant",
      description: "Specialized in high-end properties in Marbella with over 15 years of experience in the luxury real estate market.",
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
      phone: "+34 951 000 111",
      email: "maria@leaderspain.com"
    });

    const agent2 = await this.createAgent({
      name: "Carlos Mendez",
      title: "Luxury Property Specialist",
      description: "Expert in luxury villas and estates across Costa del Sol.",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
      phone: "+34 951 000 222",
      email: "carlos@leaderspain.com"
    });

    // Create sample properties
    const property1 = await this.createProperty({
      title: "Exclusive Villa",
      description: "This magnificent villa is situated in one of the most prestigious areas of Puerto Banús, offering breathtaking views of the Mediterranean Sea. The property has been designed with the utmost attention to detail, featuring high-end finishes and state-of-the-art technology throughout.\n\nThe open floor plan provides a seamless flow between indoor and outdoor living spaces, with floor-to-ceiling windows that flood the home with natural light and showcase the spectacular views.",
      price: "3500000",
      location: "Puerto Banús, Marbella",
      area: "650",
      bedrooms: 5,
      bathrooms: 6,
      featured: true,
      isNewDevelopment: false,
      isNewListing: false,
      category: "Villa",
      plotSize: "1200",
      reference: "LS-2435"
    });

    // Add images for property 1
    await this.createPropertyImage({
      propertyId: property1.id,
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      isPrimary: true
    });
    await this.createPropertyImage({
      propertyId: property1.id,
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
      isPrimary: false
    });
    await this.createPropertyImage({
      propertyId: property1.id,
      imageUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      isPrimary: false
    });
    await this.createPropertyImage({
      propertyId: property1.id,
      imageUrl: "https://images.unsplash.com/photo-1539922631499-09155cc609a4",
      isPrimary: false
    });

    // Add features for property 1
    const features1 = [
      "Private Pool", "Sea Views", "Home Automation", "Underfloor Heating",
      "Garden", "Garage (3 cars)", "24h Security", "Guest House", "Wine Cellar"
    ];
    
    for (const feature of features1) {
      await this.createPropertyFeature({
        propertyId: property1.id,
        feature
      });
    }

    // Create more properties
    const property2 = await this.createProperty({
      title: "Modern House",
      description: "Contemporary luxury residence with stunning views and exceptional design elements.",
      price: "2100000",
      location: "La Zagaleta, Benahavis",
      area: "420",
      bedrooms: 4,
      bathrooms: 5,
      featured: false,
      isNewDevelopment: false,
      isNewListing: false,
      category: "Villa",
      plotSize: "800",
      reference: "LS-1875"
    });

    await this.createPropertyImage({
      propertyId: property2.id,
      imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      isPrimary: true
    });

    const property3 = await this.createProperty({
      title: "Beachfront Penthouse",
      description: "Luxurious penthouse with direct beach access and panoramic sea views.",
      price: "4750000",
      location: "Estepona, Costa del Sol",
      area: "380",
      bedrooms: 3,
      bathrooms: 4,
      featured: false,
      isNewDevelopment: false,
      isNewListing: true,
      category: "Penthouse",
      plotSize: "0",
      reference: "LS-3287"
    });

    await this.createPropertyImage({
      propertyId: property3.id,
      imageUrl: "https://images.unsplash.com/photo-1613977257592-4a9a32f9734e",
      isPrimary: true
    });

    // Similar properties
    await this.createProperty({
      title: "Modern Villa",
      description: "Contemporary design with panoramic views and infinity pool.",
      price: "2900000",
      location: "Golden Mile, Marbella",
      area: "520",
      bedrooms: 4,
      bathrooms: 5,
      featured: false,
      isNewDevelopment: false,
      isNewListing: false,
      category: "Villa",
      plotSize: "900",
      reference: "LS-2145"
    });

    await this.createProperty({
      title: "Beach House",
      description: "Stunning beachfront property with direct access to the Mediterranean.",
      price: "3250000",
      location: "Nueva Andalucía, Marbella",
      area: "600",
      bedrooms: 5,
      bathrooms: 6,
      featured: false,
      isNewDevelopment: false,
      isNewListing: false,
      category: "Villa",
      plotSize: "1000",
      reference: "LS-2673"
    });

    await this.createProperty({
      title: "Luxury Estate",
      description: "Magnificent estate with extensive gardens and complete privacy.",
      price: "4100000",
      location: "Sotogrande, Cádiz",
      area: "750",
      bedrooms: 6,
      bathrooms: 7,
      featured: false,
      isNewDevelopment: false,
      isNewListing: false,
      category: "Estate",
      plotSize: "3000",
      reference: "LS-3111"
    });
  }
}

export const storage = new MemStorage();
