import { useState, useRef, useEffect } from "react";
import { translations } from "./translations";

// ── Templates ─────────────────────────────────────────────
const TEMPLATES = [
  { label: "Startup Budget Planner",           type: "excel", url: "/templates/startup-budget.xlsx",      ready: false },
  { label: "Monthly Cash Flow Tracker",        type: "excel", url: "/templates/cashflow-tracker.xlsx",    ready: false },
  { label: "Profit & Loss Statement",          type: "excel", url: "/templates/profit-loss.xlsx",         ready: false },
  { label: "Client Invoice Template",          type: "excel", url: "/templates/invoice-template.xlsx",    ready: false },
  { label: "Small Business Startup Checklist", type: "pdf",   url: "/templates/startup-checklist.pdf",    ready: false },
  { label: "LLC vs S-Corp Guide",              type: "pdf",   url: "/templates/llc-vs-scorp.pdf",         ready: false },
  { label: "Pricing Your Services Guide",      type: "pdf",   url: "/templates/pricing-guide.pdf",        ready: false },
];

// ── Themes ────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:"#0C0C0F", surface:"#161618", surface2:"#0F0F12", nav:"#0C0C0Fcc",
    border:"#ffffff12", borderMid:"#ffffff18", text:"#E8E4DC",
    textSub:"#888", textMuted:"#555", textFaint:"#333",
    chipText:"#C0B89A", faqBg:"#0F0F12",
    msgUser:{bg:"#D4A843",color:"#0C0C0F"},
    msgAI:{bg:"#161618",color:"#C8C0B2",border:"#ffffff0f"},
    inputBg:"#161618", accent:"#D4A843", accentDim:"#D4A84322",
    accentBorder:"#D4A84344", accentGlow:"#D4A84344", scrollThumb:"#333",
    essentialsBadge:"#D4A84322", essentialsBadgeText:"#D4A843",
    advancedBadge:"#9B7EC822", advancedBadgeText:"#9B7EC8",
  },
  light: {
    bg:"#F7F5F0", surface:"#FFFFFF", surface2:"#EDEAE4", nav:"#F7F5F0ee",
    border:"#00000012", borderMid:"#00000018", text:"#1A1208",
    textSub:"#666", textMuted:"#999", textFaint:"#CCCCCC",
    chipText:"#5C4A1E", faqBg:"#FFFFFF",
    msgUser:{bg:"#C4921A",color:"#FFFFFF"},
    msgAI:{bg:"#FFFFFF",color:"#444",border:"#00000010"},
    inputBg:"#FFFFFF", accent:"#C4921A", accentDim:"#C4921A14",
    accentBorder:"#C4921A44", accentGlow:"#C4921A28", scrollThumb:"#CCCCCC",
    essentialsBadge:"#C4921A18", essentialsBadgeText:"#C4921A",
    advancedBadge:"#7B5EA722", advancedBadgeText:"#7B5EA7",
  },
};

