import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Inbox() {

  const [emails, setEmails] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [openedEmail, setOpenedEmail] =
    useState(null);

  const [nextPageToken, setNextPageToken] =
    useState(null);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [loadingEmail, setLoadingEmail] =
    useState(false);

  // GET TOKEN
  const gmailToken =
    localStorage.getItem("gmail_token");

  // CATEGORY BACKGROUND COLORS
  const categoryBackgrounds = {

    social: "rgba(139,92,246,0.28)",

    promotions: "rgba(249,115,22,0.28)",

    education: "rgba(6,182,212,0.28)",

    banking: "rgba(34,197,94,0.28)",

    spam: "rgba(239,68,68,0.28)"

  };

  // INITIAL FETCH
  useEffect(() => {

    fetchEmails();

  }, []);

  // FETCH EMAILS
  const fetchEmails = (pageToken = null) => {

    let url =
      "https://intellimail-y86b.onrender.com/emails";

    if (pageToken) {

      url += `?pageToken=${pageToken}`;

    }

    fetch(url, {

      headers: {

        Authorization:
          `Bearer ${gmailToken}`

      }

    })

      .then((res) => res.json())

      .then((data) => {

        console.log(data);

        if (data.emails) {

          if (pageToken) {

            setEmails((prev) => [

              ...prev,

              ...data.emails

            ]);

          }

          else {

            setEmails(data.emails);

          }

          setNextPageToken(
            data.nextPageToken
          );

        }

      })

      .catch((err) => {

        console.log(err);

      });

  };

  // LOAD MORE
  const loadMoreEmails = () => {

    if (!nextPageToken) return;

    setLoadingMore(true);

    fetchEmails(nextPageToken);

    setTimeout(() => {

      setLoadingMore(false);

    }, 1200);

  };

  // FETCH FULL EMAIL
  const openEmail = (email) => {

    setLoadingEmail(true);

    fetch(
      `https://intellimail-y86b.onrender.com/email/${email.id}`,
      {

        headers: {

          Authorization:
            `Bearer ${gmailToken}`

        }

      }
    )

      .then((res) => res.json())

      .then((data) => {

        console.log(data);

        setOpenedEmail(data);

        setLoadingEmail(false);

      })

      .catch((err) => {

        console.log(err);

        setLoadingEmail(false);

      });

  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem(
      "gmail_token"
    );

    window.location.href = "/";

  };

  const categories = [

    {
      category: "social",
      label: "Social",
      color: "#8b5cf6",
    },

    {
      category: "promotions",
      label: "Promotions",
      color: "#f97316",
    },

    {
      category: "education",
      label: "Education",
      color: "#06b6d4",
    },

    {
      category: "banking",
      label: "Banking",
      color: "#22c55e",
    },

    {
      category: "spam",
      label: "Spam",
      color: "#ef4444",
    },

  ];

  const filteredEmails = selectedCategory

    ? emails.filter(
        (email) =>
          email.category &&
          email.category.toLowerCase() ===
          selectedCategory
      )

    : [];

  return (

    <div className="inbox-page">

      {/* DYNAMIC CATEGORY GLOW */}

      {selectedCategory && (

        <div
          className="dynamic-category-glow"
          style={{
            background:
              categoryBackgrounds[
                selectedCategory
              ]
          }}
        ></div>

      )}

      <div className="inbox-orb inbox-orb-1"></div>
      <div className="inbox-orb inbox-orb-2"></div>

      <motion.div
        className="inbox-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >

        {/* TOP BAR */}

        <div className="top-bar">

          <p className="inbox-tag">
            AI POWERED GMAIL ANALYSIS
          </p>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

        <h1 className="inbox-title">
          Your Inbox.
          <br />
          Organized Intelligently.
        </h1>

        <p className="inbox-subtitle">
          IntelliMail automatically classified your Gmail inbox
          using AI-powered categorization and threat analysis.
        </p>

        {/* CATEGORY CARDS */}

        <div className="email-grid">

          {categories.map((mail, index) => {

            const count = emails.filter(
              (email) =>
                email.category &&
                email.category.toLowerCase() ===
                mail.category
            ).length;

            return (

              <motion.div
                key={index}
                className="email-card"
                whileHover={{
                  y: -12
                }}
                style={{
                  border:
                    `1px solid ${mail.color}55`,
                }}
                onClick={() => {

                  setSelectedCategory(
                    mail.category
                  );

                }}
              >

                <div
                  className="email-glow"
                  style={{
                    background: mail.color,
                  }}
                ></div>

                <h2>{mail.label}</h2>

                <p className="email-count">
                  {count} Emails
                </p>

                <span className="view-text">
                  View Intelligence →
                </span>

              </motion.div>

            );

          })}

        </div>

        {/* EMAIL LIST */}

        {selectedCategory && (

          <motion.div
            className="selected-mail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: "60px",
            }}
          >

            <div className="selected-header">

              <h2>
                {selectedCategory.toUpperCase()} EMAILS
              </h2>

              <button
                className="close-btn"
                onClick={() => {

                  setSelectedCategory(null);

                }}
              >
                ✕
              </button>

            </div>

            {filteredEmails.map((email, index) => (

              <motion.div
                key={index}
                className="mail-box"
                whileHover={{
                  scale: 1.015
                }}
                whileTap={{
                  scale: 0.98
                }}
                onClick={() =>
                  openEmail(email)
                }
                style={{
                  cursor: "pointer",
                  marginBottom: "22px",
                }}
              >

                <h3>{email.subject}</h3>

                <p>
                  <strong>From:</strong>{" "}
                  {email.sender}
                </p>

                <p
                  style={{
                    marginTop: "12px",
                    opacity: 0.7,
                    fontSize: "14px",
                    lineHeight: "1.8"
                  }}
                >
                  {email.snippet}
                </p>

              </motion.div>

            ))}

            {/* LOAD MORE */}

            {nextPageToken && (

              <div className="load-more-container">

                <motion.button
                  className="load-more-btn"
                  whileHover={{
                    scale: 1.04
                  }}
                  whileTap={{
                    scale: 0.96
                  }}
                  onClick={loadMoreEmails}
                  disabled={loadingMore}
                >

                  {loadingMore
                    ? "Loading..."
                    : "Load More Emails"}

                </motion.button>

              </div>

            )}

          </motion.div>

        )}

      </motion.div>

      {/* LOADING EMAIL */}

      {loadingEmail && (

        <div className="email-modal-overlay">

          <motion.div
            className="email-modal"
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
          >

            <h2
              style={{
                textAlign: "center",
                marginTop: "80px",
              }}
            >
              Loading Email...
            </h2>

          </motion.div>

        </div>

      )}

      {/* FULL EMAIL MODAL */}

      {openedEmail && (

        <div className="email-modal-overlay">

          <motion.div
            className="email-modal"
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
          >

            <button
              className="modal-close"
              onClick={() =>
                setOpenedEmail(null)
              }
            >
              ✕
            </button>

            <h1 className="email-modal-title">
              {openedEmail.subject}
            </h1>

            <div className="email-modal-content">

              <div className="email-full-box">

                <h3>Email Content</h3>

                <p>
                  <strong>From:</strong>{" "}
                  {openedEmail.sender}
                </p>

                <div className="email-text">

                  {openedEmail.body}

                </div>

              </div>

              <div className="analysis-side">

                <h3>AI Analysis</h3>

                <br />

                <p>
                  <strong>Category:</strong>
                </p>

                <p>
                  {openedEmail.category}
                </p>

                <br />

                <p>
                  <strong>Confidence:</strong>
                </p>

                <p>
                  {openedEmail.confidence}
                </p>

                <br />

                <p>
                  IntelliMail AI analyzed this
                  email using NLP classification
                  and threat detection models.
                </p>

              </div>

            </div>

          </motion.div>

        </div>

      )}

    </div>

  );

}

export default Inbox;