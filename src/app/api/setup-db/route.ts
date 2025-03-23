import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

export async function GET() {
  try {
    // Create a payments table if it doesn't exist
    // await query(`
    //   CREATE TABLE IF NOT EXISTS payments (
    //     id SERIAL PRIMARY KEY,
    //     wallet_address TEXT NOT NULL,
    //     amount DECIMAL(18, 8) NOT NULL,
    //     token TEXT NOT NULL,
    //     chain_id INTEGER NOT NULL,
    //     tx_hash TEXT,
    //     status TEXT NOT NULL,
    //     created_at TIMESTAMPTZ DEFAULT NOW(),
    //     updated_at TIMESTAMPTZ DEFAULT NOW()
    //   )
    // `);
    
    // Create a users table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        address TEXT NOT NULL UNIQUE,
        mnemonic TEXT,
        worldcoin_id TEXT,
        worldcoin_username TEXT,
        worldcoin_address TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    
    // Create logs table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS logs (
        id VARCHAR(255) PRIMARY KEY
      )
    `);

    // Check if we can see the table
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'logs'
      )
    `);

    // Count existing logs
    const countResult = await query(`SELECT COUNT(*) FROM logs`);
    const count = countResult.rows[0].count;

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully",
      table_exists: tableCheck.rows[0].exists,
      logs_count: count
    });
  } catch (error) {
    console.error("Error setting up database:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to setup database",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
