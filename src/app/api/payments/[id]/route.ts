import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Validate required fields
    const { status, txHash } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Missing status field" },
        { status: 400 }
      );
    }

    // Update payment status
    await query(
      `UPDATE payments 
       SET status = $1, tx_hash = $2, updated_at = NOW()
       WHERE id = $3`,
      [status, txHash || null, id]
    );

    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update payment",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
