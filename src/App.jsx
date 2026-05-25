import { useState, useRef, useEffect } from "react";
import { translations } from "./translations";

// ─────────────────────────────────────────────────────────
// TEMPLATES — Edit this list to add/remove templates
// For each template:
//   label: display name shown in dropdown
//   type: "excel" | "pdf"
//   url: path to file in /public/templates/ folder
//   ready: true = downloadable link, false = "Coming Soon"
// ─────────────────────────────────────────────────────────
const TEMPLATES = [
  { label: "Startup Budget Planner",        type: "excel", url: "/templates/startup-budget.xlsx",      ready: false },
  { label: "Monthly Cash Flow Tracker",     type: "excel", url: "/templates/cashflow-tracker.xlsx",    ready: false },
  { label: "Profit & Loss Statement",       type: "excel", url: "/templates/profit-loss.xlsx",         ready: false },
  { label: "Client Invoice Template",       type: "excel", url: "/templates/invoice-template.xlsx",    ready: false },
  { label: "Small Business Startup Checklist", type: "pdf", url: "/templates/startup-checklist.pdf",  ready: false },
  { label: "LLC vs S-Corp Guide",           type: "pdf",   url: "/templates/llc-vs-scorp.pdf",         ready: false },
  { label: "Pricing Your Services Guide",   type: "pdf",   url: "/templates/pricing-guide.pdf",        ready: false },
];

const THEMES = {
  dark: {
    bg: "#0C0C0F", surface: "#161618", surface2: "#0F0F12", nav: "#0C0C0Fcc",
    border: "#ffffff12", borderMid: "#ffffff18", text: "#E8E4DC",
    textSub: "#888", textMuted: "#555", textFaint: "#333",
    chipText: "#C0B89A", faqBg: "#0F0F12",
    msgUser: { bg: "#D4A843", color: "#0C0C0F" },
    msgAI: { bg: "#161618", color: "#C8C0B2", border: "#ffffff0f" },
    inputBg: "#161618", accent: "#D4A843", accentDim: "#D4A84322",
    accentBorder: "#D4A84344", accentGlow: "#D4A84344", scrollThumb: "#333",
  },
  light: {
    bg: "#F7F5F0", surface: "#FFFFFF", surface2: "#EDEAE4", nav: "#F7F5F0ee",
    border: "#00000012", borderMid: "#00000018", text: "#1A1208",
    textSub: "#666", textMuted: "#999", textFaint: "#CCCCCC",
    chipText: "#5C4A1E", faqBg: "#FFFFFF",
    msgUser: { bg: "#C4921A", color: "#FFFFFF" },
    msgAI: { bg: "#FFFFFF", color: "#444", border: "#00000010" },
    inputBg: "#FFFFFF", accent: "#C4921A", accentDim: "#C4921A14",
    accentBorder: "#C4921A44", accentGlow: "#C4921A28", scrollThumb: "#CCCCCC",
  },
};

