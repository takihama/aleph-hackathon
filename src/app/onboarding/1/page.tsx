"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { Outfit, Manrope } from "next/font/google";
import ob1Image from "@/assets/ob_1.png";

const outfit = Outfit({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export default function OnboardingPage1() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <Image 
            src={ob1Image} 
            alt="Person walking on a path"
            className={styles.image}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        <div className={styles.textContent}>
          <h2 className={`${styles.title} ${outfit.className}`}>Cuida a quien vas a ser mañana</h2>
          <p className={`${styles.description} ${manrope.className}`}>Tu yo del futuro va a necesitarte.</p>
          <p className={`${styles.description} ${manrope.className}`}>Construye tu retiro, paso a paso, desde hoy</p>
        </div>
        
        <div className={styles.pagination}>
          <span className={styles.activeDot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
        
        <div className={styles.navigation}>
          <Link href="/onboarding/2" className={styles.nextButton}>
            <span className={styles.arrowIcon}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 