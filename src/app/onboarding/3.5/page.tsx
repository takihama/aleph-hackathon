"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Outfit, Manrope } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export default function OnboardingPage3Point5() {
  const router = useRouter();
  const [visibleLines, setVisibleLines] = useState(0);
  const [allLinesShown, setAllLinesShown] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const messageLines = [
    "Hola",
    "Soy vos...",
    "pero dentro de unos años",
    "Estoy bien, tranquilo",
    "Quiero darte las gracias por lo que decidiste comenzar hoy"
  ];

  const advanceText = useCallback(() => {
    if (visibleLines < messageLines.length) {
      setVisibleLines(prev => prev + 1);
    } else {
      setAllLinesShown(true);
    }
  }, [visibleLines, messageLines.length]);

  // Handle tap/click anywhere to advance
  const handleScreenTap = useCallback(() => {
    if (!allLinesShown) {
      setAutoAdvance(false);
      advanceText();
    }
  }, [allLinesShown, advanceText]);

  // Auto-advance timer
  useEffect(() => {
    if (!autoAdvance || allLinesShown) return;

    const timer = setTimeout(() => {
      advanceText();
    }, 2500);

    return () => clearTimeout(timer);
  }, [visibleLines, autoAdvance, allLinesShown, advanceText]);

  // Set allLinesShown when all lines have been displayed
  useEffect(() => {
    if (visibleLines >= messageLines.length && !allLinesShown) {
      setAllLinesShown(true);
    }
  }, [visibleLines, messageLines.length, allLinesShown]);

  return (
    <div className={styles.container} onClick={handleScreenTap}>
      <div className={styles.content}>
        <div className={styles.messageContainer}>
          {messageLines.slice(0, visibleLines).map((line, index) => (
            <p 
              key={index} 
              className={`${styles.messageLine} ${manrope.className}`}
              style={{
                top: `${50 + index * 60}px`,
                zIndex: messageLines.length - index
              }}
            >
              {line}
            </p>
          ))}
        </div>
        
        <div className={styles.navigation}>
          {allLinesShown && (
            <Link href="/onboarding/4" className={styles.nextButton}>
              <span className={styles.arrowIcon}>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 