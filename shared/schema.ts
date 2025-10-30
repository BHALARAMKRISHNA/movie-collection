import { sql } from "drizzle-orm";
import { mysqlTable, varchar, int, decimal, text, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const movies = mysqlTable("movies", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  director: varchar("director", { length: 255 }).notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).$type<number | null>(),
  location: varchar("location", { length: 500 }),
  duration: int("duration"),
  year: int("year").notNull(),
  additionalDetails: text("additional_details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const baseMovieSchema = createInsertSchema(movies, {
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  type: z.enum(["Movie", "TV Show"], { required_error: "Type is required" }),
  director: z.string().min(1, "Director is required").max(255, "Director must be less than 255 characters"),
  budget: z.number().positive("Budget must be positive").optional().nullable(),
  location: z.string().max(500, "Location must be less than 500 characters").optional().nullable(),
  duration: z.number().int("Duration must be a whole number").positive("Duration must be positive").optional().nullable(),
  year: z.number().int("Year must be a whole number").min(1800, "Year must be after 1800").max(new Date().getFullYear() + 10, "Year cannot be too far in the future"),
  additionalDetails: z.string().max(1000, "Additional details must be less than 1000 characters").optional().nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMovieSchema = baseMovieSchema.refine(
  (data) => {
    if (data.type === "Movie" && !data.duration) {
      return false;
    }
    return true;
  },
  {
    message: "Duration is required for movies",
    path: ["duration"],
  }
);

export const updateMovieSchema = baseMovieSchema.partial().refine(
  (data) => {
    if (data.type === "Movie" && !data.duration) {
      return false;
    }
    return true;
  },
  {
    message: "Duration is required for movies",
    path: ["duration"],
  }
);

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type UpdateMovie = z.infer<typeof updateMovieSchema>;
export type Movie = typeof movies.$inferSelect;
