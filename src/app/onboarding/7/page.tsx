"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function OnboardingPage7() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("equilibrio");

  const handleContinue = () => {
    // Save risk preference
    localStorage.setItem("riskPreference", selectedOption);
    
    // Navigate to page 8 for risk selection
    router.push("/onboarding/8");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/onboarding/6" className={styles.backButton}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            Hello
          </h1>
          <p className={styles.subtitle}>
            It's me... but in a few years
          </p>
          <p className={styles.additionalText}>
            I'm fine, calm
          </p>
          <p className={styles.additionalText}>
            I want to thank you for what you decided to start today
          </p>
        </div>

        <div className={styles.optionsSection}>
          <h2 className={styles.optionsTitle}>Choose an option</h2>

          <div className={styles.optionsList}>
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>🌱</span>
                <span className={styles.optionText}>
                  I prefer to take it slow, even if it grows slowly
                </span>
              </div>
              <input
                type="radio"
                name="riskOption"
                value="conservador"
                checked={selectedOption === "conservador"}
                onChange={() => setSelectedOption("conservador")}
                className={styles.radioInput}
              />
              <span
                className={`${styles.radioButton} ${
                  selectedOption === "conservador" ? styles.selected : ""
                }`}
              ></span>
            </label>

            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>⚖️</span>
                <span className={styles.optionText}>
                  Let's find a balance between safety and growth
                </span>
              </div>
              <input
                type="radio"
                name="riskOption"
                value="equilibrio"
                checked={selectedOption === "equilibrio"}
                onChange={() => setSelectedOption("equilibrio")}
                className={styles.radioInput}
              />
              <span
                className={`${styles.radioButton} ${
                  selectedOption === "equilibrio" ? styles.selected : ""
                }`}
              ></span>
            </label>

            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>🔥</span>
                <span className={styles.optionText}>
                  I prefer to take more risks if it helps grow more
                </span>
              </div>
              <input
                type="radio"
                name="riskOption"
                value="agresivo"
                checked={selectedOption === "agresivo"}
                onChange={() => setSelectedOption("agresivo")}
                className={styles.radioInput}
              />
              <span
                className={`${styles.radioButton} ${
                  selectedOption === "agresivo" ? styles.selected : ""
                }`}
              ></span>
            </label>
          </div>
        </div>

        <div className={styles.infoBox}>
          <span className={styles.infoIcon}>!</span>
          <p className={styles.infoText}>
            We will choose the best option for your risk tolerance level.
          </p>
        </div>

        <button className={styles.continueButton} onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
