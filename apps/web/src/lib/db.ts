import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Initialize the SQL client with the database URL
const sql = neon(process.env.DATABASE_URL!)

// Initialize the Drizzle ORM instance
export const db = drizzle(sql)

// Helper function for executing raw SQL queries
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  try {
    const result = await sql(query, params)
    return result as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function for transactions
export async function transaction<T = any>(callback: (client: any) => Promise<T>): Promise<T> {
  try {
    const result = await sql.transaction(callback)
    return result as T
  } catch (error) {
    console.error("Transaction error:", error)
    throw error
  }
}
