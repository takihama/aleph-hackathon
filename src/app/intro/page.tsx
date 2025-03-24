"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function IntroScreen() {
  const router = useRouter();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  
  // Array of intro texts to display
  const introTexts = [
    "Every dollar you save today...",
    "... becomes security for tomorrow",
    "Your future begins with small steps",
    "Welcome to Senda"
  ];

  useEffect(() => {
    if (currentTextIndex < introTexts.length - 1) {
      // Start fade out effect
      const fadeOutTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2000);
      
      // Move to next text after fade out completes
      const nextTextTimer = setTimeout(() => {
        setFadeOut(false);
        setCurrentTextIndex(prevIndex => prevIndex + 1);
      }, 2500);
      
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(nextTextTimer);
      };
    } else if (currentTextIndex === introTexts.length - 1) {
      // After showing the last text, wait and then navigate to splash page
      const splashTimer = setTimeout(() => {
        setFadeOut(true);
        
        setTimeout(() => {
          router.push("/splash");
        }, 500);
      }, 2000);
      
      return () => clearTimeout(splashTimer);
    }
  }, [currentTextIndex, introTexts.length, router]);

  return (
    <main className={styles.introContainer}>
      <div className={`${styles.introTextContainer} ${fadeOut ? styles.fadeOut : styles.fadeIn}`}>
        <p className={styles.introText}>{introTexts[currentTextIndex]}</p>
      </div>
    </main>
  );
} 