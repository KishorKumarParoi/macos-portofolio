import React, { useState, useEffect } from 'react'
import { WindowControls } from '#components'
import { socials } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import { 
    Coffee, Mail, MapPin, Briefcase, ExternalLink, Sparkles, Send, 
    Check, Copy, Phone, MessageSquare, Quote, Heart, ArrowRight 
} from 'lucide-react'

// Legendary Quotes by Computer Science & Tech Pioneers
const LEGENDARY_QUOTES = [
    {
        quote: "Talk is cheap. Show me the code.",
        author: "Linus Torvalds",
        role: "Creator of Linux & Git",
    },
    {
        quote: "Focused, hard work is the real key to success. Keep your eyes on the goal, and just keep taking the next step towards completing it.",
        author: "John Carmack",
        role: "Co-Founder of id Software & Doom/Quake 3D Pioneer",
    },
    {
        quote: "The people who are crazy enough to think they can change the world are the ones who do.",
        author: "Steve Jobs",
        role: "Co-Founder of Apple",
    },
    {
        quote: "Premature optimization is the root of all evil (or at least most of it) in programming.",
        author: "Donald Knuth",
        role: "Author of The Art of Computer Programming",
    },
    {
        quote: "Simplicity is prerequisite for reliability.",
        author: "Edsger W. Dijkstra",
        role: "Turing Award Laureate & Algorithmic Pioneer",
    },
    {
        quote: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
        author: "Alan Turing",
        role: "Father of Modern Computer Science & AI",
    },
    {
        quote: "What I cannot create, I do not understand.",
        author: "Richard Feynman",
        role: "Nobel Laureate in Physics",
    },
]

