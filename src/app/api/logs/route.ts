import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

// Create a new log entry - simplified for a table with only 'id' column
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate a log ID that captures the relevant information
    // Format: event_type-timestamp-randomString
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const eventType = body.event_type || 'unknown';
    
    // Include some payload info in the ID if available
    let payloadInfo = '';
    if (body.payload) {
      if (body.payload.paymentId) {
        payloadInfo = `-${body.payload.paymentId}`;
      } else if (body.payload.timestamp) {
        payloadInfo = `-${body.payload.timestamp.substring(0, 10)}`;
      }
    }
    
    const logId = `${eventType}${payloadInfo}-${timestamp}-${randomStr}`;

    // Insert log record with just the ID
    const result = await query(
      `INSERT INTO logs (id) VALUES ($1) RETURNING id`,
      [logId]
    );

    return NextResponse.json({
      success: true,
      message: "Log saved successfully",
      logId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error saving log:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save log",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Get logs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "";
    const limit = parseInt(searchParams.get("limit") || "100");
    
    let sql = "SELECT id FROM logs";
    const params = [];
    
    if (filter) {
      sql += " WHERE id LIKE $1";
      params.push(`%${filter}%`);
    }
    
    sql += " ORDER BY id DESC LIMIT $" + (params.length + 1);
    params.push(limit);
    
    const result = await query(sql, params);
    
    // Get total count
    const countResult = await query(`SELECT COUNT(*) FROM logs`);
    
    return NextResponse.json({
      success: true,
      total_count: parseInt(countResult.rows[0].count),
      logs: result.rows,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch logs",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
} 