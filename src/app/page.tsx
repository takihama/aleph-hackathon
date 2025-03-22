"use client";

import { useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import styles from "./page.module.css";

export default function Home() {
  const [isInWorldApp, setIsInWorldApp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Add debugging information
    const checkEnvironment = () => {
      const isInstalled = MiniKit.isInstalled();
      setIsInWorldApp(isInstalled);
      
      // Collect debug info
      setDebugInfo({
        isInstalled,
        isMiniKitDefined: typeof MiniKit !== 'undefined',
        userAgent: window.navigator.userAgent,
        windowObject: Object.keys(window).includes('MiniKit')
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

  return (
    <main className={styles.main}>
      {isInWorldApp ? (
        <>
          <button onClick={handleClick} disabled={loading}>
            {loading ? "Loading..." : "Click Me!"}
          </button>
          {response && <div>{response}</div>}
        </>
      ) : (
        <div>
          <div>Please open this app in WorldApp</div>
          <pre style={{ fontSize: '12px', marginTop: '20px' }}>
            Debug Info:
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
