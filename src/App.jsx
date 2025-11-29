import { Dock, Navbar, Welcome } from '#components'
import React from 'react'
import gsap from 'gsap'
import { Finder, Resume, Safari, Terminal, Text, Image, Contact, Home } from '#windows'

import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <Image />
      <Contact />
      <Home />
    </main>
  )
}

export default App