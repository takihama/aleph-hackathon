import { query } from "@/lib/server/db";

export async function POST(request: Request) {
  const timestamp = new Date().toISOString();
  
  try {
    const payload = await request.json();
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    // Log the webhook event with simplified approach
    await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: payload.type || 'unknown',
        payload: {
          paymentId: payload.paymentId,
          timestamp
        }
      })
    });
    
    // Verify the webhook token
    if (token !== process.env.DAIMO_WEBHOOK_TOKEN) {
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: 'auth_error',
          payload: { timestamp }
        })
      });
      
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Log test events for debugging
    if (payload.isTestEvent) {
      console.log("🧪 Test event received!");
    }
    
    // Process payment events
    switch (payload.type) {
      case 'payment_started':
        await fetch("/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_type: 'payment_started',
            payload: { paymentId: payload.paymentId }
          })
        });
        break;
      case 'payment_completed':
        await fetch("/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_type: 'payment_completed',
            payload: { paymentId: payload.paymentId }
          })
        });
        break;
      case 'payment_bounced':
        await fetch("/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_type: 'payment_bounced',
            payload: { paymentId: payload.paymentId }
          })
        });
        break;
      default:
        console.log("⚠️ Unknown event type:", payload.type);
    }
    
    console.log("✅ Webhook processed successfully");
    
    // Return 200 status quickly as recommended
    return Response.json({ success: true });
  } catch (error) {
    // Log errors to database too
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: 'webhook_error'
        })
      });
    } catch (dbError) {
      // If even logging fails, we're in trouble
    }
    
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Simple GET endpoint to verify the route is accessible
export async function GET() {
  try {
    // Log the GET request
    await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: 'webhook_get',
        payload: { timestamp: new Date().toISOString() }
      })
    });
    
    // Check logs count
    const logsResponse = await fetch("/api/logs?limit=1");
    const logsData = await logsResponse.json();
    
    return Response.json({ 
      status: "Webhook endpoint is active",
      logs_count: logsData.total_count || 0
    });
  } catch (error) {
    return Response.json({ 
      status: "Webhook endpoint is active, but logging failed",
      error: (error as Error).message
    });
  }
} 