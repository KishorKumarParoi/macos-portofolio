import { Dock, Navbar, Welcome } from '#components'
import React from 'react'
import gsap from 'gsap'
import { Terminal } from '#windows'

import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />

      <Terminal />
    </main>
  )
}

export default App