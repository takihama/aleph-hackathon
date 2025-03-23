"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function OnboardingPage3() {
  const router = useRouter();
  
  const handleGetStarted = () => {
    // Navigate to the main app or registration
    router.push("/home");
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          {/* Replace with actual image later */}
          <div className={styles.placeholderImage}>
            {/* Blue illustration of people on clouds */}
            <div className={styles.cloudScene}></div>
          </div>
        </div>
        
        <div className={styles.textContent}>
          <h2 className={styles.title}>Así de simple empieza tu Senda</h2>
          <p className={styles.subtitle}>Se guarda en una cuenta digital a tu nombre dentro de una red segura y sin intermediarios.</p>
          <p className={styles.description}>Crece con el tiempo, de forma automática.</p>
        </div>
        
        <div className={styles.pagination}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.activeDot}></span>
        </div>
        
        <div className={styles.navigation}>
          <Link href="/onboarding/2" className={styles.backButton}>
            <span className={styles.arrowIcon}>←</span>
          </Link>
          <button onClick={handleGetStarted} className={styles.startButton}>
            Comenzar
          </button>
        </div>
      </div>
    </div>
  );
} 