import { WindowControls } from '#components';
import { socials } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import { ContactIcon, Mail } from 'lucide-react';
import React from 'react'

const Contact = () => {
    return (
        <>
            <div id='window-header'>
                <WindowControls target="contact" />
                <h2>Contact Me</h2>
            </div>

            <div className='p-5 space-y-5'>
                <img
                    src='/images/Kishor.jpeg'
                    alt='Kishor Paroi'
                // className=' rounded-full'
                />
                <h3>Let's Connect</h3>
                <p>Got an Idea! A bug to Squash? Or just wanna talk tech? I'm in. Allow me
                    to Invite you over a coffee. Just Ping me.
                </p>

                <div className='flex flex-wrap gap-4 items-center mt-4'>
                    <a
                        href='mailto:Kishor.ruet.cse@gmail.com'
                        className='flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 text-white text-sm shadow hover:scale-105 transition'
                        title='Email me'
                    >
                        <Mail className='size-4' />
                        <span className='font-medium'>Kishor.ruet.cse@gmail.com</span>
                    </a>

                    <a
                        href='https://wa.me/8801724714156?text=Hi%20Kishor,%20I%20saw%20your%20portfolio.'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-green-500 to-emerald-500 text-white text-sm shadow hover:scale-105 transition'
                        title='Chat on WhatsApp'
                    >
                        <ContactIcon className='size-5' />
                        <span className='font-medium'>WhatsApp: +880 1724-714-156</span>
                    </a>
                </div>

                <ul>
                    {
                        socials.map(({ id, bg, link, icon, text }) => (
                            <li key={id} style={{ backgroundColor: bg }}>
                                <a href={link}
                                    target='__blank'
                                    rel='noopener noreferrer'
                                    title={text}
                                >
                                    <img src={icon} alt={text} className='size-5' />
                                    <p>{text}</p>
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

const ContactWindow = WindowWrapper(Contact, 'contact');

export default ContactWindow