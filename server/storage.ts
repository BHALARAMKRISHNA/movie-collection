import type { InsertMovie, UpdateMovie, Movie } from "@shared/schema";
import { MongoStorage, createMongoStorage } from "./storage/mongo";
import { DatabaseStorage } from "./storage/mysql";

export interface IStorage {
  createMovie(movie: InsertMovie): Promise<Movie>;
  getMovies(page: number, limit: number): Promise<{ data: Movie[]; total: number }>;
  getMovieById(id: number): Promise<Movie | undefined>;
  updateMovie(id: number, movie: UpdateMovie): Promise<Movie | undefined>;
  deleteMovie(id: number): Promise<boolean>;
}

export class MemoryStorage implements IStorage {
  private movies: Map<number, Movie> = new Map();
  private nextId: number = 1;

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = this.nextId++;
    const now = new Date();
    const movie: Movie = {
      id,
      title: insertMovie.title,
      type: insertMovie.type,
      director: insertMovie.director,
      budget: insertMovie.budget ?? null,
      location: insertMovie.location ?? null,
      duration: insertMovie.duration ?? null,
      year: insertMovie.year,
      additionalDetails: insertMovie.additionalDetails ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.movies.set(id, movie);
    return movie;
  }

  async getMovies(page: number = 1, limit: number = 20): Promise<{ data: Movie[]; total: number }> {
    const allMovies = Array.from(this.movies.values());
    const sortedMovies = allMovies.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const offset = (page - 1) * limit;
    const paginatedMovies = sortedMovies.slice(offset, offset + limit);
    
    return {
      data: paginatedMovies,
      total: allMovies.length,
    };
  }

  async getMovieById(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async updateMovie(id: number, updateData: UpdateMovie): Promise<Movie | undefined> {
    const existingMovie = this.movies.get(id);
    if (!existingMovie) {
      return undefined;
    }

    const updatedMovie: Movie = {
      ...existingMovie,
      ...updateData,
      updatedAt: new Date(),
    };
    this.movies.set(id, updatedMovie);
    return updatedMovie;
  }

  async deleteMovie(id: number): Promise<boolean> {
    return this.movies.delete(id);
  }
}


export class CombinedStorage implements IStorage {
  private mysqlAvailable = true;
  private mongoAvailable = true;
  private fallback: MemoryStorage | null = null;

  constructor(public readonly primary: DatabaseStorage, public readonly replica: MongoStorage) {}

  setPrimaryAvailability(state: boolean) {
    this.mysqlAvailable = state;
  }

  setReplicaAvailability(state: boolean) {
    this.mongoAvailable = state;
  }

  private getFallback(): MemoryStorage {
    if (!this.fallback) {
      this.fallback = new MemoryStorage();
    }
    return this.fallback;
  }

