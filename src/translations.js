// translations.js — English & Spanish content for BizAdvisor

export const translations = {
    en: {
      // ── Nav & Global ──
      appName: "BizAdvisor",
      nav: { home: "Home", askAI: "Ask AI" },
  
      // ── Hero ──
      hero: {
        badge: "Small Business Intelligence",
        title1: "Every answer your",
        title2: "business needs.",
        sub: "Browse expert guidance by topic, explore FAQs, or ask our AI advisor any business question — from taxes to scaling.",
        btnAI: "Ask the AI Advisor →",
        btnBrowse: "Browse Topics",
      },
  
      // ── Quick Questions ──
      popularLabel: "Popular questions →",
      popularQuestions: [
        "How do I price my services?",
        "Should I form an LLC?",
        "How do self-employment taxes work?",
        "When should I hire my first employee?",
        "How do I find my first clients?",
        "What's the difference between profit and cash flow?",
      ],
  
      // ── Sections ──
      browseTitle: "Browse by Topic",
      faqCount: (n) => `${n} FAQs`,
      followUp: "Ask a follow-up question →",
      noQuestion: "Don't see your question?",
      askAdvisor: "Ask the AI Advisor →",
  
      // ── CTA Strip ──
      ctaTitle: "Have a specific question?",
      ctaSub: "Our AI advisor is trained on small business best practices",
      ctaBtn: "Ask Now →",
  
      // ── Breadcrumb ──
      breadHome: "Home",
  
      // ── Chat ──
      chat: {
        name: "BizAdvisor AI",
        status: "Online · Small Business Expert",
        emptyTitle: "Ask me anything about running your business",
        emptyDesc: "Finance, legal, marketing, operations, strategy — I've got you covered.",
        placeholder: "Ask any small business question...",
        suggestions: [
          "How do I know if my business idea is viable?",
          "What should I charge for my services?",
          "Do I really need an LLC?",
          "How do I handle a client who won't pay?",
        ],
        systemPrompt: `You are a knowledgeable, practical small business advisor. You give clear, actionable advice to entrepreneurs and small business owners. Your answers are concise but complete (2-4 short paragraphs max), practical and specific, honest about risks and tradeoffs, written in plain language without jargon, and encouraging but realistic. Focus areas: finance, legal structure, marketing, operations, strategy, and mindset. Always prioritize the most actionable insight first. Respond in English.`,
      },
  
      // ── Categories ──
      categories: [
        {
          id: "finance",
          icon: "◈",
          label: "Finance & Money",
          color: "#D4A843",
          bg: "#1A140A",
          desc: "Pricing, cash flow, taxes, profit",
          faqs: [
            {
              q: "How much money do I need to start my business?",
              a: "Service businesses (bookkeeping, consulting) can launch under $500. Product businesses typically need $2,000–$10,000+ for inventory and setup. List every expense for your first 90 days and add a 20% buffer for surprises. The key is knowing your break-even point before you spend anything.",
            },
            {
              q: "What's the difference between revenue, profit, and cash flow?",
              a: "Revenue = total money coming in. Profit = revenue minus all expenses. Cash flow = the actual timing of money moving in and out of your account. A business can be profitable on paper but cash-flow negative if clients pay late. This is why profitable businesses sometimes run out of money.",
            },
            {
              q: "How do self-employment taxes work?",
              a: "Self-employed individuals pay both the employee AND employer portions of Social Security and Medicare — totaling 15.3% on net income, plus federal income tax. Set aside 25–30% of every payment you receive into a dedicated savings account. Pay quarterly estimated taxes (April, June, September, January) to avoid IRS penalties.",
            },
            {
              q: "How do I price my service or product?",
              a: "Calculate all costs (materials, time, overhead, software) then add your desired margin. Research what competitors charge. Consider value-based pricing — what is the result worth to your client? Most beginners underprice. If you're fully booked, that's a signal to raise prices. Review pricing every 6 months.",
            },
            {
              q: "What business expenses can I deduct?",
              a: "Common deductions include: home office, business software, phone/internet (business portion), equipment, professional development, advertising, business meals (50%), vehicle use, and professional services. Keep receipts for everything. A good accounting system pays for itself in tax savings alone.",
            },
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
            {
              q: "Should I form an LLC?",
              a: "For most small businesses: yes. An LLC costs $50–$500 to form and protects your personal assets (house, car, savings) from business debts and lawsuits. A sole proprietorship is simpler but leaves you personally liable. Form the LLC before you start taking on clients. It also adds credibility.",
            },
            {
              q: "What's the difference between LLC and S-Corp?",
              a: "An LLC is a legal structure. An S-Corp is a tax election you can apply to an LLC. The S-Corp advantage: you pay yourself a reasonable salary and take remaining profit as distributions — distributions avoid the 15.3% self-employment tax. This strategy typically saves money when your net profit exceeds ~$60,000/year.",
            },
            {
              q: "What contracts do I actually need?",
              a: "At minimum: a client service agreement (scope, payment, deadlines, cancellation policy) for every client. If you hire help: an independent contractor agreement. For sensitive business info: an NDA. Simple, plain-language templates work fine — you don't need a lawyer for basic contracts. Get every agreement signed before starting work.",
            },
            {
              q: "What insurance does a small business need?",
              a: "General liability ($500–$1,500/year) covers property damage or injury claims. Professional liability / E&O ($500–$2,000/year) covers mistakes in your professional services — essential for bookkeepers, consultants, and designers. If you have employees, workers' comp is required in most states. Start with general liability at minimum.",
            },
            {
              q: "Do I need a business license?",
              a: "Most cities and counties require a general business license ($25–$100/year). Some industries require additional licenses (contractors, food service, healthcare, financial services). Check your city/county website and your state's business portal. If working from home, also check local zoning laws.",
            },
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
            {
              q: "How do I find my first customers?",
              a: "Your personal network is your fastest path. Tell everyone you know what you do and who you help. Post on LinkedIn and local Facebook groups. Offer a discounted or free first project to get a testimonial. Ask satisfied clients for referrals. Most first clients come from people you already know — don't skip this step to focus on ads.",
            },
            {
              q: "Do I need a website right away?",
              a: "Not necessarily. Many businesses get their first 10 clients without one. A LinkedIn profile or simple one-page site (Carrd, Squarespace — $10–$20/month) is enough to start. Focus on getting clients first, then invest in a professional website once you have revenue.",
            },
            {
              q: "What is a niche and do I really need one?",
              a: "A niche is a specific, defined market segment you focus on. Instead of 'bookkeeper,' you become 'bookkeeper for restaurants.' Niching makes marketing easier, makes you more referable, and lets you charge more as a specialist. Being everything to everyone means being nothing to no one.",
            },
            {
              q: "How do I ask for referrals without feeling awkward?",
              a: "Make it simple and specific: 'I'm looking to work with a few more clients like you — if you know any business owners who struggle with [problem], I'd love an introduction.' Most happy clients want to help but don't know you're looking. Ask once right after completing a successful project.",
            },
            {
              q: "What's the difference between marketing and sales?",
              a: "Marketing creates awareness and interest (content, social media, ads, SEO). Sales converts that interest into paying customers (conversations, proposals, follow-ups, closing). Most small business owners are decent at one and ignore the other. You need both.",
            },
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
            {
              q: "When should I hire my first employee or contractor?",
              a: "Hire when: you're turning down work due to capacity, you're spending 20%+ of your time on tasks someone else could do for $20–$30/hr, or a skill gap is costing you clients. Start with a part-time contractor before a full employee — lower risk, more flexibility.",
            },
            {
              q: "What tools do I actually need to run a small business?",
              a: "Essentials: accounting software (QuickBooks or Wave), invoicing tool, contract signing (DocuSign), and a calendar. Nice-to-have once you're growing: project management (Notion, Trello), CRM (HubSpot free), and scheduling (Calendly). Add tools only when a specific pain point exists.",
            },
            {
              q: "How do I manage time when I'm doing everything myself?",
              a: "Time-block your week: assign specific hours to client work, admin, marketing, and business development. Use the 'big 3' method — identify the 3 most important tasks each day and do those first. Batch similar tasks together. The biggest time thief for solo operators is constantly switching between tasks.",
            },
            {
              q: "How do I handle a difficult customer?",
              a: "Stay calm and listen first. Address the issue directly and professionally. Refer to your signed contract if they're asking for extras beyond scope. If a relationship is consistently draining, it's okay to professionally end it. One toxic client can consume time meant for five great ones.",
            },
            {
              q: "When is it time to raise prices?",
              a: "Raise prices when: you're fully booked, you've gained significant new skills or credentials, your results demonstrably improve client outcomes, or you haven't raised rates in 12+ months. Raise rates for new clients first, then gradually for existing ones with 60–90 days notice.",
            },
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
            {
              q: "How do I know if my business idea is viable?",
              a: "The fastest test: can you get 3 people to pay you for it this week? Talk to 20 potential customers before building anything. Look for existing competition (competitors prove a market exists). A paying customer is the only real validation — everything else is theory.",
            },
            {
              q: "Am I building a business or just a job?",
              a: "A job requires your personal presence to function — if you stop, revenue stops. A business has systems, processes, and eventually people that generate revenue without you doing everything. Most freelancers accidentally build a job. Build recurring revenue and document your processes to transition.",
            },
            {
              q: "What is customer acquisition cost (CAC) and why does it matter?",
              a: "CAC = total marketing and sales spend ÷ new customers acquired. Compare to customer lifetime value (LTV). LTV should be at least 3x CAC for a sustainable business. Not knowing this means you can't evaluate whether your marketing is actually working.",
            },
            {
              q: "When should I quit my day job?",
              a: "When your side business consistently generates 75–100% of your take-home salary for 3+ consecutive months AND you have 6 months of living expenses saved. Don't quit on potential or one good month. Financial pressure from quitting too early leads to bad decisions.",
            },
            {
              q: "Do I need a business plan?",
              a: "Not a 30-page document, but yes to a one-pager covering: what you sell, who you sell to, how you find customers, your pricing, monthly costs, and revenue target. For a bank loan or investor, a formal plan is required. For a solo service business, a clear one-pager is plenty.",
            },
          ],
        },
      ],
    },
  
    // ════════════════════════════════════════════════════════
    // SPANISH
    // ════════════════════════════════════════════════════════
    es: {
      appName: "BizAdvisor",
      nav: { home: "Inicio", askAI: "Preguntar a IA" },
  
      hero: {
        badge: "Inteligencia para Pequeños Negocios",
        title1: "Cada respuesta que tu",
        title2: "negocio necesita.",
        sub: "Explora guías por tema, revisa preguntas frecuentes o consulta a nuestro asesor de IA cualquier pregunta de negocios — desde impuestos hasta crecimiento.",
        btnAI: "Consultar al Asesor IA →",
        btnBrowse: "Explorar Temas",
      },
  
      popularLabel: "Preguntas populares →",
      popularQuestions: [
        "¿Cómo fijo el precio de mis servicios?",
        "¿Debo formar una LLC?",
        "¿Cómo funcionan los impuestos por cuenta propia?",
        "¿Cuándo debo contratar a mi primer empleado?",
        "¿Cómo encuentro mis primeros clientes?",
        "¿Cuál es la diferencia entre ganancia y flujo de caja?",
      ],
  
      browseTitle: "Explorar por Tema",
      faqCount: (n) => `${n} Preguntas`,
      followUp: "Hacer una pregunta de seguimiento →",
      noQuestion: "¿No encuentras tu pregunta?",
      askAdvisor: "Consultar al Asesor IA →",
  
      ctaTitle: "¿Tienes una pregunta específica?",
      ctaSub: "Nuestro asesor de IA está entrenado en mejores prácticas para pequeños negocios",
      ctaBtn: "Preguntar Ahora →",
  
      breadHome: "Inicio",
  
      chat: {
        name: "BizAdvisor IA",
        status: "En línea · Experto en Pequeños Negocios",
        emptyTitle: "Pregúntame cualquier cosa sobre tu negocio",
        emptyDesc: "Finanzas, legal, marketing, operaciones, estrategia — estoy aquí para ayudarte.",
        placeholder: "Haz cualquier pregunta sobre tu negocio...",
        suggestions: [
          "¿Cómo sé si mi idea de negocio es viable?",
          "¿Cuánto debo cobrar por mis servicios?",
          "¿Realmente necesito una LLC?",
          "¿Cómo manejo a un cliente que no paga?",
        ],
        systemPrompt: `Eres un asesor de negocios práctico y experto. Das consejos claros y accionables a emprendedores y dueños de pequeños negocios. Tus respuestas son concisas pero completas (máximo 2-4 párrafos cortos), prácticas y específicas, honestas sobre riesgos, en lenguaje sencillo sin jerga técnica, y alentadoras pero realistas. Áreas de enfoque: finanzas, estructura legal, marketing, operaciones, estrategia y mentalidad. Prioriza siempre el consejo más accionable primero. Responde siempre en español.`,
      },
  
      categories: [
        {
          id: "finance",
          icon: "◈",
          label: "Finanzas y Dinero",
          color: "#D4A843",
          bg: "#1A140A",
          desc: "Precios, flujo de caja, impuestos, ganancia",
          faqs: [
            {
              q: "¿Cuánto dinero necesito para iniciar mi negocio?",
              a: "Los negocios de servicios (contabilidad, consultoría) pueden lanzarse con menos de $500. Los negocios de productos típicamente necesitan $2,000–$10,000+ para inventario y configuración. Haz una lista de cada gasto para tus primeros 90 días y agrega un 20% de margen para imprevistos. Lo clave es conocer tu punto de equilibrio antes de gastar.",
            },
            {
              q: "¿Cuál es la diferencia entre ingresos, ganancia y flujo de caja?",
              a: "Ingresos = dinero total que entra. Ganancia = ingresos menos todos los gastos. Flujo de caja = el momento real en que el dinero entra y sale de tu cuenta. Un negocio puede ser rentable en papel pero tener flujo de caja negativo si los clientes pagan tarde. Por eso negocios rentables a veces se quedan sin dinero.",
            },
            {
              q: "¿Cómo funcionan los impuestos por cuenta propia?",
              a: "Los trabajadores por cuenta propia pagan tanto la parte del empleado como la del empleador del Seguro Social y Medicare — un total del 15.3% sobre los ingresos netos, más el impuesto federal sobre la renta. Aparta el 25–30% de cada pago en una cuenta de ahorros dedicada. Paga impuestos estimados trimestralmente para evitar multas del IRS.",
            },
            {
              q: "¿Cómo fijo el precio de mi servicio o producto?",
              a: "Calcula todos tus costos (materiales, tiempo, gastos generales, software) y luego agrega tu margen de ganancia deseado. Investiga lo que cobran los competidores. Considera precios basados en valor — ¿cuánto vale el resultado para tu cliente? La mayoría de los principiantes cobran de menos. Si estás completamente ocupado, es señal de subir precios.",
            },
            {
              q: "¿Qué gastos de negocio puedo deducir?",
              a: "Deducciones comunes: oficina en casa, software empresarial, teléfono/internet (porción de negocio), equipo, desarrollo profesional, publicidad, comidas de negocio (50%), uso del vehículo y servicios profesionales. Guarda recibos de todo. Un buen sistema contable se paga solo con el ahorro en impuestos.",
            },
          ],
        },
        {
          id: "legal",
          icon: "⬡",
          label: "Legal y Estructura",
          color: "#5B8FA8",
          bg: "#080F13",
          desc: "LLC, contratos, licencias, protección",
          faqs: [
            {
              q: "¿Debo formar una LLC?",
              a: "Para la mayoría de los pequeños negocios: sí. Una LLC cuesta $50–$500 para formarse y protege tus activos personales (casa, auto, ahorros) de deudas y demandas del negocio. Una empresa unipersonal es más simple pero te deja personalmente responsable. Forma la LLC antes de empezar a trabajar con clientes.",
            },
            {
              q: "¿Cuál es la diferencia entre LLC y S-Corp?",
              a: "Una LLC es una estructura legal. Una S-Corp es una elección tributaria que puedes aplicar a una LLC. La ventaja de S-Corp: te pagas un salario razonable y tomas la ganancia restante como distribuciones — las distribuciones evitan el impuesto de trabajo por cuenta propia del 15.3%. Esto ahorra dinero cuando tu ganancia neta supera ~$60,000/año.",
            },
            {
              q: "¿Qué contratos realmente necesito?",
              a: "Como mínimo: un acuerdo de servicios al cliente (alcance, pago, plazos, política de cancelación) para cada cliente. Si contratas ayuda: un acuerdo de contratista independiente. Para información confidencial: un NDA. Las plantillas simples en lenguaje claro funcionan bien — no necesitas un abogado para contratos básicos.",
            },
            {
              q: "¿Qué seguros necesita un pequeño negocio?",
              a: "Responsabilidad general ($500–$1,500/año) cubre daños a la propiedad o lesiones. Responsabilidad profesional ($500–$2,000/año) cubre errores en tus servicios — esencial para contadores, consultores y diseñadores. Si tienes empleados, la compensación laboral es obligatoria en la mayoría de los estados.",
            },
            {
              q: "¿Necesito una licencia comercial?",
              a: "La mayoría de las ciudades y condados requieren una licencia comercial general ($25–$100/año). Algunas industrias requieren licencias adicionales (contratistas, servicio de alimentos, salud). Consulta el sitio web de tu ciudad/condado y el portal estatal de negocios. Si trabajas desde casa, también verifica las leyes de zonificación local.",
            },
          ],
        },
        {
          id: "marketing",
          icon: "◇",
          label: "Marketing y Ventas",
          color: "#C46A4E",
          bg: "#130A08",
          desc: "Clientes, referencias, presencia en línea",
          faqs: [
            {
              q: "¿Cómo encuentro mis primeros clientes?",
              a: "Tu red personal es el camino más rápido. Cuéntale a todos lo que haces y a quién ayudas. Publica en LinkedIn y grupos locales de Facebook. Ofrece un primer proyecto con descuento o gratis para obtener un testimonio. Pide referencias a clientes satisfechos. La mayoría de los primeros clientes vienen de personas que ya conoces.",
            },
            {
              q: "¿Necesito un sitio web de inmediato?",
              a: "No necesariamente. Muchos negocios obtienen sus primeros 10 clientes sin uno. Un perfil de LinkedIn o un sitio sencillo de una página (Carrd, Squarespace — $10–$20/mes) es suficiente para empezar. Enfócate en conseguir clientes primero, luego invierte en un sitio profesional cuando tengas ingresos.",
            },
            {
              q: "¿Qué es un nicho y realmente lo necesito?",
              a: "Un nicho es un segmento de mercado específico en el que te enfocas. En lugar de 'contador,' te conviertes en 'contador para restaurantes.' El nicho hace el marketing más fácil, te hace más recomendable y te permite cobrar más como especialista. Tratar de servir a todos significa no ser nada para nadie.",
            },
            {
              q: "¿Cómo pido referencias sin sentirme incómodo?",
              a: "Hazlo simple y específico: 'Busco trabajar con más clientes como tú — si conoces a dueños de negocios que tengan problemas con [problema], me encantaría una presentación.' La mayoría de los clientes satisfechos quieren ayudar pero no saben que estás buscando. Pregunta justo después de completar un proyecto exitoso.",
            },
            {
              q: "¿Cuál es la diferencia entre marketing y ventas?",
              a: "El marketing crea conciencia e interés (contenido, redes sociales, anuncios, SEO). Las ventas convierten ese interés en clientes que pagan (conversaciones, propuestas, seguimientos, cierre). La mayoría de los dueños de pequeños negocios son buenos en uno e ignoran el otro. Necesitas ambos.",
            },
          ],
        },
        {
          id: "operations",
          icon: "◉",
          label: "Operaciones",
          color: "#6E9E6E",
          bg: "#080F08",
          desc: "Contratación, herramientas, tiempo, procesos",
          faqs: [
            {
              q: "¿Cuándo debo contratar a mi primer empleado o contratista?",
              a: "Contrata cuando: estás rechazando trabajo por falta de capacidad, pasas más del 20% de tu tiempo en tareas que alguien más podría hacer por $20–$30/hr, o una brecha de habilidades te está costando clientes. Empieza con un contratista de medio tiempo antes que un empleado completo — menor riesgo, más flexibilidad.",
            },
            {
              q: "¿Qué herramientas realmente necesito para manejar un pequeño negocio?",
              a: "Esenciales: software de contabilidad (QuickBooks o Wave), herramienta de facturación, firma de contratos (DocuSign) y un calendario. Útiles cuando estás creciendo: gestión de proyectos (Notion, Trello), CRM (HubSpot gratuito) y programación de citas (Calendly). Agrega herramientas solo cuando exista un problema específico.",
            },
            {
              q: "¿Cómo administro el tiempo cuando lo hago todo yo mismo?",
              a: "Bloquea tu semana en horarios: asigna horas específicas para trabajo con clientes, administración, marketing y desarrollo de negocios. Usa el método de 'los 3 grandes' — identifica las 3 tareas más importantes del día y hazlas primero. Agrupa tareas similares. El mayor ladrón de tiempo para operadores independientes es cambiar constantemente entre tareas.",
            },
            {
              q: "¿Cómo manejo a un cliente difícil?",
              a: "Mantén la calma y escucha primero. Aborda el problema directamente y profesionalmente. Consulta tu contrato firmado si piden extras fuera del alcance. Si una relación es constantemente agotadora, está bien terminarla profesionalmente. Un cliente tóxico puede consumir el tiempo destinado a cinco clientes excelentes.",
            },
            {
              q: "¿Cuándo es momento de subir los precios?",
              a: "Sube precios cuando: estás completamente ocupado, has adquirido nuevas habilidades importantes, tus resultados mejoran demostrablemente los resultados del cliente, o no has subido tarifas en 12+ meses. Sube tarifas para nuevos clientes primero, luego gradualmente para los existentes con 60–90 días de aviso.",
            },
          ],
        },
        {
          id: "strategy",
          icon: "△",
          label: "Estrategia y Crecimiento",
          color: "#9B7EC8",
          bg: "#0D0A13",
          desc: "Visión, escalado, puntos ciegos",
          faqs: [
            {
              q: "¿Cómo sé si mi idea de negocio es viable?",
              a: "La prueba más rápida: ¿puedes conseguir que 3 personas te paguen por ello esta semana? Habla con 20 clientes potenciales antes de construir cualquier cosa. Busca competencia existente (los competidores prueban que hay mercado). Un cliente que paga es la única validación real — todo lo demás es teoría.",
            },
            {
              q: "¿Estoy construyendo un negocio o solo un empleo?",
              a: "Un empleo requiere tu presencia personal para funcionar — si paras, los ingresos paran. Un negocio tiene sistemas, procesos y eventualmente personas que generan ingresos sin que hagas todo tú. La mayoría de los freelancers accidentalmente construyen un empleo. Construye ingresos recurrentes y documenta tus procesos para hacer la transición.",
            },
            {
              q: "¿Qué es el costo de adquisición de clientes (CAC)?",
              a: "CAC = gasto total en marketing y ventas ÷ nuevos clientes adquiridos. Compara con el valor de vida del cliente (LTV). El LTV debe ser al menos 3 veces el CAC para un negocio sostenible. No saber esto significa que no puedes evaluar si tu marketing realmente está funcionando.",
            },
            {
              q: "¿Cuándo debo dejar mi trabajo de tiempo completo?",
              a: "Cuando tu negocio secundario genere consistentemente el 75–100% de tu salario neto durante 3+ meses consecutivos Y tengas 6 meses de gastos de vida ahorrados. No renuncies por potencial o un buen mes. La presión financiera de renunciar demasiado pronto lleva a malas decisiones.",
            },
            {
              q: "¿Necesito un plan de negocios?",
              a: "No un documento de 30 páginas, pero sí una página que cubra: qué vendes, a quién le vendes, cómo encuentras clientes, tus precios, costos mensuales y meta de ingresos. Para un préstamo bancario o inversionista, se requiere un plan formal. Para un negocio de servicios independiente, una página clara es suficiente.",
            },
          ],
        },
      ],
    },
  };