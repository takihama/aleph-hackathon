"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState('0');
  
  useEffect(() => {
    const amountParam = searchParams.get('amount') || '0';
    setAmount(amountParam);
  }, [searchParams]);
  
  const handleReturn = () => {
    router.push("/home");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path fill="#4CAF50" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        
        <h1 className={styles.title}>
          ¡Agregaste ${amount} USD
          <br />a tu fondo de retiro!
        </h1>
        
        <div className={styles.message}>
          <p>Gracias por pensar en mí.</p>
          <p className={styles.signature}>"Tu yo del futuro"</p>
        </div>
        
        <button className={styles.button} onClick={handleReturn}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
} 