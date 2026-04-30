import {
  Header,
  ResumeForm,
  ResumePreview,
} from './components'
import './App.css'
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { createPDFDownloadHandler } from './utils/pdfUtils';


function App() {
  const printRef = useRef();
  const theme = useSelector((state) => state.resume.theme);
  const surfaceClass = theme === "dark" ? "bg-slate-950" : "bg-white";
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePDFDownload = createPDFDownloadHandler(printRef, 'resume.pdf', setIsGeneratingPDF);

  useEffect(() => {
    const backgroundColor = "#ffffff";
    document.body.style.backgroundColor = backgroundColor;
    document.documentElement.style.backgroundColor = backgroundColor;
  }, [theme]);

  return (
    <div className={`flex h-full w-full flex-col transition-colors duration-300 ${surfaceClass}`}>
      <Header handlePDFDownload={handlePDFDownload} isGeneratingPDF={isGeneratingPDF} />

      <div className={`flex-1 flex flex-col lg:flex-row gap-2 px-2 sm:px-3 py-2 transition-colors duration-300 ${surfaceClass} overflow-hidden`}>
        <div className="w-full lg:w-1/2 min-h-0 animate-[slideInLeft_.4s_ease-out]">
          <ResumeForm />
        </div>

        <div className="w-full lg:w-1/2 min-h-0 animate-[slideInRight_.4s_ease-out]">
          <ResumePreview printRef={printRef}  />
        </div>
      </div>
    </div>
  )
}

export default App
