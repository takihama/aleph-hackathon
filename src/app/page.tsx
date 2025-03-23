"use client";

import { useEffect, useState } from "react";
import { MiniKit, Permission } from "@worldcoin/minikit-js";
import { getAddress } from "viem";
import { mantleMNT } from "@daimo/contract";
import { DaimoPayButton } from "@daimo/pay";
import styles from "./page.module.css";
import { createWorldAppDeepLink } from "@/lib/deeplink";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  // Handle app initialization and permissions in one effect
  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        
        // Check if MiniKit is installed and get permissions in one step
        if (MiniKit.isInstalled()) {
          // Request notification permissions
          await MiniKit.commandsAsync.requestPermission({
            permission: Permission.Notifications,
          });
          
          // Authenticate wallet right away if possible
          await authenticateWallet();
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        setStatus(`Error initializing app: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  // Load user details when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      fetchUserDetails();
    }
  }, [walletAddress]);

  // Authenticate user wallet
  const authenticateWallet = async () => {
    setLoading(true);
    
    try {
      const nonce = Math.random().toString(36).substring(2, 10);
      
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce,
        statement: "Connect your wallet to use this app",
      });

      if (result?.finalPayload.status === "success") {
        const address = result.finalPayload.address;
        setWalletAddress(address);
        return address;
      }
      
      return null;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details from database
  const fetchUserDetails = async () => {
    if (!walletAddress) return;
    
    try {
      const response = await fetch(`/api/users?worldcoin_address=${walletAddress}`);
      const data = await response.json();
      
      if (response.ok && data.success && data.user) {
        setUserDetails(data.user);
      } else {
        // User not found, create new user
        await saveUserToDatabase();
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Save user to database
  const saveUserToDatabase = async () => {
    if (!MiniKit.user?.walletAddress) return;
    
    try {
      // Create a payload with required user data
      const userData = {
        // Generate a random address for payment wallet
        address: `0x${Array.from({length: 40}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`,
        worldcoin_username: MiniKit.user.username,
        worldcoin_address: MiniKit.user.walletAddress,
      };
      
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUserDetails({
          id: data.userId,
          ...userData
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Send notification to wallet
  const sendNotification = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_addresses: [walletAddress],
          title: "Hello from WorldApp!",
          message: "This is a test notification.",
          path: "/notification-received",
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStatus("Notification sent successfully!");
      } else {
        setStatus(`Failed to send notification: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setStatus(`Error sending notification: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Get return deep link for payment callback
  const getReturnDeepLink = () => {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
    
    return createWorldAppDeepLink(
      process.env.WORLDAPP_APP_ID || "",
      currentPath,
      { timestamp: Date.now().toString() }
    );
  };

  return (
    <main className={styles.main}>
      <div className={styles.walletAddressContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : walletAddress ? (
          <>
            <div className={styles.walletAddressLabel}>Your WorldCoin Wallet</div>
            <div className={styles.walletAddressValue}>{walletAddress}</div>
            {userDetails && (
              <div className={styles.walletAddressLabel} style={{ marginTop: "8px" }}>
                Your Payment Wallet
                <div className={styles.walletAddressValue}>{userDetails.address}</div>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={authenticateWallet}
            disabled={loading}
            className={styles.button}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {walletAddress && (
        <button
          onClick={sendNotification}
          disabled={loading}
          className={styles.button}
        >
          Send Test Notification
        </button>
      )}

      {userDetails?.address && (
        <div className={styles.paymentSection}>
          <h3>Make a Payment</h3>
          <DaimoPayButton
            appId={process.env.NEXT_PUBLIC_DAIMO_API_KEY!}
            toAddress={getAddress(userDetails.address)}
            toChain={mantleMNT.chainId}
            toToken={getAddress(mantleMNT.token)}
            redirectReturnUrl={getReturnDeepLink()}
            metadata={{ appName: "WorldApp Mini" }}
            onPaymentStarted={() => setStatus("Payment started!")}
            onPaymentCompleted={() => setStatus("Payment completed!")}
            onPaymentBounced={() => setStatus("Payment bounced.")}
          />
        </div>
      )}

      {status && (
        <div className={`${styles.status} ${status.includes("Error") ? styles.error : styles.success}`}>
          {status}
        </div>
      )}
    </main>
  );
}
