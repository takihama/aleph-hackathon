import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import * as db from "@/lib/server/db"; // Correct import path

export async function POST(request: NextRequest) {
  try {
    const { worldcoin_address } = await request.json();

    // Validate the request data
    if (!worldcoin_address) {
      return NextResponse.json(
        {
          error: "Invalid withdrawal request. Address required.",
        },
        { status: 400 }
      );
    }

    // Generate a unique ID for the withdrawal
    const id = uuidv4();

    // Insert the withdrawal record
    await db.query(
      "INSERT INTO withdrawals (id, worldcoin_address, status) VALUES ($1, $2, $3)",
      [id, worldcoin_address, "pending"]
    );

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted successfully",
      id,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json(
      { error: "Failed to process withdrawal request" },
      { status: 500 }
    );
  }
}