export default function SmallBizAdvisor() {
  const [lang, setLang] = useState("en");
  const [themeKey, setThemeKey] = useState("dark");
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("home");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const chatEndRef = useRef(null);
  const dropdownRef = useRef(null);

  const t = translations[lang];
  const CATEGORIES = t.categories;
  const th = THEMES[themeKey];
  const isDark = themeKey === "dark";

  useEffect(() => { setMessages([]); setActiveCategory(null); setExpandedFaq(null); setView("home"); }, [lang]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    const handle = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setTemplatesOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

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
        body: JSON.stringify({ messages: newMessages, systemPrompt: t.chat.systemPrompt }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || (lang === "en" ? "Sorry, I couldn't get a response. Please try again." : "Lo siento, no pude obtener una respuesta. Por favor intenta de nuevo.");
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: lang === "en" ? "Connection error. Please try again." : "Error de conexión. Por favor intenta de nuevo." }]);
    }
    setLoading(false);
  };

  const openCategory = (cat) => { setActiveCategory(cat); setExpandedFaq(null); setView("category"); };
  const goHome = () => { setView("home"); setActiveCategory(null); setExpandedFaq(null); };
  const openChat = (prefill) => { setView("chat"); if (prefill) setTimeout(() => sendMessage(prefill), 100); };
  const allFaqs = CATEGORIES.flatMap(c => c.faqs.slice(0, 2).map(f => ({ ...f, color: c.color, cat: c })));

  return (
    <div style={{ ...S.root, background: th.bg, color: th.text }}>
      <style>{buildCss(th)}</style>

      {/* NAV */}
      <nav style={{ ...S.nav, background: th.nav, borderBottomColor: th.border }}>
        <button onClick={goHome} style={S.navLogo}>
          <span style={{ fontSize: 20, color: th.accent }}>◈</span>
          <span style={{ fontSize: 17, fontWeight: "700", letterSpacing: "-0.5px", color: th.text }}>{t.appName}</span>
        </button>
        <div style={S.navRight}>
          <button onClick={goHome} style={{ ...S.navLink, color: view === "home" ? th.text : th.textSub, background: view === "home" ? th.surface : "transparent" }}>{t.nav.home}</button>
          <button onClick={() => setView("chat")} style={{ ...S.navLink, color: view === "chat" ? th.text : th.textSub, background: view === "chat" ? th.surface : "transparent" }}>{t.nav.askAI}</button>

          {/* Templates dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button onClick={() => setTemplatesOpen(o => !o)} className="templates-btn"
              style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${templatesOpen ? th.accent : th.borderMid}`, borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", background: templatesOpen ? th.surface : "transparent", color: th.text, marginLeft: 4, transition: "all 0.2s" }}>
              <span>📁</span>
              <span>{lang === "en" ? "Templates" : "Plantillas"}</span>
              <span style={{ fontSize: 11, color: th.textMuted, transform: templatesOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
            </button>
            {templatesOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 310, background: th.surface, border: `1px solid ${th.border}`, borderRadius: 12, overflow: "hidden", zIndex: 200, boxShadow: isDark ? "0 16px 40px #00000066" : "0 8px 32px #00000018" }}>
                <div style={{ fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", padding: "12px 16px 10px", borderBottom: `1px solid ${th.border}`, fontWeight: "700", color: th.textMuted }}>
                  {lang === "en" ? "Download Templates & Guides" : "Descargar Plantillas y Guías"}
                </div>
                <div style={{ fontSize: 10, letterSpacing: "1.5px", fontWeight: "700", padding: "10px 16px 4px", color: th.textMuted }}>📊 {lang === "en" ? "EXCEL TEMPLATES" : "PLANTILLAS EXCEL"}</div>
                {TEMPLATES.filter(tp => tp.type === "excel").map((tmpl, i) => <TemplateRow key={i} tmpl={tmpl} th={th} lang={lang} />)}
                <div style={{ height: 1, background: th.border, margin: "4px 0" }} />
                <div style={{ fontSize: 10, letterSpacing: "1.5px", fontWeight: "700", padding: "10px 16px 4px", color: th.textMuted }}>📄 {lang === "en" ? "PDF GUIDES" : "GUÍAS PDF"}</div>
                {TEMPLATES.filter(tp => tp.type === "pdf").map((tmpl, i) => <TemplateRow key={i} tmpl={tmpl} th={th} lang={lang} />)}
                <div style={{ padding: "10px 16px 12px", borderTop: `1px solid ${th.border}` }}>
                  <p style={{ fontSize: 11, color: th.textMuted, fontStyle: "italic" }}>
                    {lang === "en" ? "More templates coming soon. Check back regularly." : "Más plantillas próximamente. Vuelve a consultar con regularidad."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button onClick={() => setThemeKey(k => k === "dark" ? "light" : "dark")} className="icon-btn"
            style={{ width: 34, height: 34, border: `1px solid ${th.borderMid}`, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", background: th.surface, color: th.text, marginLeft: 4, transition: "all 0.2s" }}>
            {isDark ? "☀" : "☽"}
          </button>

          {/* Language toggle */}
          <button onClick={() => setLang(l => l === "en" ? "es" : "en")} className="lang-toggle"
            style={{ display: "flex", alignItems: "center", gap: 4, border: `1px solid ${th.borderMid}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit", background: th.surface, marginLeft: 4, transition: "all 0.2s" }}>
            <span style={{ fontSize: 11, fontWeight: "700", color: lang === "en" ? th.accent : th.textFaint }}>EN</span>
            <span style={{ fontSize: 11, color: th.border }}>|</span>
            <span style={{ fontSize: 11, fontWeight: "700", color: lang === "es" ? th.accent : th.textFaint }}>ES</span>
          </button>
        </div>
      </nav>

      {/* HOME */}
      {view === "home" && (
        <main style={S.main}>
          {/* Hero */}
          <section style={{ padding: "52px 0 32px", textAlign: "center" }}>
            <div style={{ display: "inline-block", fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: th.accent, border: `1px solid ${th.accentBorder}`, borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>{t.hero.badge}</div>
            <h1 style={{ fontSize: "clamp(30px, 5vw, 50px)", fontWeight: "400", lineHeight: 1.15, margin: "0 0 14px", letterSpacing: "-1px", color: th.text }}>
              {t.hero.title1}<br /><span style={{ color: th.accent, fontStyle: "italic" }}>{t.hero.title2}</span>
            </h1>
            <p style={{ fontSize: 16, color: th.textSub, maxWidth: 480, margin: "0 auto 26px", lineHeight: 1.6 }}>{t.hero.sub}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => openChat()} className="btn-primary" style={{ border: "none", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: "700", cursor: "pointer", fontFamily: "inherit", background: th.accent, color: isDark ? "#0C0C0F" : "#FFFFFF" }}>{t.hero.btnAI}</button>
              <button onClick={() => document.getElementById("categories").scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", border: `1px solid ${th.borderMid}`, borderRadius: 8, padding: "12px 22px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", color: th.text }}>{t.hero.btnBrowse}</button>
            </div>
          </section>

          {/* FAQ Strip — above browse */}
          <section style={{ padding: "28px 0 36px", borderBottom: `1px solid ${th.border}` }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: th.textMuted, fontWeight: "700", marginBottom: 14 }}>{t.popularLabel}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))", gap: 9 }}>
              {allFaqs.slice(0, 6).map((faq, i) => (
                <button key={i} onClick={() => openChat(faq.q)} className="faq-strip-card"
                  style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "13px 15px", border: `1px solid ${th.border}`, borderRadius: 10, cursor: "pointer", textAlign: "left", fontFamily: "inherit", background: th.surface, transition: "transform 0.15s, border-color 0.2s" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: faq.color, flexShrink: 0, marginTop: 5 }} />
                  <span style={{ flex: 1, fontSize: 13, lineHeight: 1.4, color: th.text }}>{faq.q}</span>
                  <span style={{ fontSize: 13, color: faq.color, flexShrink: 0 }}>→</span>
                </button>
              ))}
            </div>
          </section>

          {/* Browse by Topic */}
          <section id="categories" style={{ padding: "40px 0 28px" }}>
            <h2 style={{ fontSize: 24, fontWeight: "400", marginBottom: 20, letterSpacing: "-0.5px", color: th.text }}>{t.browseTitle}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(225px, 1fr))", gap: 10 }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => openCategory(c)} className="cat-card"
                  style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 5, padding: "20px", border: `1px solid ${isDark ? c.color + "33" : th.border}`, borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "transform 0.2s, border-color 0.2s", fontFamily: "inherit", background: isDark ? c.bg : th.surface }}>
                  <span style={{ fontSize: 24, color: c.color, marginBottom: 3 }}>{c.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: "700", color: th.text }}>{c.label}</span>
                  <span style={{ fontSize: 12, color: th.textSub, lineHeight: 1.4 }}>{c.desc}</span>
                  <span style={{ fontSize: 11, color: c.color, fontWeight: "600", marginTop: 3 }}>{t.faqCount(c.faqs.length)}</span>
                </button>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 26px", background: th.surface, border: `1px solid ${th.accentBorder}`, borderRadius: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 16, fontWeight: "700", color: th.text }}>{t.ctaTitle}</span>
              <span style={{ fontSize: 13, color: th.textSub }}>{t.ctaSub}</span>
            </div>
            <button onClick={() => openChat()} className="btn-primary" style={{ border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 13, fontWeight: "700", cursor: "pointer", fontFamily: "inherit", background: th.accent, color: isDark ? "#0C0C0F" : "#FFFFFF" }}>{t.ctaBtn}</button>
          </section>
        </main>
      )}

      {/* CATEGORY */}
      {view === "category" && cat && (
        <main style={S.main}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "26px 0 12px", fontSize: 13, color: th.textSub }}>
            <button onClick={goHome} style={{ background: "none", border: "none", color: th.textSub, cursor: "pointer", fontFamily: "inherit", fontSize: 13, padding: 0 }}>{t.breadHome}</button>
            <span style={{ color: th.border }}>/</span>
            <span style={{ color: cat.color }}>{cat.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, paddingBottom: 22, borderBottom: `1px solid ${th.border}` }}>
            <span style={{ fontSize: 26, width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${isDark ? cat.color + "44" : th.border}`, borderRadius: 12, flexShrink: 0, color: cat.color, background: isDark ? cat.bg : th.surface2 }}>{cat.icon}</span>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: "400", margin: 0, letterSpacing: "-0.5px", color: th.text }}>{cat.label}</h1>
              <p style={{ fontSize: 13, color: th.textMuted, margin: "3px 0 0" }}>{t.faqCount(cat.faqs.length)}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {cat.faqs.map((faq, i) => (
              <div key={i} className="faq-item" style={{ border: `1px solid ${expandedFaq === i ? cat.color + "66" : th.border}`, borderRadius: 10, overflow: "hidden", background: th.faqBg, transition: "border-color 0.2s" }}>
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 12, padding: "15px 17px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: th.text }}>
                  <span style={{ fontSize: 11, fontWeight: "700", color: cat.color, flexShrink: 0, marginTop: 2, minWidth: 20 }}>0{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 14, lineHeight: 1.5, color: th.text }}>{faq.q}</span>
                  <span style={{ fontSize: 15, color: cat.color, transform: expandedFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", marginLeft: 8 }}>▾</span>
                </button>
                {expandedFaq === i && (
                  <div style={{ padding: "0 17px 17px 48px" }}>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: th.textSub, margin: "0 0 12px" }}>{faq.a}</p>
                    <button onClick={() => openChat(faq.q)} style={{ background: "none", border: `1px solid ${cat.color + "44"}`, borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: cat.color }}>{t.followUp}</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", padding: "40px 0 0" }}>
            <p style={{ fontSize: 14, color: th.textMuted, marginBottom: 14 }}>{t.noQuestion}</p>
            <button onClick={() => openChat()} className="btn-primary" style={{ border: "none", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: "700", cursor: "pointer", fontFamily: "inherit", background: th.accent, color: isDark ? "#0C0C0F" : "#FFFFFF" }}>{t.askAdvisor}</button>
          </div>
        </main>
      )}

      {/* CHAT */}
      {view === "chat" && (
        <main style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 800, margin: "0 auto", width: "100%", height: "calc(100vh - 61px)" }}>
          <div style={{ padding: "14px 22px", borderBottom: `1px solid ${th.border}`, background: th.surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, background: th.accentDim, border: `1px solid ${th.accentBorder}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: th.accent, flexShrink: 0 }}>◈</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: "700", color: th.text }}>{t.chat.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: th.textMuted }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4CAF50", display: "inline-block" }} />{t.chat.status}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => openChat(c.faqs[0].q)} className="topic-pill"
                  style={{ fontSize: 11, padding: "4px 10px", border: `1px solid ${isDark ? c.color + "44" : th.border}`, borderRadius: 10, cursor: "pointer", fontFamily: "inherit", color: c.color, background: isDark ? c.bg : th.surface2, transition: "opacity 0.2s" }}>
                  {c.icon} {c.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12, background: th.bg }}>
            {messages.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "50px 16px 0" }}>
                <div style={{ fontSize: 34, color: th.accent, marginBottom: 16, opacity: 0.6 }}>◈</div>
                <h2 style={{ fontSize: 19, fontWeight: "400", margin: "0 0 8px", letterSpacing: "-0.3px", color: th.text }}>{t.chat.emptyTitle}</h2>
                <p style={{ fontSize: 14, color: th.textSub, marginBottom: 24 }}>{t.chat.emptyDesc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%", maxWidth: 420 }}>
                  {t.chat.suggestions.map(s => (
                    <button key={s} onClick={() => sendMessage(s)} className="suggestion-btn"
                      style={{ border: `1px solid ${th.border}`, borderRadius: 10, padding: "11px 15px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textAlign: "left", background: th.surface, color: th.chipText }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 9, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && <div style={{ width: 30, height: 30, background: th.accentDim, border: `1px solid ${th.accentBorder}`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: th.accent, flexShrink: 0 }}>◈</div>}
                <div style={{ maxWidth: "76%", padding: "12px 16px", borderRadius: 13, fontSize: 13, lineHeight: 1.7, ...(m.role === "user" ? { background: th.msgUser.bg, color: th.msgUser.color, borderBottomRightRadius: 4, fontWeight: "500" } : { background: th.msgAI.bg, color: th.msgAI.color, border: `1px solid ${th.msgAI.border}`, borderBottomLeftRadius: 4 }) }}>
                  {m.content.split("\n").map((line, li) => <span key={li}>{line}{li < m.content.split("\n").length - 1 && <br />}</span>)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 9, justifyContent: "flex-start" }}>
                <div style={{ width: 30, height: 30, background: th.accentDim, border: `1px solid ${th.accentBorder}`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: th.accent, flexShrink: 0 }}>◈</div>
                <div style={{ padding: "13px 17px", borderRadius: 13, background: th.msgAI.bg, border: `1px solid ${th.msgAI.border}`, borderBottomLeftRadius: 4, display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 0.2, 0.4].map((d, i) => <span key={i} className={`dot-${i + 1}`} style={{ width: 6, height: 6, borderRadius: "50%", background: th.accent, display: "inline-block", opacity: 0.4, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${d}s` }} />)}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={{ display: "flex", gap: 7, padding: "14px 22px", borderTop: `1px solid ${th.border}`, background: th.bg }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()} placeholder={t.chat.placeholder}
              className="chat-input" disabled={loading}
              style={{ flex: 1, background: th.inputBg, border: `1px solid ${th.borderMid}`, color: th.text, borderRadius: 10, padding: "12px 15px", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }} />
            <button onClick={() => sendMessage()} disabled={loading || !chatInput.trim()} className="send-btn"
              style={{ width: 44, height: 44, background: th.accent, color: isDark ? "#0C0C0F" : "#FFFFFF", border: "none", borderRadius: 10, fontSize: 18, fontWeight: "700", cursor: "pointer", flexShrink: 0, opacity: loading || !chatInput.trim() ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
          </div>
        </main>
      )}
    </div>
  );
}

