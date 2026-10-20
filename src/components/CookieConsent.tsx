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
        setTimeout(() => setVisible(false), 420);
    };

    if (!visible) return null;

    return (
        <>
            <style>{`
        @keyframes ck-slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ck-slideDown {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(24px) scale(0.96); }
        }

        .ck-card {
          font-family: 'Inter', 'Montserrat', system-ui, -apple-system, sans-serif;
          animation: ck-slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .ck-card.ck-out {
          animation: ck-slideDown 0.38s ease-in forwards;
        }

        .ck-accept {
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          padding: 11px 28px;
          border-radius: 10px;
          transition: all 0.22s ease;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .ck-accept:hover {
          background: linear-gradient(135deg, #15803d, #166534);
          box-shadow: 0 6px 24px rgba(22,163,74,0.35);
          transform: translateY(-1px);
        }
        .ck-accept:active {
          transform: translateY(0);
        }

        .ck-decline {
          background: transparent;
          color: #94a3b8;
          border: 1.5px solid rgba(148,163,184,0.2);
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          padding: 11px 24px;
          border-radius: 10px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .ck-decline:hover {
          border-color: rgba(148,163,184,0.4);
          color: #e2e8f0;
          background: rgba(255,255,255,0.04);
        }

        .ck-link {
          color: #86efac;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid rgba(134,239,172,0.3);
          transition: all 0.18s;
        }
        .ck-link:hover {
          color: #bbf7d0;
          border-bottom-color: rgba(187,247,208,0.5);
        }

        @media (max-width: 640px) {
          .ck-card-inner { flex-direction: column !important; }
          .ck-actions { width: 100%; }
          .ck-actions button { flex: 1; }
        }
      `}</style>

            {/* Subtle backdrop overlay */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 99998,
                    background: "rgba(0,0,0,0.15)",
                    backdropFilter: "blur(2px)",
                    transition: "opacity 0.3s",
                    opacity: animateOut ? 0 : 1,
                    pointerEvents: "none",
                }}
            />

            <div
                className={`ck-card${animateOut ? " ck-out" : ""}`}
                role="dialog"
                aria-label="Cookie consent"
                style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 99999,
                    width: "calc(100% - 32px)",
                    maxWidth: "640px",
                }}
            >
                <div
                    style={{
                        background: "linear-gradient(145deg, #111827 0%, #0d1117 100%)",
                        borderRadius: "20px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 8px 60px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.3)",
                        padding: "28px 28px 24px",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    {/* Subtle gradient accent line */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "10%",
                            right: "10%",
                            height: "2px",
                            background: "linear-gradient(90deg, transparent, #16a34a, #7ede56, #16a34a, transparent)",
                            borderRadius: "999px",
                            opacity: 0.6,
                        }}
                    />

                    {/* Cookie icon + Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, rgba(22,163,74,0.15), rgba(126,222,86,0.1))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                                flexShrink: 0,
                            }}
                        >
                            🍪
                        </div>
                        <div>
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    color: "#f1f5f9",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                We value your privacy
                            </h3>
                            <p style={{ margin: 0, fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                                agrilync.com
                            </p>
                        </div>
                    </div>

                    {/* Body text */}
                    <p
                        style={{
                            margin: "0 0 20px 0",
                            fontSize: "13px",
                            lineHeight: "1.7",
                            color: "#94a3b8",
                        }}
                    >
                        We use essential cookies to keep{" "}
                        <strong style={{ color: "#e2e8f0", fontWeight: 600 }}>Agrilync Nexus</strong>{" "}
                        running smoothly, and optional analytics cookies to understand how you use our
                        platform so we can improve it. You can change your preferences anytime.{" "}
                        <a href="/privacy-policy" className="ck-link">
                            Learn more
                        </a>
                    </p>

                    {/* Actions */}
                    <div
                        className="ck-actions"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            justifyContent: "flex-end",
                        }}
                    >
                        <button
                            id="cookie-decline-btn"
                            className="ck-decline"
                            onClick={() => dismiss("declined")}
                        >
                            Essential Only
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
