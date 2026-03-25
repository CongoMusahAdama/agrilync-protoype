import { useState, useEffect } from "react";

const COOKIE_KEY = "agrilync_cookie_consent";

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_KEY);
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = (choice: "accepted" | "declined") => {
        localStorage.setItem(COOKIE_KEY, choice);
        setAnimateOut(true);
        setTimeout(() => setVisible(false), 380);
    };

    if (!visible) return null;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        @keyframes ck-slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes ck-slideDown {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }

        .ck-bar {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          animation: ck-slideUp 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .ck-bar.ck-out {
          animation: ck-slideDown 0.32s ease-in forwards;
        }

        .ck-accept {
          background: #16a34a;
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 7px;
          transition: background 0.18s, box-shadow 0.18s;
          white-space: nowrap;
        }
        .ck-accept:hover {
          background: #15803d;
          box-shadow: 0 4px 18px rgba(22,163,74,0.38);
        }

        .ck-decline {
          background: transparent;
          color: #cbd5e1;
          border: 1.5px solid rgba(255,255,255,0.18);
          cursor: pointer;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 500;
          padding: 10px 22px;
          border-radius: 7px;
          transition: border-color 0.18s, color 0.18s;
          white-space: nowrap;
        }
        .ck-decline:hover {
          border-color: rgba(255,255,255,0.4);
          color: #fff;
        }

        .ck-link {
          color: #86efac;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s;
        }
        .ck-link:hover { color: #bbf7d0; }

        @media (max-width: 700px) {
          .ck-inner { flex-direction: column; gap: 16px !important; }
          .ck-actions { width: 100%; justify-content: flex-end; }
        }
      `}</style>

            <div
                className={`ck-bar${animateOut ? " ck-out" : ""}`}
                role="dialog"
                aria-label="Cookie consent"
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 99999,
                    background: "#0d1117",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 -4px 40px rgba(0,0,0,0.5)",
                    padding: "22px 40px",
                }}
            >
                <div
                    className="ck-inner"
                    style={{
                        maxWidth: "1280px",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "32px",
                    }}
                >
                    {/* Text */}
                    <p style={{
                        margin: 0,
                        flex: 1,
                        fontSize: "13.5px",
                        lineHeight: "1.75",
                        color: "#94a3b8",
                    }}>
                        We use cookies to improve your experience on{" "}
                        <strong style={{ color: "#f1f5f9", fontWeight: 600 }}>Agrilync</strong>.
                        Some cookies are necessary for the site to function properly. Others help
                        us understand how you use our platform so we can improve it. By clicking{" "}
                        <strong style={{ color: "#f1f5f9" }}>Accept All</strong>, you consent to
                        our use of cookies.{" "}
                        <a href="/privacy-policy" className="ck-link">
                            Cookie Policy
                        </a>
                    </p>

                    {/* Buttons */}
                    <div
                        className="ck-actions"
                        style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}
                    >
                        <button
                            id="cookie-decline-btn"
                            className="ck-decline"
                            onClick={() => dismiss("declined")}
                        >
                            Decline All
                        </button>
                        <button
                            id="cookie-accept-btn"
                            className="ck-accept"
                            onClick={() => dismiss("accepted")}
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CookieConsent;
