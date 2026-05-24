import React, { useState } from "react";

import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import {
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

import {
  auth,
  provider
} from "../firebase";

function GmailAuth() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {

    try {

      setLoading(true);

      setError("");

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      // GET GOOGLE ACCESS TOKEN
      const credential =
        GoogleAuthProvider.credentialFromResult(
          result
        );

      const token =
        credential.accessToken;

      // STORE TOKEN
      localStorage.setItem(
        "gmail_token",
        token
      );

      console.log(
        "Access Token:",
        token
      );

      console.log(
        result.user
      );

      setTimeout(() => {

        navigate("/inbox");

      }, 1200);

    }

    catch(error){

      console.log(error);

      setError(
        "Authentication failed. Please try again."
      );

      setLoading(false);

    }

  }

  return (

    <div className="gmail-page">

      {/* FLOATING ORBS */}

      <div className="gmail-orb gmail-orb-1"></div>

      <div className="gmail-orb gmail-orb-2"></div>

      {/* MAIN CONTAINER */}

      <motion.div
        className="gmail-container"

        initial={{
          opacity: 0,
          y: 80
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: 0.8
        }}
      >

        {/* TAG */}

        <motion.p
          className="gmail-tag"

          initial={{
            opacity: 0
          }}

          animate={{
            opacity: 1
          }}

          transition={{
            delay: 0.2
          }}
        >
          GMAIL AI INTEGRATION
        </motion.p>

        {/* TITLE */}

        <motion.h1
          className="gmail-title"

          initial={{
            opacity: 0,
            y: 40
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          transition={{
            delay: 0.3
          }}
        >
          Gmail
          <br />
          Intelligence
        </motion.h1>

        {/* SUBTITLE */}

        <motion.p
          className="gmail-subtitle"

          initial={{
            opacity: 0
          }}

          animate={{
            opacity: 1
          }}

          transition={{
            delay: 0.5
          }}
        >
          Securely connect your Gmail account and allow
          IntelliMail AI to intelligently classify,
          analyze, and organize your inbox.
        </motion.p>

        {/* GLASS CARD */}

        <motion.div
          className="gmail-card"

          initial={{
            opacity: 0,
            y: 40
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          transition={{
            delay: 0.7
          }}
        >

          {/* USER */}

          <div className="gmail-user">

            <div className="gmail-avatar">
              A
            </div>

            <div>

              <h3>
                Connect Your Gmail
              </h3>

              <p>
                Google OAuth Secure Login
              </p>

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <motion.button
            className="google-btn"

            whileHover={{
              scale: 1.03
            }}

            whileTap={{
              scale: 0.95
            }}

            onClick={handleGoogleLogin}

            disabled={loading}

            style={{
              opacity: loading ? 0.7 : 1
            }}
          >

            {loading
              ? "Connecting..."
              : "Continue With Google"}

          </motion.button>

          {/* SUCCESS LOADING */}

          {loading && (

            <motion.div

              initial={{
                opacity: 0
              }}

              animate={{
                opacity: 1
              }}

              style={{
                marginTop: "25px"
              }}
            >

              <p
                style={{
                  color: "#5eead4",
                  fontSize: "15px"
                }}
              >
                Gmail verified successfully.
                Preparing your AI inbox...
              </p>

            </motion.div>

          )}

          {/* ERROR */}

          {error && (

            <motion.div

              initial={{
                opacity: 0
              }}

              animate={{
                opacity: 1
              }}

              style={{
                marginTop: "20px"
              }}
            >

              <p
                style={{
                  color: "#ef4444",
                  fontSize: "14px"
                }}
              >
                {error}
              </p>

            </motion.div>

          )}

          {/* SECURITY */}

          <p className="gmail-security">
            Your emails remain encrypted and secure.
          </p>

        </motion.div>

      </motion.div>

    </div>

  );

}

export default GmailAuth;