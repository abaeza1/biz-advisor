import { useState, useRef, useEffect } from "react";
import { translations } from "./translations";

export default function SmallBizAdvisor() {
  const [lang, setLang] = useState("en");
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("home");
  const chatEndRef = useRef(null);

  // Pull the current language's text
  const t = translations[lang];
  const CATEGORIES = t.categories;

  // Reset chat and category when language changes
  useEffect(() => {
    setMessages([]);
    setActiveCategory(null);
    setExpandedFaq(null);
    setView("home");
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || chatInput.trim();
    if (!userText || loading) return;
    setChatInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          systemPrompt: t.chat.systemPrompt,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || (lang === "en"
        ? "Sorry, I couldn't get a response. Please try again."
        : "Lo siento, no pude obtener una respuesta. Por favor intenta de nuevo.");
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: lang === "en"
          ? "Connection error. Please try again."
          : "Error de conexión. Por favor intenta de nuevo."
      }]);
    }
    setLoading(false);
  };

  const openCategory = (cat) => {
    setActiveCategory(cat);
    setExpandedFaq(null);
    setView("category");
  };

  const goHome = () => {
    setView("home");
    setActiveCategory(null);
    setExpandedFaq(null);
  };

  const openChat = (prefill) => {
    setView("chat");
    if (prefill) setTimeout(() => sendMessage(prefill), 100);
  };

  const toggleLang = () => setLang(l => l === "en" ? "es" : "en");

  const cat = activeCategory;

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav style={styles.nav}>
        <button onClick={goHome} style={styles.navLogo}>
          <span style={styles.logoMark}>◈</span>
          <span style={styles.logoText}>{t.appName}</span>
        </button>
        <div style={styles.navRight}>
          <button onClick={goHome} style={{ ...styles.navLink, ...(view === "home" ? styles.navLinkActive : {}) }}>
            {t.nav.home}
          </button>
          <button onClick={() => setView("chat")} style={{ ...styles.navLink, ...(view === "chat" ? styles.navLinkActive : {}) }}>
            {t.nav.askAI}
          </button>

          {/* ── Language Toggle ── */}
          <button onClick={toggleLang} style={styles.langToggle} className="lang-toggle" title={lang === "en" ? "Cambiar a Español" : "Switch to English"}>
            <span style={{ ...styles.langOption, ...(lang === "en" ? styles.langActive : styles.langInactive) }}>EN</span>
            <span style={styles.langDivider}>|</span>
            <span style={{ ...styles.langOption, ...(lang === "es" ? styles.langActive : styles.langInactive) }}>ES</span>
          </button>
        </div>
      </nav>

      {/* ══════════ HOME ══════════ */}
      {view === "home" && (
        <main style={styles.main}>
          <section style={styles.hero}>
            <div style={styles.heroBadge}>{t.hero.badge}</div>
            <h1 style={styles.heroTitle}>
              {t.hero.title1}<br />
              <span style={styles.heroAccent}>{t.hero.title2}</span>
            </h1>
            <p style={styles.heroSub}>{t.hero.sub}</p>
            <div style={styles.heroActions}>
              <button onClick={() => openChat()} style={styles.btnPrimary} className="btn-primary">
                {t.hero.btnAI}
              </button>
              <button onClick={() => document.getElementById("categories").scrollIntoView({ behavior: "smooth" })} style={styles.btnGhost}>
                {t.hero.btnBrowse}
              </button>
            </div>
          </section>

          <section style={styles.quickSection}>
            <p style={styles.quickLabel}>{t.popularLabel}</p>
            <div style={styles.quickGrid}>
              {t.popularQuestions.map((q) => (
                <button key={q} onClick={() => openChat(q)} style={styles.quickChip} className="quick-chip">
                  {q}
                </button>
              ))}
            </div>
          </section>

          <section id="categories" style={styles.catSection}>
            <h2 style={styles.sectionTitle}>{t.browseTitle}</h2>
            <div style={styles.catGrid}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => openCategory(c)} style={{ ...styles.catCard, background: c.bg, borderColor: c.color + "33" }} className="cat-card">
                  <span style={{ ...styles.catIcon, color: c.color }}>{c.icon}</span>
                  <span style={styles.catLabel}>{c.label}</span>
                  <span style={styles.catDesc}>{c.desc}</span>
                  <span style={{ ...styles.catCount, color: c.color }}>{t.faqCount(c.faqs.length)}</span>
                  <div style={{ ...styles.catGlow, background: c.color + "18" }} />
                </button>
              ))}
            </div>
          </section>

          <section style={styles.ctaStrip}>
            <div style={styles.ctaContent}>
              <span style={styles.ctaTitle}>{t.ctaTitle}</span>
              <span style={styles.ctaSub}>{t.ctaSub}</span>
            </div>
            <button onClick={() => openChat()} style={styles.btnPrimary} className="btn-primary">
              {t.ctaBtn}
            </button>
          </section>
        </main>
      )}

      {/* ══════════ CATEGORY ══════════ */}
      {view === "category" && cat && (
        <main style={styles.main}>
          <div style={styles.breadcrumb}>
            <button onClick={goHome} style={styles.breadLink}>{t.breadHome}</button>
            <span style={styles.breadSep}>/</span>
            <span style={{ color: cat.color }}>{cat.label}</span>
          </div>

          <div style={styles.catHeader}>
            <span style={{ ...styles.catHeaderIcon, color: cat.color, borderColor: cat.color + "44", background: cat.bg }}>{cat.icon}</span>
            <div>
              <h1 style={styles.catHeaderTitle}>{cat.label}</h1>
              <p style={styles.catHeaderSub}>{t.faqCount(cat.faqs.length)}</p>
            </div>
          </div>

          <div style={styles.faqList}>
            {cat.faqs.map((faq, i) => (
              <div key={i} style={{ ...styles.faqItem, borderColor: expandedFaq === i ? cat.color + "66" : "#ffffff15" }} className="faq-item">
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={styles.faqQuestion}>
                  <span style={{ ...styles.faqNum, color: cat.color }}>0{i + 1}</span>
                  <span style={styles.faqQText}>{faq.q}</span>
                  <span style={{ ...styles.faqChevron, transform: expandedFaq === i ? "rotate(180deg)" : "rotate(0deg)", color: cat.color }}>▾</span>
                </button>
                {expandedFaq === i && (
                  <div style={styles.faqAnswer}>
                    <p style={styles.faqAnswerText}>{faq.a}</p>
                    <button onClick={() => openChat(faq.q)} style={{ ...styles.faqFollowUp, color: cat.color, borderColor: cat.color + "44" }}>
                      {t.followUp}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={styles.catFooter}>
            <p style={styles.catFooterText}>{t.noQuestion}</p>
            <button onClick={() => openChat()} style={styles.btnPrimary} className="btn-primary">
              {t.askAdvisor}
            </button>
          </div>
        </main>
      )}

      {/* ══════════ CHAT ══════════ */}
      {view === "chat" && (
        <main style={styles.chatMain}>
          <div style={styles.chatHeader}>
            <div style={styles.chatHeaderLeft}>
              <div style={styles.chatAvatar}>◈</div>
              <div>
                <div style={styles.chatName}>{t.chat.name}</div>
                <div style={styles.chatStatus}>
                  <span style={styles.chatDot} />
                  {t.chat.status}
                </div>
              </div>
            </div>
            <div style={styles.chatTopics}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => openChat(c.faqs[0].q)} style={{ ...styles.topicPill, color: c.color, borderColor: c.color + "44", background: c.bg }} className="topic-pill">
                  {c.icon} {c.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.chatMessages}>
            {messages.length === 0 && (
              <div style={styles.chatEmpty}>
                <div style={styles.chatEmptyIcon}>◈</div>
                <h2 style={styles.chatEmptyTitle}>{t.chat.emptyTitle}</h2>
                <p style={styles.chatEmptyDesc}>{t.chat.emptyDesc}</p>
                <div style={styles.chatSuggestions}>
                  {t.chat.suggestions.map(s => (
                    <button key={s} onClick={() => sendMessage(s)} style={styles.suggestionBtn} className="suggestion-btn">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{ ...styles.msgRow, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && <div style={styles.msgAvatar}>◈</div>}
                <div style={{ ...styles.msgBubble, ...(m.role === "user" ? styles.msgUser : styles.msgAssistant) }}>
                  {m.content.split("\n").map((line, li) => (
                    <span key={li}>{line}{li < m.content.split("\n").length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
                <div style={styles.msgAvatar}>◈</div>
                <div style={{ ...styles.msgBubble, ...styles.msgAssistant, ...styles.msgLoading }}>
                  <span className="dot-1" style={styles.dot} />
                  <span className="dot-2" style={styles.dot} />
                  <span className="dot-3" style={styles.dot} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={styles.chatInputRow}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={t.chat.placeholder}
              style={styles.chatInput}
              className="chat-input"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !chatInput.trim()}
              style={{ ...styles.sendBtn, opacity: loading || !chatInput.trim() ? 0.4 : 1 }}
              className="send-btn"
            >
              ↑
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: "#0C0C0F",
    color: "#E8E4DC",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    display: "flex",
    flexDirection: "column",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 28px",
    borderBottom: "1px solid #ffffff12",
    background: "#0C0C0Fcc",
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    display: "flex", alignItems: "center", gap: 8,
    background: "none", border: "none", cursor: "pointer", padding: 0,
  },
  logoMark: { fontSize: 22, color: "#D4A843" },
  logoText: { fontSize: 18, fontWeight: "700", color: "#E8E4DC", letterSpacing: "-0.5px" },
  navRight: { display: "flex", alignItems: "center", gap: 4 },
  navLink: {
    background: "none", border: "none", color: "#888", fontSize: 14,
    cursor: "pointer", padding: "6px 14px", borderRadius: 6,
    fontFamily: "inherit", transition: "color 0.2s",
  },
  navLinkActive: { color: "#E8E4DC", background: "#ffffff0f" },

  // ── Language Toggle ──
  langToggle: {
    display: "flex", alignItems: "center", gap: 4,
    background: "#161618", border: "1px solid #ffffff18",
    borderRadius: 8, padding: "5px 12px", cursor: "pointer",
    fontFamily: "inherit", marginLeft: 8,
    transition: "border-color 0.2s",
  },
  langOption: { fontSize: 12, fontWeight: "700", letterSpacing: "0.5px", transition: "color 0.2s" },
  langActive: { color: "#D4A843" },
  langInactive: { color: "#444" },
  langDivider: { color: "#333", fontSize: 12 },

  main: { flex: 1, maxWidth: 860, margin: "0 auto", width: "100%", padding: "0 24px 60px" },

  hero: { padding: "64px 0 40px", textAlign: "center" },
  heroBadge: {
    display: "inline-block", fontSize: 11, letterSpacing: "2px",
    textTransform: "uppercase", color: "#D4A843",
    border: "1px solid #D4A84344", borderRadius: 20,
    padding: "5px 14px", marginBottom: 24,
  },
  heroTitle: {
    fontSize: "clamp(36px, 6vw, 56px)", fontWeight: "400",
    lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-1px", color: "#E8E4DC",
  },
  heroAccent: { color: "#D4A843", fontStyle: "italic" },
  heroSub: { fontSize: 17, color: "#888", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.6 },
  heroActions: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  btnPrimary: {
    background: "#D4A843", color: "#0C0C0F", border: "none",
    borderRadius: 8, padding: "13px 24px", fontSize: 15, fontWeight: "700",
    cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.3px",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  btnGhost: {
    background: "transparent", color: "#E8E4DC",
    border: "1px solid #ffffff22", borderRadius: 8,
    padding: "13px 24px", fontSize: 15, cursor: "pointer", fontFamily: "inherit",
  },

  quickSection: { padding: "8px 0 40px", borderBottom: "1px solid #ffffff0a" },
  quickLabel: { fontSize: 12, color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 },
  quickGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  quickChip: {
    background: "#161618", border: "1px solid #ffffff15", color: "#C0B89A",
    borderRadius: 20, padding: "8px 15px", fontSize: 13, cursor: "pointer",
    fontFamily: "inherit", transition: "border-color 0.2s, color 0.2s",
  },

  catSection: { padding: "48px 0" },
  sectionTitle: { fontSize: 28, fontWeight: "400", marginBottom: 28, letterSpacing: "-0.5px" },
  catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 },
  catCard: {
    position: "relative", overflow: "hidden", display: "flex",
    flexDirection: "column", alignItems: "flex-start", gap: 6,
    padding: "24px", border: "1px solid", borderRadius: 12,
    cursor: "pointer", textAlign: "left",
    transition: "transform 0.2s, border-color 0.2s", fontFamily: "inherit",
  },
  catIcon: { fontSize: 28, marginBottom: 4, display: "block" },
  catLabel: { fontSize: 16, fontWeight: "700", color: "#E8E4DC" },
  catDesc: { fontSize: 13, color: "#666", lineHeight: 1.4 },
  catCount: { fontSize: 12, marginTop: 4, fontWeight: "600" },
  catGlow: {
    position: "absolute", inset: 0, opacity: 0,
    transition: "opacity 0.3s", pointerEvents: "none", borderRadius: 12,
  },

  ctaStrip: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 20, padding: "28px 32px", background: "#161618",
    border: "1px solid #D4A84322", borderRadius: 14, flexWrap: "wrap",
  },
  ctaContent: { display: "flex", flexDirection: "column", gap: 4 },
  ctaTitle: { fontSize: 18, fontWeight: "700", color: "#E8E4DC" },
  ctaSub: { fontSize: 14, color: "#666" },

  breadcrumb: { display: "flex", alignItems: "center", gap: 8, padding: "28px 0 16px", fontSize: 14, color: "#555" },
  breadLink: { background: "none", border: "none", color: "#888", cursor: "pointer", fontFamily: "inherit", fontSize: 14, padding: 0 },
  breadSep: { color: "#333" },

  catHeader: { display: "flex", alignItems: "center", gap: 20, marginBottom: 36, paddingBottom: 28, borderBottom: "1px solid #ffffff0f" },
  catHeaderIcon: {
    fontSize: 32, width: 64, height: 64, display: "flex",
    alignItems: "center", justifyContent: "center",
    border: "1px solid", borderRadius: 14, flexShrink: 0,
  },
  catHeaderTitle: { fontSize: 32, fontWeight: "400", margin: 0, letterSpacing: "-0.5px" },
  catHeaderSub: { fontSize: 14, color: "#555", margin: "4px 0 0" },

  faqList: { display: "flex", flexDirection: "column", gap: 8 },
  faqItem: { border: "1px solid", borderRadius: 10, overflow: "hidden", background: "#0F0F12", transition: "border-color 0.2s" },
  faqQuestion: {
    width: "100%", display: "flex", alignItems: "flex-start", gap: 14,
    padding: "18px 20px", background: "none", border: "none",
    cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "#E8E4DC",
  },
  faqNum: { fontSize: 12, fontWeight: "700", letterSpacing: "1px", flexShrink: 0, marginTop: 2, minWidth: 24 },
  faqQText: { flex: 1, fontSize: 15, lineHeight: 1.5, color: "#D8D0C4" },
  faqChevron: { fontSize: 18, flexShrink: 0, transition: "transform 0.25s", marginLeft: 8 },
  faqAnswer: { padding: "0 20px 20px 56px" },
  faqAnswerText: { fontSize: 14, lineHeight: 1.75, color: "#999", margin: "0 0 14px" },
  faqFollowUp: {
    background: "none", border: "1px solid", borderRadius: 6,
    padding: "7px 14px", fontSize: 13, cursor: "pointer",
    fontFamily: "inherit", transition: "background 0.2s",
  },

  catFooter: { textAlign: "center", padding: "48px 0 0" },
  catFooterText: { fontSize: 16, color: "#555", marginBottom: 16 },

  chatMain: {
    flex: 1, display: "flex", flexDirection: "column",
    maxWidth: 800, margin: "0 auto", width: "100%",
    height: "calc(100vh - 61px)",
  },
  chatHeader: { padding: "16px 24px", borderBottom: "1px solid #ffffff10", background: "#0F0F12" },
  chatHeaderLeft: { display: "flex", alignItems: "center", gap: 14, marginBottom: 12 },
  chatAvatar: {
    width: 40, height: 40, background: "#D4A84322",
    border: "1px solid #D4A84344", borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, color: "#D4A843", flexShrink: 0,
  },
  chatName: { fontSize: 16, fontWeight: "700", color: "#E8E4DC" },
  chatStatus: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" },
  chatDot: { width: 7, height: 7, borderRadius: "50%", background: "#4CAF50", display: "inline-block" },
  chatTopics: { display: "flex", gap: 6, flexWrap: "wrap" },
  topicPill: {
    fontSize: 12, padding: "4px 11px", border: "1px solid",
    borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
    background: "transparent", transition: "opacity 0.2s",
  },
  chatMessages: { flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 },
  chatEmpty: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "60px 20px 0" },
  chatEmptyIcon: { fontSize: 40, color: "#D4A843", marginBottom: 20, opacity: 0.6 },
  chatEmptyTitle: { fontSize: 22, fontWeight: "400", margin: "0 0 10px", letterSpacing: "-0.3px" },
  chatEmptyDesc: { fontSize: 15, color: "#555", marginBottom: 28 },
  chatSuggestions: { display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 460 },
  suggestionBtn: {
    background: "#161618", border: "1px solid #ffffff15", color: "#C0B89A",
    borderRadius: 10, padding: "12px 16px", fontSize: 14, cursor: "pointer",
    fontFamily: "inherit", textAlign: "left", transition: "border-color 0.2s",
  },
  msgRow: { display: "flex", alignItems: "flex-end", gap: 10 },
  msgAvatar: {
    width: 32, height: 32, background: "#D4A84318",
    border: "1px solid #D4A84330", borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, color: "#D4A843", flexShrink: 0,
  },
  msgBubble: { maxWidth: "76%", padding: "13px 17px", borderRadius: 14, fontSize: 14, lineHeight: 1.7 },
  msgUser: { background: "#D4A843", color: "#0C0C0F", borderBottomRightRadius: 4, fontWeight: "500" },
  msgAssistant: { background: "#161618", color: "#C8C0B2", border: "1px solid #ffffff0f", borderBottomLeftRadius: 4 },
  msgLoading: { display: "flex", gap: 5, alignItems: "center", padding: "14px 18px" },
  dot: {
    width: 7, height: 7, borderRadius: "50%", background: "#D4A843",
    display: "inline-block", opacity: 0.4, animation: "pulse 1.2s ease-in-out infinite",
  },
  chatInputRow: {
    display: "flex", gap: 8, padding: "16px 24px",
    borderTop: "1px solid #ffffff10", background: "#0C0C0F",
  },
  chatInput: {
    flex: 1, background: "#161618", border: "1px solid #ffffff18",
    color: "#E8E4DC", borderRadius: 10, padding: "13px 16px",
    fontSize: 15, fontFamily: "inherit", outline: "none", transition: "border-color 0.2s",
  },
  sendBtn: {
    width: 46, height: 46, background: "#D4A843", color: "#0C0C0F",
    border: "none", borderRadius: 10, fontSize: 20, fontWeight: "700",
    cursor: "pointer", flexShrink: 0, transition: "transform 0.15s",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px #D4A84344; }
  .cat-card:hover { transform: translateY(-2px); }
  .quick-chip:hover { border-color: #D4A84366; color: #E8E4DC; }
  .faq-item:hover { border-color: #ffffff25 !important; }
  .topic-pill:hover { opacity: 0.75; }
  .suggestion-btn:hover { border-color: #D4A84355; }
  .chat-input:focus { border-color: #D4A84355; }
  .send-btn:hover:not(:disabled) { transform: scale(1.05); }
  .lang-toggle:hover { border-color: #D4A84366; }
  @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
  .dot-1{animation-delay:0s} .dot-2{animation-delay:0.2s} .dot-3{animation-delay:0.4s}
`;
