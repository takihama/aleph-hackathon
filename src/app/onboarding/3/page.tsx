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
          <h2 className={`${styles.title} ${outfit.className}`}>Así de simple empieza tu Senda</h2>
          <p className={`${styles.description} ${manrope.className}`}>Se guarda en una cuenta digital a tu nombre dentro de una red segura y sin intermediarios.</p>
          <p className={`${styles.description} ${manrope.className}`}>Crece con el tiempo, de forma automática.</p>
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
          <Link href="/onboarding/4" className={styles.nextButton}>
            <span className={styles.arrowIcon}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 