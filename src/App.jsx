import { useState, useRef, useEffect } from "react";

const CATEGORIES = [
  {
    id: "finance",
    icon: "◈",
    label: "Finance & Money",
    color: "#D4A843",
    bg: "#1A140A",
    desc: "Pricing, cash flow, taxes, profit",
    faqs: [
      { q: "How much money do I need to start my business?", a: "Service businesses (bookkeeping, consulting) can launch under $500. Product businesses typically need $2,000–$10,000+ for inventory and setup. List every expense for your first 90 days and add a 20% buffer for surprises. The key is knowing your break-even point before you spend anything." },
      { q: "What's the difference between revenue, profit, and cash flow?", a: "Revenue = total money coming in. Profit = revenue minus all expenses. Cash flow = the actual timing of money moving in and out of your account. A business can be profitable on paper but cash-flow negative if clients pay late. This is why profitable businesses sometimes run out of money." },
      { q: "How do self-employment taxes work?", a: "Self-employed individuals pay both the employee AND employer portions of Social Security and Medicare — totaling 15.3% on net income, plus federal income tax. Set aside 25–30% of every payment you receive into a dedicated savings account. Pay quarterly estimated taxes (April, June, September, January) to avoid IRS penalties." },
      { q: "How do I price my service or product?", a: "Calculate all costs (materials, time, overhead, software) then add your desired margin. Research what competitors charge. Consider value-based pricing — what is the result worth to your client? Most beginners underprice. If you're fully booked, that's a signal to raise prices. Review pricing every 6 months." },
      { q: "What business expenses can I deduct?", a: "Common deductions include: home office, business software, phone/internet (business portion), equipment, professional development, advertising, business meals (50%), vehicle use, and professional services. Keep receipts for everything. A good accounting system pays for itself in tax savings alone." },
    ],
  },
  {
    id: "legal",
    icon: "⬡",
    label: "Legal & Structure",
    color: "#5B8FA8",
    bg: "#080F13",
    desc: "LLC, contracts, licenses, protection",
    faqs: [
      { q: "Should I form an LLC?", a: "For most small businesses: yes. An LLC costs $50–$500 to form and protects your personal assets (house, car, savings) from business debts and lawsuits. A sole proprietorship is simpler but leaves you personally liable. Form the LLC before you start taking on clients. It also adds credibility." },
      { q: "What's the difference between LLC and S-Corp?", a: "An LLC is a legal structure. An S-Corp is a tax election you can apply to an LLC. The S-Corp advantage: you pay yourself a reasonable salary and take remaining profit as distributions — distributions avoid the 15.3% self-employment tax. This strategy typically saves money when your net profit exceeds ~$60,000/year." },
      { q: "What contracts do I actually need?", a: "At minimum: a client service agreement (scope, payment, deadlines, cancellation policy) for every client. If you hire help: an independent contractor agreement. For sensitive business info: an NDA. Simple, plain-language templates work fine — you don't need a lawyer for basic contracts. Get every agreement signed before starting work." },
      { q: "What insurance does a small business need?", a: "General liability ($500–$1,500/year) covers property damage or injury claims. Professional liability / E&O ($500–$2,000/year) covers mistakes in your professional services — essential for bookkeepers, consultants, and designers. If you have employees, workers' comp is required in most states. Start with general liability at minimum." },
      { q: "Do I need a business license?", a: "Most cities and counties require a general business license ($25–$100/year). Some industries require additional licenses (contractors, food service, healthcare, financial services). Check your city/county website and your state's business portal. If working from home, also check local zoning laws. The SBA website has a license lookup tool by state." },
    ],
  },
  {
    id: "marketing",
    icon: "◇",
    label: "Marketing & Sales",
    color: "#C46A4E",
    bg: "#130A08",
    desc: "Clients, referrals, online presence",
    faqs: [
      { q: "How do I find my first customers?", a: "Your personal network is your fastest path. Tell everyone you know what you do and who you help. Post on LinkedIn and local Facebook groups. Offer a discounted or free first project to get a testimonial. Ask satisfied clients for referrals. Partner with complementary businesses. Most first clients come from people you already know — don't skip this step to focus on ads." },
      { q: "Do I need a website right away?", a: "Not necessarily. Many businesses get their first 10 clients without one. A LinkedIn profile or simple one-page site (Carrd, Squarespace — $10–$20/month) is enough to start. Focus on getting clients first, then invest in a professional website once you have revenue. A fancy website with no clients is just an expensive hobby." },
      { q: "What is a niche and do I really need one?", a: "A niche is a specific, defined market segment you focus on. Instead of 'bookkeeper,' you become 'bookkeeper for restaurants' or 'bookkeeper for creative freelancers.' Niching makes marketing easier, makes you more referable, and lets you charge more as a specialist. Being everything to everyone means being nothing to no one." },
      { q: "How do I ask for referrals without feeling awkward?", a: "Make it simple and specific: 'I'm looking to work with a few more clients like you — if you know any [type of business] owners who struggle with [problem], I'd love an introduction.' Most happy clients want to help but don't know you're looking. Ask once right after completing a successful project, when satisfaction is highest." },
      { q: "What's the difference between marketing and sales?", a: "Marketing creates awareness and interest (content, social media, ads, SEO). Sales converts that interest into paying customers (conversations, proposals, follow-ups, closing). Most small business owners are decent at one and ignore the other. Great marketing with no follow-through loses clients. Great sales with no marketing means you're always hustling." },
    ],
  },
  {
    id: "operations",
    icon: "◉",
    label: "Operations",
    color: "#6E9E6E",
    bg: "#080F08",
    desc: "Hiring, tools, time, processes",
    faqs: [
      { q: "When should I hire my first employee or contractor?", a: "Hire when: you're turning down work due to capacity, you're spending 20%+ of your time on tasks someone else could do for $20–$30/hr, or a skill gap is costing you clients. Start with a part-time contractor before a full employee — lower risk, more flexibility. Document your processes first so training is faster and results are consistent." },
      { q: "What tools do I actually need to run a small business?", a: "Essentials: accounting software (QuickBooks or Wave), invoicing tool, contract signing (DocuSign or HelloSign), and a calendar. Nice-to-have once you're growing: project management (Notion, Trello), CRM (HubSpot free), scheduling (Calendly), and email marketing (Mailchimp). Add tools only when a specific pain point exists — tool overload is real." },
      { q: "How do I manage time when I'm doing everything myself?", a: "Time-block your week: assign specific hours to client work, admin, marketing, and business development. Use the 'big 3' method — identify the 3 most important tasks each day and do those first. Batch similar tasks together. Protect your deep work hours. The biggest time thief for solo operators is constantly switching between tasks." },
      { q: "How do I handle a difficult customer?", a: "Stay calm and listen first — understand their concern before responding. Address the issue directly and professionally. Refer to your signed contract if they're asking for extras beyond scope. If a relationship is consistently draining, it's okay to professionally end it. One toxic client can consume time meant for five great ones — protect your capacity." },
      { q: "When is it time to raise prices?", a: "Raise prices when: you're fully booked, you've gained significant new skills or credentials, your results demonstrably improve client outcomes, or you haven't raised rates in 12+ months. Raise rates for new clients first, then gradually for existing ones with 60–90 days notice. Most service businesses leave significant money on the table by not raising prices annually." },
    ],
  },
  {
    id: "strategy",
    icon: "△",
    label: "Strategy & Growth",
    color: "#9B7EC8",
    bg: "#0D0A13",
    desc: "Vision, scaling, blind spots",
    faqs: [
      { q: "How do I know if my business idea is viable?", a: "The fastest test: can you get 3 people to pay you for it this week? Talk to 20 potential customers before building anything — ask about their problems, not your solution. Look for existing competition (competitors prove a market exists). Check Google Trends and Reddit for demand signals. A paying customer is the only real validation — everything else is theory." },
      { q: "Am I building a business or just a job?", a: "A job requires your personal presence to function — if you stop, revenue stops. A business has systems, processes, and eventually people that generate revenue without you doing everything. Most freelancers accidentally build a job. To transition: document your processes, build recurring revenue, and gradually hire. The goal is to work ON the business, not just IN it." },
      { q: "What is my customer acquisition cost (CAC) and why does it matter?", a: "CAC = total marketing and sales spend ÷ new customers acquired. If you spend $500/month on ads and get 5 clients, CAC = $100. Compare to customer lifetime value (LTV). If a client pays $200/month for 12 months, LTV = $2,400. LTV should be at least 3x CAC for a sustainable business. Not knowing this means you can't evaluate whether your marketing is working." },
      { q: "When should I quit my day job?", a: "A common framework: when your side business consistently generates 75–100% of your take-home salary for 3+ consecutive months AND you have 6 months of living expenses saved. Don't quit on potential or one good month. Financial pressure from quitting too early leads to taking bad clients and making desperate decisions that damage your reputation." },
      { q: "Do I need a business plan?", a: "Not a 30-page document, but yes to a one-pager covering: what you sell, who you sell to, how you find customers, your pricing, monthly costs, and revenue target. For a bank loan or investor, a formal plan is required. For a solo service business, a clear one-pager plus a 12-month financial projection is plenty and will force important clarity." },
    ],
  },
];

