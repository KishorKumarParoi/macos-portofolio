import { WindowControls } from '#components';
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import React, { useState } from 'react'
import { FileText, Copy, Check, Terminal, ExternalLink, Sparkles, Code2 } from 'lucide-react'

const Text = () => {
    const { windows } = useWindowStore();
    const data = windows.txtfile?.data;
    const [copiedIndex, setCopiedIndex] = useState(null);

    if (!data) return null;

    const { name, image, subtitle, description } = data;

    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className='w-[720px] max-w-[94vw] max-h-[80vh] flex flex-col bg-[#14141e] text-gray-200 rounded-xl shadow-2xl border border-white/15 select-none overflow-hidden'>
            <div id='window-header' className='bg-[#1c1c2a] px-4 py-2.5 border-b border-white/10 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <WindowControls target="txtfile" />
                    <div className='flex items-center gap-1.5 ml-2'>
                        <FileText className='size-3.5 text-cyan-400' />
                        <h2 className='text-xs font-bold text-white truncate max-w-[420px]'>{name}</h2>
                    </div>
                </div>
                <div className='flex items-center gap-2 text-[10px] text-gray-400 font-mono'>
                    <span>Preview Mode</span>
                </div>
            </div>

            <div className='p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-[#14141e] to-[#0e0e15] text-xs leading-relaxed'>
                {image && (
                    <div className='w-full rounded-xl overflow-hidden border border-white/10 shadow-lg'>
                        <img src={image} alt={name} className='w-full h-auto object-cover max-h-64' />
                    </div>
                )}

                {subtitle && (
                    <div className='p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20'>
                        <h3 className='text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5'>
                            <Sparkles className='size-3 text-cyan-400' />
                            <span>{subtitle}</span>
                        </h3>
                    </div>
                )}

                {Array.isArray(description) && description.length > 0 && (
                    <div className='space-y-3 pt-1'>
                        {description.map((para, idx) => {
                            // If paragraph contains a curl/deploy command
                            const isCommand = para.includes('curl ') || para.includes('docker run') || para.includes('git clone');
                            
                            if (isCommand) {
                                const cleanCmd = para.replace(/^🚀\s*One-Click Deploy Command:\s*/i, '').trim();
                                return (
                                    <div key={idx} className='rounded-xl bg-black/60 border border-cyan-500/30 p-3 my-2'>
                                        <div className='flex items-center justify-between text-[11px] text-cyan-300 font-bold mb-1.5'>
                                            <span className='flex items-center gap-1.5'>
                                                <Terminal className='size-3.5' />
                                                <span>One-Click Production Deploy</span>
                                            </span>
                                            <button
                                                onClick={() => handleCopy(cleanCmd, idx)}
                                                className='flex items-center gap-1 text-[10px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 px-2.5 py-1 rounded-lg transition cursor-pointer'
                                                title='Copy command to clipboard'
                                            >
                                                {copiedIndex === idx ? (
                                                    <>
                                                        <Check className='size-3 text-emerald-400' />
                                                        <span className='text-emerald-400 font-bold'>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className='size-3' />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <pre className='font-mono text-[11px] text-emerald-300 bg-black/40 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap select-all'>
                                            {cleanCmd}
                                        </pre>
                                    </div>
                                );
                            }

                            return (
                                <div key={idx} className='flex items-start gap-2.5 text-gray-300 leading-relaxed text-xs'>
                                    <span className='text-cyan-400 font-bold mt-0.5 shrink-0'>▸</span>
                                    <p className='flex-1'>{para}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className='bg-[#111118] px-4 py-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400 font-mono'>
                <span>Principal AI Architect Documentation</span>
                <span>UTF-8 • Markdown / Plaintext</span>
            </div>
        </div>
    );
};

const TextWindow = WindowWrapper(Text, 'txtfile');
export default TextWindow;