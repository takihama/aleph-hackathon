"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MiniKit,
  Permission,
  RequestPermissionPayload,
} from "@worldcoin/minikit-js";
import styles from "./page.module.css";
import { DaimoPayButton } from "@daimo/pay";

export default function Home() {
  const [isInWorldApp, setIsInWorldApp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

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

  const handleClick = async () => {
    try {
      setLoading(true);
      // Your API call here
      const result = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: "En tu cara man." });
        }, 1000);
      });
      setResponse((result as any).message);
    } catch (error) {
      setResponse("Error occurred");
    } finally {
      setLoading(false);
    }
  };

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

      console.log("Using wallet address:", addressToUse);

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
      console.log("Notification API response:", data);

      if (response.ok && data.success) {
        setStatus("Notification sent successfully!");
        console.log("Delivery results:", data.result);
      } else {
        setStatus(
          `Failed to send notification: ${data.error || "Unknown error"}`
        );
        console.error("Error details:", data.details || "No details provided");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
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
        console.log("User data:", MiniKit.user);
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
    console.log("Payment completed:", event);
    setStatus("Payment completed successfully!");
  };

  // Payment started handler
  const handlePaymentStarted = (event: any) => {
    console.log("Payment started:", event);
    setStatus("Payment started...");
  };

  return (
    <main className={styles.main}>
      {isInWorldApp ? (
        <>
          <div className={styles.walletAddressContainer}>
            {!walletAddress && (
              <button onClick={authenticateWallet} disabled={loading}>
                {loading ? "Authenticating..." : "Connect Wallet"}
              </button>
            )}
          </div>
          <button onClick={handleClick} disabled={loading}>
            {loading ? "Loading..." : "Click Me!"}
          </button>
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
            <DaimoPayButton
              appId={process.env.DAIMO_API_KEY!}
              toAddress={
                process.env.DESTINATION_WALLET_ADDRESS! as `0x${string}`
              }
              toChain={137} // Polygon
              toUnits="0.10" // $0.10 in Polygon USDC
              toToken="0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" // Polygon USDC
              onPaymentStarted={handlePaymentStarted}
              onPaymentCompleted={handlePaymentCompleted}
            />
          </div>
        </>
      ) : (
        <div>
          <div>Please open this app in WorldApp</div>
          <pre style={{ fontSize: "12px", marginTop: "20px" }}>
            Debug Info:
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

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
