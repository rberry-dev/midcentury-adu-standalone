import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  serial,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Models (floor plans)
// ---------------------------------------------------------------------------

export const modelsTable = pgTable("models", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  sf: integer("sf").notNull(),
  type: text("type").notNull(),
  badge: text("badge").notNull(),
  badgeBg: text("badge_bg").notNull(),
  badgeColor: text("badge_color").notNull(),
  scenario: text("scenario").notNull(),
  tagline: text("tagline").notNull(),
  beds: text("beds").notNull(),
  baths: integer("baths").notNull(),
  stories: integer("stories").notNull(),
  priceCents: integer("price_cents").notNull(),
  furnishingPriceCents: integer("furnishing_price_cents").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const modelImagesTable = pgTable("model_images", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id")
    .notNull()
    .references(() => modelsTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  kind: text("kind").notNull().default("gallery"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const includedProductsTable = pgTable("included_products", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id")
    .notNull()
    .references(() => modelsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const modelsRelations = relations(modelsTable, ({ many }) => ({
  images: many(modelImagesTable),
  products: many(includedProductsTable),
}));

export const modelImagesRelations = relations(modelImagesTable, ({ one }) => ({
  model: one(modelsTable, {
    fields: [modelImagesTable.modelId],
    references: [modelsTable.id],
  }),
}));

export const includedProductsRelations = relations(includedProductsTable, ({ one }) => ({
  model: one(modelsTable, {
    fields: [includedProductsTable.modelId],
    references: [modelsTable.id],
  }),
}));

export type Model = typeof modelsTable.$inferSelect;
export type InsertModel = typeof modelsTable.$inferInsert;
export type ModelImage = typeof modelImagesTable.$inferSelect;
export type InsertModelImage = typeof modelImagesTable.$inferInsert;
export type IncludedProduct = typeof includedProductsTable.$inferSelect;
export type InsertIncludedProduct = typeof includedProductsTable.$inferInsert;

// ---------------------------------------------------------------------------
// Posts (blog)
// ---------------------------------------------------------------------------

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""),
  category: text("category").notNull(),
  heroImageUrl: text("hero_image_url"),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Post = typeof postsTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  status: text("status").notNull().default("new"),
  name: text("name"),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  zip: text("zip"),
  modelInterest: text("model_interest"),
  intendedUse: text("intended_use"),
  processStage: text("process_stage"),
  message: text("message"),
  scheduledAt: timestamp("scheduled_at"),
  notes: text("notes"),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Lead = typeof leadsTable.$inferSelect;
export type InsertLead = typeof leadsTable.$inferInsert;

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

export const availabilityWindowsTable = pgTable("availability_windows", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(),
  startMinute: integer("start_minute").notNull(),
  endMinute: integer("end_minute").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AvailabilityWindow = typeof availabilityWindowsTable.$inferSelect;
export type InsertAvailabilityWindow =
  typeof availabilityWindowsTable.$inferInsert;