export default function SmallBizAdvisor() {
  const [lang, setLang]               = useState("en");
  const [themeKey, setThemeKey]       = useState("dark");
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedEss, setExpandedEss] = useState(null);
  const [expandedAdv, setExpandedAdv] = useState(null);
  const [chatInput, setChatInput]     = useState("");
  const [messages, setMessages]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [view, setView]               = useState("home");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [contactStatus, setContactStatus] = useState(null);
  const [contactSending, setContactSending] = useState(false);
  const chatEndRef   = useRef(null);
  const dropdownRef  = useRef(null);
  const searchRef    = useRef(null);

  const t  = translations[lang];
  const th = THEMES[themeKey];
  const isDark = themeKey === "dark";
  const CATEGORIES = t.categories;
  const essentialCats = CATEGORIES.filter(c => c.tier === "essentials");
  const advancedCats  = CATEGORIES.filter(c => c.tier === "advanced");

  // All FAQs flattened for search
  const allFaqs = CATEGORIES.flatMap(c => [
    ...(c.essentials||[]).map(f => ({ ...f, color: c.color, catLabel: c.label, catId: c.id })),
    ...(c.advanced||[]).map(f =>   ({ ...f, color: c.color, catLabel: c.label, catId: c.id })),
  ]);

  // Popular = first essentials FAQ from each of the first 6 categories
  const popularFaqs = CATEGORIES.slice(0, 6).map(c => ({
    ...(c.essentials?.[0] || {}), color: c.color, catLabel: c.label, catId: c.id,
  }));

  useEffect(() => {
    setMessages([]); setActiveCategory(null);
    setExpandedEss(null); setExpandedAdv(null); setView("home");
  }, [lang]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setTemplatesOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
  window.history.replaceState({ view: "home", categoryId: null }, "", "/");

  const handlePop = (e) => {
    const state = e.state;
    if (!state) { setView("home"); setActiveCategory(null); return; }
    setView(state.view || "home");
    if (state.categoryId) {
      const found = translations[lang].categories.find(c => c.id === state.categoryId);
      if (found) setActiveCategory(found);
    } else {
      setActiveCategory(null);
    }
    setExpandedEss(null);
    setExpandedAdv(null);
    window.scrollTo(0, 0);
  };

  window.addEventListener("popstate", handlePop);
  return () => window.removeEventListener("popstate", handlePop);
}, [lang]);

  // Search results
  const searchResults = searchQuery.trim().length > 1
    ? allFaqs.filter(f =>
        f.q?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.a?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const sendMessage = async (text) => {
    const userText = text || chatInput.trim();
    if (!userText || loading) return;
    setChatInput("");
    const newMessages = [...messages, { role:"user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ messages: newMessages, systemPrompt: t.chat.systemPrompt }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || (lang==="en" ? "Sorry, couldn't get a response." : "Lo siento, no pude obtener una respuesta.");
      setMessages([...newMessages, { role:"assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role:"assistant", content: lang==="en" ? "Connection error. Please try again." : "Error de conexión." }]);
    }
    setLoading(false);
  };

  const sendContact = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSending(true);
    try {
      const res = await fetch("/api/contact", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ ...contactForm, lang }),
      });
      if (res.ok) { setContactStatus("success"); setContactForm({ name:"", email:"", subject:"", message:"" }); }
      else setContactStatus("error");
    } catch { setContactStatus("error"); }
    setContactSending(false);
  };
 // ── Browser history sync ──────────────────────────
const navigate = (newView, cat = null) => {
  const path =
    newView === "home"     ? "/" :
    newView === "category" ? `/topic/${cat?.id}` :
    `/${newView}`;
  window.history.pushState({ view: newView, categoryId: cat?.id || null }, "", path);
  setView(newView);
  if (cat) setActiveCategory(cat);
  else setActiveCategory(null);
  setMenuOpen(false);
  window.scrollTo(0, 0);
};

const openCategory = (cat) => {
  setExpandedEss(null); setExpandedAdv(null); navigate("category", cat);
};
const goHome  = () => navigate("home");
const openChat = (prefill) => {
  navigate("chat");
  if (prefill) setTimeout(() => sendMessage(prefill), 100);
};
const navTo = (v) => navigate(v);

  // ── Shared button styles
  const btnPrimary = { border:"none", borderRadius:8, padding:"12px 22px", fontSize:14, fontWeight:"700", cursor:"pointer", fontFamily:"inherit", background:th.accent, color: isDark ? "#0C0C0F" : "#FFFFFF", transition:"transform 0.15s, box-shadow 0.15s" };
  const btnGhost   = { background:"transparent", border:`1px solid ${th.borderMid}`, borderRadius:8, padding:"12px 22px", fontSize:14, cursor:"pointer", fontFamily:"inherit", color:th.text };

  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"'Georgia','Times New Roman',serif", display:"flex", flexDirection:"column", transition:"background 0.3s" }}>
      <style>{buildCss(th)}</style>

      {/* ══ SEO Meta (injected into head via effect) ══ */}

      {/* ══ NAV ══ */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 22px", borderBottom:`1px solid ${th.border}`, background:th.nav, backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:100 }}>
        {/* Logo */}
        <button onClick={goHome} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:0 }}>
          <span style={{ fontSize:20, color:th.accent }}>◈</span>
          <span style={{ fontSize:17, fontWeight:"700", color:th.text, letterSpacing:"-0.5px" }}>{t.appName}</span>
        </button>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:3 }}>
          <button onClick={goHome}          style={{ background:"none", border:"none", fontSize:13, cursor:"pointer", padding:"6px 11px", borderRadius:6, fontFamily:"inherit", color: view==="home"    ? th.text : th.textSub, background: view==="home"    ? th.surface : "transparent" }}>{t.nav.home}</button>
          <button onClick={() => navTo("chat")}    style={{ background:"none", border:"none", fontSize:13, cursor:"pointer", padding:"6px 11px", borderRadius:6, fontFamily:"inherit", color: view==="chat"    ? th.text : th.textSub, background: view==="chat"    ? th.surface : "transparent" }}>{t.nav.askAI}</button>
          <button onClick={() => navTo("contact")} style={{ background:"none", border:"none", fontSize:13, cursor:"pointer", padding:"6px 11px", borderRadius:6, fontFamily:"inherit", color: view==="contact" ? th.text : th.textSub, background: view==="contact" ? th.surface : "transparent" }}>{t.nav.contact}</button>

          {/* Templates */}
          <div ref={dropdownRef} style={{ position:"relative" }}>
            <button onClick={() => setTemplatesOpen(o => !o)} className="icon-btn"
              style={{ display:"flex", alignItems:"center", gap:6, border:`1px solid ${templatesOpen ? th.accent : th.borderMid}`, borderRadius:8, padding:"6px 12px", fontSize:13, cursor:"pointer", fontFamily:"inherit", background: templatesOpen ? th.surface : "transparent", color:th.text, marginLeft:4, transition:"all 0.2s" }}>
              📁 <span>{t.nav.templates}</span>
              <span style={{ fontSize:10, color:th.textMuted, transform: templatesOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s", display:"inline-block" }}>▾</span>
            </button>
            {templatesOpen && (
              <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", width:310, background:th.surface, border:`1px solid ${th.border}`, borderRadius:12, overflow:"hidden", zIndex:200, boxShadow: isDark?"0 16px 40px #00000066":"0 8px 32px #00000018" }}>
                <div style={{ fontSize:11, letterSpacing:"1px", textTransform:"uppercase", padding:"12px 16px 10px", borderBottom:`1px solid ${th.border}`, fontWeight:"700", color:th.textMuted }}>
                  {lang==="en" ? "Download Templates & Guides" : "Descargar Plantillas y Guías"}
                </div>
                <div style={{ fontSize:10, letterSpacing:"1.5px", fontWeight:"700", padding:"10px 16px 4px", color:th.textMuted }}>📊 {lang==="en" ? "EXCEL TEMPLATES" : "PLANTILLAS EXCEL"}</div>
                {TEMPLATES.filter(tp => tp.type==="excel").map((tmpl,i) => <TemplateRow key={i} tmpl={tmpl} th={th} lang={lang} />)}
                <div style={{ height:1, background:th.border, margin:"4px 0" }} />
                <div style={{ fontSize:10, letterSpacing:"1.5px", fontWeight:"700", padding:"10px 16px 4px", color:th.textMuted }}>📄 {lang==="en" ? "PDF GUIDES" : "GUÍAS PDF"}</div>
                {TEMPLATES.filter(tp => tp.type==="pdf").map((tmpl,i) => <TemplateRow key={i} tmpl={tmpl} th={th} lang={lang} />)}
                <div style={{ padding:"10px 16px 12px", borderTop:`1px solid ${th.border}` }}>
                  <p style={{ fontSize:11, color:th.textMuted, fontStyle:"italic" }}>{lang==="en" ? "More templates coming soon." : "Más plantillas próximamente."}</p>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <button onClick={() => setSearchOpen(true)} className="icon-btn"
            style={{ width:34, height:34, border:`1px solid ${th.borderMid}`, borderRadius:8, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", background:th.surface, color:th.text, marginLeft:4 }}>🔍</button>

          {/* Theme */}
          <button onClick={() => setThemeKey(k => k==="dark" ? "light" : "dark")} className="icon-btn"
            style={{ width:34, height:34, border:`1px solid ${th.borderMid}`, borderRadius:8, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", background:th.surface, color:th.text, marginLeft:2 }}>
            {isDark ? "☀" : "☽"}
          </button>

          {/* Language */}
          <button onClick={() => setLang(l => l==="en" ? "es" : "en")} className="icon-btn"
            style={{ display:"flex", alignItems:"center", gap:4, border:`1px solid ${th.borderMid}`, borderRadius:8, padding:"5px 10px", cursor:"pointer", fontFamily:"inherit", background:th.surface, marginLeft:2 }}>
            <span style={{ fontSize:11, fontWeight:"700", color: lang==="en" ? th.accent : th.textFaint }}>EN</span>
            <span style={{ fontSize:11, color:th.border }}>|</span>
            <span style={{ fontSize:11, fontWeight:"700", color: lang==="es" ? th.accent : th.textFaint }}>ES</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)}
          style={{ display:"none", background:"none", border:`1px solid ${th.borderMid}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", color:th.text, fontSize:18 }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div style={{ background:th.surface, borderBottom:`1px solid ${th.border}`, padding:"12px 22px 16px", display:"flex", flexDirection:"column", gap:2, zIndex:99 }} className="mobile-menu">
          {[
            { label: t.nav.home,    action: goHome },
            { label: t.nav.askAI,  action: () => openChat() },
            { label: t.nav.contact,action: () => navTo("contact") },
          ].map(item => (
            <button key={item.label} onClick={item.action}
              style={{ background:"none", border:"none", color:th.text, fontSize:15, cursor:"pointer", fontFamily:"inherit", padding:"10px 0", textAlign:"left", borderBottom:`1px solid ${th.border}` }}>
              {item.label}
            </button>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <button onClick={() => setThemeKey(k => k==="dark"?"light":"dark")}
              style={{ flex:1, border:`1px solid ${th.borderMid}`, borderRadius:8, padding:"8px", cursor:"pointer", background:th.surface2, color:th.text, fontFamily:"inherit", fontSize:13 }}>
              {isDark ? "☀ Light Mode" : "☽ Dark Mode"}
            </button>
            <button onClick={() => setLang(l => l==="en"?"es":"en")}
              style={{ flex:1, border:`1px solid ${th.borderMid}`, borderRadius:8, padding:"8px", cursor:"pointer", background:th.surface2, color:th.text, fontFamily:"inherit", fontSize:13 }}>
              {lang==="en" ? "🇲🇽 Español" : "🇺🇸 English"}
            </button>
          </div>
        </div>
      )}

      {/* ══ SEARCH MODAL ══ */}
      {searchOpen && (
        <div style={{ position:"fixed", inset:0, background:"#00000088", zIndex:300, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:80 }}
          onClick={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); setSearchQuery(""); } }}>
          <div style={{ width:"100%", maxWidth:580, background:th.surface, borderRadius:14, border:`1px solid ${th.border}`, overflow:"hidden", margin:"0 16px", boxShadow:"0 24px 60px #00000066" }}>
            <div style={{ display:"flex", alignItems:"center", padding:"14px 18px", gap:10, borderBottom:`1px solid ${th.border}` }}>
              <span style={{ fontSize:16, color:th.textMuted }}>🔍</span>
              <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.nav.search} style={{ flex:1, background:"none", border:"none", outline:"none", fontSize:16, color:th.text, fontFamily:"inherit" }} />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                style={{ background:"none", border:"none", color:th.textMuted, cursor:"pointer", fontSize:18, lineHeight:1 }}>✕</button>
            </div>
            {searchQuery.trim().length > 1 && (
              <div style={{ maxHeight:380, overflowY:"auto" }}>
                {searchResults.length === 0
                  ? <div style={{ padding:"20px 18px", color:th.textMuted, fontSize:14 }}>{lang==="en" ? "No results found." : "No se encontraron resultados."}</div>
                  : searchResults.map((f,i) => (
                    <button key={i} onClick={() => { setSearchOpen(false); setSearchQuery(""); openChat(f.q); }}
                      style={{ width:"100%", display:"flex", alignItems:"flex-start", gap:10, padding:"13px 18px", background:"none", border:"none", borderBottom:`1px solid ${th.border}`, cursor:"pointer", textAlign:"left", fontFamily:"inherit", transition:"background 0.15s" }}
                      className="search-result">
                      <span style={{ width:7, height:7, borderRadius:"50%", background:f.color, flexShrink:0, marginTop:5 }} />
                      <div>
                        <div style={{ fontSize:13, color:th.text, fontWeight:"600", marginBottom:2 }}>{f.q}</div>
                        <div style={{ fontSize:11, color:th.textMuted }}>{f.catLabel}</div>
                      </div>
                    </button>
                  ))
                }
              </div>
            )}
            {searchQuery.trim().length <= 1 && (
              <div style={{ padding:"16px 18px" }}>
                <p style={{ fontSize:11, color:th.textMuted, letterSpacing:"1px", textTransform:"uppercase", fontWeight:"700", marginBottom:10 }}>{lang==="en" ? "Popular Topics" : "Temas Populares"}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {CATEGORIES.slice(0,6).map(c => (
                    <button key={c.id} onClick={() => { setSearchOpen(false); openCategory(c); }}
                      style={{ fontSize:12, padding:"5px 12px", border:`1px solid ${th.border}`, borderRadius:16, cursor:"pointer", fontFamily:"inherit", color:c.color, background:isDark ? c.bg : th.surface2 }}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════ HOME ══════════ */}
      {view === "home" && (
        <main style={{ flex:1, maxWidth:900, margin:"0 auto", width:"100%", padding:"0 22px 60px" }}>

          {/* Hero */}
          <section style={{ padding:"52px 0 36px", textAlign:"center" }}>
            <div style={{ display:"inline-block", fontSize:10, letterSpacing:"2px", textTransform:"uppercase", color:th.accent, border:`1px solid ${th.accentBorder}`, borderRadius:20, padding:"5px 14px", marginBottom:20 }}>{t.hero.badge}</div>
            <h1 style={{ fontSize:"clamp(30px,5vw,50px)", fontWeight:"400", lineHeight:1.15, margin:"0 0 14px", letterSpacing:"-1px", color:th.text }}>
              {t.hero.title1}<br /><span style={{ color:th.accent, fontStyle:"italic" }}>{t.hero.title2}</span>
            </h1>
            <p style={{ fontSize:16, color:th.textSub, maxWidth:480, margin:"0 auto 26px", lineHeight:1.6 }}>{t.hero.sub}</p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={() => openChat()} className="btn-primary" style={btnPrimary}>{t.hero.btnAI}</button>
              <button onClick={() => document.getElementById("categories").scrollIntoView({ behavior:"smooth" })} style={btnGhost}>{t.hero.btnBrowse}</button>
            </div>
          </section>

          {/* ── Essentials Categories ── */}
          <section id="categories" style={{ padding:"32px 0 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
              <div style={{ flex:1 }}>
                <h2 style={{ fontSize:22, fontWeight:"700", color:th.text, margin:"0 0 3px" }}>{t.tiers.essentials}</h2>
                <p style={{ fontSize:13, color:th.textSub }}>{t.tiers.essentialsSub}</p>
              </div>
              <span style={{ fontSize:11, padding:"4px 12px", borderRadius:16, background:th.essentialsBadge, color:th.essentialsBadgeText, fontWeight:"700", letterSpacing:"0.5px" }}>
                {lang==="en" ? "FOUNDATIONS" : "FUNDAMENTOS"}
              </span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10, marginBottom:48 }}>
              {essentialCats.map(c => <CategoryCard key={c.id} c={c} th={th} isDark={isDark} onClick={() => openCategory(c)} faqCount={t.faqCount(c.essentials.length + c.advanced.length)} />)}
            </div>

            {/* ── Advanced Categories ── */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
              <div style={{ flex:1 }}>
                <h2 style={{ fontSize:22, fontWeight:"700", color:th.text, margin:"0 0 3px" }}>{t.tiers.advanced}</h2>
                <p style={{ fontSize:13, color:th.textSub }}>{t.tiers.advancedSub}</p>
              </div>
              <span style={{ fontSize:11, padding:"4px 12px", borderRadius:16, background:th.advancedBadge, color:th.advancedBadgeText, fontWeight:"700", letterSpacing:"0.5px" }}>
                {lang==="en" ? "GROWTH" : "CRECIMIENTO"}
              </span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10, marginBottom:48 }}>
              {advancedCats.map(c => <CategoryCard key={c.id} c={c} th={th} isDark={isDark} onClick={() => openCategory(c)} faqCount={t.faqCount(c.essentials.length + c.advanced.length)} />)}
            </div>
          </section>

          {/* ── CTA ── */}
          <section style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, padding:"22px 26px", background:th.surface, border:`1px solid ${th.accentBorder}`, borderRadius:14, flexWrap:"wrap", marginBottom:48 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <span style={{ fontSize:16, fontWeight:"700", color:th.text }}>{t.ctaTitle}</span>
              <span style={{ fontSize:13, color:th.textSub }}>{t.ctaSub}</span>
            </div>
            <button onClick={() => openChat()} className="btn-primary" style={btnPrimary}>{t.ctaBtn}</button>
          </section>

          {/* ── Email Capture ── */}
          <section style={{ padding:"32px 28px", background:isDark ? "#161618" : "#FFFFFF", border:`1px solid ${th.border}`, borderRadius:14, textAlign:"center", marginBottom:48 }}>
            <h3 style={{ fontSize:20, fontWeight:"400", color:th.text, margin:"0 0 8px", letterSpacing:"-0.3px" }}>{t.emailCapture.title}</h3>
            <p style={{ fontSize:13, color:th.textSub, marginBottom:20, maxWidth:440, margin:"0 auto 20px" }}>{t.emailCapture.sub}</p>
            <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", maxWidth:440, margin:"0 auto" }}>
              <input placeholder={t.emailCapture.placeholder}
                style={{ flex:1, minWidth:200, background:th.inputBg, border:`1px solid ${th.borderMid}`, color:th.text, borderRadius:8, padding:"11px 14px", fontSize:14, fontFamily:"inherit", outline:"none" }} />
              <button className="btn-primary" style={{ ...btnPrimary, padding:"11px 18px", fontSize:13, whiteSpace:"nowrap" }}>{t.emailCapture.btn}</button>
            </div>
            <p style={{ fontSize:11, color:th.textMuted, marginTop:10 }}>{t.emailCapture.note}</p>
          </section>

          {/* ── Popular Questions (bottom) ── */}
          <section style={{ padding:"0 0 8px" }}>
            <h3 style={{ fontSize:18, fontWeight:"400", color:th.text, marginBottom:16, letterSpacing:"-0.3px" }}>{t.popularLabel}</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))", gap:9 }}>
              {popularFaqs.map((faq,i) => (
                <button key={i} onClick={() => openChat(faq.q)} className="faq-strip-card"
                  style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"13px 15px", border:`1px solid ${th.border}`, borderRadius:10, cursor:"pointer", textAlign:"left", fontFamily:"inherit", background:th.surface }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:faq.color, flexShrink:0, marginTop:5 }} />
                  <span style={{ flex:1, fontSize:13, lineHeight:1.4, color:th.text }}>{faq.q}</span>
                  <span style={{ fontSize:13, color:faq.color }}>→</span>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ══════════ CATEGORY ══════════ */}
      {view === "category" && activeCategory && (() => {
        const cat = activeCategory;
        return (
          <main style={{ flex:1, maxWidth:880, margin:"0 auto", width:"100%", padding:"0 22px 60px" }}>
            {/* Breadcrumb */}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"26px 0 14px", fontSize:13, color:th.textSub }}>
              <button onClick={goHome} style={{ background:"none", border:"none", color:th.textSub, cursor:"pointer", fontFamily:"inherit", fontSize:13, padding:0 }}>{t.breadHome}</button>
              <span style={{ color:th.border }}>/</span>
              <span style={{ color:cat.color }}>{cat.label}</span>
            </div>

            {/* Cat header */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32, paddingBottom:22, borderBottom:`1px solid ${th.border}` }}>
              <span style={{ fontSize:26, width:54, height:54, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${isDark ? cat.color+"44" : th.border}`, borderRadius:12, flexShrink:0, color:cat.color, background: isDark ? cat.bg : th.surface2 }}>{cat.icon}</span>
              <div>
                <h1 style={{ fontSize:26, fontWeight:"400", margin:0, letterSpacing:"-0.5px", color:th.text }}>{cat.label}</h1>
                <p style={{ fontSize:13, color:th.textMuted, margin:"3px 0 0" }}>{t.faqCount((cat.essentials?.length||0) + (cat.advanced?.length||0))}</p>
              </div>
            </div>

            {/* Essentials FAQs */}
            {cat.essentials?.length > 0 && (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <span style={{ fontSize:13, fontWeight:"700", color:th.essentialsBadgeText, background:th.essentialsBadge, padding:"4px 12px", borderRadius:16 }}>
                    {lang==="en" ? "Business Essentials" : "Fundamentos"}
                  </span>
                  <span style={{ fontSize:12, color:th.textMuted }}>{lang==="en" ? "Foundational knowledge" : "Conocimiento fundamental"}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:32 }}>
                  {cat.essentials.map((faq,i) => (
                    <FaqAccordion key={`e${i}`} faq={faq} index={i} prefix="e" cat={cat} th={th} isDark={isDark}
                      expanded={expandedEss===i} onToggle={() => setExpandedEss(expandedEss===i ? null : i)}
                      onFollowUp={() => openChat(faq.q)} followUpLabel={t.followUp} />
                  ))}
                </div>
              </>
            )}

            {/* Advanced FAQs */}
            {cat.advanced?.length > 0 && (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <span style={{ fontSize:13, fontWeight:"700", color:th.advancedBadgeText, background:th.advancedBadge, padding:"4px 12px", borderRadius:16 }}>
                    {lang==="en" ? "Business Growth" : "Crecimiento"}
                  </span>
                  <span style={{ fontSize:12, color:th.textMuted }}>{lang==="en" ? "Scaling & optimization" : "Escalado y optimización"}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:32 }}>
                  {cat.advanced.map((faq,i) => (
                    <FaqAccordion key={`a${i}`} faq={faq} index={i} prefix="a" cat={cat} th={th} isDark={isDark}
                      expanded={expandedAdv===i} onToggle={() => setExpandedAdv(expandedAdv===i ? null : i)}
                      onFollowUp={() => openChat(faq.q)} followUpLabel={t.followUp} />
                  ))}
                </div>
              </>
            )}

            <div style={{ textAlign:"center", padding:"32px 0 0" }}>
              <p style={{ fontSize:14, color:th.textMuted, marginBottom:14 }}>{t.noQuestion}</p>
              <button onClick={() => openChat()} className="btn-primary" style={btnPrimary}>{t.askAdvisor}</button>
            </div>
          </main>
        );
      })()}

      {/* ══════════ CHAT ══════════ */}
      {view === "chat" && (
        <main style={{ flex:1, display:"flex", flexDirection:"column", maxWidth:800, margin:"0 auto", width:"100%", height:"calc(100vh - 61px)" }}>
          <div style={{ padding:"14px 22px", borderBottom:`1px solid ${th.border}`, background:th.surface }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <div style={{ width:36, height:36, background:th.accentDim, border:`1px solid ${th.accentBorder}`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:th.accent, flexShrink:0 }}>◈</div>
              <div>
                <div style={{ fontSize:14, fontWeight:"700", color:th.text }}>{t.chat.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:th.textMuted }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"#4CAF50", display:"inline-block" }} />{t.chat.status}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => openChat((c.essentials||[])[0]?.q)} className="topic-pill"
                  style={{ fontSize:11, padding:"4px 10px", border:`1px solid ${isDark ? c.color+"44" : th.border}`, borderRadius:10, cursor:"pointer", fontFamily:"inherit", color:c.color, background: isDark ? c.bg : th.surface2 }}>
                  {c.icon} {c.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"18px 22px", display:"flex", flexDirection:"column", gap:12, background:th.bg }}>
            {messages.length === 0 && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"50px 16px 0" }}>
                <div style={{ fontSize:34, color:th.accent, marginBottom:16, opacity:0.6 }}>◈</div>
                <h2 style={{ fontSize:19, fontWeight:"400", margin:"0 0 8px", color:th.text }}>{t.chat.emptyTitle}</h2>
                <p style={{ fontSize:14, color:th.textSub, marginBottom:24 }}>{t.chat.emptyDesc}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:7, width:"100%", maxWidth:420 }}>
                  {t.chat.suggestions.map(s => (
                    <button key={s} onClick={() => sendMessage(s)} className="suggestion-btn"
                      style={{ border:`1px solid ${th.border}`, borderRadius:10, padding:"11px 15px", fontSize:13, cursor:"pointer", fontFamily:"inherit", textAlign:"left", background:th.surface, color:th.chipText }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m,i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-end", gap:9, justifyContent: m.role==="user" ? "flex-end" : "flex-start" }}>
                {m.role==="assistant" && <div style={{ width:30, height:30, background:th.accentDim, border:`1px solid ${th.accentBorder}`, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:th.accent, flexShrink:0 }}>◈</div>}
                <div style={{ maxWidth:"76%", padding:"12px 16px", borderRadius:13, fontSize:13, lineHeight:1.7, ...(m.role==="user" ? { background:th.msgUser.bg, color:th.msgUser.color, borderBottomRightRadius:4, fontWeight:"500" } : { background:th.msgAI.bg, color:th.msgAI.color, border:`1px solid ${th.msgAI.border}`, borderBottomLeftRadius:4 }) }}>
                  {m.content.split("\n").map((line,li) => <span key={li}>{line}{li < m.content.split("\n").length-1 && <br/>}</span>)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", alignItems:"flex-end", gap:9 }}>
                <div style={{ width:30, height:30, background:th.accentDim, border:`1px solid ${th.accentBorder}`, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:th.accent, flexShrink:0 }}>◈</div>
                <div style={{ padding:"13px 17px", borderRadius:13, background:th.msgAI.bg, border:`1px solid ${th.msgAI.border}`, borderBottomLeftRadius:4, display:"flex", gap:4, alignItems:"center" }}>
                  {[0,0.2,0.4].map((d,i) => <span key={i} className={`dot-${i+1}`} style={{ width:6, height:6, borderRadius:"50%", background:th.accent, display:"inline-block", opacity:0.4, animation:"pulse 1.2s ease-in-out infinite", animationDelay:`${d}s` }} />)}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display:"flex", gap:7, padding:"14px 22px", borderTop:`1px solid ${th.border}`, background:th.bg }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key==="Enter" && !e.shiftKey && sendMessage()}
              placeholder={t.chat.placeholder} disabled={loading} className="chat-input"
              style={{ flex:1, background:th.inputBg, border:`1px solid ${th.borderMid}`, color:th.text, borderRadius:10, padding:"12px 15px", fontSize:14, fontFamily:"inherit", outline:"none" }} />
            <button onClick={() => sendMessage()} disabled={loading || !chatInput.trim()} className="send-btn"
              style={{ width:44, height:44, background:th.accent, color: isDark?"#0C0C0F":"#FFFFFF", border:"none", borderRadius:10, fontSize:18, fontWeight:"700", cursor:"pointer", flexShrink:0, opacity: loading||!chatInput.trim() ? 0.4 : 1, display:"flex", alignItems:"center", justifyContent:"center" }}>↑</button>
          </div>
        </main>
      )}

      {/* ══════════ CONTACT ══════════ */}
      {view === "contact" && (
        <main style={{ flex:1, maxWidth:640, margin:"0 auto", width:"100%", padding:"40px 22px 60px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28, fontSize:13, color:th.textSub }}>
            <button onClick={goHome} style={{ background:"none", border:"none", color:th.textSub, cursor:"pointer", fontFamily:"inherit", fontSize:13, padding:0 }}>{t.breadHome}</button>
            <span>/</span><span style={{ color:th.text }}>{t.contact.title}</span>
          </div>

          <h1 style={{ fontSize:30, fontWeight:"400", color:th.text, margin:"0 0 8px", letterSpacing:"-0.5px" }}>{t.contact.title}</h1>
          <p style={{ fontSize:15, color:th.textSub, marginBottom:32, lineHeight:1.6 }}>{t.contact.sub}</p>

          {contactStatus === "success" ? (
            <div style={{ padding:"28px", background:isDark?"#0A1A0A":"#F0FFF0", border:`1px solid #4CAF5044`, borderRadius:12, textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>✓</div>
              <p style={{ fontSize:16, color:th.text, fontWeight:"600" }}>{t.contact.success}</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }} className="contact-grid">
                <div>
                  <label style={{ fontSize:12, color:th.textMuted, display:"block", marginBottom:6, letterSpacing:"0.5px" }}>{t.contact.name} *</label>
                  <input value={contactForm.name} onChange={e => setContactForm(f=>({...f,name:e.target.value}))}
                    style={{ width:"100%", background:th.inputBg, border:`1px solid ${th.borderMid}`, color:th.text, borderRadius:8, padding:"11px 14px", fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize:12, color:th.textMuted, display:"block", marginBottom:6, letterSpacing:"0.5px" }}>{t.contact.email} *</label>
                  <input type="email" value={contactForm.email} onChange={e => setContactForm(f=>({...f,email:e.target.value}))}
                    style={{ width:"100%", background:th.inputBg, border:`1px solid ${th.borderMid}`, color:th.text, borderRadius:8, padding:"11px 14px", fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize:12, color:th.textMuted, display:"block", marginBottom:6, letterSpacing:"0.5px" }}>{t.contact.subject}</label>
                <select value={contactForm.subject} onChange={e => setContactForm(f=>({...f,subject:e.target.value}))}
                  style={{ width:"100%", background:th.inputBg, border:`1px solid ${th.borderMid}`, color:th.text, borderRadius:8, padding:"11px 14px", fontSize:14, fontFamily:"inherit", outline:"none", cursor:"pointer" }}>
                  <option value="">— {lang==="en" ? "Select a subject" : "Selecciona un asunto"} —</option>
                  {t.contact.subjectOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize:12, color:th.textMuted, display:"block", marginBottom:6, letterSpacing:"0.5px" }}>{t.contact.message} *</label>
                <textarea value={contactForm.message} onChange={e => setContactForm(f=>({...f,message:e.target.value}))} rows={6}
                  style={{ width:"100%", background:th.inputBg, border:`1px solid ${th.borderMid}`, color:th.text, borderRadius:8, padding:"11px 14px", fontSize:14, fontFamily:"inherit", outline:"none", resize:"vertical", boxSizing:"border-box" }} />
              </div>

              {contactStatus === "error" && (
                <p style={{ fontSize:13, color:"#E85454" }}>{t.contact.error}</p>
              )}

              <button onClick={sendContact} disabled={contactSending || !contactForm.name || !contactForm.email || !contactForm.message}
                className="btn-primary" style={{ ...btnPrimary, opacity: contactSending || !contactForm.name || !contactForm.email || !contactForm.message ? 0.5 : 1, alignSelf:"flex-start" }}>
                {contactSending ? (lang==="en" ? "Sending..." : "Enviando...") : t.contact.btn}
              </button>
            </div>
          )}
        </main>
      )}

      {/* ══════════ PRIVACY ══════════ */}
      {view === "privacy" && (
        <main style={{ flex:1, maxWidth:720, margin:"0 auto", width:"100%", padding:"40px 22px 60px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28, fontSize:13, color:th.textSub }}>
            <button onClick={goHome} style={{ background:"none", border:"none", color:th.textSub, cursor:"pointer", fontFamily:"inherit", fontSize:13, padding:0 }}>{t.breadHome}</button>
            <span>/</span><span style={{ color:th.text }}>{t.privacy.title}</span>
          </div>
          <h1 style={{ fontSize:30, fontWeight:"400", color:th.text, margin:"0 0 6px" }}>{t.privacy.title}</h1>
          <p style={{ fontSize:13, color:th.textMuted, marginBottom:32 }}>{t.privacy.lastUpdated}</p>
          {[
            { h: "Information We Collect", p: "BizAdvisor collects information you voluntarily provide, including name, email address, and messages submitted through our contact form. We also collect anonymous usage data through Vercel Analytics to understand how users interact with the site." },
            { h: "How We Use Your Information", p: "We use your contact information solely to respond to your inquiries. We use anonymous analytics data to improve the app experience. We do not sell, rent, or share your personal information with third parties for marketing purposes." },
            { h: "AI Conversations", p: "Questions submitted to the AI advisor are processed by Anthropic's Claude API. Conversation content may be used by Anthropic to improve AI safety and capabilities per their privacy policy. We do not store individual conversation histories on our servers." },
            { h: "Cookies and Tracking", p: "BizAdvisor uses minimal tracking. We may use session cookies for basic functionality. We use Vercel Analytics for anonymous, privacy-focused traffic analysis. No third-party advertising trackers are used." },
            { h: "Data Security", p: "We take reasonable measures to protect your information. Contact form submissions are transmitted securely. Your API key and other sensitive credentials are stored in encrypted server-side environment variables and are never exposed to end users." },
            { h: "Your Rights", p: "You may request deletion of any personal data we hold about you by contacting us via the contact form. We will respond within 30 days." },
            { h: "Contact", p: "For privacy-related questions, please use the Contact page. We take privacy concerns seriously and will respond promptly." },
          ].map((s,i) => (
            <div key={i} style={{ marginBottom:28 }}>
              <h2 style={{ fontSize:17, fontWeight:"700", color:th.text, margin:"0 0 8px" }}>{s.h}</h2>
              <p style={{ fontSize:14, color:th.textSub, lineHeight:1.75 }}>{s.p}</p>
            </div>
          ))}
        </main>
      )}

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: isDark ? "#0A0A0D" : "#F0EDE8", borderTop:`1px solid ${th.border}`, padding:"44px 22px 24px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:32, marginBottom:40 }} className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <span style={{ fontSize:18, color:th.accent }}>◈</span>
                <span style={{ fontSize:16, fontWeight:"700", color:th.text }}>{t.appName}</span>
              </div>
              <p style={{ fontSize:13, color:th.textSub, lineHeight:1.6, maxWidth:220 }}>{t.footer.tagline}</p>
            </div>
            {/* Product links */}
            <div>
              <p style={{ fontSize:11, fontWeight:"700", color:th.textMuted, letterSpacing:"1px", textTransform:"uppercase", marginBottom:12 }}>{t.footer.sections.product.title}</p>
              {[
                { label: t.footer.sections.product.links[0], action: goHome },
                { label: t.footer.sections.product.links[1], action: () => navTo("chat") },
                { label: t.footer.sections.product.links[2], action: () => setTemplatesOpen(true) },
                { label: t.footer.sections.product.links[3], action: () => navTo("contact") },
              ].map(l => (
                <button key={l.label} onClick={l.action} style={{ display:"block", background:"none", border:"none", color:th.textSub, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:"4px 0", textAlign:"left", transition:"color 0.2s" }} className="footer-link">{l.label}</button>
              ))}
            </div>
            {/* Topic links */}
            <div>
              <p style={{ fontSize:11, fontWeight:"700", color:th.textMuted, letterSpacing:"1px", textTransform:"uppercase", marginBottom:12 }}>{t.footer.sections.topics.title}</p>
              {essentialCats.map(c => (
                <button key={c.id} onClick={() => openCategory(c)} style={{ display:"block", background:"none", border:"none", color:th.textSub, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:"4px 0", textAlign:"left" }} className="footer-link">{c.label}</button>
              ))}
            </div>
            {/* Legal */}
            <div>
              <p style={{ fontSize:11, fontWeight:"700", color:th.textMuted, letterSpacing:"1px", textTransform:"uppercase", marginBottom:12 }}>{t.footer.sections.legal.title}</p>
              <button onClick={() => navTo("privacy")} style={{ display:"block", background:"none", border:"none", color:th.textSub, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:"4px 0", textAlign:"left" }} className="footer-link">{t.footer.sections.legal.links[0]}</button>
              <button style={{ display:"block", background:"none", border:"none", color:th.textSub, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:"4px 0", textAlign:"left" }} className="footer-link">{t.footer.sections.legal.links[1]}</button>
            </div>
          </div>

          <div style={{ borderTop:`1px solid ${th.border}`, paddingTop:20, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <p style={{ fontSize:12, color:th.textMuted }}>{t.footer.copyright}</p>
            <button onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
              style={{ fontSize:12, color:th.textMuted, background:"none", border:`1px solid ${th.border}`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontFamily:"inherit" }}>
              ↑ {lang==="en" ? "Back to top" : "Volver arriba"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────
function CategoryCard({ c, th, isDark, onClick, faqCount }) {
  return (
    <button onClick={onClick} className="cat-card"
      style={{ position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:5, padding:"20px", border:`1px solid ${isDark ? c.color+"33" : th.border}`, borderRadius:12, cursor:"pointer", textAlign:"left", transition:"transform 0.2s, border-color 0.2s", fontFamily:"inherit", background: isDark ? c.bg : th.surface }}>
      <span style={{ fontSize:22, color:c.color, marginBottom:2 }}>{c.icon}</span>
      <span style={{ fontSize:14, fontWeight:"700", color:th.text }}>{c.label}</span>
      <span style={{ fontSize:12, color:th.textSub, lineHeight:1.4 }}>{c.desc}</span>
      <span style={{ fontSize:11, color:c.color, fontWeight:"600", marginTop:3 }}>{faqCount}</span>
    </button>
  );
}

function FaqAccordion({ faq, index, cat, th, expanded, onToggle, onFollowUp, followUpLabel }) {
  return (
    <div className="faq-item" style={{ border:`1px solid ${expanded ? cat.color+"66" : th.border}`, borderRadius:10, overflow:"hidden", background:th.faqBg }}>
      <button onClick={onToggle} style={{ width:"100%", display:"flex", alignItems:"flex-start", gap:12, padding:"15px 17px", background:"none", border:"none", cursor:"pointer", textAlign:"left", fontFamily:"inherit", color:th.text }}>
        <span style={{ fontSize:11, fontWeight:"700", color:cat.color, flexShrink:0, marginTop:2, minWidth:20 }}>0{index+1}</span>
        <span style={{ flex:1, fontSize:14, lineHeight:1.5, color:th.text }}>{faq.q}</span>
        <span style={{ fontSize:15, color:cat.color, transform: expanded?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.25s", marginLeft:8 }}>▾</span>
      </button>
      {expanded && (
        <div style={{ padding:"0 17px 17px 48px" }}>
          <p style={{ fontSize:13, lineHeight:1.75, color:th.textSub, margin:"0 0 12px" }}>{faq.a}</p>
          <button onClick={onFollowUp} style={{ background:"none", border:`1px solid ${cat.color+"44"}`, borderRadius:6, padding:"6px 12px", fontSize:12, cursor:"pointer", fontFamily:"inherit", color:cat.color }}>{followUpLabel}</button>
        </div>
      )}
    </div>
  );
}

function TemplateRow({ tmpl, th, lang }) {
  return (
    <div className="dropdown-item" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 16px", gap:8, transition:"background 0.15s" }}>
      <span style={{ fontSize:13, flex:1, lineHeight:1.3, color:th.text }}>{tmpl.label}</span>
      {tmpl.ready
        ? <a href={tmpl.url} download style={{ fontSize:11, fontWeight:"700", padding:"4px 10px", borderRadius:6, textDecoration:"none", whiteSpace:"nowrap", fontFamily:"inherit", background:th.accent, color:"#0C0C0F" }}>↓ {lang==="en"?"Download":"Descargar"}</a>
        : <span style={{ fontSize:10, padding:"3px 8px", border:`1px solid ${th.border}`, borderRadius:10, whiteSpace:"nowrap", color:th.textMuted }}>{lang==="en"?"Coming Soon":"Próximamente"}</span>
      }
    </div>
  );
}

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
    .icon-btn:hover { border-color: ${th.accentBorder} !important; }
    .dropdown-item:hover { background: ${th.surface2}; }
    .search-result:hover { background: ${th.surface2}; }
    .footer-link:hover { color: ${th.text} !important; }
    @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
    .dot-1{animation-delay:0s} .dot-2{animation-delay:0.2s} .dot-3{animation-delay:0.4s}
    @media (max-width: 680px) {
      .desktop-nav { display: none !important; }
      .hamburger { display: flex !important; }
      .footer-grid { grid-template-columns: 1fr 1fr !important; }
      .contact-grid { grid-template-columns: 1fr !important; }
    }
  `;
}