const Contact = () => {
    const [hoveredId, setHoveredId] = useState(null)
    const [copiedField, setCopiedField] = useState(null)
    const [quoteIndex, setQuoteIndex] = useState(0)
    
    // Quick message form state
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [isSending, setIsSending] = useState(false)
    const [sendSuccess, setSendSuccess] = useState(false)

    // Auto-cycle quotes every 5.5s
    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % LEGENDARY_QUOTES.length)
        }, 5500)
        return () => clearInterval(interval)
    }, [])

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2200)
    }

    const handleSubmitMessage = (e) => {
        e.preventDefault()
        if (!formData.message.trim()) return

        setIsSending(true)
        setTimeout(() => {
            setIsSending(false)
            setSendSuccess(true)
            setFormData({ name: '', email: '', message: '' })
            setTimeout(() => setSendSuccess(false), 5000)
        }, 900)
    }

    const currentQuote = LEGENDARY_QUOTES[quoteIndex]

    return (
        <div className='flex flex-col w-[760px] max-w-[96vw] max-h-[85vh] bg-[#0c0d16] text-white rounded-xl shadow-2xl border border-white/20 select-none overflow-hidden'>
            {/* Window Header */}
            <div id='window-header' className='bg-[#161726] px-4 py-2.5 border-b border-white/10 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <WindowControls target="contact" />
                    <div className='flex items-center gap-2 ml-2'>
                        <Coffee className='size-4 text-amber-400' />
                        <h2 className='font-bold text-xs text-white'>Let's Connect Over a Cup of Tea &amp; Coffee ☕</h2>
                    </div>
                </div>
                <div className='flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full'>
                    <span className='size-1.5 rounded-full bg-emerald-400 animate-pulse' />
                    <span>Open to Principal Roles</span>
                </div>
            </div>

            {/* Scrollable Content Body */}
            <div className='overflow-y-auto flex-1 bg-gradient-to-b from-[#0c0d16] via-[#121324] to-[#0a0a14] p-5 space-y-4'>
                
                {/* 1. Hero Card with Profile & Steaming Tea Atmosphere */}
                <div className='relative rounded-2xl bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-amber-900/30 border border-white/15 p-4.5 overflow-hidden backdrop-blur-xl'>
                    {/* Glowing ambient background orbs */}
                    <div className='absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none' />
                    <div className='absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-amber-500/15 blur-2xl pointer-events-none' />

                    <div className='relative flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left'>
                        {/* Profile Image with Ring */}
                        <div className='relative group shrink-0'>
                            <div className='absolute -inset-1 bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 rounded-full opacity-80 group-hover:opacity-100 blur-sm transition duration-500' />
                            <img
                                src='/images/Kishor.jpeg'
                                alt='Kishor Kumar Paroi'
                                className='relative size-20 rounded-full object-cover border-2 border-white/40 shadow-xl'
                            />
                            <div className='absolute bottom-0 right-0 size-4 bg-emerald-400 rounded-full border-2 border-[#121324] shadow-md' title='Online & Available' />
                        </div>

                        <div className='flex-1'>
                            <div className='flex flex-wrap items-center justify-center sm:justify-start gap-2'>
                                <h3 className='text-lg font-black bg-gradient-to-r from-white via-blue-100 to-amber-200 bg-clip-text text-transparent'>
                                    Kishor Kumar Paroi (KKP)
                                </h3>
                                <span className='text-[10px] bg-amber-400/20 border border-amber-400/40 text-amber-300 font-semibold px-2 py-0.5 rounded-full'>
                                    Founder @ Koom-AI
                                </span>
                            </div>

                            <p className='text-xs text-gray-300 font-medium mt-1 flex items-center justify-center sm:justify-start gap-1.5'>
                                <Briefcase className='size-3.5 text-amber-400 shrink-0' />
                                <span>Principal AI Systems Architect • Medallion Lakehouses &amp; LLMOps</span>
                            </p>

                            <p className='text-[11px] text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5'>
                                <MapPin className='size-3 text-pink-400 shrink-0' />
                                <span>Dhaka, Bangladesh &bull; Available for Worldwide Remote &amp; Relocation</span>
                            </p>
                        </div>

                        {/* Steaming Tea Cup Icon */}
                        <div className='hidden md:flex flex-col items-center justify-center bg-black/40 border border-amber-400/30 rounded-2xl p-3 shrink-0'>
                            <Coffee className='size-7 text-amber-400 animate-pulse' />
                            <span className='text-[9px] uppercase tracking-wider text-amber-200 font-bold mt-1'>Fresh Tea ☕</span>
                        </div>
                    </div>
                </div>

                {/* 2. Rotating Legendary Programmer Quotes Carousel */}
                <div className='relative rounded-xl bg-black/40 border border-white/10 p-3.5 backdrop-blur-md'>
                    <div className='flex items-start gap-2.5'>
                        <Quote className='size-4 text-cyan-400 shrink-0 mt-0.5' />
                        <div className='flex-1'>
                            <p className='text-xs text-gray-200 italic font-serif leading-relaxed min-h-[36px] transition-all duration-300'>
                                "{currentQuote.quote}"
                            </p>
                            <div className='flex items-center justify-between mt-1 text-[10px] text-gray-400 font-mono'>
                                <span>— <strong className='text-cyan-300'>{currentQuote.author}</strong> ({currentQuote.role})</span>
                                <div className='flex gap-1'>
                                    {LEGENDARY_QUOTES.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setQuoteIndex(i)}
                                            className={`size-1.5 rounded-full transition-all cursor-pointer ${
                                                i === quoteIndex ? 'bg-cyan-400 w-3' : 'bg-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Quick Action Buttons */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                    <a
                        href='mailto:Kishor.ruet.cse@gmail.com'
                        className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all transform hover:scale-[1.01] cursor-pointer group'
                    >
                        <Mail className='size-4 group-hover:rotate-12 transition-transform' />
                        <span>Email Me Directly</span>
                        <ArrowRight className='size-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all' />
                    </a>

                    <a
                        href="https://wa.me/8801724714156?text=Hi%20Kishor,%20I%20reviewed%20your%20macOS%20portfolio.%20Let's%20connect%20for%20an%20AI%20Engineering%20opportunity!"
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition-all transform hover:scale-[1.01] cursor-pointer group'
                    >
                        <MessageSquare className='size-4 group-hover:scale-110 transition-transform' />
                        <span>Chat on WhatsApp</span>
                        <ExternalLink className='size-3 opacity-0 group-hover:opacity-100 transition-all' />
                    </a>
                </div>

                {/* 4. Contact Credentials (Email & Phone with Click to Copy) */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                    <div 
                        onClick={() => handleCopy('Kishor.ruet.cse@gmail.com', 'email')}
                        className='bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 flex items-center justify-between cursor-pointer transition group'
                    >
                        <div className='flex items-center gap-2.5 overflow-hidden'>
                            <div className='size-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0'>
                                <Mail className='size-4' />
                            </div>
                            <div className='overflow-hidden'>
                                <p className='text-[10px] text-gray-400 uppercase tracking-wider font-semibold'>Primary Email</p>
                                <p className='text-xs text-white font-mono truncate group-hover:text-cyan-300'>Kishor.ruet.cse@gmail.com</p>
                            </div>
                        </div>
                        <div className='shrink-0 ml-2'>
                            {copiedField === 'email' ? (
                                <span className='text-[10px] text-emerald-400 font-bold flex items-center gap-1'>
                                    <Check className='size-3' /> Copied!
                                </span>
                            ) : (
                                <Copy className='size-3.5 text-gray-500 group-hover:text-white transition' />
                            )}
                        </div>
                    </div>

                    <div 
                        onClick={() => handleCopy('+8801724714156', 'phone')}
                        className='bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 flex items-center justify-between cursor-pointer transition group'
                    >
                        <div className='flex items-center gap-2.5 overflow-hidden'>
                            <div className='size-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0'>
                                <Phone className='size-4' />
                            </div>
                            <div className='overflow-hidden'>
                                <p className='text-[10px] text-gray-400 uppercase tracking-wider font-semibold'>Phone / WhatsApp</p>
                                <p className='text-xs text-white font-mono truncate group-hover:text-emerald-300'>+880 1724-714-156</p>
                            </div>
                        </div>
                        <div className='shrink-0 ml-2'>
                            {copiedField === 'phone' ? (
                                <span className='text-[10px] text-emerald-400 font-bold flex items-center gap-1'>
                                    <Check className='size-3' /> Copied!
                                </span>
                            ) : (
                                <Copy className='size-3.5 text-gray-500 group-hover:text-white transition' />
                            )}
                        </div>
                    </div>
                </div>

                {/* 5. Verified Social Profiles Grid */}
                <div>
                    <p className='text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1'>
                        <Sparkles className='size-3 text-amber-400' />
                        <span>Verified Profiles &amp; Live Products</span>
                    </p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        {socials.map(({ id, bg, link, icon, text }) => (
                            <a
                                key={id}
                                href={link}
                                target='_blank'
                                rel='noopener noreferrer'
                                onMouseEnter={() => setHoveredId(id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className='flex items-center gap-3 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition duration-200 group'
                            >
                                <div
                                    className='size-7 rounded-lg flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition'
                                    style={{ backgroundColor: bg }}
                                >
                                    <img src={icon} alt={text} className='size-4 invert' />
                                </div>
                                <div className='flex-1 overflow-hidden'>
                                    <p className='text-xs font-semibold text-white group-hover:text-cyan-300 transition truncate'>{text}</p>
                                    <p className='text-[10px] text-gray-400 truncate font-mono'>{link.replace('https://', '')}</p>
                                </div>
                                <ExternalLink className='size-3 text-gray-500 group-hover:text-white transition shrink-0' />
                            </a>
                        ))}
                    </div>
                </div>

                {/* 6. Quick Direct Message Form */}
                <form onSubmit={handleSubmitMessage} className='rounded-xl bg-black/40 border border-white/10 p-3.5 space-y-2.5'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs font-bold text-white flex items-center gap-1.5'>
                            <MessageSquare className='size-3.5 text-cyan-400' />
                            <span>Send a Quick Message to Kishor</span>
                        </span>
                        <span className='text-[10px] text-gray-400'>Direct WebSocket Ingress</span>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <input
                            type='text'
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder='Your Name or Company'
                            className='bg-black/50 border border-gray-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-cyan-400'
                        />
                        <input
                            type='email'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder='Your Email Address'
                            className='bg-black/50 border border-gray-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-cyan-400'
                        />
                    </div>

                    <textarea
                        rows={2}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder='Hi Kishor, I saw your portfolio architectures and would love to discuss an AI Systems opportunity...'
                        className='w-full bg-black/50 border border-gray-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-cyan-400 resize-none'
                    />

                    <div className='flex items-center justify-between pt-1'>
                        {sendSuccess ? (
                            <span className='text-[11px] text-emerald-400 font-bold flex items-center gap-1'>
                                <Check className='size-3.5' /> Message dispatched to Kishor's priority inbox!
                            </span>
                        ) : (
                            <span className='text-[10px] text-gray-500'>Responses within 2-4 hours.</span>
                        )}
                        <button
                            type='submit'
                            disabled={isSending || !formData.message.trim()}
                            className='px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-bold text-xs rounded-lg transition shadow-md flex items-center gap-1.5 cursor-pointer'
                        >
                            <Send className='size-3' />
                            <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer Status Bar */}
            <div className='bg-[#111220] px-4 py-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400'>
                <span>☕ "Great architectures begin with a cup of tea."</span>
                <span className='font-mono text-cyan-300'>Version 2.8 • Oct 2026</span>
            </div>
        </div>
    )
}

const ContactWindow = WindowWrapper(Contact, 'contact')
export default ContactWindow