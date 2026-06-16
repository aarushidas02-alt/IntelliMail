import React, { useState } from "react";
import { motion } from "framer-motion";

function Dashboard() {

  const [emailText, setEmailText] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const analyzeEmail = async () => {

    if (!emailText.trim()) {
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "https://intellimail-y86b.onrender.com/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            text: emailText,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      setResult(data);

    }

    catch (error) {

      console.log(error);

      setResult({
        prediction: "Backend Error",
        confidence: "0%",
      });

    }

    setLoading(false);

  };

  return (

    <div className="dashboard-page">

      <motion.div
        className="dashboard-container"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        <p className="dashboard-tag">
          MANUAL EMAIL ANALYSIS
        </p>

        <h1 className="dashboard-title">
          Analyze Any Email
          <br />
          Using IntelliMail AI
        </h1>

        <p className="dashboard-subtitle">
          Paste suspicious or unknown email content below
          and let IntelliMail classify it intelligently.
        </p>

        <textarea
          className="email-textarea"
          placeholder="Paste email content here..."
          value={emailText}
          onChange={(e) =>
            setEmailText(e.target.value)
          }
        />

        <motion.button
          className="analyze-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={analyzeEmail}
        >

          {loading
            ? "Analyzing..."
            : "Analyze Email"}

        </motion.button>

        {result && (

          <motion.div
            className="result-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <h2>
              AI Analysis Result
            </h2>

            <p>
              <strong>Category:</strong>
              {" "}
              {result.prediction}
            </p>

            <p>
              <strong>Confidence:</strong>
              {" "}
              {result.confidence}
            </p>

          </motion.div>

        )}

      </motion.div>

    </div>

  );

}

export default Dashboard;