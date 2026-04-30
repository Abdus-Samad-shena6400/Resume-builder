import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateResumeData } from './redux';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyBhSLWikcTBEdQoLWCAAwi1tnsDcfRM1Xs";
const genAI = new GoogleGenerativeAI(API_KEY);

const AIResumeParser = ({ onClose }) => {
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.resume.theme);

  const handleAutoFill = async () => {
    if (!rawText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      
      const prompt = `
        You are an expert resume parser. I will provide you with raw text which may be a resume, a LinkedIn profile export, or just free-form text about someone's professional background.
        
        Extract the information and return it strictly as a JSON object with the following exact structure. Ensure you extract as much relevant information as possible.
        If a field is missing, leave it as an empty string. For arrays, if there are no items, return an empty array [].
        Do NOT wrap the response in markdown blocks like \`\`\`json. Just return the raw JSON object.
        
        Expected JSON Structure:
        {
          "name": "string",
          "email": "string",
          "phone": "string",
          "address": "string",
          "summary": "string",
          "experience": [
            { "company": "string", "role": "string", "duration": "string", "description": "string" }
          ],
          "education": [
            { "institution": "string", "degree": "string", "field": "string", "year": "string" }
          ],
          "projects": [
            { "title": "string", "description": "string" }
          ],
          "skills": "string (comma separated list of skills)",
          "languages": "string (comma separated list of languages)"
        }
        
        Raw Text:
        ${rawText}
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Try to clean up the response in case Gemini added markdown blocks
      const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      const parsedData = JSON.parse(cleanedText);
      
      // Dispatch the data to Redux
      dispatch(updateResumeData(parsedData));
      
      // Close the AI panel
      if (onClose) onClose();
      
    } catch (err) {
      console.error("Error parsing resume with AI:", err);
      setError("Failed to parse the data. Please try again or check your input.");
    } finally {
      setIsLoading(false);
    }
  };

  const bgClass = theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200";
  const inputBgClass = theme === "dark" ? "bg-slate-950 border-slate-700 text-slate-200" : "bg-white border-slate-300 text-slate-800";

  return (
    <div className={`h-full flex flex-col p-4 rounded-xl border shadow-sm animate-[fadeSlide_.25s_ease-out] ${bgClass}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
          ✨ AI Auto-Fill
        </h3>
        <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-700 font-semibold hidden">
          Close
        </button>
      </div>
      
      <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
        Paste your LinkedIn profile text, existing resume, or write a summary of your experience. Our AI will automatically extract and fill the form for you.
      </p>
      
      <textarea
        className={`w-full flex-1 min-h-[200px] p-3 rounded-lg border text-xs outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none mb-4 transition-colors ${inputBgClass}`}
        placeholder="Paste your raw resume data here..."
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        disabled={isLoading}
      />
      
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
      
      <button
        onClick={handleAutoFill}
        disabled={isLoading || !rawText.trim()}
        className={`w-full py-2.5 rounded-full text-xs font-bold text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)] transition-all duration-300 ${
          isLoading || !rawText.trim()
            ? 'bg-emerald-300 cursor-not-allowed opacity-70 shadow-none'
            : 'bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing with AI...
          </span>
        ) : (
          "Auto-Fill Resume"
        )}
      </button>
    </div>
  );
};

export default AIResumeParser;
