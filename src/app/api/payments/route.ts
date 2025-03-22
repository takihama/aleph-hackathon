import { NextResponse } from 'next/server';
import { query } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { walletAddress, amount, token, chainId, txHash } = body;
    
    if (!walletAddress || !amount || !token || !chainId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Insert payment record
    const result = await query(
      `INSERT INTO payments 
       (wallet_address, amount, token, chain_id, tx_hash, status) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        walletAddress,
        amount,
        token,
        chainId,
        txHash || null,
        body.status || 'started'
      ]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Payment recorded successfully',
      paymentId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to record payment',
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    
    let result;
    
    if (walletAddress) {
      // Get payments for a specific wallet
      result = await query(
        'SELECT * FROM payments WHERE wallet_address = $1 ORDER BY created_at DESC',
        [walletAddress]
      );
    } else {
      // Get all payments (maybe add pagination later)
      result = await query(
        'SELECT * FROM payments ORDER BY created_at DESC LIMIT 100'
      );
    }
    
    return NextResponse.json({
      success: true,
      payments: result.rows
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch payments',
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 