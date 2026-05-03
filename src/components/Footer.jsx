import React from 'react';
import { useSelector } from 'react-redux';

const Footer = () => {
  const theme = useSelector((state) => state.resume.theme);
  const bgClass = theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-slate-100 border-slate-200";
  const textClass = theme === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <footer className={`border-t ${bgClass} py-4 px-4 sm:px-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Profile Image with Animation */}
        <div className="animate-[pulse_.3s_ease-in-out] hover:scale-110 transition-transform duration-300">
          <img
            src="/images/profile.jpeg"
            alt="Abdus Samad"
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Creator Text */}
        <div className="text-center sm:text-left">
          <p className={`text-sm font-medium ${textClass}`}>
            Created by <span className="font-bold text-emerald-500">Abdus Samad</span>
          </p>
          <p className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-500"}`}>
            Professional Resume Builder
          </p>
        </div>

        {/* Decorative Element */}
        <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-emerald-500 to-transparent opacity-30"></div>

        {/* Additional Info */}
        <div className={`text-xs ${textClass} text-center sm:text-left`}>
          <p>✨ Built with React & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
