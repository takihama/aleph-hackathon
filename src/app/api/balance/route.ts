import { NextResponse } from "next/server";
import { ethers } from "ethers";

// USDT token contract ABI (only the balanceOf function)
const tokenAbi = [
  "function balanceOf(address owner) view returns (uint256)"
];

// Mantle network RPC URL
const MANTLE_RPC_URL = "https://rpc.mantle.xyz";
// USDT token address on Mantle
const USDT_ADDRESS = "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    
    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address parameter is required" },
        { status: 400 }
      );
    }

    // Connect to Mantle network
    const provider = new ethers.JsonRpcProvider(MANTLE_RPC_URL);
    
    // Create contract instance
    const tokenContract = new ethers.Contract(USDT_ADDRESS, tokenAbi, provider);
    
    // Get balance
    const balance = await tokenContract.balanceOf(address);
    
    // USDT typically has 6 decimals
    const formattedBalance = ethers.formatUnits(balance, 6);
    
    return NextResponse.json({
      success: true,
      address: address,
      balance: formattedBalance,
      token: "USDT",
      network: "Mantle"
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch balance",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
