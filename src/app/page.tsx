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

export default function Home() {
  const [isInWorldApp, setIsInWorldApp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("10"); // Default payment amount

  useEffect(() => {
    // Add debugging information
    const checkEnvironment = () => {
      const isInstalled = MiniKit.isInstalled();
      setIsInWorldApp(isInstalled);

      // Collect debug info
      setDebugInfo({
        isInstalled,
        isMiniKitDefined: typeof MiniKit !== "undefined",
        userAgent: window.navigator.userAgent,
        windowObject: Object.keys(window).includes("MiniKit"),
      });

      // Get wallet address if available
      if (isInstalled && MiniKit.user?.walletAddress) {
        setWalletAddress(MiniKit.user.walletAddress);
      }
    };

    checkEnvironment();
  }, []);

  // Check permissions on mount
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = useCallback(async () => {
    const requestPermissionPayload: RequestPermissionPayload = {
      permission: Permission.Notifications,
    };
    const payload = await MiniKit.commandsAsync.requestPermission(
      requestPermissionPayload
    );
    // setHasPermission(payload.finalPayload.status === "success");
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
          setWalletAddress(miniKitAddress);
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

      if (result.finalPayload.status === "success") {
        // After successful auth, MiniKit.user should be available
        const address = result.finalPayload.address;
        setWalletAddress(address);
        setStatus("Wallet authenticated successfully!");
      } else {
        setStatus("Authentication failed");
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

  // Payment completion handler
  const handlePaymentCompleted = (event: any) => {
    setStatus("Payment completed successfully!");
  };

  // Payment started handler
  const handlePaymentStarted = (event: any) => {
    setStatus("Payment started...");
  };

  // Payment bounced handler
  const handlePaymentBounced = (event: any) => {
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

  return (
    <main className={styles.main}>
      <>
        <div className={styles.walletAddressContainer}>
          {!walletAddress && (
            <button onClick={authenticateWallet} disabled={loading}>
              {loading ? "Authenticating..." : "Connect Wallet"}
            </button>
          )}
        </div>
        {response && <div>{response}</div>}
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
            toUnits={paymentAmount}
            toToken={getAddress(mantleMNT.token)}
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
