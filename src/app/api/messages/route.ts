import { NextResponse } from "next/server";

// In-memory storage for messages (will reset on server restart)
let messages: {text: string, timestamp: string}[] = [];

// Add a new message
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.text) {
      return NextResponse.json(
        { success: false, message: "Message text is required" },
        { status: 400 }
      );
    }

    // Add message to the array (limit to most recent 100)
    const newMessage = {
      text: body.text,
      timestamp: new Date().toISOString()
    };
    
    messages.unshift(newMessage); // Add to beginning of array
    
    if (messages.length > 100) {
      messages = messages.slice(0, 100); // Keep only last 100 messages
    }

    return NextResponse.json({
      success: true,
      message: "Message added successfully"
    });
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Get all messages
export async function GET() {
  return NextResponse.json({
    success: true,
    messages: messages
  });
} 