import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { systemPrompt as system } from "@/lib/agent/system";
import { tools } from "@/lib/agent/tools";

const model = anthropic("claude-3-5-sonnet-20240620");
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("[API] Chat request received");
  
  try {
    const body = await req.json();
    const { prompt } = body;
    
    console.log("[API] Prompt received:", prompt);
    console.log("[API] Available tools:", Object.keys(tools));
    
    const stream = streamText({
      model,
      prompt,
      system,
      tools,
      maxSteps: 5,
    });

    console.log("[API] Stream created, sending response");
    return stream.toDataStreamResponse();
    
  } catch (error) {
    console.error("[API] Error in chat endpoint:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
