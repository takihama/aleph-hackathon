"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function OnboardingPage7() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("equilibrio");

  const handleContinue = () => {
    // Store the selected option if needed
    // Then navigate to home page
    router.push("/home");
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
            ¿Cómo quieres que crezca nuestro fondo?
          </h1>
          <p className={styles.subtitle}>
            Puedes ir con calma, buscar equilibrio o ser más ambicioso
          </p>
        </div>

        <div className={styles.optionsSection}>
          <h2 className={styles.optionsTitle}>Elige una opción</h2>

          <div className={styles.optionsList}>
            <label className={styles.optionCard}>
              <div className={styles.optionContent}>
                <span className={styles.optionEmoji}>🌱</span>
                <span className={styles.optionText}>
                  Prefiero ir con calma, aunque crezca lento
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
                  Busquemos un equilibrio entre seguridad y crecimiento
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
                  Prefiero tomar más riesgos si eso ayuda a crecer más
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
            Elegiremos la mejor opción para tu nivel de tolerancia al riesgo
          </p>
        </div>

        <button className={styles.continueButton} onClick={handleContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}
