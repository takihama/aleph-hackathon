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
    
    return NextResponse.json({
      success: true,
      message: "Database tables created successfully",
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
