"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MiniKit,
  Permission,
  RequestPermissionPayload,
} from "@worldcoin/minikit-js";
import { getAddress } from "viem";
import { mantleMNT } from "@daimo/contract";
import { DaimoPayButton } from "@daimo/pay";
import styles from "./page.module.css";
import ChatCard from "@/components/ChatCard";
import { sampleChat } from "@/lib/chats";

export default function Home() {
  const [isInWorldApp, setIsInWorldApp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("10");
  const [showPayment, setShowPayment] = useState(false);
  const [chatPrompt, setChatPrompt] = useState(sampleChat.prompt);
  
  useEffect(() => {
    const checkEnvironment = () => {
      const isInstalled = MiniKit.isInstalled();
      setIsInWorldApp(isInstalled);

      if (isInstalled && MiniKit.user?.walletAddress) {
        setWalletAddress(MiniKit.user.walletAddress);
      }
    };

    checkEnvironment();
    requestPermission();
  }, []);

  const requestPermission = useCallback(async () => {
    const requestPermissionPayload: RequestPermissionPayload = {
      permission: Permission.Notifications,
    };
    await MiniKit.commandsAsync.requestPermission(
      requestPermissionPayload
    );
  }, []);

  const authenticateWallet = async () => {
    setLoading(true);
    try {
      const nonce = Math.random().toString(36).substring(2, 10);
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        statement: "Connect your wallet to receive notifications",
      });

      if (result.finalPayload.status === "success") {
        const address = result.finalPayload.address;
        setWalletAddress(address);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCompleted = () => {
    setShowPayment(false);
  };

  const handlePaymentStarted = () => {
    // Payment started
  };

  const handlePaymentBounced = () => {
    // Payment failed
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setPaymentAmount(value);
    }
  };

  const handleMessageReceived = (message: string) => {
    // Show payment panel if the message mentions payment
    if (message.toLowerCase().includes('pay') || 
        chatPrompt.toLowerCase().includes('pay')) {
      setShowPayment(true);
    }
  };

  const currentChat = {
    ...sampleChat,
    prompt: chatPrompt
  };

  return (
    <main className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.header}>
          <h1>Mantle Investment Assistant</h1>
          {walletAddress ? (
            <div className={styles.walletBadge}>
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </div>
          ) : null}
        </div>

        <div className={styles.cardContainer}>
          <ChatCard chat={currentChat} onMessageReceived={handleMessageReceived} />
        </div>

        {showPayment && (
          <div className={styles.paymentPanel}>
            <div className={styles.paymentHeader}>
              <h3>Payment</h3>
              <button className={styles.closeButton} onClick={() => setShowPayment(false)}>×</button>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="payment-amount" className={styles.inputLabel}>
                Amount (USDT)
              </label>
              <input
                id="payment-amount"
                type="text"
                value={paymentAmount}
                onChange={handleAmountChange}
                className={styles.amountInput}
                placeholder="Enter amount"
              />
            </div>
            <DaimoPayButton
              appId={process.env.NEXT_PUBLIC_DAIMO_API_KEY!}
              toAddress={getAddress(
                process.env.NEXT_PUBLIC_DESTINATION_WALLET_ADDRESS!
              )}
              toChain={mantleMNT.chainId}
              toUnits={paymentAmount}
              toToken={getAddress(mantleMNT.token)}
              metadata={{
                appName: "Mantle Investment Assistant",
              }}
              onPaymentStarted={handlePaymentStarted}
              onPaymentCompleted={handlePaymentCompleted}
              onPaymentBounced={handlePaymentBounced}
            />
          </div>
        )}

        {!walletAddress && (
          <div className={styles.walletConnectBar}>
            <button 
              onClick={authenticateWallet} 
              disabled={loading}
              className={styles.connectButton}
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
