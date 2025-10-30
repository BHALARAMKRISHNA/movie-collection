import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

let db: any = null;
let connectionError: Error | null = null;

async function initializeDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    if (!process.env.DATABASE_URL.startsWith('mysql://')) {
      throw new Error(`Invalid DATABASE_URL format. Expected mysql://, got: ${process.env.DATABASE_URL.substring(0, 20)}...`);
    }

    console.log("Initializing MySQL connection...");
    
    const connection = mysql.createPool(process.env.DATABASE_URL);
    
    // Test the connection
    const testConnection = await connection.getConnection();
    await testConnection.query('SELECT 1');
    testConnection.release();
    
    console.log("MySQL connection successful!");
    db = drizzle(connection, { schema, mode: 'default' });
    
  } catch (error) {
    connectionError = error instanceof Error ? error : new Error(String(error));
    
    console.error("MySQL connection failed: " + connectionError.message);
    console.error("Falling back to In-Memory storage");
    db = null;
  }
}

// Initialize database on module load
initializeDatabase();

export { db, connectionError };
