import { WindowControls } from '#components';
import { socials } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import { ContactIcon, Mail, MapPin, Briefcase, ExternalLink, Sparkles, Send } from 'lucide-react';
import React, { useState } from 'react'

const Contact = () => {
    const [hoveredId, setHoveredId] = useState(null)

    return (
        <>
            <div id='window-header'>
                <WindowControls target="contact" />
                <div className='flex items-center gap-2'>
                    <Sparkles className='size-3.5 text-amber-400' />
                    <h2 className='font-semibold'>Contact Me</h2>
                </div>
                <div className='w-14' />
            </div>

            <div className='bg-gradient-to-br from-[#0f0f1a] via-[#141425] to-[#0a0a18] text-white p-0 overflow-hidden'>
                {/* Hero Header with Profile */}
                <div className='relative overflow-hidden'>
                    {/* Animated gradient orbs */}
                    <div className='absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 blur-3xl animate-pulse' />
                    <div className='absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-emerald-500/15 to-cyan-400/15 blur-2xl' style={{ animationDelay: '1s', animationDuration: '3s' }} />

                    <div className='relative flex items-center gap-5 p-6 pb-4'>
                        {/* Profile Image with glowing ring */}
                        <div className='relative group'>
                            <div className='absolute -inset-1 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur-sm transition-opacity duration-500' />
                            <img
                                src='/images/Kishor.jpeg'
                                alt='Kishor Paroi'
                                className='relative w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-2xl'
                            />
                            {/* Online indicator */}
                            <div className='absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#141425] shadow-lg shadow-emerald-400/50' />
                        </div>

                        <div className='flex-1'>
                            <h3 className='text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent'>
                                Kishor Kumar Paroi
                            </h3>
                            <p className='text-sm text-gray-400 mt-0.5 flex items-center gap-1.5'>
                                <Briefcase className='size-3.5 text-amber-400' />
                                Principal AI/ML Systems & Lakehouse Architect
                            </p>
                            <p className='text-xs text-gray-500 mt-1 flex items-center gap-1'>
                                <MapPin className='size-3 text-pink-400' />
                                Dhaka, Bangladesh
                                <span className='mx-1 text-gray-700'>•</span>
                                <span className='text-emerald-400 font-medium'>Open to Opportunities</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions: Email & WhatsApp */}
                <div className='px-6 pb-3 flex gap-3'>
                    <a
                        href='mailto:Kishor.ruet.cse@gmail.com'
                        className='flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 group'
                        title='Email me'
                    >
                        <Mail className='size-4 group-hover:rotate-12 transition-transform' />
                        <span>Email Me</span>
                        <Send className='size-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all' />
                    </a>

                    <a
                        href='https://wa.me/8801724714156?text=Hi%20Kishor,%20I%20saw%20your%20portfolio.'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-300 group'
                        title='Chat on WhatsApp'
                    >
                        <ContactIcon className='size-4 group-hover:scale-110 transition-transform' />
                        <span>WhatsApp</span>
                        <ExternalLink className='size-3 opacity-0 group-hover:opacity-100 transition-all' />
                    </a>
                </div>

                {/* Info Cards */}
                <div className='px-6 pb-3 grid grid-cols-2 gap-2.5'>
                    <div className='bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-colors group'>
                        <p className='text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1'>Email</p>
                        <p className='text-xs text-gray-300 font-mono truncate group-hover:text-blue-400 transition-colors'>Kishor.ruet.cse@gmail.com</p>
                    </div>
                    <div className='bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-colors group'>
                        <p className='text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1'>Phone</p>
                        <p className='text-xs text-gray-300 font-mono group-hover:text-emerald-400 transition-colors'>+880 1724-714-156</p>
                    </div>
                </div>

                {/* Social Links Grid */}
                <div className='px-6 pb-5'>
                    <p className='text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2.5'>Connect & Explore</p>
                    <div className='grid grid-cols-1 gap-2'>
                        {
                            socials.map(({ id, bg, link, icon, text }) => (
                                <a
                                    key={id}
                                    href={link}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    title={text}
                                    onMouseEnter={() => setHoveredId(id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className='flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 group'
                                    style={{
                                        backgroundColor: hoveredId === id ? `${bg}22` : 'rgba(255,255,255,0.03)',
                                        borderColor: hoveredId === id ? `${bg}66` : 'rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <div
                                        className='w-9 h-9 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'
                                        style={{ backgroundColor: bg }}
                                    >
                                        <img src={icon} alt={text} className='size-5 invert' />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm font-semibold text-gray-200 group-hover:text-white transition-colors'>{text}</p>
                                        <p className='text-[10px] text-gray-500 truncate'>{link}</p>
                                    </div>
                                    <ExternalLink className='size-3.5 text-gray-600 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all' />
                                </a>
                            ))
                        }
                    </div>
                </div>

                {/* Footer Tagline & Live Visitor Telemetry */}
                <div className='border-t border-white/10 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/30'>
                    <p className='text-[11px] text-gray-400 italic text-center sm:text-left'>
                        "Building resilient AI systems &amp; architectures." ✨
                    </p>
                    <div className='flex items-center gap-2'>
                        <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-medium'>
                            <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse'></span>
                            <span>Live Status</span>
                        </div>
                        <span className='text-[10px] text-gray-400'>Updated: Oct 2026 (v2.5)</span>
                    </div>
                </div>
            </div>
        </>
    )
}

const ContactWindow = WindowWrapper(Contact, 'contact');

export default ContactWindow