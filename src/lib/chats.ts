export interface Chat {
  id: string;
  title: string;
  description: string;
  prompt: string;
  createdAt: Date;
}

// Sample chat for testing
export const sampleChat: Chat = {
  id: "1",
  title: "Mantle Investment Assistant",
  description: "Ask about investing on the Mantle blockchain using Worldcoin verification",
  prompt: "What investment strategies do you recommend for someone new to Mantle blockchain?",
  createdAt: new Date(),
}; 