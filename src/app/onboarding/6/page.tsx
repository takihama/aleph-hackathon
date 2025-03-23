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
          <h1 className={styles.title}>¿Con qué frecuencia sumarás dinero al fondo?</h1>
          <p className={styles.subtitle}>Te enviaré un recordatorio para ayudarte a mantener el hábito</p>
        </div>
        
        <div className={styles.optionsSection}>
          <h2 className={styles.optionsTitle}>Elige una opción</h2>
          
          <div className={styles.optionsList}>
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>✅</span>
                <span className={styles.optionText}>Sí, cada mes</span>
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
                <span className={styles.optionText}>Quiero hacerlo de forma manual</span>
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
                <span className={styles.optionText}>No lo sé aún, recuerdamelo después</span>
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
          <p className={styles.infoText}>Te enviaremos un recordatorio más adelante, según la opción que elijas</p>
        </div>
        
        <button className={styles.continueButton} onClick={handleContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
} 