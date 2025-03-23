"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function OnboardingPage5() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("mensual");
  
  const handleContinue = () => {
    // Store the selected option if needed
    // Then navigate to next page
    router.push("/onboarding/6");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/onboarding/4" className={styles.backButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
        
        <div className={styles.titleSection}>
          <h1 className={styles.title}>How often will you add money?</h1>
          <p className={styles.subtitle}>I'll send you a reminder to help you keep the habit</p>
        </div>
        
        <div className={styles.optionsSection}>
          <h2 className={styles.optionsTitle}>Choose an option</h2>
          
          <div className={styles.optionsList}>
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>📅</span>
                <span className={styles.optionText}>Every month</span>
              </div>
              <input 
                type="radio" 
                name="contributionOption" 
                value="mensual" 
                checked={selectedOption === "mensual"} 
                onChange={() => setSelectedOption("mensual")}
                className={styles.radioInput}
              />
              <span className={`${styles.radioButton} ${selectedOption === "mensual" ? styles.selected : ""}`}></span>
            </label>
            
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>✋</span>
                <span className={styles.optionText}>Occasionally, when I can</span>
              </div>
              <input 
                type="radio" 
                name="contributionOption" 
                value="ocasional" 
                checked={selectedOption === "ocasional"} 
                onChange={() => setSelectedOption("ocasional")}
                className={styles.radioInput}
              />
              <span className={`${styles.radioButton} ${selectedOption === "ocasional" ? styles.selected : ""}`}></span>
            </label>
            
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>🕒</span>
                <span className={styles.optionText}>I don't know yet</span>
              </div>
              <input 
                type="radio" 
                name="contributionOption" 
                value="indeciso" 
                checked={selectedOption === "indeciso"} 
                onChange={() => setSelectedOption("indeciso")}
                className={styles.radioInput}
              />
              <span className={`${styles.radioButton} ${selectedOption === "indeciso" ? styles.selected : ""}`}></span>
            </label>
          </div>
        </div>
        
        <div className={styles.infoBox}>
          <span className={styles.infoIcon}>!</span>
          <p className={styles.infoText}>We will choose the best option for your level of risk tolerance.</p>
        </div>
        
        <button className={styles.continueButton} onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
} 