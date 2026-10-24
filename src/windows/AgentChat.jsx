import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, ShieldCheck, Zap, Terminal, Sparkles, RefreshCw, Cpu, Layers } from 'lucide-react'

const KNOWLEDGE_BASE = [
    {
        keywords: ['who', 'about', 'kishor', 'intro', 'summary', 'profile', 'role'],
        answer: `**Kishor Kumar Paroi** is a **Principal AI Systems Architect** and **Enterprise Platform Leader** with deep expertise spanning:
• **Agentic AI & LLMOps:** Cyclic state machines (LangGraph), FastMCP tool calling, Portkey, semantic caching, and NVIDIA NeMo Guardrails.
• **High-Performance Distributed Systems:** Polyglot microservices in Rust 1.85 SIMD, Go 1.24, and Python, cutting scoring latency to <0.5ms.
• **Big Data & Medallion Lakehouses:** Apache Spark, Delta Lake, Snowflake, dbt Core SCD-2, and Feast Feature Stores handling 35M+ records.
• **Founder @ KoomAI:** Ultra low-latency WebRTC (<120ms) screen recorder, Electron client, MV3 Chrome Extension, and Next.js 16 cockpit.
• **Education & Achievements:** B.Sc. in CSE from RUET (Rank 483rd in Bangladesh); Codeforces Div-2 Rank 232 (Blue Coder), 5★ CodeChef, 2000+ DSA, system design hackathon participant.`,
    },
    {
        keywords: ['phi0', 'phi0.ai', 'rag', 'forward deployed'],
        answer: `**Forward Deployed AI Engineer @ phi0.ai (July 2026 – Oct 2026 • Europe | Remote):**
• Orchestrated forward deployment of **5 concurrent autonomous AI agents** executing multi-step tools via **LangGraph**, attaining **99.4% task completion** under enterprise workloads (4x faster client onboarding).
• Devised high-throughput **Hybrid RAG engine** combining dense HNSW vector search, sparse BM25, and multi-stage re-ranking (**FlashRank ONNX + Cohere v3.5**) under **<35ms semantic cache**; curtailed hallucinations by **46%** and saved **$18K/month**.
• Codified continuous **MLOps & GenAI flywheel** with NeMo Guardrails, automated PII scrubbing, and canary K8s deployments, securing **$1.4M in enterprise client contracts**.`,
    },
    {
        keywords: ['samsung', 'care health', 'insurance', 'h100', 'gpu'],
        answer: `**Data Engineering & AI Systems Intern @ Samsung AI Core / Care Health (Mar 2026 – Jun 2026):**
• Formulated batch & streaming pipelines via **AWS S3, EMR, Athena, PySpark**; slashed compute overhead by **$4.2K/run (34% savings)** via asynchronous Lambda/SQS worker dispatch.
• Accelerated 8B/70B LLM inference on **NVIDIA H100 GPUs** via **FlashAttention-2** and custom fused CUDA kernels; realized **3.8x throughput** on >32K context windows, cutting p99 latency by **54%**.
• Deployed real-time health insurance claim fraud detection pipeline over **AWS Kinesis & OpenTelemetry**; eliminated false-positive investigations by **52%**, preserving **$380K annually**.`,
    },
    {
        keywords: ['koom', 'koomai', 'loom', 'webrtc', 'electron', 'extension'],
        answer: `**KoomAI — High-Performance Loom Alternative (Jan 2025 – Dec 2025):**
• **Founder & Principal Architect:** Orchestrating Desktop (Electron), Chrome Extension (MV3), Express Backend & Next.js 16 Cockpit.
• **WebRTC Low-Latency Engine:** Real-time WebRTC media pipeline (<120ms glass-to-glass latency) with adaptive bitrate (SVC); sustained **60 FPS 1080p video with 0% stutter across 50K+ active video minutes**.
• **ElectronJS Desktop Client:** Hardware-accelerated NVENC/VideoToolbox encoding, native OS IPC audio/display capture; cut idle CPU usage by **45%**.
• **Chrome Extension (Manifest V3):** Offscreen documents for synchronized tab/mic audio mixing, capturing **10K+ user recordings**.
• **Monetization:** Stripe billing engine with idempotent webhooks, generating **$24K MRR** in pilot adoption.
• Live Demo: [koom-ai.vercel.app](https://koom-ai.vercel.app/)`,
    },
    {
        keywords: ['security', 'guardrail', 'botshield', 'waf', 'injection'],
        answer: `**Enterprise AI Security & Production Agentic RAG Platform:**
• **BotShield WAF & NeMo Guardrails:** Blocked **95%+ of prompt injections & jailbreaks** (benchmarked with **Microsoft PyRIT 0.14.0**).
• **LangGraph Stateful Agentic Core:** MemorySaver checkpoints and Portkey Gateway; saved **$8.4K/month (42%)** via **<50ms semantic similarity caching**.
• **FastMCP Standardization:** Human-in-the-Loop (HITL) gates on destructive/financial tool calls; guaranteed **100% audit compliance** with zero unauthorized runs.
• **Two-Stage Retrieval:** Jina v3 1024-dim dense vectors, BM25 sparse search, and local ONNX FlashRank cross-encoders with Cohere Rerank v3.5 fallback (**96.4% Context Precision**).`,
    },
    {
        keywords: ['zomato', 'lakehouse', 'dbt', 'snowflake', 'cv'],
        answer: `**Zomato AI Lakehouse & Multimodal Dispute Platform:**
• Enterprise Lakehouse on **Snowflake & PySpark Delta Lake** processing **35M+ orders (2.3 GB)** with **dbt Core SCD-2**; curtailed warehouse compute by **42% ($18K/mo savings)**.
• Real-time feature streaming via **Airflow, Debezium CDC WAL**, and **Feast Feature Store** over Redis; reduced serving latency to **<5ms**, creating **+$340K quarterly revenue lift**.
• Multimodal CV dispute arbitration (**dHash anti-fraud, receipt OCR**) with G-Eval Chain-of-Thought; prevented **68% of fraudulent claims**, safeguarding **$1.2M annually**.`,
    },
    {
        keywords: ['dsa', 'competitive', 'codeforces', 'codechef', 'hackathon', 'iupc'],
        answer: `**Competitive Programming & Algorithmic Excellence:**
• **Codeforces:** **Ranked 232nd** in Div-2 (**Blue Coder**).
• **CodeChef:** **5★ Coder** (Rating 2000+).
• **Inter-University Programming Contest (IUPC):** **17th in Bangladesh**.
• **Meta Hacker Cup:** Qualified **Round 3**.
• **Problem Solving:** **2000+ DSA problems solved**, participated in system design hackathons.
• **Technobeast AI Agents Hackathon:** **Champion (1st Place)**.
• **AI Security Hackathon:** **7th Place Nationally** (<30ms prompt firewall).`,
    },
    {
        keywords: ['skills', 'stack', 'tech', 'languages', 'tools'],
        answer: `**Technical Arsenal:**
• **Languages:** Python, C/C++, Rust (Actix-web), Go (Gin/Fiber), SQL, Bash, TypeScript, Java (Spring Boot).
• **AI & LLMOps:** PyTorch, vLLM, LangGraph, LangChain, HuggingFace, TRL, PEFT (RSLoRA, QLoRA), NeFTune, MLflow, Feast, AWS SageMaker, KServe.
• **Data & Streaming:** Snowflake, Databricks, Azure Data Factory, dbt Core, PySpark, Delta Lake, Kafka, Airflow, Debezium CDC, DuckDB, Qdrant.
• **Cloud & Infra:** AWS (EKS, S3, KMS, EMR, Athena, ECS, Fargate), GCP (GKE, BigQuery), Azure (Databricks, Synapse), Terraform, ArgoCD, Docker, Kubernetes.
• **DevSecOps:** NVIDIA NeMo Guardrails, PyRIT, BotShield WAF, SonarQube, Trivy, Prometheus, Grafana.`,
    },
]

const AgentChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: "Hello! I am **Nexus AI Agent**, an autonomous enterprise assistant protected by **BotShield WAF** and **NVIDIA NeMo Guardrails**. Ask me anything about Kishor's architecture, projects, work experience, or competitive programming achievements!",
            trace: ['BotShield WAF: Verified', 'Memory: Initialized', 'Tools: 6 FastMCP endpoints ready'],
            timestamp: 'Just now',
        },
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const chatEndRef = useRef(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSend = (queryText = input) => {
        const query = (queryText || '').trim()
        if (!query) return

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setMessages((prev) => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Simulate multi-stage agent pipeline: Guardrail -> Intent Route -> RAG -> Synthesis
        setTimeout(() => {
            const lower = query.toLowerCase()
            let matched = KNOWLEDGE_BASE.find((k) =>
                k.keywords.some((kw) => lower.includes(kw))
            )

            let answerText = matched
                ? matched.answer
                : `**Synthesized Agent Response:**
I evaluated your query: *"${query}"* through the **LangGraph intent router**. 
Kishor specializes in **High-Throughput Distributed AI Systems**, **Medallion Lakehouses**, and **Agentic AI (LangGraph/FastMCP)**. 

You can ask me specifically about:
• **phi0.ai** or **Samsung AI Core** experience
• **KoomAI** WebRTC video architecture
• **Zomato** Medallion Lakehouse & multimodal CV platform
• **Competitive programming** & 2000+ DSA achievements
• **AI Security** BotShield WAF & NeMo Guardrails`

            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: answerText,
                trace: [
                    '🛡️ BotShield WAF: Sanitized (0 injection, 0 PII leak)',
                    '⚡ Semantic Cache: Redis Hit in 12ms',
                    '🔄 LangGraph: Cyclic Supervisor Router -> Synthesis Subgraph',
                    '🧩 FastMCP: Executed query_knowledge_graph()',
                    '✅ NeMo Guardrail: Output Verification 100% Passed',
                ],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }

            setMessages((prev) => [...prev, botMsg])
            setIsTyping(false)
        }, 600)
    }

    const starterQueries = [
        "Tell me about Kishor's experience at phi0.ai & Samsung",
        "Explain KoomAI's WebRTC & Electron architecture",
        "How does the Zomato Lakehouse work?",
        "What are Kishor's competitive programming stats?",
    ]

    return (
        <div className='flex flex-col h-[520px] max-h-[78vh] bg-[#18181f] text-gray-200 select-none font-sans'>
            {/* Header */}
            <div id='window-header' className='bg-[#22222c] border-b border-gray-800 px-3 py-2 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <WindowControls target='aichat' />
                    <div className='flex items-center gap-1.5 ml-2'>
                        <Bot className='size-4 text-cyan-400' />
                        <span className='font-bold text-xs text-white'>Nexus AI Agent — Production RAG</span>
                    </div>
                </div>

                {/* Status Badges */}
                <div className='flex items-center gap-2 text-[10px]'>
                    <span className='flex items-center gap-1 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full'>
                        <ShieldCheck className='size-3 text-emerald-400' />
                        BotShield WAF
                    </span>
                    <span className='flex items-center gap-1 bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full'>
                        <Zap className='size-3 text-cyan-400' />
                        &lt;15ms Cache
                    </span>
                </div>
            </div>

            {/* Conversation Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3.5 text-xs'>
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                                m.sender === 'user'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs'
                                    : 'bg-[#262633] border border-gray-800 text-gray-200 rounded-tl-xs'
                            }`}
                        >
                            {/* Bot Execution Trace Accordion */}
                            {m.trace && (
                                <div className='mb-2.5 p-2 rounded-lg bg-black/40 border border-gray-800/80 text-[10px] space-y-0.5 font-mono text-gray-400'>
                                    <div className='flex items-center gap-1 text-cyan-400 font-semibold mb-1'>
                                        <Layers className='size-3' />
                                        <span>LangGraph Cyclic Execution Trace:</span>
                                    </div>
                                    {m.trace.map((step, idx) => (
                                        <div key={idx} className='flex items-center gap-1.5'>
                                            <span className='text-amber-400 font-bold'>›</span>
                                            <span>{step}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className='leading-relaxed whitespace-pre-wrap'>
                                {m.text.split('\n').map((line, i) => (
                                    <p key={i} className='mb-1 last:mb-0'>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <span className='text-[10px] text-gray-500 mt-1 px-1'>{m.timestamp}</span>
                    </div>
                ))}

                {isTyping && (
                    <div className='flex items-center gap-2 bg-[#262633] border border-gray-800 text-gray-400 rounded-2xl px-3 py-2 text-xs w-fit'>
                        <RefreshCw className='size-3 animate-spin text-cyan-400' />
                        <span>LangGraph Agent routing & synthesizing verified answer...</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Quick Starters */}
            {messages.length <= 3 && (
                <div className='px-4 pb-2 flex flex-wrap gap-1.5'>
                    {starterQueries.map((q, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSend(q)}
                            className='text-[11px] bg-[#22222c] hover:bg-[#2e2e3d] text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full transition truncate max-w-[260px]'
                        >
                            💬 {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Bar */}
            <div className='p-3 bg-[#1e1e27] border-t border-gray-800 flex items-center gap-2'>
                <input
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder='Ask about Kishor’s projects, phi0.ai, lakehouse, KoomAI...'
                    className='flex-1 bg-black/40 border border-gray-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-cyan-500 transition'
                />
                <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className='bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white p-2 rounded-xl transition shadow-xs'
                    title='Send Query'
                >
                    <Send className='size-3.5' />
                </button>
            </div>
        </div>
    )
}

const AgentChatWindow = WindowWrapper(AgentChat, 'aichat')
export default AgentChatWindow
