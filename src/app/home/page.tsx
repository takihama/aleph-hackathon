"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();
  
  const handleStart = () => {
    router.push("/intro");
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.appContent}>
          <div className={styles.menuContainer}>
            <button className={styles.menuButton}>
              <div className={styles.menuLine}></div>
              <div className={styles.menuLine}></div>
              <div className={styles.menuLine}></div>
            </button>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <div className={styles.cardLabel}>Mi senda hoy</div>
                <div className={styles.amount} style={{ color: '#4285F4' }}>$0</div>
                <div className={styles.description}>Crece al 5,5% anual 😀</div>
              </div>
              <div className={styles.avatarContainer}>
                <div className={styles.avatarYoung}></div>
              </div>
            </div>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <div className={styles.cardLabel}>Mi senda mañana</div>
                <div className={styles.amount} style={{ color: '#34A853' }}>$0</div>
                <div className={styles.description}>Tu dinero en 30 años</div>
              </div>
              <div className={styles.avatarContainer}>
                <div className={styles.avatarOld}></div>
              </div>
            </div>
          </div>
          
          <button className={styles.startButton} onClick={handleStart}>
            Quiero empezar
          </button>
        </div>
      </div>
    </div>
  );
} 