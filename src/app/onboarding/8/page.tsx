"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function OnboardingPage8() {
  const router = useRouter();
  const [contributionAmount, setContributionAmount] = useState(25);
  const [riskLevel, setRiskLevel] = useState("medium");
  const [yield_, setYield] = useState(8.5);
  const [showOptions, setShowOptions] = useState(false);
  const [chartPath, setChartPath] = useState("");
  const chartRef = useRef(null);
  
  // Update chart when contribution amount or yield changes
  useEffect(() => {
    setChartPath(createChartPath());
  }, [contributionAmount, yield_]);

  // Set risk level based on selection
  const handleRiskChange = (level: string) => {
    setRiskLevel(level);
    
    // Set yield based on risk level
    if (level === "low") {
      setYield(5.5);
    } else if (level === "medium") {
      setYield(8.5);
    } else if (level === "high") {
      setYield(12.0);
    }
    
    setShowOptions(false);
  };

  // Calculate compound interest over time
  const calculateGrowth = (years: number) => {
    const monthlyContribution = contributionAmount;
    const annualRate = yield_ / 100;
    let futureValue = 0;
    
    // Calculate monthly rate
    const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1;
    
    // Calculate future value using compound interest formula for periodic contributions
    // FV = PMT × ((1 + r)^n - 1) / r
    futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, years * 12) - 1) / monthlyRate);
    
    return futureValue;
  };

  // Prevent default on slider to stop page movement
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setContributionAmount(parseInt(e.target.value));
  };

  // Create SVG path for the growth chart with randomness
  const createChartPath = () => {
    const width = 300;
    const height = 150;
    const maxYears = 30;
    const leftPadding = 50; // Add left padding
    const volatilityFactor = 0.03; // Amount of randomness (higher = more jagged)
    
    let path = "";
    const points = [];
    
    // Calculate points for the path with slight random variations
    for (let year = 0; year <= maxYears; year++) {
      const futureValue = calculateGrowth(year);
      const maxValue = calculateGrowth(maxYears);
      
      // Add randomness to make the line look more natural
      const randomFactor = 1 + (Math.random() * 2 - 1) * volatilityFactor;
      const adjustedValue = futureValue * randomFactor;
      
      // Scale x and y values to fit chart with left padding
      const x = leftPadding + ((year / maxYears) * (width - leftPadding));
      const y = height - (adjustedValue / maxValue) * height;
      
      points.push({ x, y });
    }
    
    // Smooth the points a bit to avoid extreme jaggedness
    if (points.length > 0) {
      path += `M ${points[0].x} ${points[0].y} `;
      
      for (let i = 1; i < points.length; i++) {
        path += `L ${points[i].x} ${points[i].y} `;
      }
    }
    
    return path;
  };

  // Generate y-axis values based on contribution amount
  const getYAxisValues = () => {
    const maxValue = calculateGrowth(30);
    
    // Dynamically generate y-axis values based on max value
    const scale = getYAxisScale(maxValue);
    
    // Return values in reverse order (larger values at the top)
    return scale.reverse().map(value => `$${formatCurrency(value)}`);
  };
  
  // Generate appropriate scale for y-axis
  const getYAxisScale = (maxValue: number) => {
    if (maxValue < 1000) {
      return [100, 250, 500, 750, 1000];
    } else if (maxValue < 5000) {
      return [500, 1000, 2000, 3000, 5000];
    } else if (maxValue < 10000) {
      return [1000, 2500, 5000, 7500, 10000];
    } else if (maxValue < 50000) {
      return [5000, 10000, 20000, 30000, 50000];
    } else {
      return [10000, 25000, 50000, 75000, 100000];
    }
  };
  
  // Format currency without decimal places for larger numbers
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return new Intl.NumberFormat('en-US', { 
        maximumFractionDigits: 0 
      }).format(value);
    }
    return value.toString();
  };

  // Generate x-axis values (years)
  const getXAxisValues = () => {
    return ["1", "5", "10", "15", "20", "25", "30"];
  };

  const getRiskEmoji = () => {
    if (riskLevel === "low") return "🛡️";
    if (riskLevel === "medium") return "⚖️";
    if (riskLevel === "high") return "🔥";
    return "⚖️";
  };

  // Handle continue button
  const handleContinue = () => {
    // Save risk level and yield to localStorage
    localStorage.setItem("riskLevel", riskLevel);
    localStorage.setItem("yield", yield_.toString());
    
    // Mark onboarding as completed and navigate to home
    localStorage.setItem("onboardingCompleted", "true");
    router.push("/home");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/onboarding/7" className={styles.backButton}>
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
          <h1 className={styles.title}>See how your senda can grow</h1>
          <p className={styles.subtitle}>
            Simulate how the fund could grow based on the pace you choose
          </p>
        </div>

        <div className={styles.chartSection}>
          <div className={styles.chartContainer}>
            <div className={styles.yAxis}>
              {getYAxisValues().map((value, index) => (
                <span key={index}>{value}</span>
              ))}
            </div>
            <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
              <path
                d={chartPath}
                className={styles.chartLine}
              />
            </svg>
            <div className={styles.xAxis}>
              {getXAxisValues().map((year, index) => (
                <span key={index}>{year}</span>
              ))}
            </div>
            <div className={styles.xAxisLabel}>Years</div>
          </div>

          <div className={styles.contributionSection}>
            <p className={styles.contributionText}>
              If you add ${contributionAmount} per month...
            </p>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={contributionAmount}
                onChange={handleSliderChange}
                className={styles.slider}
                onTouchMove={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className={styles.riskLevelContainer}>
            <span className={styles.riskLevel}>Risk: {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</span>
            <span className={styles.riskSymbol}>{getRiskEmoji()}</span>
            <button className={styles.modifyButton} onClick={() => setShowOptions(!showOptions)}>
              {showOptions ? "Close" : "Modify"}
            </button>
          </div>
        </div>

        {/* Modal popup for risk options */}
        {showOptions && (
          <div className={styles.modalOverlay} onClick={() => setShowOptions(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Select risk level</h3>
                <button className={styles.closeButton} onClick={() => setShowOptions(false)}>×</button>
              </div>
              
              <div className={styles.optionsList}>
                <label className={styles.optionCard} onClick={() => handleRiskChange("low")}>
                  <div className={styles.optionContent}>
                    <span className={styles.optionEmoji}>🛡️</span>
                    <span className={styles.optionText}>Low risk (5.5% yield)</span>
                  </div>
                  <input
                    type="radio"
                    name="riskOption"
                    value="low"
                    checked={riskLevel === "low"}
                    onChange={() => {}}
                    className={styles.radioInput}
                  />
                  <span
                    className={`${styles.radioButton} ${
                      riskLevel === "low" ? styles.selected : ""
                    }`}
                  ></span>
                </label>

                <label className={styles.optionCard} onClick={() => handleRiskChange("medium")}>
                  <div className={styles.optionContent}>
                    <span className={styles.optionEmoji}>⚖️</span>
                    <span className={styles.optionText}>Medium risk (8.5% yield)</span>
                  </div>
                  <input
                    type="radio"
                    name="riskOption"
                    value="medium"
                    checked={riskLevel === "medium"}
                    onChange={() => {}}
                    className={styles.radioInput}
                  />
                  <span
                    className={`${styles.radioButton} ${
                      riskLevel === "medium" ? styles.selected : ""
                    }`}
                  ></span>
                </label>

                <label className={styles.optionCard} onClick={() => handleRiskChange("high")}>
                  <div className={styles.optionContent}>
                    <span className={styles.optionEmoji}>🔥</span>
                    <span className={styles.optionText}>High risk (12% yield)</span>
                  </div>
                  <input
                    type="radio"
                    name="riskOption"
                    value="high"
                    checked={riskLevel === "high"}
                    onChange={() => {}}
                    className={styles.radioInput}
                  />
                  <span
                    className={`${styles.radioButton} ${
                      riskLevel === "high" ? styles.selected : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className={styles.infoBox}>
          <span className={styles.infoIcon}>!</span>
          <p className={styles.infoText}>
            It is an estimated calculation based on the information you provided earlier
          </p>
        </div>

        <button className={styles.continueButton} onClick={handleContinue}>
          Add money to the fund
        </button>
      </div>
    </div>
  );
} 