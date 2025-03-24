"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import { useCallback, useEffect, useState } from "react";
import { DaimoPayButton } from "@daimo/pay";
import { getAddress } from "viem";
import { mantleMNT, mantleUSDT } from "@daimo/contract";
import { createWorldAppDeepLink } from "@/lib/deeplink";
import {
  MiniKit,
  Permission,
  RequestPermissionPayload,
} from "@worldcoin/minikit-js";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [balance, setBalance] = useState("-");
  const [futureBalance, setFutureBalance] = useState("-");
  const [annualRateDisplay, setAnnualRateDisplay] = useState("5.5");

  // Initialize app and check if MiniKit is installed
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);

        // Check if MiniKit is installed
        if (MiniKit.isInstalled()) {
          setIsInstalled(true);
        }
      } catch (error: any) {
        console.error("Error initializing app:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Request permissions and authenticate when MiniKit is installed
  useEffect(() => {
    if (isInstalled) {
      requestPermission();
      
      // Check if we already have a wallet address in localStorage
      const savedWalletAddress = localStorage.getItem("userWalletAddress");
      const authExpiry = localStorage.getItem("authExpiry");
      const now = Date.now();
      
      // Check if we have a valid session: address exists and expiry time is in the future
      if (savedWalletAddress && authExpiry && parseInt(authExpiry) > now) {
        console.log("Using saved wallet address:", savedWalletAddress);
        setWalletAddress(savedWalletAddress);
      } else if (savedWalletAddress) {
        // If we have an address but expiry is invalid, try to extend the session
        // instead of full re-authentication which would show the popup
        console.log("Extending session for existing wallet address");
        const newExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000);
        localStorage.setItem("authExpiry", newExpiry.toString());
        setWalletAddress(savedWalletAddress);
      } else {
        // Only attempt full authentication if we have no saved address
        console.log("No saved wallet address, authenticating");
        authenticateWallet();
      }
    }
  }, [isInstalled]);

  // Fetch user details when wallet address is available
  useEffect(() => {
    if (walletAddress) {
      fetchUserDetails();
    }
  }, [walletAddress]);

  // Fetch balance when user details are available
  useEffect(() => {
    if (userDetails?.address) {
      fetchBalance();
    }
  }, [userDetails]);

  // Calculate future balance
  useEffect(() => {
    try {
      // Calculate future value with annual growth for 30 years
      let currentBalance = 0;
      if (balance !== "-") {
        currentBalance = parseFloat(balance.replace(/,/g, ""));
      }

      const years = 30;

      // Use saved yield from risk selection or default to random
      let annualRate = 0.085; // Default medium risk (8.5%)

      if (typeof window !== "undefined") {
        const savedYield = localStorage.getItem("yield");
        if (savedYield) {
          annualRate = parseFloat(savedYield) / 100;
        } else {
          // Fallback to random if no saved yield
          annualRate = 0.055 + Math.random() * (0.12 - 0.055);
        }
      }

      // Update the annual rate display
      setAnnualRateDisplay(
        new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(annualRate * 100)
      );

      // Compound interest formula: FV = PV * (1 + r)^n
      const futureValue =
        currentBalance <= 0
          ? 0
          : currentBalance * Math.pow(1 + annualRate, years);

      // Format with thousands separator and period as decimal separator
      const formatted = isNaN(futureValue)
        ? "-"
        : new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(futureValue);

      setFutureBalance(formatted);
    } catch (error) {
      console.error("Error calculating future balance:", error);
    }
  }, [balance]);

  // Request permission for notifications
  const requestPermission = useCallback(async () => {
    try {
      const requestPermissionPayload: RequestPermissionPayload = {
        permission: Permission.Notifications,
      };

      await MiniKit.commandsAsync.requestPermission(requestPermissionPayload);
      setHasPermission(true);
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  }, []);

  // Authenticate wallet and get wallet address
  const authenticateWallet = async (retryCount = 0) => {
    setLoading(true);
    setStatus("Connecting to wallet...");

    try {
      console.log("Starting wallet authentication");
      const nonce = Math.random().toString(36).substring(2, 10);

      // Check for existing auth first
      const savedWalletAddress = localStorage.getItem("userWalletAddress");
      const authExpiry = localStorage.getItem("authExpiry");
      const now = Date.now();
      
      // If we have valid saved credentials, use them instead of prompting again
      if (savedWalletAddress && authExpiry && parseInt(authExpiry) > now) {
        console.log("Using existing authentication");
        setWalletAddress(savedWalletAddress);
        setStatus(""); // Clear status
        setLoading(false);
        return savedWalletAddress;
      }

      const result = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        statement: "Connect your wallet to receive notifications",
      });

      console.log("Wallet auth result:", result);

      if (result?.finalPayload.status === "success") {
        const address = result.finalPayload.address;
        console.log("Authentication successful, got address:", address);

        // Store in localStorage for persistence
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("userWalletAddress", address);
            // Set a timestamp for when authentication occurred (30 days expiry)
            const authExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000);
            localStorage.setItem("authExpiry", authExpiry.toString());
          } catch (e) {
            console.error("Error saving to localStorage:", e);
          }
        }

        setWalletAddress(address);
        setStatus(""); // Clear status
        return address;
      } else {
        console.error("Authentication failed or invalid response:", result);
        // Only show error if final retry
        if (retryCount >= 2) {
          setStatus("Authentication failed. Please try again."); 
        }
      }
    } catch (error) {
      console.error("Error authenticating wallet:", error);
      
      // Retry automatically with increasing delay, but limit retries
      if (retryCount < 3) {
        const delay = 2000 * (retryCount + 1); // Exponential backoff
        setTimeout(() => {
          console.log(`Retrying wallet authentication (${retryCount + 1}/3)...`);
          authenticateWallet(retryCount + 1);
        }, delay);
      } else {
        setStatus("Couldn't connect to wallet. Please try again later.");
      }
    } finally {
      setLoading(false);
    }

    return null;
  };

  const handleWithdraw = async () => {
    try {
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worldcoin_address: walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to withdraw funds");
      }

      const data = await response.json();
      console.log("Withdrawal request submitted:", data);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    }
  };

  // Fetch user details from the database
  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details for wallet address:", walletAddress);
      const response = await fetch(
        `/api/users?worldcoin_address=${walletAddress!}`
      );
      const data = await response.json();
      console.log("User details API response:", data);

      if (response.ok && data.success && data.user) {
        setUserDetails(data.user);
      } else {
        console.error("Failed to get valid user details:", data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch balance from API
  const fetchBalance = async () => {
    try {
      // Only use legitimate addresses, never fallbacks
      const addressToUse = userDetails?.address || walletAddress;

      if (!addressToUse) {
        console.error("No valid address available for balance fetch");
        return;
      }

      console.log("Fetching balance for address:", addressToUse);
      const response = await fetch(`/api/balance?address=${addressToUse}`);
      const data = await response.json();
      console.log("Balance API response:", data);

      if (response.ok && data.success) {
        const rawBalance = parseFloat(data.balance);
        console.log("Raw balance value:", rawBalance);

        const formattedBalance = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: rawBalance < 0.1 ? 2 : 0,
          maximumFractionDigits: 2,
        }).format(rawBalance);

        console.log("Formatted balance:", formattedBalance);
        setBalance(formattedBalance);
      } else {
        console.error("Failed to get valid balance data:", data);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Add a periodic refresh for connectivity issues
  useEffect(() => {
    // Try to fetch balance again after authentication is likely complete
    const timeoutId = setTimeout(() => {
      if (userDetails?.address || walletAddress) {
        fetchBalance();
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [userDetails, walletAddress]);

  // Generate a dynamic deep link that uses the current path
  const getReturnDeepLink = () => {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname || "/" : "/";

    return createWorldAppDeepLink(
      process.env.WORLDAPP_APP_ID || "",
      currentPath,
      {
        timestamp: Date.now().toString(),
      }
    );
  };

  // Payment event handlers
  const handlePaymentStarted = async () => {
    setStatus("Payment started! Check your wallet app.");
  };

  const handlePaymentCompleted = async (data: any) => {
    setStatus("Payment completed successfully!");
    const amount = data?.amount || '0';
    
    // Store current wallet state before redirect
    if (walletAddress) {
      localStorage.setItem("userWalletAddress", walletAddress);
      // Set a long expiry to ensure session persists through redirects
      const authExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000);
      localStorage.setItem("authExpiry", authExpiry.toString());
    }
    
    router.push(`/home/success?amount=${amount}`);
  };

  const handlePaymentBounced = async () => {
    setStatus("Payment bounced. Please try again later.");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.appContent}>
          <div className={styles.menuContainer}>
            <button className={styles.menuButton}>
              <div className={styles.menuLine}></div>
              <div className={styles.menuLine}></div>
              <div className={styles.menuLine}></div>
            </button>
          </div>

          <div className={styles.quote}>
            "Every step counts. And you've already taken the first one"
          </div>

          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <div className={styles.cardLabel}>My senda today</div>
                <div className={styles.growthInfo}>
                  Grows at {annualRateDisplay}% annually 😀
                </div>
                <div className={styles.amount} style={{ color: "#4285F4" }}>
                  ${balance}
                </div>
              </div>
              <div className={styles.avatarContainer}>
                <Image
                  src="/images/young.png"
                  alt="Young avatar"
                  width={135}
                  height={135}
                />
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <div className={styles.cardLabel}>My senda tomorrow</div>
                <div className={styles.growthInfo}>
                  In 30 years you would have
                </div>
                <div className={styles.amount} style={{ color: "#34A853" }}>
                  ${futureBalance}
                </div>
              </div>
              <div className={styles.avatarContainer}>
                <Image
                  src="/images/old.png"
                  alt="Old avatar"
                  width={135}
                  height={135}
                />
              </div>
            </div>
          </div>

          <div className={styles.nextPaymentCard}>
            <div className={styles.calendarIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="5"
                  width="22"
                  height="20"
                  rx="2"
                  fill="#FFEFC3"
                />
                <rect x="3" y="5" width="22" height="6" fill="#FFD579" />
                <path
                  d="M9 3V7"
                  stroke="#555555"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M19 3V7"
                  stroke="#555555"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3 11H25"
                  stroke="#555555"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect
                  x="7"
                  y="15"
                  width="4"
                  height="2"
                  rx="0.5"
                  fill="#FFB730"
                />
                <rect
                  x="7"
                  y="19"
                  width="4"
                  height="2"
                  rx="0.5"
                  fill="#FFB730"
                />
                <rect
                  x="13"
                  y="15"
                  width="4"
                  height="2"
                  rx="0.5"
                  fill="#FFB730"
                />
                <rect
                  x="13"
                  y="19"
                  width="4"
                  height="2"
                  rx="0.5"
                  fill="#FFB730"
                />
                <rect
                  x="19"
                  y="15"
                  width="2"
                  height="2"
                  rx="0.5"
                  fill="#FFB730"
                />
              </svg>
            </div>
            <div className={styles.paymentInfo}>
              Your next contribution is scheduled for April 25th
            </div>
          </div>

          <div className={styles.trustedPersonCard}>
            <div className={styles.personIcon}>
              <div className={styles.personBody}></div>
            </div>
            <div className={styles.trustedPersonContent}>
              <div className={styles.trustedPersonTitle}>Trusted person</div>
              <div className={styles.trustedPersonDesc}>
                Choose someone you trust, in case you ever can't continue your
                path
              </div>
              <button className={styles.chooseButton}>Choose</button>
            </div>
          </div>

          <div className={styles.actionsContainer}>
            <button className={styles.withdrawButton} onClick={handleWithdraw}>
              <span className={styles.minusIcon}>−</span>
              Withdraw
            </button>
            {userDetails?.address ? (
              <div className={styles.addButtonWrapper}>
                <DaimoPayButton
                  appId={process.env.NEXT_PUBLIC_DAIMO_API_KEY!}
                  toAddress={getAddress(userDetails.address || "")}
                  toChain={mantleMNT.chainId}
                  toToken={getAddress(mantleUSDT.token)}
                  redirectReturnUrl={getReturnDeepLink()}
                  metadata={{
                    appName: "Senda",
                  }}
                  onPaymentStarted={handlePaymentStarted}
                  onPaymentCompleted={(data) => handlePaymentCompleted(data)}
                  onPaymentBounced={handlePaymentBounced}
                />
              </div>
            ) : (
              <button className={styles.addButton} onClick={() => authenticateWallet()}>
                <span className={styles.plusIcon}>+</span>
                Add money
              </button>
            )}
          </div>

          {status && <div className={styles.statusMessage}>{status}</div>}
        </div>
      </div>
    </div>
  );
}