const SYSTEM_PROMPT = `You are a knowledgeable, practical small business advisor. You give clear, actionable advice to entrepreneurs and small business owners. Your answers are:
- Concise but complete (2-4 short paragraphs max)
- Practical and specific, not generic
- Honest about risks and tradeoffs
- Written in plain language without jargon
- Encouraging but realistic

Focus areas: finance, legal structure, marketing, operations, strategy, and mindset. When relevant, mention specific numbers, timelines, or tools. Always prioritize the most actionable insight first.`;

export default function SmallBizAdvisor() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("home"); // home | category | chat
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }]);
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

  const cat = activeCategory;

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav style={styles.nav}>
        <button onClick={goHome} style={styles.navLogo}>
          <span style={styles.logoMark}>◈</span>
          <span style={styles.logoText}>BizAdvisor</span>
        </button>
        <div style={styles.navLinks}>
          <button onClick={goHome} style={{...styles.navLink, ...(view==="home"?styles.navLinkActive:{})}}>Home</button>
          <button onClick={()=>setView("chat")} style={{...styles.navLink, ...(view==="chat"?styles.navLinkActive:{})}}>Ask AI</button>
        </div>
      </nav>

      {/* ══════════ HOME ══════════ */}
      {view === "home" && (
        <main style={styles.main}>
          {/* Hero */}
          <section style={styles.hero}>
            <div style={styles.heroBadge}>Small Business Intelligence</div>
            <h1 style={styles.heroTitle}>
              Every answer your<br />
              <span style={styles.heroAccent}>business needs.</span>
            </h1>
            <p style={styles.heroSub}>
              Browse expert guidance by topic, explore FAQs, or ask our AI advisor any business question — from taxes to scaling.
            </p>
            <div style={styles.heroActions}>
              <button onClick={() => openChat()} style={styles.btnPrimary} className="btn-primary">
                Ask the AI Advisor →
              </button>
              <button onClick={() => document.getElementById("categories").scrollIntoView({behavior:"smooth"})} style={styles.btnGhost}>
                Browse Topics
              </button>
            </div>
          </section>

          {/* Quick-fire questions */}
          <section style={styles.quickSection}>
            <p style={styles.quickLabel}>Popular questions →</p>
            <div style={styles.quickGrid}>
              {[
                "How do I price my services?",
                "Should I form an LLC?",
                "How do self-employment taxes work?",
                "When should I hire my first employee?",
                "How do I find my first clients?",
                "What's the difference between profit and cash flow?",
              ].map((q) => (
                <button key={q} onClick={() => openChat(q)} style={styles.quickChip} className="quick-chip">
                  {q}
                </button>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section id="categories" style={styles.catSection}>
            <h2 style={styles.sectionTitle}>Browse by Topic</h2>
            <div style={styles.catGrid}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => openCategory(c)} style={{...styles.catCard, background: c.bg, borderColor: c.color+"33"}} className="cat-card">
                  <span style={{...styles.catIcon, color: c.color}}>{c.icon}</span>
                  <span style={styles.catLabel}>{c.label}</span>
                  <span style={styles.catDesc}>{c.desc}</span>
                  <span style={{...styles.catCount, color: c.color}}>{c.faqs.length} FAQs</span>
                  <div style={{...styles.catGlow, background: c.color+"18"}} />
                </button>
              ))}
            </div>
          </section>

          {/* CTA strip */}
          <section style={styles.ctaStrip}>
            <div style={styles.ctaContent}>
              <span style={styles.ctaTitle}>Have a specific question?</span>
              <span style={styles.ctaSub}>Our AI advisor is trained on small business best practices</span>
            </div>
            <button onClick={() => openChat()} style={styles.btnPrimary} className="btn-primary">
              Ask Now →
            </button>
          </section>
        </main>
      )}

      {/* ══════════ CATEGORY ══════════ */}
      {view === "category" && cat && (
        <main style={styles.main}>
          <div style={styles.breadcrumb}>
            <button onClick={goHome} style={styles.breadLink}>Home</button>
            <span style={styles.breadSep}>/</span>
            <span style={{color: cat.color}}>{cat.label}</span>
          </div>

          <div style={styles.catHeader}>
            <span style={{...styles.catHeaderIcon, color: cat.color, borderColor: cat.color+"44", background: cat.bg}}>{cat.icon}</span>
            <div>
              <h1 style={styles.catHeaderTitle}>{cat.label}</h1>
              <p style={styles.catHeaderSub}>{cat.faqs.length} frequently asked questions</p>
            </div>
          </div>

          <div style={styles.faqList}>
            {cat.faqs.map((faq, i) => (
              <div
                key={i}
                style={{...styles.faqItem, borderColor: expandedFaq===i ? cat.color+"66" : "#ffffff15"}}
                className="faq-item"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  style={styles.faqQuestion}
                >
                  <span style={{...styles.faqNum, color: cat.color}}>0{i+1}</span>
                  <span style={styles.faqQText}>{faq.q}</span>
                  <span style={{...styles.faqChevron, transform: expandedFaq===i?"rotate(180deg)":"rotate(0deg)", color: cat.color}}>▾</span>
                </button>
                {expandedFaq === i && (
                  <div style={styles.faqAnswer}>
                    <p style={styles.faqAnswerText}>{faq.a}</p>
                    <button onClick={() => openChat(faq.q)} style={{...styles.faqFollowUp, color: cat.color, borderColor: cat.color+"44"}}>
                      Ask a follow-up question →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={styles.catFooter}>
            <p style={styles.catFooterText}>Don't see your question?</p>
            <button onClick={() => openChat()} style={styles.btnPrimary} className="btn-primary">
              Ask the AI Advisor →
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
                <div style={styles.chatName}>BizAdvisor AI</div>
                <div style={styles.chatStatus}>
                  <span style={styles.chatDot} />
                  Online · Small Business Expert
                </div>
              </div>
            </div>
            <div style={styles.chatTopics}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => openChat(c.faqs[0].q)} style={{...styles.topicPill, color: c.color, borderColor: c.color+"44", background: c.bg}} className="topic-pill">
                  {c.icon} {c.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.chatMessages}>
            {messages.length === 0 && (
              <div style={styles.chatEmpty}>
                <div style={styles.chatEmptyIcon}>◈</div>
                <h2 style={styles.chatEmptyTitle}>Ask me anything about running your business</h2>
                <p style={styles.chatEmptyDesc}>Finance, legal, marketing, operations, strategy — I've got you covered.</p>
                <div style={styles.chatSuggestions}>
                  {[
                    "How do I know if my business idea is viable?",
                    "What should I charge for my services?",
                    "Do I really need an LLC?",
                    "How do I handle a client who won't pay?",
                  ].map(s => (
                    <button key={s} onClick={() => sendMessage(s)} style={styles.suggestionBtn} className="suggestion-btn">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{...styles.msgRow, justifyContent: m.role === "user" ? "flex-end" : "flex-start"}}>
                {m.role === "assistant" && (
                  <div style={styles.msgAvatar}>◈</div>
                )}
                <div style={{
                  ...styles.msgBubble,
                  ...(m.role === "user" ? styles.msgUser : styles.msgAssistant)
                }}>
                  {m.content.split("\n").map((line, li) => (
                    <span key={li}>{line}{li < m.content.split("\n").length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{...styles.msgRow, justifyContent: "flex-start"}}>
                <div style={styles.msgAvatar}>◈</div>
                <div style={{...styles.msgBubble, ...styles.msgAssistant, ...styles.msgLoading}}>
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
              ref={inputRef}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask any small business question..."
              style={styles.chatInput}
              className="chat-input"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !chatInput.trim()}
              style={{...styles.sendBtn, opacity: loading || !chatInput.trim() ? 0.4 : 1}}
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
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  logoMark: { fontSize: 22, color: "#D4A843" },
  logoText: { fontSize: 18, fontWeight: "700", color: "#E8E4DC", letterSpacing: "-0.5px" },
  navLinks: { display: "flex", gap: 4 },
  navLink: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: 14,
    cursor: "pointer",
    padding: "6px 14px",
    borderRadius: 6,
    fontFamily: "inherit",
    transition: "color 0.2s",
  },
  navLinkActive: { color: "#E8E4DC", background: "#ffffff0f" },

  main: { flex: 1, maxWidth: 860, margin: "0 auto", width: "100%", padding: "0 24px 60px" },

  // ── HERO
  hero: { padding: "64px 0 40px", textAlign: "center" },
  heroBadge: {
    display: "inline-block",
    fontSize: 11,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#D4A843",
    border: "1px solid #D4A84344",
    borderRadius: 20,
    padding: "5px 14px",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: "clamp(36px, 6vw, 56px)",
    fontWeight: "400",
    lineHeight: 1.15,
    margin: "0 0 16px",
    letterSpacing: "-1px",
    color: "#E8E4DC",
  },
  heroAccent: { color: "#D4A843", fontStyle: "italic" },
  heroSub: { fontSize: 17, color: "#888", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.6 },
  heroActions: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  btnPrimary: {
    background: "#D4A843",
    color: "#0C0C0F",
    border: "none",
    borderRadius: 8,
    padding: "13px 24px",
    fontSize: 15,
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "-0.3px",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  btnGhost: {
    background: "transparent",
    color: "#E8E4DC",
    border: "1px solid #ffffff22",
    borderRadius: 8,
    padding: "13px 24px",
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "inherit",
  },

  // ── QUICK
  quickSection: { padding: "8px 0 40px", borderBottom: "1px solid #ffffff0a" },
  quickLabel: { fontSize: 12, color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 },
  quickGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  quickChip: {
    background: "#161618",
    border: "1px solid #ffffff15",
    color: "#C0B89A",
    borderRadius: 20,
    padding: "8px 15px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "border-color 0.2s, color 0.2s",
  },

  // ── CATEGORIES
  catSection: { padding: "48px 0" },
  sectionTitle: { fontSize: 28, fontWeight: "400", marginBottom: 28, letterSpacing: "-0.5px" },
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 12,
  },
  catCard: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
    padding: "24px",
    border: "1px solid",
    borderRadius: 12,
    cursor: "pointer",
    textAlign: "left",
    transition: "transform 0.2s, border-color 0.2s",
    fontFamily: "inherit",
  },
  catIcon: { fontSize: 28, marginBottom: 4, display: "block" },
  catLabel: { fontSize: 16, fontWeight: "700", color: "#E8E4DC" },
  catDesc: { fontSize: 13, color: "#666", lineHeight: 1.4 },
  catCount: { fontSize: 12, marginTop: 4, fontWeight: "600" },
  catGlow: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    transition: "opacity 0.3s",
    pointerEvents: "none",
    borderRadius: 12,
  },

  // ── CTA
  ctaStrip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    padding: "28px 32px",
    background: "#161618",
    border: "1px solid #D4A84322",
    borderRadius: 14,
    flexWrap: "wrap",
  },
  ctaContent: { display: "flex", flexDirection: "column", gap: 4 },
  ctaTitle: { fontSize: 18, fontWeight: "700", color: "#E8E4DC" },
  ctaSub: { fontSize: 14, color: "#666" },

  // ── BREADCRUMB
  breadcrumb: { display: "flex", alignItems: "center", gap: 8, padding: "28px 0 16px", fontSize: 14, color: "#555" },
  breadLink: { background: "none", border: "none", color: "#888", cursor: "pointer", fontFamily: "inherit", fontSize: 14, padding: 0 },
  breadSep: { color: "#333" },

  // ── CAT HEADER
  catHeader: { display: "flex", alignItems: "center", gap: 20, marginBottom: 36, paddingBottom: 28, borderBottom: "1px solid #ffffff0f" },
  catHeaderIcon: {
    fontSize: 32,
    width: 64,
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid",
    borderRadius: 14,
    flexShrink: 0,
  },
  catHeaderTitle: { fontSize: 32, fontWeight: "400", margin: 0, letterSpacing: "-0.5px" },
  catHeaderSub: { fontSize: 14, color: "#555", margin: "4px 0 0" },

  // ── FAQ
  faqList: { display: "flex", flexDirection: "column", gap: 8 },
  faqItem: {
    border: "1px solid",
    borderRadius: 10,
    overflow: "hidden",
    background: "#0F0F12",
    transition: "border-color 0.2s",
  },
  faqQuestion: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "18px 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    color: "#E8E4DC",
  },
  faqNum: { fontSize: 12, fontWeight: "700", letterSpacing: "1px", flexShrink: 0, marginTop: 2, minWidth: 24 },
  faqQText: { flex: 1, fontSize: 15, lineHeight: 1.5, color: "#D8D0C4" },
  faqChevron: { fontSize: 18, flexShrink: 0, transition: "transform 0.25s", marginLeft: 8 },
  faqAnswer: { padding: "0 20px 20px 56px" },
  faqAnswerText: { fontSize: 14, lineHeight: 1.75, color: "#999", margin: "0 0 14px" },
  faqFollowUp: {
    background: "none",
    border: "1px solid",
    borderRadius: 6,
    padding: "7px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s",
  },

  catFooter: { textAlign: "center", padding: "48px 0 0" },
  catFooterText: { fontSize: 16, color: "#555", marginBottom: 16 },

  // ── CHAT
  chatMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: 800,
    margin: "0 auto",
    width: "100%",
    height: "calc(100vh - 61px)",
  },
  chatHeader: {
    padding: "16px 24px",
    borderBottom: "1px solid #ffffff10",
    background: "#0F0F12",
  },
  chatHeaderLeft: { display: "flex", alignItems: "center", gap: 14, marginBottom: 12 },
  chatAvatar: {
    width: 40, height: 40,
    background: "#D4A84322",
    border: "1px solid #D4A84344",
    borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, color: "#D4A843",
    flexShrink: 0,
  },
  chatName: { fontSize: 16, fontWeight: "700", color: "#E8E4DC" },
  chatStatus: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" },
  chatDot: { width: 7, height: 7, borderRadius: "50%", background: "#4CAF50", display: "inline-block" },
  chatTopics: { display: "flex", gap: 6, flexWrap: "wrap" },
  topicPill: {
    fontSize: 12,
    padding: "4px 11px",
    border: "1px solid",
    borderRadius: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    background: "transparent",
    transition: "opacity 0.2s",
  },
  chatMessages: { flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 },
  chatEmpty: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "60px 20px 0" },
  chatEmptyIcon: { fontSize: 40, color: "#D4A843", marginBottom: 20, opacity: 0.6 },
  chatEmptyTitle: { fontSize: 22, fontWeight: "400", margin: "0 0 10px", letterSpacing: "-0.3px" },
  chatEmptyDesc: { fontSize: 15, color: "#555", marginBottom: 28 },
  chatSuggestions: { display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 460 },
  suggestionBtn: {
    background: "#161618",
    border: "1px solid #ffffff15",
    color: "#C0B89A",
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "border-color 0.2s",
  },
  msgRow: { display: "flex", alignItems: "flex-end", gap: 10 },
  msgAvatar: {
    width: 32, height: 32,
    background: "#D4A84318",
    border: "1px solid #D4A84330",
    borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, color: "#D4A843",
    flexShrink: 0,
  },
  msgBubble: {
    maxWidth: "76%",
    padding: "13px 17px",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.7,
  },
  msgUser: {
    background: "#D4A843",
    color: "#0C0C0F",
    borderBottomRightRadius: 4,
    fontWeight: "500",
  },
  msgAssistant: {
    background: "#161618",
    color: "#C8C0B2",
    border: "1px solid #ffffff0f",
    borderBottomLeftRadius: 4,
  },
  msgLoading: { display: "flex", gap: 5, alignItems: "center", padding: "14px 18px" },
  dot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "#D4A843",
    display: "inline-block",
    opacity: 0.4,
    animation: "pulse 1.2s ease-in-out infinite",
  },
  chatInputRow: {
    display: "flex",
    gap: 8,
    padding: "16px 24px",
    borderTop: "1px solid #ffffff10",
    background: "#0C0C0F",
  },
  chatInput: {
    flex: 1,
    background: "#161618",
    border: "1px solid #ffffff18",
    color: "#E8E4DC",
    borderRadius: 10,
    padding: "13px 16px",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  },
  sendBtn: {
    width: 46, height: 46,
    background: "#D4A843",
    color: "#0C0C0F",
    border: "none",
    borderRadius: 10,
    fontSize: 20,
    fontWeight: "700",
    cursor: "pointer",
    flexShrink: 0,
    transition: "transform 0.15s",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};

// ─── CSS ───────────────────────────────────────────────────
const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px #D4A84344; }
  .cat-card:hover { transform: translateY(-2px); border-color: currentColor !important; }
  .cat-card:hover .catGlow { opacity: 1 !important; }
  .quick-chip:hover { border-color: #D4A84366; color: #E8E4DC; }
  .faq-item:hover { border-color: #ffffff25 !important; }
  .topic-pill:hover { opacity: 0.75; }
  .suggestion-btn:hover { border-color: #D4A84355; }
  .chat-input:focus { border-color: #D4A84355; }
  .send-btn:hover:not(:disabled) { transform: scale(1.05); }
  @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
  .dot-1{animation-delay:0s} .dot-2{animation-delay:0.2s} .dot-3{animation-delay:0.4s}
`;