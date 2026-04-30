import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Moon, SunMedium, Loader2 } from "lucide-react";
import { toggleTheme } from "./redux";

function Header({ handlePDFDownload, isGeneratingPDF }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.resume.theme);

  return (
    <div
      className={`w-full transition-all duration-300 ${
        theme === "dark" ? "bg-slate-950" : "bg-white"
      }`}
    >
      <div className="relative px-4 pt-4 pb-2">
        <div className="flex items-center justify-between gap-3 animate-[fadeSlide_.45s_ease-out]">
          <div className="flex items-center gap-3">
           

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full transition-all duration-300 hover:scale-105">
                <img
                  src="../images/logo.jpg"
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h1
                  className={`brand-title text-sm font-bold tracking-[0.18em] uppercase transition-colors duration-300 ${
                    theme === "dark" ? "brand-title-dark" : "brand-title-light"
                  }`}
                >
                  Make My Resume
                </h1>
                <p
                  className={`brand-subtitle text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Professional Resume Builder
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full px-2 py-1.5 transition-all duration-300 hover:-translate-y-0.5">
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                theme === "dark"
                  ? "bg-amber-400 text-slate-900 shadow-[0_8px_18px_rgba(251,191,36,0.25)] hover:bg-amber-300"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? (
                <SunMedium className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={handlePDFDownload}
              disabled={isGeneratingPDF}
              className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)] transition-all duration-300 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              title={isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
            >
              {isGeneratingPDF ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
