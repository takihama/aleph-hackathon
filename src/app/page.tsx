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
  const [user, setUser] = useState(MiniKit.user ?? null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("10"); // Default payment amount
  const [userDetails, setUserDetails] = useState<any>(null);

  // Single useEffect for initializing the app and loading user data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);

        // First check if user is already authenticated in MiniKit
        if (MiniKit.isInstalled()) {
          useEffect(() => {
            const interval = setInterval(() => {
              if (MiniKit.user && MiniKit.user !== user) {
                setUser(MiniKit.user);
              }
            }, 1000); // Poll every second

            return () => clearInterval(interval); // Cleanup on unmount
          }, [user]);

          await authenticateWallet();

          // Check if we already have wallet address in MiniKit
          if (MiniKit.user?.walletAddress) {
            setWalletAddress(MiniKit.user.walletAddress);
            console.log("User already authenticated:", MiniKit.user);

            // Try to fetch user details from our database
            await fetchUserDetails(MiniKit.user.walletAddress);
          } else {
            // Need to authenticate
            console.log("User not authenticated, authenticating...");
          }

          // Request notification permissions
          await requestPermission();
        } else {
          console.log("MiniKit not installed or running outside WorldApp");
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        setStatus("Error initializing app. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch user details from our database
  const fetchUserDetails = async (worldcoin_address: string) => {
    try {
      const response = await fetch(
        `/api/users?worldcoin_address=${encodeURIComponent(worldcoin_address)}`
      );
      const data = await response.json();

      if (response.ok && data.success && data.user) {
        setUserDetails(data.user);
        console.log("User details loaded from database:", data.user);
      } else {
        // No user in our database yet, save them
        console.log("User not found in database, creating new record...");
        await saveUserToDatabase();
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

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
      // Only proceed if we have WorldCoin wallet details
      if (!MiniKit.user?.walletAddress) {
        console.log(
          "No WorldCoin wallet address available, skipping database save"
        );
        return;
      }

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
        // Update our local state with the new user details
        if (data.userId) {
          setUserDetails({
            id: data.userId,
            address: wallet.address,
            worldcoin_username: worldcoinUsername,
            worldcoin_address: worldcoinAddress,
          });
        }
      }
    } catch (error) {
      console.error("Error saving user to database:", error);
    }
  };

  // Add a function to authenticate the user and get their wallet details
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
        const address = result.finalPayload.address;
        setWalletAddress(address);
        setStatus("Wallet authenticated successfully!");

        // Now we can save this to the database
        await saveUserToDatabase();

        return address; // Return the address for immediate use
      } else {
        setStatus("Authentication failed");
        return null;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setStatus(
        `Error authenticating: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return null;
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
          {loading ? (
            <p>Loading user details...</p>
          ) : walletAddress ? (
            <>
              <div className={styles.walletAddressLabel}>
                Your WorldCoin Wallet
              </div>
              <div className={styles.walletAddressValue}>{walletAddress}</div>
              {userDetails && (
                <div
                  className={styles.walletAddressLabel}
                  style={{ marginTop: "8px" }}
                >
                  Your Payment Wallet
                  <div className={styles.walletAddressValue}>
                    {userDetails.address}
                  </div>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={authenticateWallet}
              disabled={loading}
              className={styles.button}
            >
              {loading ? "Authenticating..." : "Authenticate Wallet"}
            </button>
          )}
        </div>

        {/* Notification permission button */}
        <div>
          {walletAddress && hasPermission && (
            <button
              onClick={sendNotification}
              disabled={loading}
              className={styles.button}
            >
              {loading ? "Sending..." : "Send Test Notification"}
            </button>
          )}
        </div>

        {/* Add the payment section */}
        {walletAddress && (
          <div className={styles.paymentSection}>
            <h3>Make a Payment</h3>

            <DaimoPayButton
              appId={process.env.NEXT_PUBLIC_DAIMO_API_KEY!}
              toAddress={getAddress(MiniKit.user!.walletAddress)}
              toChain={mantleMNT.chainId}
              toUnits={paymentAmount}
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
        )}
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
