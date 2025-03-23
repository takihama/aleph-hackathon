"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();
  
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
          
          <div className={styles.quote}>
            "Cada paso suma. Y vos ya diste el primero"
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <div className={styles.cardLabel}>Mi senda hoy</div>
                <div className={styles.growthInfo}>Crece al 5,5% anual 😀</div>
                <div className={styles.amount} style={{ color: '#4285F4' }}>$100</div>
              </div>
              <div className={styles.avatarContainer}>
                <Image src="/images/young.png" alt="Young avatar" width={135} height={135} />
              </div>
            </div>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardLeft}>
                <div className={styles.cardLabel}>Mi senda mañana</div>
                <div className={styles.growthInfo}>En 30 años tendrías</div>
                <div className={styles.amount} style={{ color: '#34A853' }}>$1.352,7</div>
              </div>
              <div className={styles.avatarContainer}>
                <Image src="/images/old.png" alt="Old avatar" width={135} height={135} />
              </div>
            </div>
          </div>
          
          <div className={styles.nextPaymentCard}>
            <div className={styles.calendarIcon}>
              <div className={styles.calendarBody}></div>
            </div>
            <div className={styles.paymentInfo}>
              Tu próximo aporte está agendado para el 25 de abril
            </div>
          </div>
          
          <div className={styles.trustedPersonCard}>
            <div className={styles.personIcon}>
              <div className={styles.personBody}></div>
            </div>
            <div className={styles.trustedPersonContent}>
              <div className={styles.trustedPersonTitle}>Persona de confianza</div>
              <div className={styles.trustedPersonDesc}>
                Elige a alguien en quien confíes, por si alguna vez no puedes continuar tu senda
              </div>
              <button className={styles.chooseButton}>Elegir</button>
            </div>
          </div>
          
          <div className={styles.actionsContainer}>
            <button className={styles.withdrawButton}>
              <span className={styles.minusIcon}>−</span>
              Retirar dinero
            </button>
            <button className={styles.addButton}>
              <span className={styles.plusIcon}>+</span>
              Sumar dinero
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 