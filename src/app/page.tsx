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
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_addresses: ["0x0000000000000000000000000000000000000000"], // Use the user's wallet address
          title: "Hello from Your App!",
          message: "This is a test notification from your WorldApp mini-app.",
          path: "/notification-received", // Optional: specific path to open when notification is clicked
        }),
      });

      const data = await response.json();

      console.log("data", data);
      if (data.success) {
        setStatus("Notification sent successfully!");
        console.log("Delivery results:", data.result);
      } else {
        setStatus(
          `Failed to send notification: ${data.error || "Unknown error"}`
        );
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
            {/* {hasPermission && ( */}
            <button onClick={sendNotification} disabled={loading}>
              {loading ? "Sending..." : "Send Test Notification"}
            </button>
            {/* )} */}
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
