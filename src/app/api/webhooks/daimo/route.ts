import { query } from "@/lib/server/db";

export async function POST(request: Request) {
  const timestamp = new Date().toISOString();
  
  try {
    const payload = await request.json();
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    // Log the webhook event via messages API
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `📥 Webhook received: ${payload.type || 'unknown'} at ${timestamp}`
      })
    });
    
    // Verify the webhook token
    if (token !== process.env.DAIMO_WEBHOOK_TOKEN) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `❌ Auth error: Invalid token at ${timestamp}`
        })
      });
      
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Log test events for debugging
    if (payload.isTestEvent) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `🧪 Test event received! Type: ${payload.type} at ${timestamp}`
        })
      });
    }
    
    // Process payment events
    switch (payload.type) {
      case 'payment_started':
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `💰 Payment started: ${payload.paymentId || 'unknown'} at ${timestamp}`
          })
        });
        break;
      case 'payment_completed':
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `✅ Payment completed: ${payload.paymentId || 'unknown'} at ${timestamp}`
          })
        });
        break;
      case 'payment_bounced':
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `❌ Payment bounced: ${payload.paymentId || 'unknown'} at ${timestamp}`
          })
        });
        break;
      default:
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `⚠️ Unknown event type: ${payload.type || 'unknown'} at ${timestamp}`
          })
        });
    }
    
    // Return 200 status quickly as recommended
    return Response.json({ success: true });
  } catch (error) {
    // Log errors via messages API
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `⛔ Error processing webhook: ${(error as Error).message} at ${timestamp}`
        })
      });
    } catch (fetchError) {
      // If even logging fails, we're in trouble
    }
    
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Simple GET endpoint to verify the route is accessible
export async function GET() {
  try {
    // Log the GET request
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `🔍 GET request to webhook endpoint at ${new Date().toISOString()}`
      })
    });
    
    // Check message count
    const messagesResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/messages`);
    const messagesData = await messagesResponse.json();
    
    return Response.json({ 
      status: "Webhook endpoint is active",
      message_count: messagesData.messages?.length || 0
    });
  } catch (error) {
    return Response.json({ 
      status: "Webhook endpoint is active, but messaging failed",
      error: (error as Error).message
    });
  }
} 