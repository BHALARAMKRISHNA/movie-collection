import { MongoClient, Db } from "mongodb";
import type { Collection, Filter, ModifyResult, ObjectId, OptionalId } from "mongodb";
import type { InsertMovie, UpdateMovie, Movie } from "@shared/schema";
import type { IStorage } from "../storage";

type CounterDocument = { _id: string; seq: number };
type MovieDocument = Movie & { _id?: ObjectId };

export class MongoStorage implements IStorage {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private async getDb(): Promise<Db> {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }
    if (!this.client) {
      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db(process.env.MONGODB_DB_NAME || "movie_db");
    }
    return this.db!;
  }

  private async getMoviesCollection(): Promise<Collection<MovieDocument>> {
    const db = await this.getDb();
    return db.collection<MovieDocument>("movies");
  }

  private async getCountersCollection(): Promise<Collection<CounterDocument>> {
    const db = await this.getDb();
    return db.collection<CounterDocument>("counters");
  }

  private async getNextId(): Promise<number> {
    const counters = await this.getCountersCollection();
    const result = (await counters.findOneAndUpdate(
      { _id: "movies" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    )) as ModifyResult<CounterDocument> | null;

    if (result?.value?.seq != null) {
      return result.value.seq;
    }

    const fallback = await counters.findOne({ _id: "movies" });
    if (fallback?.seq != null) {
      return fallback.seq;
    }

    return 1;
  }

  private normalizeId(id: unknown): number {
    if (typeof id === "number" && Number.isFinite(id)) {
      return id;
    }
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private buildIdFilter(id: number): Filter<MovieDocument> {
    return { $or: [{ id }, { id: id.toString() }] } as Filter<MovieDocument>;
  }

  private mapDocument(document: MovieDocument): Movie {
    const { _id, ...rest } = document;
    return { ...rest, id: this.normalizeId(rest.id) };
  }

  async verifyConnection(): Promise<void> {
    const db = await this.getDb();
    await db.command({ ping: 1 });
  }

  async upsertMovie(movie: Movie): Promise<void> {
    const collection = await this.getMoviesCollection();
    const normalizedId = this.normalizeId(movie.id);
    const normalizedMovie = { ...movie, id: normalizedId };
    await collection.updateOne(this.buildIdFilter(normalizedId), { $set: { ...normalizedMovie } }, { upsert: true });
    const counters = await this.getCountersCollection();
    await counters.updateOne({ _id: "movies" }, { $max: { seq: normalizedId } }, { upsert: true });
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const collection = await this.getMoviesCollection();
    const id = await this.getNextId();
    const now = new Date();
    const movie: OptionalId<MovieDocument> = {
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
    await collection.insertOne(movie);
    return this.mapDocument(movie as MovieDocument);
  }

  async getMovies(page: number = 1, limit: number = 20): Promise<{ data: Movie[]; total: number }> {
    const collection = await this.getMoviesCollection();
    const offset = (page - 1) * limit;
    const cursor = collection
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    const [documents, total] = await Promise.all([
      cursor.toArray(),
      collection.countDocuments(),
    ]);
    return {
      data: documents.map((doc) => this.mapDocument(doc)),
      total,
    };
  }

  async getMovieById(id: number): Promise<Movie | undefined> {
    const collection = await this.getMoviesCollection();
    const document = await collection.findOne(this.buildIdFilter(id));
    return document ? this.mapDocument(document) : undefined;
  }

  async updateMovie(id: number, updateData: UpdateMovie): Promise<Movie | undefined> {
    const collection = await this.getMoviesCollection();
    const normalizedId = this.normalizeId(id);
    const filter = this.buildIdFilter(normalizedId);
    const now = new Date();
    const update: Record<string, unknown> = { ...updateData, updatedAt: now };
    Object.keys(update).forEach((key) => {
      if (update[key] === undefined) {
        delete update[key];
      }
    });

    const result = await collection.updateOne(filter, { $set: update });
    if (result.matchedCount === 0) {
      return undefined;
    }

    return this.getMovieById(normalizedId);
  }

  async deleteMovie(id: number): Promise<boolean> {
    const collection = await this.getMoviesCollection();
    const existing = await collection.findOne(this.buildIdFilter(id));
    if (!existing?._id) {
      return false;
    }
    const result = await collection.deleteOne({ _id: existing._id });
    return result.deletedCount === 1;
  }
}

export function createMongoStorage(): MongoStorage {
  return new MongoStorage();
}
