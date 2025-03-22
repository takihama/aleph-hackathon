"use client";

import { useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import styles from "./page.module.css";

export default function Home() {
  const [isInWorldApp, setIsInWorldApp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    // Check if the app is running inside WorldApp
    const checkEnvironment = () => {
      const isInstalled = MiniKit.isInstalled();
      setIsInWorldApp(isInstalled);
      console.log("Running in WorldApp:", isInstalled);
    };

    checkEnvironment();
  }, []);

  const handleClick = async () => {
    try {
      setLoading(true);
      // Your API call here
      const result = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: "Success! API responded." });
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
        <div>Please open this app in WorldApp</div>
      )}
    </main>
  );
}
