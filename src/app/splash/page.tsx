"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./splash.module.css";
import { Outfit, Manrope } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export default function SplashScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/onboarding/1");
  };

  return (
    <main className={styles.splashContainer}>
      <div className={styles.contentFrame}>
        <h1 className={`${styles.title} ${outfit.className}`}>Senda</h1>
        <p className={`${styles.tagline} ${manrope.className}`}>Cuida a quien vas a ser mañana</p>
      </div>
      
      <button 
        onClick={handleGetStarted} 
        className={styles.circleButton}
        aria-label="Get Started"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M4 12H20M20 12L14 6M20 12L14 18" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </main>
  );
} 