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
    
    console.error("\nMySQL Connection Error:");
    console.error("─".repeat(50));
    
    if (connectionError.message.includes('ECONNREFUSED')) {
      console.error("  Connection refused at 127.0.0.1:3306");
      console.error("  Make sure MySQL server is running");
      console.error("  Tip: Start MySQL from MySQL Workbench or command line");
    } else if (connectionError.message.includes('Access denied')) {
      console.error("  Access denied - Wrong username or password");
      console.error("  DATABASE_URL: " + process.env.DATABASE_URL?.replace(/:[^@]*@/, ':****@'));
      console.error("  Check your password contains: 6193@Bk");
    } else if (connectionError.message.includes('Unknown database')) {
      console.error("  Database 'movie_db' does not exist");
      console.error("  Create it in MySQL Workbench first");
      console.error("  Right-click Connection → Create Schema → name it 'movie_db'");
    } else if (connectionError.message.includes('Table') && connectionError.message.includes('doesn')) {
      console.error("  Required tables not found");
      console.error("  Run the database-schema.sql file in MySQL Workbench");
    } else {
      console.error("  " + connectionError.message);
    }
    
    console.error("─".repeat(50));
    console.error("\nFalling back to In-Memory storage");
    console.error("   Data will be lost when the application restarts!\n");
    
    db = null;
  }
}

// Initialize database on module load
initializeDatabase();

export { db, connectionError };
