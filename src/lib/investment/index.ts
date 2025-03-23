import { ethers } from "ethers";
import { erc20Abi } from "./erc20.abi";

const provider = new ethers.JsonRpcProvider("https://rpc.mantle.xyz");

const wallet = ethers.Wallet.fromPhrase(
  process.env.TREASURY_WALLET || ""
).connect(provider);

// Token enum to contract address mapping
enum TokenType {
  USDT = "USDT",
  USDY = "USDY",
}

const TokenAddress: Record<TokenType, string> = {
  [TokenType.USDT]: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
  [TokenType.USDY]: "0x5bE26527e817998A7206475496fDE1E68957c5A6",
}


// sends the chosen token to the user's wallet
const allocateFunds = async (mantleAddress: string, token: TokenType, amount: string): Promise<void> => {
  const contract = new ethers.Contract(TokenAddress[token], erc20Abi, wallet);
  const tx = await contract.transfer(mantleAddress, amount);
  await tx.wait(); 
};


// 4. Send USDT to the worldcoin wallet
const deInvestFunds = async (mantleAddress: string): Promise<void> => {
  // TODO: Implement
  return;
}; 
