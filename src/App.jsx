import { DesktopFooter, Dock, Navbar, Welcome, NotificationCenter } from '#components'
import React from 'react'
import gsap from 'gsap'
import { Finder, Resume, Safari, Terminal, Text, Image, Contact, Home, Chess, ClashDefense, AgentChat } from '#windows'

import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)

const App = () => {
  return (
    <main>
      <Navbar />
      <NotificationCenter />
      <Welcome />
      <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <Image />
      <Contact />
      <Chess />
      <ClashDefense />
      <AgentChat />
      <Home />

      <DesktopFooter />
    </main>
  )
}

export default App