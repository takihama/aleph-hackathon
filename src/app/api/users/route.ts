import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.worldcoin_username || !body.worldcoin_address) {
      return NextResponse.json(
        {
          success: false,
          message: "Worldcoin username and address are required",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    const {
      address,
      mnemonic,
      worldcoin_username,
      worldcoin_address,
      worldcoin_id,
    } = body;

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address is required" },
        { status: 400 }
      );
    }

    // Insert user record
    const result = await query(
      `INSERT INTO users 
       (address, mnemonic, worldcoin_username, worldcoin_address, worldcoin_id) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [
        address,
        mnemonic || null,
        worldcoin_username || null,
        worldcoin_address || null,
        worldcoin_id || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "User saved successfully",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save user",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const worldcoin_address = searchParams.get("worldcoin_address");

    let result;

    if (worldcoin_address) {
      // Get specific user by address
      result = await query(
        "SELECT id, address, worldcoin_username, worldcoin_address, created_at, updated_at FROM users WHERE worldcoin_address = $1",
        [worldcoin_address]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: result.rows[0],
      });
    } else {
      return NextResponse.json({
        success: true,
        user: null,
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
