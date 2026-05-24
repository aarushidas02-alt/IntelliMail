import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function LandingPage() {

  const navigate = useNavigate();

  return (

    <div className="landing-page">

      {/* PREMIUM BACKGROUND */}

      <div className="bg-wrapper">

        <div className="bg-gradient bg-gradient-1"></div>

        <div className="bg-gradient bg-gradient-2"></div>

        <div className="bg-gradient bg-gradient-3"></div>

        <div className="grid-overlay"></div>

        <div className="particles"></div>

      </div>

      {/* HERO */}

      <section className="hero-section">

        <motion.div

          className="hero-content"

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          transition={{ duration: 1.2 }}

        >

          <motion.h1
            className="main-title"

            initial={{ opacity: 0, y: 100 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{
              duration: 1.2
            }}
          >
            IntelliMail
          </motion.h1>

          <motion.p
            className="hero-subtitle"

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            transition={{
              delay: 0.5,
              duration: 1
            }}
          >
            AI that understands your inbox
            before you do.
          </motion.p>

        </motion.div>

      </section>

      {/* HUGE TEXT */}

      <section className="section">

        <motion.div

          initial={{
            opacity: 0,
            y: 100
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: false,
            amount: 0.3
          }}

          transition={{
            duration: 1
          }}
        >

          <p className="section-tag">
            AI POWERED INTELLIGENCE
          </p>

          <h2 className="huge-text">
            Your inbox finally becomes
            intelligent.
          </h2>

        </motion.div>

      </section>

      {/* FEATURES */}

      <section className="features-section">

        <motion.div
          className="glass-card"

          initial={{
            opacity: 0,
            y: 80
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: false
          }}

          transition={{
            duration: 0.7
          }}

          whileHover={{
            y: -12,
            scale: 1.02
          }}
        >

          <div className="card-glow" />

          <h3>Spam Detection</h3>

          <p>
            Detect phishing attacks,
            scam emails, suspicious links,
            dangerous attachments,
            and malicious patterns instantly
            using AI-powered threat analysis.
          </p>

        </motion.div>

        <motion.div
          className="glass-card"

          initial={{
            opacity: 0,
            y: 80
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: false
          }}

          transition={{
            duration: 0.7,
            delay: 0.1
          }}

          whileHover={{
            y: -12,
            scale: 1.02
          }}
        >

          <div className="card-glow" />

          <h3>Banking Intelligence</h3>

          <p>
            Automatically organize banking
            alerts, payment notifications,
            transactions, invoices,
            credit card statements,
            and financial activity securely.
          </p>

        </motion.div>

        <motion.div
          className="glass-card"

          initial={{
            opacity: 0,
            y: 80
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: false
          }}

          transition={{
            duration: 0.7,
            delay: 0.2
          }}

          whileHover={{
            y: -12,
            scale: 1.02
          }}
        >

          <div className="card-glow" />

          <h3>Educational Sorting</h3>

          <p>
            Sort assignments, internships,
            exam schedules, placement updates,
            university announcements,
            and academic communications
            intelligently.
          </p>

        </motion.div>

        <motion.div
          className="glass-card"

          initial={{
            opacity: 0,
            y: 80
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: false
          }}

          transition={{
            duration: 0.7,
            delay: 0.3
          }}

          whileHover={{
            y: -12,
            scale: 1.02
          }}
        >

          <div className="card-glow" />

          <h3>Smart Categorization</h3>

          <p>
            IntelliMail learns your inbox
            behavior and intelligently
            categorizes every email into
            meaningful AI-powered sections
            automatically.
          </p>

        </motion.div>

      </section>

      {/* CINEMATIC */}

      <section className="cinematic-section">

        <motion.div

          initial={{
            opacity: 0,
            scale: 0.9
          }}

          whileInView={{
            opacity: 1,
            scale: 1
          }}

          viewport={{
            once: false,
            amount: 0.4
          }}

          transition={{
            duration: 1.2
          }}
        >

          <p className="section-tag">
            BUILT FOR THE FUTURE
          </p>

          <h2 className="cinematic-text">
            Your inbox wasn’t built
            for the AI era.
            <br />
            IntelliMail is.
          </h2>

        </motion.div>

      </section>

      {/* FINAL CTA */}

      <section className="final-section">

        <motion.div

          className="final-container"

          initial={{
            opacity: 0,
            y: 100
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: false,
            amount: 0.3
          }}

          transition={{
            duration: 1
          }}
        >

          <p className="section-tag">
            CHOOSE YOUR EXPERIENCE
          </p>

          <h2 className="final-heading">
            Manual Analysis
            or Full Gmail AI?
          </h2>

          <p className="final-description">

            Paste suspicious emails manually
            for instant AI spam detection
            and vulnerability analysis,
            or connect your Gmail inbox
            for fully automated intelligent
            email classification.

          </p>

          <div className="button-group">

            <motion.button

              className="manual-btn"

              whileHover={{
                scale: 1.04,
                y: -4
              }}

              whileTap={{
                scale: 0.96
              }}

              onClick={() =>
                navigate("/dashboard")
              }
            >
              Analyze Custom Email
            </motion.button>

            <motion.button

              className="google-btn"

              whileHover={{
                scale: 1.04,
                y: -4
              }}

              whileTap={{
                scale: 0.96
              }}

              onClick={() =>
                navigate("/gmail-auth")
              }
            >
              Continue With Google
            </motion.button>

          </div>

        </motion.div>

      </section>

    </div>

  );

}

export default LandingPage;