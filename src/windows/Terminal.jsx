import { WindowControls } from '#components'
import { techStack, locations } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import useLocationStore from '#store/location'
import { Check, Terminal as TerminalIcon, Sparkles } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

const BANNER = [
    "Last login: " + new Date().toLocaleString() + " on ttys001",
    "Welcome to Paroi-macOS Darwin 24.1.0 (Apple Silicon arm64)",
    "Type 'help' or click quick suggestions below to control the OS & explore.",
]

// Fire spark colors
const SPARK_COLORS = ['#ff6b35', '#ff3d00', '#ff9100', '#ffd600', '#ff4081', '#ff1744', '#ffab00']

// Quick suggestion commands connected with macOS apps & system
const QUICK_SUGGESTIONS = [
    { label: 'skills', cmd: 'skills', color: 'hover:text-cyan-300' },
    { label: 'whoami', cmd: 'whoami', color: 'hover:text-emerald-300' },
    { label: 'projects', cmd: 'projects', color: 'hover:text-amber-300' },
    { label: 'contact', cmd: 'contact', color: 'hover:text-pink-300' },
    { label: 'agent', cmd: 'agent', color: 'hover:text-purple-300' },
    { label: 'gallery', cmd: 'gallery', color: 'hover:text-blue-300' },
    { label: 'chess', cmd: 'chess', color: 'hover:text-orange-300' },
    { label: 'coc', cmd: 'coc', color: 'hover:text-red-300' },
    { label: 'resume', cmd: 'resume', color: 'hover:text-yellow-300' },
    { label: 'neofetch', cmd: 'neofetch', color: 'hover:text-green-300' },
]

