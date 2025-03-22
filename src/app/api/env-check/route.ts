import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasApiUrl: !!process.env.WORLDAPP_API_URL,
    hasApiKey: !!process.env.WORLDAPP_API_KEY,
    hasAppId: !!process.env.WORLDAPP_APP_ID,
    apiUrlValue: process.env.WORLDAPP_API_URL
  })
} 