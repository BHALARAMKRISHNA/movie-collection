import type { InsertMovie, UpdateMovie, Movie } from "@shared/schema";
import type { IStorage } from "../storage";

export class DatabaseStorage implements IStorage {
  private db: any;
  private connectionError: Error | null = null;

  constructor() {
    import("../db").then(module => {
      this.db = module.db;
      this.connectionError = module.connectionError;
    });
  }

  private async getDb() {
    const { db, connectionError } = await import("../db");
    
    if (!db) {
      const errorMsg = connectionError?.message || "Unknown error";
      throw new Error(
        `❌ MySQL database is not connected!\n\n` +
        `Error: ${errorMsg}\n\n` +
        `Troubleshooting steps:\n` +
        `1. Check MySQL server is running\n` +
        `2. Verify DATABASE_URL format: mysql://user:password@host:port/database\n` +
        `3. Ensure the database and tables exist (run database-schema.sql)\n` +
        `4. Check firewall/connection issues`
      );
    }
    return db;
  }

  async verifyConnection(): Promise<void> {
    await this.getDb();
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const db = await this.getDb();
    const { movies } = await import("@shared/schema");
    
    const result = await db
      .insert(movies)
      .values(insertMovie);
    
    const insertId = Number(result[0].insertId);
    const movie = await this.getMovieById(insertId);
    
    if (!movie) {
      throw new Error("Failed to create movie");
    }
    
    return movie;
  }

  async getMovies(page: number = 1, limit: number = 20): Promise<{ data: Movie[]; total: number }> {
    const db = await this.getDb();
    const { movies } = await import("@shared/schema");
    const { desc, sql } = await import("drizzle-orm");
    
    const offset = (page - 1) * limit;
    
    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(movies)
        .orderBy(desc(movies.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ value: sql<number>`count(*)` })
        .from(movies)
    ]);

    return {
      data,
      total: Number(countResult[0]?.value ?? 0),
    };
  }

  async getMovieById(id: number): Promise<Movie | undefined> {
    const db = await this.getDb();
    const { movies } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [movie] = await db
      .select()
      .from(movies)
      .where(eq(movies.id, id))
      .limit(1);
    return movie;
  }

  async updateMovie(id: number, updateData: UpdateMovie): Promise<Movie | undefined> {
    const db = await this.getDb();
    const { movies } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    await db
      .update(movies)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(movies.id, id));
    
    return this.getMovieById(id);
  }

  async deleteMovie(id: number): Promise<boolean> {
    const db = await this.getDb();
    const { movies } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const result = await db
      .delete(movies)
      .where(eq(movies.id, id));
    
    return Number(result[0].affectedRows) > 0;
  }
}