  private logError(source: string, error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${source}: ${message}`);
  }

  private async syncMovie(movie: Movie | undefined) {
    if (!movie || !this.mongoAvailable) {
      return;
    }
    try {
      await this.replica.upsertMovie(movie);
      this.mongoAvailable = true;
    } catch (error) {
      this.mongoAvailable = false;
      this.logError("MongoDB synchronization failed", error);
    }
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    if (this.mysqlAvailable) {
      try {
        const movie = await this.primary.createMovie(insertMovie);
        this.mysqlAvailable = true;
        await this.syncMovie(movie);
        return movie;
      } catch (error) {
        this.mysqlAvailable = false;
        this.logError("MySQL create failed", error);
      }
    }
    if (this.mongoAvailable) {
      try {
        const movie = await this.replica.createMovie(insertMovie);
        this.mongoAvailable = true;
        return movie;
      } catch (error) {
        this.mongoAvailable = false;
        this.logError("MongoDB create failed", error);
      }
    }
    return this.getFallback().createMovie(insertMovie);
  }

  async getMovies(page: number, limit: number): Promise<{ data: Movie[]; total: number }> {
    if (this.mysqlAvailable) {
      try {
        const result = await this.primary.getMovies(page, limit);
        this.mysqlAvailable = true;
        return result;
      } catch (error) {
        this.mysqlAvailable = false;
        this.logError("MySQL list failed", error);
      }
    }
    if (this.mongoAvailable) {
      try {
        const result = await this.replica.getMovies(page, limit);
        this.mongoAvailable = true;
        return result;
      } catch (error) {
        this.mongoAvailable = false;
        this.logError("MongoDB list failed", error);
      }
    }
    return this.getFallback().getMovies(page, limit);
  }

  async getMovieById(id: number): Promise<Movie | undefined> {
    if (this.mysqlAvailable) {
      try {
        const movie = await this.primary.getMovieById(id);
        this.mysqlAvailable = true;
        if (movie) {
          return movie;
        }
      } catch (error) {
        this.mysqlAvailable = false;
        this.logError("MySQL fetch failed", error);
      }
    }
    if (this.mongoAvailable) {
      try {
        const movie = await this.replica.getMovieById(id);
        this.mongoAvailable = true;
        return movie;
      } catch (error) {
        this.mongoAvailable = false;
        this.logError("MongoDB fetch failed", error);
      }
    }
    return this.getFallback().getMovieById(id);
  }

  async updateMovie(id: number, updateData: UpdateMovie): Promise<Movie | undefined> {
    if (this.mysqlAvailable) {
      try {
        const movie = await this.primary.updateMovie(id, updateData);
        this.mysqlAvailable = true;
        if (movie) {
          await this.syncMovie(movie);
          return movie;
        }
      } catch (error) {
        this.mysqlAvailable = false;
        this.logError("MySQL update failed", error);
      }
    }
    if (this.mongoAvailable) {
      try {
        const movie = await this.replica.updateMovie(id, updateData);
        this.mongoAvailable = true;
        if (movie) {
          return movie;
        }
      } catch (error) {
        this.mongoAvailable = false;
        this.logError("MongoDB update failed", error);
      }
    }
    return this.getFallback().updateMovie(id, updateData);
  }

  async deleteMovie(id: number): Promise<boolean> {
    let primaryDeleted = false;
    if (this.mysqlAvailable) {
      try {
        primaryDeleted = await this.primary.deleteMovie(id);
        this.mysqlAvailable = true;
      } catch (error) {
        this.mysqlAvailable = false;
        this.logError("MySQL delete failed", error);
      }
    }
    let replicaDeleted = false;
    if (this.mongoAvailable) {
      try {
        replicaDeleted = await this.replica.deleteMovie(id);
        this.mongoAvailable = true;
      } catch (error) {
        this.mongoAvailable = false;
        this.logError("MongoDB delete failed", error);
      }
    }
    if (primaryDeleted || replicaDeleted) {
      return true;
    }
    return this.getFallback().deleteMovie(id);
  }
}

function initializeStorage(): IStorage {
  const mysqlUrl = process.env.DATABASE_URL ?? "";
  const mongoUri = process.env.MONGODB_URI ?? "";
  const useMySQL = process.env.USE_MYSQL === "true";
  const wantsMongo = process.env.USE_MONGODB === "true" || (mongoUri.startsWith("mongodb"));
  const mysqlConfigured = mysqlUrl.startsWith("mysql://");
  const mongoConfigured = mongoUri.startsWith("mongodb");

  if (useMySQL && wantsMongo && mongoConfigured) {
    if (!mysqlConfigured) {
      console.error("Error: DATABASE_URL is not a MySQL connection string!");
      console.error("   Switching to MongoDB storage...\n");
      return createMongoStorage();
    }
    console.log("Attempting to connect to MySQL (primary) and MongoDB (replica)...");
    return new CombinedStorage(new DatabaseStorage(), createMongoStorage());
  }

  if (useMySQL) {
    if (!mysqlUrl) {
      console.error("Error: USE_MYSQL=true but DATABASE_URL is not set!");
      if (mongoConfigured) {
        console.error("   Switching to MongoDB storage...\n");
        return createMongoStorage();
      }
      console.error("   Falling back to in-memory storage...\n");
      return new MemoryStorage();
    }

    if (!mysqlConfigured) {
      console.error("Error: DATABASE_URL is not a MySQL connection string!");
      if (mongoConfigured) {
        console.error("   Switching to MongoDB storage...\n");
        return createMongoStorage();
      }
      console.error("   Falling back to in-memory storage...\n");
      return new MemoryStorage();
    }

    console.log("Attempting to connect to MySQL...");
    return new DatabaseStorage();
  }

  if (wantsMongo) {
    if (!mongoConfigured) {
      console.error("Error: MONGODB_URI is not a MongoDB connection string!");
      console.error("   Falling back to in-memory storage...\n");
      return new MemoryStorage();
    }

    console.log("Attempting to connect to MongoDB...");
    return createMongoStorage();
  }
  
  console.log("Using In-Memory storage");
  return new MemoryStorage();
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function healthCheck(check: () => Promise<void>, attempts = 5, delayMs = 500): Promise<{ ok: boolean; error?: unknown }> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      await check();
      return { ok: true };
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await wait(delayMs);
      }
    }
  }
  return { ok: false, error: lastError };
}

export let storage: IStorage = initializeStorage();

async function finalizeStorage() {
  try {
    if (storage instanceof CombinedStorage) {
      const combined = storage as CombinedStorage;
      const mysqlStatus = await healthCheck(() => combined.primary.verifyConnection());
      const mongoStatus = await healthCheck(() => combined.replica.verifyConnection());

      combined.setPrimaryAvailability(mysqlStatus.ok);
      combined.setReplicaAvailability(mongoStatus.ok);

      if (!mysqlStatus.ok && mysqlStatus.error) {
        const message = mysqlStatus.error instanceof Error ? mysqlStatus.error.message : String(mysqlStatus.error);
        console.error("MySQL health check failed", message);
      }
      if (!mongoStatus.ok && mongoStatus.error) {
        const message = mongoStatus.error instanceof Error ? mongoStatus.error.message : String(mongoStatus.error);
        console.error("MongoDB health check failed", message);
      }

      if (!mysqlStatus.ok && mongoStatus.ok) {
        console.log("MySQL unavailable, running with MongoDB fallback\n");
        storage = combined.replica;
        return;
      }

      if (mysqlStatus.ok && mongoStatus.ok) {
        console.log("Running MySQL primary with MongoDB replica\n");
        return;
      }

      if (mysqlStatus.ok) {
        console.log("MongoDB unavailable, running with MySQL only\n");
        setTimeout(finalizeStorage, 2000);
        return;
      }

      combined.setPrimaryAvailability(false);
      combined.setReplicaAvailability(false);
      console.log("All databases unavailable\n");
      setTimeout(finalizeStorage, 2000);
      return;
    }

    if (storage instanceof DatabaseStorage) {
      const { db, connectionError } = await import('./db');
      if (db && !connectionError) {
        console.log("Using MySQL Database storage\n");
        return;
      }
      console.error("❌ MySQL connection failed");
      const mongoUri = process.env.MONGODB_URI ?? "";
      const mongoConfigured = mongoUri.startsWith("mongodb");
      if (process.env.USE_MONGODB === "true" || mongoConfigured) {
        try {
          const mongoStorage = createMongoStorage();
          await mongoStorage.verifyConnection();
          storage = mongoStorage;
          console.log("✅ Switched to MongoDB storage\n");
          return;
        } catch (mongoError) {
          console.error("❌ MongoDB fallback failed:", mongoError instanceof Error ? mongoError.message : mongoError);
        }
      }
      storage = new MemoryStorage();
      console.log("⚠️  Using In-Memory storage\n");
      return;
    }

    if (storage instanceof MongoStorage) {
      await storage.verifyConnection();
      console.log("✅ Using MongoDB storage\n");
      return;
    }

    console.log("⚠️  Using In-Memory storage\n");
  } catch (error) {
    console.error("Error checking storage status:", error);
  }
}

finalizeStorage();
