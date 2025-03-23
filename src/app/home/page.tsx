"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import { useCallback, useEffect, useState } from "react";
import { DaimoPayButton } from "@daimo/pay";
import { getAddress } from "viem";
import { mantleMNT } from "@daimo/contract";
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
      authenticateWallet();
    }
  }, [isInstalled]);

  // Fetch user details when wallet address is available
  useEffect(() => {
    if (walletAddress) {
      fetchUserDetails();
    }
  }, [walletAddress]);

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
  const authenticateWallet = async () => {
    setLoading(true);

    try {
      const nonce = Math.random().toString(36).substring(2, 10);

      const result = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        statement: "Connect your wallet to receive notifications",
      });

      if (result?.finalPayload.status === "success") {
        const address = result.finalPayload.address;
        setWalletAddress(address);
        return address;
      }
    } catch (error) {
      console.error("Error authenticating wallet:", error);
    } finally {
      setLoading(false);
    }
    
    return null;
  };

  // Fetch user details from the database
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(
        `/api/users?worldcoin_address=${walletAddress!}`
      );
      const data = await response.json();

      if (response.ok && data.success && data.user) {
        setUserDetails(data.user);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

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

  const handlePaymentCompleted = async () => {
    setStatus("Payment completed successfully!");
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
            "Cada paso suma. Y vos ya diste el primero"
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <div className={styles.cardLabel}>Mi senda hoy</div>
                <div className={styles.growthInfo}>Crece al 5,5% anual 😀</div>
                <div className={styles.amount} style={{ color: '#4285F4' }}>$100</div>
              </div>
              <div className={styles.avatarContainer}>
                <Image src="/images/young.png" alt="Young avatar" width={135} height={135} />
              </div>
            </div>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <div className={styles.cardLabel}>Mi senda mañana</div>
                <div className={styles.growthInfo}>En 30 años tendrías</div>
                <div className={styles.amount} style={{ color: '#34A853' }}>$1.352,7</div>
              </div>
              <div className={styles.avatarContainer}>
                <Image src="/images/old.png" alt="Old avatar" width={135} height={135} />
              </div>
            </div>
          </div>
          
          <div className={styles.nextPaymentCard}>
            <div className={styles.calendarIcon}>
              <div className={styles.calendarBody}></div>
            </div>
            <div className={styles.paymentInfo}>
              Tu próximo aporte está agendado para el 25 de abril
            </div>
          </div>
          
          <div className={styles.trustedPersonCard}>
            <div className={styles.personIcon}>
              <div className={styles.personBody}></div>
            </div>
            <div className={styles.trustedPersonContent}>
              <div className={styles.trustedPersonTitle}>Persona de confianza</div>
              <div className={styles.trustedPersonDesc}>
                Elige a alguien en quien confíes, por si alguna vez no puedes continuar tu senda
              </div>
              <button className={styles.chooseButton}>Elegir</button>
            </div>
          </div>
          
          <div className={styles.actionsContainer}>
            <button className={styles.withdrawButton}>
              <span className={styles.minusIcon}>−</span>
              Retirar dinero
            </button>
            {userDetails?.address ? (
              <div className={styles.addButtonWrapper}>
                <DaimoPayButton
                  appId={process.env.NEXT_PUBLIC_DAIMO_API_KEY!}
                  toAddress={getAddress(userDetails.address || "")}
                  toChain={mantleMNT.chainId}
                  toToken={getAddress(mantleMNT.token)}
                  redirectReturnUrl={getReturnDeepLink()}
                  metadata={{
                    appName: "Senda",
                  }}
                  onPaymentStarted={handlePaymentStarted}
                  onPaymentCompleted={handlePaymentCompleted}
                  onPaymentBounced={handlePaymentBounced}
                />
              </div>
            ) : (
              <button 
                className={styles.addButton}
                onClick={authenticateWallet}
              >
                <span className={styles.plusIcon}>+</span>
                Sumar dinero
              </button>
            )}
          </div>
          
          {status && (
            <div className={styles.statusMessage}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 