const Terminal = () => {
    const { openWindow } = useWindowStore()
    const { setActiveLocation } = useLocationStore()
    const [history, setHistory] = useState([
        { type: 'output', text: BANNER.join("\n") },
        { type: 'cmd', text: 'show tech stack' },
    ])
    const [inputVal, setInputVal] = useState('')
    const inputRef = useRef(null)
    const bottomRef = useRef(null)
    const sparkContainerRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [history])

    // Fire spark particle spawner on keypress
    const spawnSparks = () => {
        const container = sparkContainerRef.current
        const input = inputRef.current
        if (!container || !input) return

        const inputRect = input.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        // Spawn 3-6 spark particles per keystroke
        const count = 3 + Math.floor(Math.random() * 4)
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div')
            const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]
            const size = 2 + Math.random() * 4
            // Position near the end of the input text (caret area)
            const caretX = inputRect.left - containerRect.left + Math.min(inputVal.length * 6.5, inputRect.width - 10) + (Math.random() - 0.5) * 16
            const caretY = inputRect.top - containerRect.top + inputRect.height / 2

            Object.assign(spark.style, {
                position: 'absolute',
                left: `${caretX}px`,
                top: `${caretY}px`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}80`,
                pointerEvents: 'none',
                zIndex: 50,
                opacity: 1,
            })
            container.appendChild(spark)

            // Animate: float upward with random drift
            const dx = (Math.random() - 0.5) * 40
            const dy = -(20 + Math.random() * 50)
            const duration = 400 + Math.random() * 400
            const start = performance.now()

            const animate = (now) => {
                const elapsed = now - start
                const progress = Math.min(elapsed / duration, 1)
                const eased = 1 - (1 - progress) * (1 - progress) // ease-out-quad
                spark.style.transform = `translate(${dx * eased}px, ${dy * eased}px) scale(${1 - progress * 0.7})`
                spark.style.opacity = String(1 - progress)
                if (progress < 1) {
                    requestAnimationFrame(animate)
                } else {
                    spark.remove()
                }
            }
            requestAnimationFrame(animate)
        }
    }

    const handleRunCommand = (cmd) => {
        const trimmed = cmd.trim().toLowerCase()
        if (!trimmed) return

        const newEntries = [{ type: 'cmd', text: cmd }]

        switch (trimmed) {
            case 'help':
            case 'commands':
            case '?':
                newEntries.push({
                    type: 'output',
                    text: [
                        "PAROI-MACOS INTERACTIVE SHELL COMMANDS (OS INTEGRATED):",
                        "--------------------------------------------------------------------------------",
                        "SYSTEM & ARCHITECTURE:",
                        "  skills          - Display all 7 verified technology domains (interactive)",
                        "  whoami          - Principal Architect identity, degree & background",
                        "  projects        - List 15 enterprise projects & copyable deploy commands",
                        "  education       - RUET B.Sc. in CSE (Admission Rank 483rd in Bangladesh)",
                        "  cp              - Competitive programming honors (Codeforces, CodeChef 5★)",
                        "  neofetch        - Apple Silicon kernel specs & polyglot system architecture",
                        "",
                        "INTEGRATED MACOS APPS & DIRECT WINDOW LAUNCHERS:",
                        "  contact         - Launch Contact & direct encrypted uplink channels",
                        "  agent           - Launch Nexus-AI Multi-Agent mesh chat (LangGraph + FastMCP)",
                        "  gallery         - Launch Architecture Blueprint Image viewer & Photos",
                        "  chess           - Launch Live 5-Minute Blitz Chess AI (Minimax challenge)",
                        "  coc             - Launch Clash of Villages (CVD) RTS Defense simulation",
                        "  resume          - Launch ATS Executive Resume PDF viewer",
                        "  safari          - Launch Safari browser (production live portal)",
                        "  finder          - Launch macOS Finder systems directory",
                        "  notes           - Launch TextEdit technical documentation",
                        "",
                        "LIVE PLATFORM & UTILITIES:",
                        "  koom            - Inspect Koom-AI live telemetry, Stripe & user metrics",
                        "  matrix          - Transmit cyberpunk neural telemetry stream",
                        "  clear           - Clear terminal window history",
                        "--------------------------------------------------------------------------------",
                        "💡 Click any suggestion pill above or type a command to control the OS!",
                    ].join("\n"),
                })
                break

            case 'skills':
            case 'techstack':
            case 'show tech stack':
                newEntries.push({ type: 'skills' })
                break

            case 'whoami':
                newEntries.push({
                    type: 'output',
                    text: [
                        "Kishor Kumar Paroi (KKP)",
                        "Role: Principal AI/ML Systems & Lakehouse Architect | Founder @ Koom-AI",
                        "Location: Dhaka, Bangladesh",
                        "Degrees: B.Sc. in CSE from RUET (Rank 483rd in Bangladesh, 3.25 / 4.00 D.O)",
                        "Key Expertise: High-Throughput Polyglot Mesh (Rust/Go), Multi-Cloud Lakehouses (Snowflake/PySpark/dbt), Autonomous AI Agent Mesh (LangGraph, FastMCP, NeMo Guardrails)",
                    ].join("\n"),
                })
                break

            case 'education':
                newEntries.push({
                    type: 'output',
                    text: [
                        "🎓 Rajshahi University of Engineering & Technology (RUET) (2018 – 2023)",
                        "   Degree: B.Sc. in Computer Science & Engineering",
                        "   CPI: 3.25 / 4.00 (D.O) | Merit: Rank 483rd in Bangladesh in Admission",
                        "",
                        "🎓 Saint Joseph Higher Secondary School, Dhaka (2015 – 2017)",
                        "   Degree: Higher Secondary Certificate (HSC) | GPA: 5.00 / 5.00",
                        "   Merit: Rank 85th in Dhaka Board Merit List",
                        "",
                        "🎓 S.J Govt Model High School, Gopalganj (2013 – 2015)",
                        "   Degree: Secondary School Certificate (SSC) | GPA: 5.00 / 5.00",
                        "   Merit: Rank 90th in Dhaka Board",
                    ].join("\n"),
                })
                break

            case 'cp':
            case 'competitive':
                newEntries.push({
                    type: 'output',
                    text: [
                        "🏆 Codeforces Div-2: Ranked 232nd (Blue Coder)",
                        "⭐ CodeChef: 5★ Competitive Programmer (Rating 2000+)",
                        "🎯 IUPC: 17th Rank in National Inter-University Programming Contest",
                        "🏅 Meta Hacker Cup: Qualified for Round 3",
                        "🧠 LeetCode: 1000+ Algorithmic & Dynamic Programming problems solved",
                    ].join("\n"),
                })
                break

            case 'projects':
                newEntries.push({
                    type: 'output',
                    text: [
                        "PAROI-MACOS PRODUCTION SYSTEMS DIRECTORY (15 ENTERPRISE PROJECTS):",
                        "--------------------------------------------------------------------------------",
                        "01. Zomato Enterprise AI Lakehouse & Multimodal Dispute Platform (Snowflake, PySpark, Feast)",
                        "02. Hybrid Anime Intelligence & Continuous LLMOps (Go 1.24, Rust SIMD, vLLM Multi-LoRA)",
                        "03. Zero-Trust AI Defense & Production Agentic RAG Platform (BotShield WAF, NVIDIA NeMo)",
                        "04. Smart Manufacturing Industrial IIoT & MLOps (Rust SIMD, Go Gateway, GKE/K3s, ArgoCD)",
                        "05. Nexus-AI Multi-Cloud Lakehouse & Autonomous Agent Mesh (LangGraph, DuckDB, FastAPI)",
                        "06. Advanced AI Chatbot & HITL Financial Gating (FastMCP, Qdrant Vector, PostgreSQL)",
                        "07. Data Agent: Autonomous Multi-Agent BI & Self-Healing NL2SQL (LangGraph Supervisor)",
                        "08. Advanced Network Security Medallion Lakehouse (Azure ADF, Databricks, Synapse CETAS)",
                        "09. AWS SageMaker End-to-End MLOps Pipeline (SageMaker DAG, Spot Training, Drift Alarms)",
                        "10. Cloud-Native Real-Time MLOps: KServe & AWS ECS Fargate (KServe v1beta1, Terraform)",
                        "11. Bare-Metal Systems: Rust Git Engine & Async POSIX Shell (Rust 1.85, SIMD zlib)",
                        "12. Koom-AI: Enterprise Asynchronous Video Intelligence Platform (Next.js 16, WebRTC)",
                        "13. User Survival Prediction: Astro CLI Airflow, Redis Feature Store (<2ms) & Alibi Drift",
                        "14. re:invent 3D: High-Fidelity WebGL Shaders, Three.js Camera & Live EDM Audio Mesh",
                        "15. macOS Tahoe Portfolio: OS-Grade Windowing Web Environment (React 19, TailwindCSS)",
                        "--------------------------------------------------------------------------------",
                        "💡 Tip: Run `curl -fsSL <repo-url>/bootstrap.sh | bash` in your local terminal for One-Click Deploy!",
                        "📁 Double-click any project folder on the desktop to inspect architecture diagrams and source code.",
                    ].join("\n"),
                })
                break

            case 'resume':
            case 'cv':
                openWindow('resume')
                newEntries.push({
                    type: 'output',
                    text: "📄 Launching ATS Verified Executive Resume (PDF Viewer)...",
                })
                break

            case 'contact':
                openWindow('contact')
                newEntries.push({
                    type: 'output',
                    text: [
                        "📬 Launching Contact & Secure Uplink Window...",
                        "--------------------------------------------------------------------------------",
                        "  Email:      paroi.kishor@gmail.com",
                        "  Phone:      +880 1781682312",
                        "  WhatsApp:   https://wa.me/8801781682312",
                        "  Telegram:   @kishorparoi",
                        "  LinkedIn:   https://linkedin.com/in/kishorkumarparoi",
                        "  GitHub:     https://github.com/KishorKumarParoi",
                        "  Location:   Dhaka, Bangladesh (Open to Global Relocation / Remote)",
                        "  Status:     Available for Principal AI/ML & Lakehouse Architect roles",
                        "--------------------------------------------------------------------------------",
                    ].join("\n"),
                })
                break

            case 'agent':
            case 'nexus':
            case 'nexus-ai':
            case 'nexus-ai-agent':
            case 'ai':
            case 'chat':
                openWindow('aichat')
                newEntries.push({
                    type: 'output',
                    text: [
                        "🤖 Launching Nexus-AI Autonomous Multi-Agent Mesh (LangGraph + FastMCP)...",
                        "--------------------------------------------------------------------------------",
                        "  Agent Mesh:      ONLINE (Port 8000 / WebSocket streaming)",
                        "  Supervisor:      Autonomous Gated Lakehouse & Repo Auditing Supervisor",
                        "  Model Context:   FastMCP server connected • RAG semantic cache <35ms",
                        "  Inquiry Topics:  Ask about 15 architectures, Zomato lakehouse, vLLM multi-LoRA",
                        "--------------------------------------------------------------------------------",
                    ].join("\n"),
                })
                break

            case 'gallery':
            case 'photos':
            case 'picture':
            case 'pictures':
            case 'images':
            case 'image':
                setActiveLocation(locations?.gallery)
                openWindow('imgfile', {
                    id: 'zomato_arch',
                    name: 'Zomato Enterprise AI Lakehouse Architecture',
                    imageUrl: '/images/projects/zomato/architecture.png',
                })
                openWindow('finder')
                newEntries.push({
                    type: 'output',
                    text: [
                        "🖼️ Launching High-Fidelity Architecture Gallery & Photos...",
                        "--------------------------------------------------------------------------------",
                        "  Preview Window:  Loaded Zomato Multi-Cloud Lakehouse blueprint.",
                        "  Finder Gallery:  Navigated to /Systems/Architecture-Blueprints.",
                        "  Controls:        Zoom (Scroll/Buttons), Split-Screen & Multi-Tab.",
                        "--------------------------------------------------------------------------------",
                    ].join("\n"),
                })
                break

            case 'chess':
            case 'play chess':
                window.dispatchEvent(new CustomEvent('start-chess-challenge'))
                openWindow('chess')
                newEntries.push({
                    type: 'output',
                    text: [
                        "♟️ Launching Chess Live: 5-Minute Blitz AI (Minimax Engine)...",
                        "--------------------------------------------------------------------------------",
                        "  Challenge Accepted: White Blitz Clock activated (5:00).",
                        "  Victory Bounty:     Virtual Apple MacBook Pro + Grandmaster status!",
                        "  Defeat Penalty:     You must gift AirPods to the computer! 🎧",
                        "--------------------------------------------------------------------------------",
                    ].join("\n"),
                })
                break

            case 'coc':
            case 'clash':
            case 'cvd':
            case 'defense':
            case 'game':
                openWindow('clash')
                newEntries.push({
                    type: 'output',
                    text: [
                        "⚔️ Launching Clash of Villages (CVD) RTS Defense Simulation...",
                        "--------------------------------------------------------------------------------",
                        "  Objective:  Defend Town Hall 12 against goblin & barbarian waves.",
                        "  Arsenal:    Archer Towers, Wizard Towers, Cannon Defenses.",
                        "  Condition:  Survive 60 seconds of relentless raid siege to WIN!",
                        "--------------------------------------------------------------------------------",
                    ].join("\n"),
                })
                break

            case 'safari':
            case 'browser':
            case 'web':
                openWindow('safari')
                newEntries.push({
                    type: 'output',
                    text: "🧭 Launching Safari Web Browser (Connecting to https://kishor.tech)...",
                })
                break

            case 'finder':
            case 'files':
            case 'ls':
            case 'dir':
                openWindow('finder')
                newEntries.push({
                    type: 'output',
                    text: [
                        "📁 Launching macOS Finder Desktop & Storage Directory...",
                        "  Available mounts: /Work, /About, /Resume, /Games, /Gallery, /Trash",
                    ].join("\n"),
                })
                break

            case 'notes':
            case 'text':
            case 'doc':
            case 'txt':
                openWindow('txtfile')
                newEntries.push({
                    type: 'output',
                    text: "📝 Launching TextEdit Executive Documentation Viewer...",
                })
                break

            case 'matrix':
                newEntries.push({
                    type: 'output',
                    text: [
                        "Wake up, Neo...",
                        "The Matrix has you.",
                        "Follow the white rabbit. 🐇",
                        "01001011 01001001 01010011 01001000 01001111 01010010 (KISHOR)",
                        "Principal AI Systems & Distributed Mesh Telemetry: NOMINAL",
                    ].join("\n"),
                })
                break

            case 'koom':
            case 'koom-ai':
                newEntries.push({
                    type: 'output',
                    text: [
                        "KOOM-AI ENTERPRISE VIDEO INTELLIGENCE PLATFORM:",
                        "🚀 Subdomain URL:   https://koom.kishor.tech",
                        "🌐 Production Host:  https://koom-ai.vercel.app",
                        "📊 Recruiter Proof:  https://koom.kishor.tech/status (Live Neon PostgreSQL)",
                        "⚡ Live Telemetry:   3 Verified Users • 2 Active PRO Subscriptions ($19/mo)",
                        "💳 Stripe Customer: cus_Sa8WlnKaXniRPq, cus_SaBPjj2abks12w",
                        "📈 Unit Economics:   88.4% Gross Margin • <61ms Query SLA • Whisper V3 AI",
                        "--------------------------------------------------------------------------------",
                    ].join("\n"),
                })
                break

            case 'neofetch':
            case 'mac':
                newEntries.push({
                    type: 'output',
                    text: [
                        "                    'c.           kishor@paroi-macbook-pro",
                        "                 ,xNMM.          ------------------------",
                        "               .OMMMMo           OS: macOS Sequoia 15.3 (arm64)",
                        "               OMMM0,            Host: MacBook Pro (Apple Silicon)",
                        "     .;loddo:.  .olloddol;.      Kernel: 24.1.0 Darwin",
                        "   cKMMMMMMMMMMNWMMMMMMMMMM0:    Uptime: 42 days, 7 hours, 28 mins",
                        " .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Shell: zsh 5.9 (arm64-apple-darwin24.0)",
                        " XMMMMMMMMMMMMMMMMMMMMMMMX.      Terminal: Apple Terminal / Macfolio",
                        ";MMMMMMMMMMMMMMMMMMMMMMMM:       CPU: Apple M-Series Ultra / Max (16 cores)",
                        ":MMMMMMMMMMMMMMMMMMMMMMMM:       Memory: 64 GB Unified LPDDR5",
                        ".MMMMMMMMMMMMMMMMMMMMMMMMX.      Architecture: Polyglot (Rust, Go, Python, Next.js)",
                        " kMMMMMMMMMMMMMMMMMMMMMMMMWd.    Specialization: GenAI, Lakehouses & Distributed MLOps",
                        "  .XMMMMMMMMMMMMMMMMMMMMMMMMk    Status: Open for Principal AI/ML & Lakehouse Roles",
                    ].join("\n"),
                })
                break

            case 'clear':
                setHistory([])
                setInputVal('')
                return

            default:
                newEntries.push({
                    type: 'output',
                    text: `zsh: command not found: ${cmd}. Type 'help' for available commands.`,
                })
                break
        }

        setHistory((prev) => [...prev, ...newEntries])
        setInputVal('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        handleRunCommand(inputVal)
    }

    return (
        <>
            <div id='window-header' className='flex items-center justify-between px-3 py-1.5 border-b border-gray-800 bg-[#1e1e1e] text-gray-300 select-none overflow-x-auto no-scrollbar'>
                <div className='flex items-center gap-2 shrink-0 mr-3'>
                    <WindowControls target="terminal" />
                    <span className='text-xs font-mono font-medium flex items-center gap-1.5 ml-2 text-gray-300'>
                        <TerminalIcon size={13} className='text-emerald-400' />
                        kishor — zsh — 80x24
                    </span>
                </div>
                <div className='flex items-center gap-1.5 text-[11px] font-mono shrink-0 overflow-x-auto py-0.5 no-scrollbar'>
                    {QUICK_SUGGESTIONS.map(({ label, cmd, color }) => (
                        <button
                            key={cmd}
                            onClick={() => handleRunCommand(cmd)}
                            className={`px-2 py-0.5 rounded bg-gray-800/90 hover:bg-gray-700 text-gray-300 ${color || ''} transition cursor-pointer whitespace-nowrap border border-white/5 shadow-xs`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div
                ref={sparkContainerRef}
                className='relative bg-[#18181b] text-gray-100 font-mono text-xs p-4 overflow-y-auto max-h-[70vh] min-h-[420px] select-text'
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((item, idx) => {
                    if (item.type === 'cmd') {
                        return (
                            <div key={idx} className='flex items-center gap-1.5 text-emerald-400 mt-2 mb-1'>
                                <span className='text-pink-400 font-bold'>@kishor</span>
                                <span className='text-gray-400'>in</span>
                                <span className='text-blue-400 font-semibold'>~</span>
                                <span className='text-yellow-400'>%</span>
                                <span className='text-gray-100 font-medium'>{item.text}</span>
                            </div>
                        )
                    }

                    if (item.type === 'output') {
                        return (
                            <pre key={idx} className='whitespace-pre-wrap text-gray-300 leading-relaxed font-mono text-[11px] mb-2'>
                                {item.text}
                            </pre>
                        )
                    }

                    if (item.type === 'skills') {
                        return (
                            <div key={idx} className='my-3 bg-black/40 border border-gray-800/80 rounded-lg p-3'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    {techStack.map(({ category, items }) => (
                                        <div key={category} className='p-2 rounded bg-gray-900/60 border border-gray-800'>
                                            <div className='flex items-center gap-1.5 text-cyan-300 font-semibold mb-1 text-xs'>
                                                <Check size={14} className='text-emerald-400' />
                                                {category}
                                            </div>
                                            <div className='flex flex-wrap gap-1'>
                                                {items.map((it, i) => (
                                                    <span key={i} className='bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded'>
                                                        {it}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className='mt-3 text-[11px] text-emerald-400 flex items-center gap-1'>
                                    <Check size={14} /> {techStack.length} verified production technology domains compiled (100% test coverage)
                                </p>
                            </div>
                        )
                    }

                    return null
                })}

                {/* Live Prompt Line with Fire Sparks */}
                <form onSubmit={handleSubmit} className='flex items-center gap-1.5 text-emerald-400 mt-2'>
                    <span className='text-pink-400 font-bold'>@kishor</span>
                    <span className='text-gray-400'>in</span>
                    <span className='text-blue-400 font-semibold'>~</span>
                    <span className='text-yellow-400'>%</span>
                    <input
                        ref={inputRef}
                        type='text'
                        value={inputVal}
                        onChange={(e) => { setInputVal(e.target.value); spawnSparks(); }}
                        placeholder="type 'help', 'contact', 'agent', 'gallery', 'chess', 'coc'..."
                        className='flex-1 bg-transparent border-none outline-hidden text-gray-100 font-mono text-xs focus:ring-0 p-0'
                        autoFocus
                    />
                </form>

                {/* In-Terminal Quick Command Pills */}
                <div className='mt-2.5 pt-2 border-t border-gray-800/60 flex items-center gap-1.5 flex-wrap text-[10px] text-gray-400 select-none'>
                    <span className='flex items-center gap-1 text-gray-500 font-semibold uppercase tracking-wider text-[9px]'>
                        <Sparkles size={11} className='text-amber-400' /> Suggestions:
                    </span>
                    {QUICK_SUGGESTIONS.map(({ label, cmd, color }) => (
                        <button
                            key={cmd}
                            type='button'
                            onClick={() => handleRunCommand(cmd)}
                            className={`px-1.5 py-0.5 rounded bg-gray-900/80 hover:bg-gray-800 text-gray-300 ${color || ''} border border-gray-800 transition cursor-pointer font-mono`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div ref={bottomRef} />
            </div>
        </>
    )
}

const TerminalWindow = WindowWrapper(Terminal, 'terminal')

export default TerminalWindow