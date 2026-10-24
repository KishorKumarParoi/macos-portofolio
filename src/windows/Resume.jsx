import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { Download, FileText, Layers, ZoomIn, ZoomOut } from 'lucide-react'
import React, { useState } from 'react'

import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const Resume = () => {
    const [selectedResume, setSelectedResume] = useState('academic') // 'academic' | 'detailed'
    const [numPages, setNumPages] = useState(1)
    const [scale, setScale] = useState(0.95)

    const resumeFile = selectedResume === 'academic' 
        ? '/files/resume.pdf' 
        : '/files/resume_single_column.pdf'

    const resumeTitle = selectedResume === 'academic'
        ? 'Academic Split Resume (1-Page)'
        : 'Comprehensive ATS Resume (2-Page)'

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
    }

    return (
        <>
            <div id='window-header' className='flex items-center justify-between px-3 py-1.5 border-b border-gray-200 bg-gray-50/90 backdrop-blur-md select-none'>
                <div className='flex items-center gap-2'>
                    <WindowControls target="resume" />
                    <span className='text-xs font-semibold text-gray-700 ml-2'>{resumeTitle}</span>
                </div>

                <div className='flex items-center gap-1.5 bg-gray-200/80 p-0.5 rounded-lg'>
                    <button
                        onClick={() => setSelectedResume('academic')}
                        className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md transition-all ${
                            selectedResume === 'academic'
                                ? 'bg-white text-gray-900 shadow-xs font-semibold'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title="1-Page Academic Split Resume (LaTeX / RUET)"
                    >
                        <FileText size={13} />
                        1-Page Academic
                    </button>
                    <button
                        onClick={() => setSelectedResume('detailed')}
                        className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md transition-all ${
                            selectedResume === 'detailed'
                                ? 'bg-white text-gray-900 shadow-xs font-semibold'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title="2-Page Detailed ATS Single-Column Resume"
                    >
                        <Layers size={13} />
                        2-Page ATS
                    </button>
                </div>

                <div className='flex items-center gap-1.5'>
                    <button
                        onClick={() => setScale((s) => Math.max(0.7, s - 0.1))}
                        className='p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded'
                        title="Zoom Out"
                    >
                        <ZoomOut size={15} />
                    </button>
                    <button
                        onClick={() => setScale((s) => Math.min(1.4, s + 0.1))}
                        className='p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded'
                        title="Zoom In"
                    >
                        <ZoomIn size={15} />
                    </button>

                    <div className='flex items-center gap-1 bg-gray-200/80 p-0.5 rounded-md ml-1'>
                        <span className='text-[10px] font-bold text-gray-500 uppercase px-1'>Get:</span>
                        <a
                            href={resumeFile}
                            download
                            className='flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 bg-[#641C26] text-white rounded hover:bg-[#7b2734] transition shadow-xs'
                            title={`Download ${selectedResume === 'academic' ? '1-Page Academic' : '2-Page Single-Column'} PDF`}
                        >
                            <Download size={11} />
                            PDF
                        </a>
                        <a
                            href={selectedResume === 'academic' ? '/files/resume.docx' : '/files/resume_single_column.docx'}
                            download
                            className='text-[11px] font-semibold px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-xs'
                            title={`Download ${selectedResume === 'academic' ? '1-Page Academic' : '2-Page Single-Column'} Word DOCX`}
                        >
                            DOCX
                        </a>
                        <a
                            href={selectedResume === 'academic' ? '/files/resume.tex' : '/files/resume_single_column.tex'}
                            download
                            className='text-[11px] font-semibold px-2 py-0.5 bg-emerald-700 text-white rounded hover:bg-emerald-800 transition shadow-xs'
                            title={`Download ${selectedResume === 'academic' ? '1-Page Academic' : '2-Page Single-Column'} LaTeX .tex Source`}
                        >
                            LaTeX
                        </a>
                    </div>
                </div>
            </div>

            <div className='max-h-[75vh] overflow-y-auto bg-gray-200/60 p-4 flex flex-col items-center gap-4'>
                <Document
                    file={resumeFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className='flex items-center justify-center p-12 text-sm text-gray-500'>
                            Loading Resume PDF...
                        </div>
                    }
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className='shadow-lg rounded-sm overflow-hidden mb-4 bg-white'>
                            <Page
                                pageNumber={index + 1}
                                scale={scale}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        </div>
                    ))}
                </Document>
            </div>
        </>
    )
}

const ResumeWindow = WindowWrapper(Resume, 'resume')

export default ResumeWindow