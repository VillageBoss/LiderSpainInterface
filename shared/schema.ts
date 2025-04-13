import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  telegramId: text("telegram_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phone: true,
  telegramId: true,
});

// Property schema
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  location: text("location").notNull(),
  area: decimal("area", { precision: 10, scale: 2 }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  featured: boolean("featured").default(false),
  isNewDevelopment: boolean("is_new_development").default(false),
  isNewListing: boolean("is_new_listing").default(false),
  category: text("category").notNull(),
  plotSize: decimal("plot_size", { precision: 10, scale: 2 }),
  reference: text("reference").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).pick({
  title: true,
  description: true,
  price: true,
  location: true,
  area: true,
  bedrooms: true,
  bathrooms: true,
  featured: true,
  isNewDevelopment: true,
  isNewListing: true,
  category: true,
  plotSize: true,
  reference: true,
});

// Property Images schema
export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  imageUrl: text("image_url").notNull(),
  isPrimary: boolean("is_primary").default(false),
});

export const insertPropertyImageSchema = createInsertSchema(propertyImages).pick({
  propertyId: true,
  imageUrl: true,
  isPrimary: true,
});

// Property Features schema
export const propertyFeatures = pgTable("property_features", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  feature: text("feature").notNull(),
});

export const insertPropertyFeatureSchema = createInsertSchema(propertyFeatures).pick({
  propertyId: true,
  feature: true,
});

// Agent schema
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  phone: text("phone"),
  email: text("email"),
});

export const insertAgentSchema = createInsertSchema(agents).pick({
  name: true,
  title: true,
  description: true,
  imageUrl: true,
  phone: true,
  email: true,
});

// UserFavorites schema - to track favorite properties
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).pick({
  userId: true,
  propertyId: true,
});

// Inquiry schema - for contact forms
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  propertyInterest: text("property_interest"),
  budget: text("budget"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  propertyId: integer("property_id"),
});

export const insertInquirySchema = createInsertSchema(inquiries).pick({
  fullName: true,
  email: true,
  phone: true,
  propertyInterest: true,
  budget: true,
  message: true,
  propertyId: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type PropertyImage = typeof propertyImages.$inferSelect;
export type InsertPropertyImage = z.infer<typeof insertPropertyImageSchema>;

export type PropertyFeature = typeof propertyFeatures.$inferSelect;
export type InsertPropertyFeature = z.infer<typeof insertPropertyFeatureSchema>;

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

// Categories for property types
export const PropertyCategories = ['Villa', 'Apartment', 'Penthouse', 'Estate', 'Beach House', 'New Development'] as const;
export type PropertyCategory = typeof PropertyCategories[number];

// Locations for properties
export const PropertyLocations = ['Marbella', 'Ibiza', 'Mallorca', 'Costa del Sol', 'Madrid', 'Puerto Banús', 'Estepona', 'Benahavis', 'Sotogrande'] as const;
export type PropertyLocation = typeof PropertyLocations[number];
