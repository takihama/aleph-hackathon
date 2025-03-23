"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { Outfit, Manrope } from "next/font/google";
import ob2Image from "@/assets/ob_2.png";

const outfit = Outfit({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export default function OnboardingPage2() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <Image 
            src={ob2Image} 
            alt="Retirement fund illustration"
            className={styles.image}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        <div className={styles.textContent}>
          <h2 className={`${styles.title} ${outfit.className}`}>Your retirement fund, without complications.</h2>
          <p className={`${styles.description} ${manrope.className}`}>You don't need to know about investments or finance.</p>
          <p className={`${styles.description} ${manrope.className}`}>You choose how much, when, and how.</p>
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