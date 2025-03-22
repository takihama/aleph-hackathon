// API route to handle sending notifications
import { NextResponse } from 'next/server'

const API_URL = 'https://developer.worldcoin.org/api/v2/minikit/send-notification'
const API_KEY = process.env.WORLDAPP_API_KEY // Add this to your .env file

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const notification = {
      app_id: process.env.WORLDAPP_APP_ID,
      wallet_addresses: body.wallet_addresses,
      title: body.title,
      message: body.message,
      mini_app_path: `worldapp://mini-app?app_id=${process.env.WORLDAPP_APP_ID}&path=${body.path || ''}`
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notification)
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
} 