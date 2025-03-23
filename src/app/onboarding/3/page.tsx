"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { Outfit, Manrope } from "next/font/google";
import ob3Image from "@/assets/ob_3.png";

const outfit = Outfit({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export default function OnboardingPage3() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <Image 
            src={ob3Image} 
            alt="Simple path illustration"
            className={styles.image}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        <div className={styles.textContent}>
          <h2 className={`${styles.title} ${outfit.className}`}>This is how simply your Senda begins</h2>
          <p className={`${styles.description} ${manrope.className}`}>It is stored in a digital account in your name within a secure network and without intermediaries.</p>
          <p className={`${styles.description} ${manrope.className}`}>It grows over time, automatically.</p>
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
          <Link href="/onboarding/3.5" className={styles.nextButton}>
            <span className={styles.arrowIcon}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 