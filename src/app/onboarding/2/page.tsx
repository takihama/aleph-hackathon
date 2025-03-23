"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function OnboardingPage2() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          {/* Replace with actual image later */}
          <div className={styles.placeholderImage}>
            {/* Blue illustration of a person looking at a tablet */}
            <div className={styles.personWithTablet}></div>
          </div>
        </div>
        
        <div className={styles.textContent}>
          <h2 className={styles.title}>Tu fonde de retiro, sin complicaciones</h2>
          <p className={styles.subtitle}>No necesitas saber de inversiones ni finanzas</p>
          <p className={styles.description}>Tu eliges cuánto, cuándo y cómo</p>
        </div>
        
        <div className={styles.pagination}>
          <span className={styles.dot}></span>
          <span className={styles.activeDot}></span>
          <span className={styles.dot}></span>
        </div>
        
        <div className={styles.navigation}>
          <Link href="/onboarding/1" className={styles.backButton}>
            <span className={styles.arrowIcon}>←</span>
          </Link>
          <Link href="/onboarding/3" className={styles.nextButton}>
            <span className={styles.arrowIcon}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 