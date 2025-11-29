import { locations } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import { Draggable } from 'gsap/Draggable'
import React from 'react'

const projects = Array.isArray(locations.work?.children) ? locations.work.children : []

const Home = () => {
    const { openWindow } = useWindowStore()
    const { setActiveLocation } = useLocationStore()

    const handleOpenProjectFinder = (project) => {
        setActiveLocation(project)
        openWindow("finder")
    }

    useGSAP(() => {
        Draggable.create(".folder")
    }, [])

    return (
        <section id='home'>
            <ul>
                {
                    projects.map((project) => (
                        <li
                            key={project.id}
                            onClick={() => { console.log('open', project); handleOpenProjectFinder(project) }}
                            className={clsx("group folder", project.windowPosition)}
                        >
                            <img src='/images/folder.png' alt={project.name} />
                            <p>{project.name}</p>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}

export default Home;