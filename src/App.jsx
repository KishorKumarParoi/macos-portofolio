import { DesktopFooter, Dock, Navbar, Welcome, NotificationCenter, LockScreen } from '#components'
import React from 'react'
import gsap from 'gsap'
import { Finder, Resume, Safari, Terminal, Text, Image, Contact, Home, Chess, ClashDefense, AgentChat, Journey } from '#windows'

import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)

const App = () => {
  return (
    <main>
      <LockScreen />
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
      <Journey />
      <Home />

      <DesktopFooter />
    </main>
  )
}

export default App