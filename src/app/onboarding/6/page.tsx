"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function OnboardingPage6() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("mensual");
  
  const handleContinue = () => {
    // Store the selected option if needed
    // Then navigate to next page
    router.push("/onboarding/7");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/onboarding/5" className={styles.backButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
        
        <div className={styles.titleSection}>
          <h1 className={styles.title}>How do you want our fund to grow?</h1>
          <p className={styles.subtitle}>You can take it slow, seek balance, or be more ambitious</p>
        </div>
        
        <div className={styles.optionsSection}>
          <h2 className={styles.optionsTitle}>Choose an option</h2>
          
          <div className={styles.optionsList}>
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>✅</span>
                <span className={styles.optionText}>I prefer to take it slow, even if it grows slowly</span>
              </div>
              <input 
                type="radio" 
                name="frequencyOption" 
                value="mensual" 
                checked={selectedOption === "mensual"} 
                onChange={() => setSelectedOption("mensual")}
                className={styles.radioInput}
              />
              <span className={`${styles.radioButton} ${selectedOption === "mensual" ? styles.selected : ""}`}></span>
            </label>
            
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>🔄</span>
                <span className={styles.optionText}>Let's find a balance between safety and growth</span>
              </div>
              <input 
                type="radio" 
                name="frequencyOption" 
                value="manual" 
                checked={selectedOption === "manual"} 
                onChange={() => setSelectedOption("manual")}
                className={styles.radioInput}
              />
              <span className={`${styles.radioButton} ${selectedOption === "manual" ? styles.selected : ""}`}></span>
            </label>
            
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>⌛</span>
                <span className={styles.optionText}>I prefer to take more risks if it helps grow more</span>
              </div>
              <input 
                type="radio" 
                name="frequencyOption" 
                value="despues" 
                checked={selectedOption === "despues"} 
                onChange={() => setSelectedOption("despues")}
                className={styles.radioInput}
              />
              <span className={`${styles.radioButton} ${selectedOption === "despues" ? styles.selected : ""}`}></span>
            </label>
          </div>
        </div>
        
        <div className={styles.infoBox}>
          <span className={styles.infoIcon}>!</span>
          <p className={styles.infoText}>We will choose the best option for your risk tolerance level.</p>
        </div>
        
        <button className={styles.continueButton} onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
} 