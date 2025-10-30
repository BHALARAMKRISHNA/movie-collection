import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMovieSchema, updateMovieSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/movies", async (req, res) => {
    try {
      const validatedData = insertMovieSchema.parse(req.body);
      const movie = await storage.createMovie(validatedData);
      res.status(201).json(movie);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Validation error",
          errorCode: "VALIDATION_ERROR",
          details: error.errors,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error("Error creating movie:", error);
        res.status(500).json({
          error: "Failed to create movie",
          errorCode: "INTERNAL_ERROR",
          timestamp: new Date().toISOString(),
        });
      }
    }
  });

  app.get("/api/movies", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      const { data, total } = await storage.getMovies(page, limit);
      
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;

      res.json({
        data,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalRecords: total,
          totalPages,
          hasNextPage,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching movies:", errorMessage);
      
      if (errorMessage.includes("MySQL database is not connected")) {
        return res.status(503).json({
          error: "Database is not connected",
          errorCode: "DATABASE_ERROR",
          details: errorMessage,
          timestamp: new Date().toISOString(),
        });
      }
      
      res.status(500).json({
        error: "Failed to fetch movies",
        errorCode: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
      });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid movie ID",
          errorCode: "INVALID_ID",
          timestamp: new Date().toISOString(),
        });
      }

      const movie = await storage.getMovieById(id);

      if (!movie) {
        return res.status(404).json({
          error: "Movie not found",
          errorCode: "NOT_FOUND",
          timestamp: new Date().toISOString(),
        });
      }

      res.json(movie);
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500).json({
        error: "Failed to fetch movie",
        errorCode: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
      });
    }
  });

  app.put("/api/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid movie ID",
          errorCode: "INVALID_ID",
          timestamp: new Date().toISOString(),
        });
      }

      const validatedData = updateMovieSchema.parse(req.body);
      const updated = await storage.updateMovie(id, validatedData);
      const movie = updated ?? await storage.getMovieById(id);

      if (!movie) {
        return res.status(404).json({
          error: "Movie not found",
          errorCode: "NOT_FOUND",
          timestamp: new Date().toISOString(),
        });
      }

      res.json(movie);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Validation error",
          errorCode: "VALIDATION_ERROR",
          details: error.errors,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error("Error updating movie:", error);
        res.status(500).json({
          error: "Failed to update movie",
          errorCode: "INTERNAL_ERROR",
          timestamp: new Date().toISOString(),
        });
      }
    }
  });

  app.delete("/api/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid movie ID",
          errorCode: "INVALID_ID",
          timestamp: new Date().toISOString(),
        });
      }

      const deleted = await storage.deleteMovie(id);

      if (!deleted) {
        return res.status(404).json({
          error: "Movie not found",
          errorCode: "NOT_FOUND",
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        message: "Entry deleted successfully",
        id,
      });
    } catch (error) {
      console.error("Error deleting movie:", error);
      res.status(500).json({
        error: "Failed to delete movie",
        errorCode: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
