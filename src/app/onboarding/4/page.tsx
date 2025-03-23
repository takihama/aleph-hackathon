"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function OnboardingPage4() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("tranquilo");
  
  const handleContinue = () => {
    // Store the selected option if needed
    // Then navigate to next page
    router.push("/onboarding/5");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/onboarding/3.5" className={styles.backButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
        
        <div className={styles.titleSection}>
          <h1 className={styles.title}>How do you picture your life in retirement?</h1>
          <p className={styles.subtitle}>Take a moment to envision how you want to live that future</p>
        </div>
        
        <div className={styles.optionsSection}>
          <h2 className={styles.optionsTitle}>Choose an option</h2>
          
          <div className={styles.optionsList}>
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>🛏️</span>
                <span className={styles.optionText}>Living peacefully, without worries</span>
              </div>
              <input 
                type="radio" 
                name="retirementOption" 
                value="tranquilo" 
                checked={selectedOption === "tranquilo"} 
                onChange={() => setSelectedOption("tranquilo")}
                className={styles.radioInput}
              />
              <span className={`${styles.radioButton} ${selectedOption === "tranquilo" ? styles.selected : ""}`}></span>
            </label>
            
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>👨‍👩‍👧‍👦</span>
                <span className={styles.optionText}>Enjoying time with those I love</span>
              </div>
              <input 
                type="radio" 
                name="retirementOption" 
                value="familia" 
                checked={selectedOption === "familia"} 
                onChange={() => setSelectedOption("familia")}
                className={styles.radioInput}
              />
              <span className={`${styles.radioButton} ${selectedOption === "familia" ? styles.selected : ""}`}></span>
            </label>
            
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>🌍</span>
                <span className={styles.optionText}>Traveling or fulfilling pending dreams</span>
              </div>
              <input 
                type="radio" 
                name="retirementOption" 
                value="viajes" 
                checked={selectedOption === "viajes"} 
                onChange={() => setSelectedOption("viajes")}
                className={styles.radioInput}
              />
              <span className={`${styles.radioButton} ${selectedOption === "viajes" ? styles.selected : ""}`}></span>
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