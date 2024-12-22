import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  price: integer("price").notNull(),
  specifications: json("specifications").notNull(),
  features: json("features").notNull(),
  imageUrl: text("image_url"),
  amazonUrl: text("amazon_url"),
});

export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);
export type InsertProduct = typeof products.$inferInsert;
export type SelectProduct = typeof products.$inferSelect;
