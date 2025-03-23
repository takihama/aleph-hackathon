"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState("0");

  useEffect(() => {
    const amountParam = searchParams.get("amount") || "0";
    setAmount(amountParam);
  }, [searchParams]);

  const formattedAmount = () => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "0";

    // Show 2 decimal places for values less than 1 or with decimal part
    // Otherwise show 0 decimal places for whole numbers
    const hasDecimal = num % 1 !== 0;
    const isSmall = num < 1;

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: isSmall || hasDecimal ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const handleReturn = () => {
    router.push("/home");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path
              fill="#4CAF50"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        </div>

        <h1 className={styles.title}>
          You added ${formattedAmount()} USD
          <br />
          to your retirement fund!
        </h1>

        <div className={styles.message}>
          <p>Thank you for thinking of me</p>
          <p className={styles.signature}>"Your future self"</p>
        </div>

        <button className={styles.button} onClick={handleReturn}>
          Back to home
        </button>
      </div>
    </div>
  );
}
