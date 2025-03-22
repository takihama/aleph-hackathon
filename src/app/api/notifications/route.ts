// API route to handle sending notifications
import { NextResponse } from "next/server";

const API_URL =
  process.env.WORLDAPP_API_URL ||
  "https://developer.worldcoin.org/api/v2/minikit/send-notification";
const API_KEY = process.env.WORLDAPP_API_KEY;
const APP_ID = process.env.WORLDAPP_APP_ID;

export async function POST(request: Request) {
  // Log environment variables status (not their values)
  console.log("API Config Check:", {
    hasApiUrl: !!API_URL,
    hasApiKey: !!API_KEY,
    hasAppId: !!APP_ID,
    apiUrlValue: API_URL,
  });

  if (!API_KEY || !APP_ID) {
    console.error("Missing credentials:", {
      hasApiKey: !!API_KEY,
      hasAppId: !!APP_ID,
    });
    return NextResponse.json(
      { error: "API configuration missing" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    if (
      !body.wallet_addresses ||
      !Array.isArray(body.wallet_addresses) ||
      body.wallet_addresses.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid wallet addresses" },
        { status: 400 }
      );
    }

    const notification = {
      app_id: APP_ID,
      wallet_addresses: body.wallet_addresses,
      title: body.title || "New Notification",
      message: body.message || "You have a new notification",
      mini_app_path: `worldapp://mini-app?app_id=${APP_ID}${
        body.path ? `&path=${body.path}` : ""
      }`,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || `API error: ${response.status}`
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send notification",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
