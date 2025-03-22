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
import { createWorldAppDeepLink } from "@/lib/deeplink";
import { ethers } from "ethers";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("10"); // Default payment amount

  useEffect(() => {
    // Auto-authenticate every time the app loads
    const autoAuthenticateUser = async () => {
      const isInstalled = MiniKit.isInstalled();
      if (isInstalled && !walletAddress) {
        await authenticateWallet();
      }
    };

    autoAuthenticateUser();
  }, []);

  // Check permissions on mount
  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (MiniKit.user?.username && MiniKit.user?.walletAddress) {
      saveUserToDatabase();
    }
  }, [walletAddress]);

  const requestPermission = useCallback(async () => {
    const requestPermissionPayload: RequestPermissionPayload = {
      permission: Permission.Notifications,
    };
    const payload = await MiniKit.commandsAsync.requestPermission(
      requestPermissionPayload
    );

    setHasPermission(true);
  }, []);

  const sendNotification = async () => {
    setLoading(true);
    setStatus("Sending notification...");

    try {
      // Get the current wallet address from state or try to fetch it
      let addressToUse = walletAddress;

      if (!addressToUse) {
        // Try to get the wallet address from MiniKit if not in state
        const miniKitAddress = MiniKit.user?.walletAddress;

        if (miniKitAddress) {
          // Update state if we got a valid address
          addressToUse = miniKitAddress;
        } else {
          setStatus("Error: Could not get your wallet address");
          setLoading(false);
          return;
        }
      }

      // Use the wallet address for the notification
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_addresses: [addressToUse],
          title: "Hello from Your App!",
          message: "This is a test notification from your WorldApp mini-app.",
          path: "/notification-received",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("Notification sent successfully!");
      } else {
        setStatus(
          `Failed to send notification: ${data.error || "Unknown error"}`
        );
        console.error("Error details:", data.details || "No details provided");
      }
    } catch (error) {
      setStatus(
        `Error sending notification: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a function to save the authenticated user to the database
  const saveUserToDatabase = async () => {
    try {
      const wallet = ethers.Wallet.createRandom();

      // Get user info from MiniKit
      const worldcoinUsername = MiniKit.user?.username;
      const worldcoinAddress = MiniKit.user?.walletAddress;

      // Save to database
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: wallet.address,
          mnemonic: wallet.mnemonic?.phrase,
          worldcoin_username: worldcoinUsername,
          worldcoin_address: worldcoinAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to save user:", data.message);
      } else {
        console.log("User saved to database:", data);
      }
    } catch (error) {
      console.error("Error saving user to database:", error);
    }
  };

  // Add a function to authenticate the user
  const authenticateWallet = async () => {
    setLoading(true);
    setStatus("Authenticating wallet...");

    try {
      // Generate a random nonce (in production this should come from your server)
      const nonce = Math.random().toString(36).substring(2, 10);

      const result = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        statement: "Connect your wallet to receive notifications",
      });

      if (result?.finalPayload.status === "success") {
        setWalletAddress(result?.finalPayload.address);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setStatus(
        `Error authenticating: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Payment started handler
  const handlePaymentStarted = async (event: any) => {
    setStatus("Payment started! Check your wallet app.");
  };

  // Payment completion handler
  const handlePaymentCompleted = async (event: any) => {
    setStatus("Payment completed successfully!");
  };

  // Payment bounced handler
  const handlePaymentBounced = async (event: any) => {
    setStatus("Payment bounced. Please try again later.");
  };

  // Handle payment amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure valid number format
    const value = e.target.value;
    // Allow empty input, numbers, and numbers with decimal point
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setPaymentAmount(value);
    }
  };

  // Generate a dynamic deep link that uses the current path
  const getReturnDeepLink = () => {
    // Get current path if available, otherwise use a default path
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname || "/" : "/";

    return createWorldAppDeepLink(
      process.env.WORLDAPP_APP_ID || "",
      currentPath, // Use the current path instead of a fixed one
      {
        timestamp: Date.now().toString(), // Add a unique identifier
      }
    );
  };

  return (
    <main className={styles.main}>
      <>
        {/* Add authentication button at the top */}
        <div className={styles.walletAddressContainer}>
          <button
            onClick={authenticateWallet}
            disabled={loading}
            className={styles.button}
          >
            {loading ? "Authenticating..." : "Authenticate Wallet"}
          </button>
        </div>

        <div>
          {hasPermission && (
            <button onClick={sendNotification} disabled={loading}>
              {loading ? "Sending..." : "Send Test Notification"}
            </button>
          )}
        </div>

        {/* Add the payment section */}
        <div className={styles.paymentSection}>
          <h3>Make a Payment</h3>
          <h3>{JSON.stringify(MiniKit.user)}</h3>
          <h3>{MiniKit.user?.walletAddress}</h3>

          {/* Payment amount input */}
          <div className={styles.inputGroup}>
            <label htmlFor="payment-amount" className={styles.inputLabel}>
              Payment Amount (USDT)
            </label>
            <div className={styles.inputWithUnit}>
              <input
                id="payment-amount"
                type="text"
                value={paymentAmount}
                onChange={handleAmountChange}
                className={styles.amountInput}
                placeholder="Enter amount"
                min="0.01"
                max="1000"
              />
            </div>
            <p className={styles.helperText}>
              Enter the amount of USDT you want to send on Mantle chain.
              <br />
              Min: 0.01 USDT | Max: 1000 USDT
            </p>
          </div>

          <DaimoPayButton
            appId={process.env.NEXT_PUBLIC_DAIMO_API_KEY!}
            toAddress={getAddress(
              process.env.NEXT_PUBLIC_DESTINATION_WALLET_ADDRESS!
            )}
            toChain={mantleMNT.chainId}
            toToken={getAddress(mantleMNT.token)}
            redirectReturnUrl={getReturnDeepLink()}
            metadata={{
              appName: "WorldApp Mini Test",
            }}
            onPaymentStarted={handlePaymentStarted}
            onPaymentCompleted={handlePaymentCompleted}
            onPaymentBounced={handlePaymentBounced}
          />
        </div>
      </>

      {status && (
        <div
          className={`${styles.status} ${
            status.includes("Error") ? styles.error : styles.success
          }`}
        >
          {status}
        </div>
      )}
    </main>
  );
}
