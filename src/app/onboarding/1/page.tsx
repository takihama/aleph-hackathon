"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function OnboardingPage1() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          {/* Replace with actual image later */}
          <div className={styles.placeholderImage}>
            {/* Blue illustration of a person walking on a path */}
            <div className={styles.bluePath}></div>
            <div className={styles.person}></div>
          </div>
        </div>
        
        <div className={styles.textContent}>
          <h2 className={styles.title}>Cuida a quien vas a ser mañana</h2>
          <p className={styles.subtitle}>Tu yo del futuro va a necesitarte.</p>
          <p className={styles.description}>Construye tu retiro, paso a paso, desde hoy</p>
        </div>
        
        <div className={styles.pagination}>
          <span className={styles.activeDot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
        
        <Link href="/onboarding/2" className={styles.nextButton}>
          <span className={styles.arrowIcon}>→</span>
        </Link>
      </div>
    </div>
  );
} 