"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function WebhookMonitor() {
  const [messages, setMessages] = useState<{text: string, timestamp: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/messages");
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessages(data.messages || []);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch messages");
      }
    } catch (error) {
      setError(`Error fetching messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages on load and every 5 seconds
  useEffect(() => {
    fetchMessages();
    
    // Set up polling
    const interval = setInterval(fetchMessages, 5000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);

  // Add a test message
  const addTestMessage = async () => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `🧪 Manual test message at ${new Date().toISOString()}`
        })
      });
      
      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      setError(`Error adding test message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <main className={styles.main}>
      <h1>Webhook Monitor</h1>
      
      <div className={styles.buttonContainer}>
        <button onClick={fetchMessages} className={styles.button}>
          Refresh Messages
        </button>
        <button onClick={addTestMessage} className={styles.button}>
          Add Test Message
        </button>
      </div>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      
      <div className={styles.messageContainer}>
        <h2>Messages ({messages.length})</h2>
        
        {loading && messages.length === 0 ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet. Try sending a test webhook!</p>
        ) : (
          <div className={styles.messageList}>
            {messages.map((message, index) => (
              <div key={index} className={styles.messageItem}>
                <div className={styles.messageText}>{message.text}</div>
                <div className={styles.messageTime}>
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.infoBox}>
        <h3>How to test the webhook:</h3>
        <ol>
          <li>Register your webhook with Daimo Pay</li>
          <li>Get the webhook token and add it to your environment variables</li>
          <li>Send a test webhook event from Daimo</li>
          <li>Messages will appear in this monitor</li>
        </ol>
      </div>
    </main>
  );
} 