"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MiniKit,
  Permission,
  RequestPermissionPayload,
} from "@worldcoin/minikit-js";
import styles from "./page.module.css";

export default function Home() {
  const [isInWorldApp, setIsInWorldApp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState("");

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
    };

    checkEnvironment();
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

  const requestPermission = useCallback(async () => {
    const requestPermissionPayload: RequestPermissionPayload = {
      permission: Permission.Notifications,
    };
    const payload = await MiniKit.commandsAsync.requestPermission(
      requestPermissionPayload
    );
  }, []);

  const sendNotification = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_addresses: ["0x123..."], // Add target wallet addresses
          title: "Test Notification",
          message: "This is a test notification from your app!",
          path: "/some-path", // Optional: specific path in your app
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Notification sent successfully!");
        console.log("Delivery results:", data.result);
      } else {
        setStatus("Failed to send notification");
      }
    } catch (error) {
      setStatus("Error sending notification");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      {isInWorldApp ? (
        <>
          <button onClick={handleClick} disabled={loading}>
            {loading ? "Loading..." : "Click Me!"}
          </button>
          {response && <div>{response}</div>}
          <div>
            <button onClick={requestPermission}>
              Request Notification Permission
            </button>

            {hasPermission && (
              <button onClick={sendNotification}>Send Test Notification</button>
            )}
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

      {status && <div className={styles.status}>{status}</div>}
    </main>
  );
}