function TemplateRow({ tmpl, th, lang }) {
  return (
    <div className="dropdown-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", gap: 8, transition: "background 0.15s", cursor: tmpl.ready ? "pointer" : "default" }}>
      <span style={{ fontSize: 13, flex: 1, lineHeight: 1.3, color: th.text }}>{tmpl.label}</span>
      {tmpl.ready
        ? <a href={tmpl.url} download style={{ fontSize: 11, fontWeight: "700", padding: "4px 10px", borderRadius: 6, textDecoration: "none", whiteSpace: "nowrap", fontFamily: "inherit", background: th.accent, color: "#0C0C0F" }}>↓ {lang === "en" ? "Download" : "Descargar"}</a>
        : <span style={{ fontSize: 10, padding: "3px 8px", border: `1px solid ${th.border}`, borderRadius: 10, whiteSpace: "nowrap", color: th.textMuted }}>{lang === "en" ? "Coming Soon" : "Próximamente"}</span>
      }
    </div>
  );
}

const S = {
  root: { minHeight: "100vh", fontFamily: "'Georgia','Times New Roman',serif", display: "flex", flexDirection: "column", transition: "background 0.3s, color 0.3s" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 22px", borderBottom: "1px solid", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 8 },
  navLogo: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 },
  navRight: { display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" },
  navLink: { background: "none", border: "none", fontSize: 13, cursor: "pointer", padding: "6px 11px", borderRadius: 6, fontFamily: "inherit", transition: "all 0.2s" },
  main: { flex: 1, maxWidth: 880, margin: "0 auto", width: "100%", padding: "0 22px 56px" },
};

function buildCss(th) {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${th.scrollThumb}; border-radius: 2px; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px ${th.accentGlow}; }
    .cat-card:hover { transform: translateY(-2px); }
    .faq-strip-card:hover { transform: translateY(-1px); border-color: ${th.accentBorder} !important; }
    .faq-item { transition: border-color 0.2s; }
    .topic-pill:hover { opacity: 0.7; }
    .suggestion-btn:hover { border-color: ${th.accentBorder}; }
    .chat-input:focus { border-color: ${th.accentBorder}; }
    .send-btn:hover:not(:disabled) { transform: scale(1.05); }
    .lang-toggle:hover, .icon-btn:hover, .templates-btn:hover { border-color: ${th.accentBorder} !important; }
    .dropdown-item:hover { background: ${th.surface2}; }
    @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
    .dot-1{animation-delay:0s} .dot-2{animation-delay:0.2s} .dot-3{animation-delay:0.4s}
  `;
}
