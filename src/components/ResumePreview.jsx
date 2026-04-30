import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTemplate, toggleEditMode, updateResumeData } from "./redux";
import Template1 from "./templates/Template1";
import Template2 from "./templates/Template2";
import Template3 from "./templates/Template3";
import { ChevronDown, Check } from "lucide-react";


const ResumePreview = ({ printRef }) => {
  const { selectedTemplate, sectionHeadings, theme, ...resumeData } =
    useSelector((state) => state.resume);
  const isEditMode = true; // Always in edit mode for live two-way binding
  const dispatch = useDispatch();
  const previewScrollRef = React.useRef(null);
  const templateMenuRef = React.useRef(null);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = React.useState(false);
  const templateOptions = [
    { value: 1, label: "Template 1" },
    { value: 2, label: "Template 2" },
    { value: 3, label: "Template 3" },
  ];

  const previousProjectCountRef = React.useRef(
    Array.isArray(resumeData.projects) ? resumeData.projects.length : 0,
  );

  const hasContent =
    resumeData.name ||
    resumeData.email ||
    resumeData.phone ||
    resumeData.address ||
    resumeData.summary ||
    resumeData.skills ||
    (Array.isArray(resumeData.experience) &&
      resumeData.experience.some(
        (exp) => exp.company || exp.role || exp.duration || exp.description,
      )) ||
    (Array.isArray(resumeData.education) &&
      resumeData.education.some(
        (edu) => edu.institution || edu.degree || edu.field || edu.year,
      )) ||
    (Array.isArray(resumeData.projects) &&
      resumeData.projects.some((proj) => proj.title || proj.description)) ||
    resumeData.languages;

  // Removed auto-scroll functionality for projects

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!templateMenuRef.current?.contains(event.target)) {
        setIsTemplateMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const updateField = (field, value) => {
    dispatch(updateResumeData({ [field]: value }));
  };

  const updateArrayItem = (field, index, key, value) => {
    const items = Array.isArray(resumeData[field]) ? resumeData[field] : [];
    const updatedItems = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item,
    );

    dispatch(updateResumeData({ [field]: updatedItems }));
  };

  const updateDelimitedFieldItem = (field, index, value) => {
    // Split existing items while preserving empty ones for correct positioning
    let items = String(resumeData[field] || "")
      .split(",")
      .map((item) => item.trim());

    // Ensure array is large enough for the index
    while (items.length <= index) {
      items.push("");
    }

    // Update the specific item
    items[index] = value.trim();

    // Filter out empty items and rejoin
    const nonEmptyItems = items.filter((item) => item.length > 0);
    
    dispatch(updateResumeData({ [field]: nonEmptyItems.join(", ") }));
  };

  const updateSectionHeading = (key, value) => {
    dispatch(
      updateResumeData({
        sectionHeadings: {
          ...sectionHeadings,
          [selectedTemplate]: {
            ...sectionHeadings?.[selectedTemplate],
            [key]: value,
          },
        },
      })
    );
  };

  const handleProficiencyChange = (type, item, level) => {
    const proficiencyField = type === "skills" ? "skillProficiency" : "languageProficiency";
    const currentProficiency = resumeData[proficiencyField] || {};
    const updatedProficiency = {
      ...currentProficiency,
      [item]: level
    };
    dispatch(updateResumeData({ [proficiencyField]: updatedProficiency }));
  };

  const templateProps = {
    resumeData,
    isEditMode,
    sectionHeadings: sectionHeadings?.[selectedTemplate] || {},
    onFieldChange: updateField,
    onArrayItemChange: updateArrayItem,
    onListItemChange: updateDelimitedFieldItem,
    onSectionHeadingChange: updateSectionHeading,
    onProficiencyChange: handleProficiencyChange,
  };

  return (
    <div className={`flex h-full w-full flex-col gap-0 animate-[fadeSlide_.25s_ease-out] mb-3 border overflow-hidden transition-colors duration-300 ${
      theme === "dark"
        ? "bg-slate-950 border-slate-800"
        : "bg-white border-slate-200"
    }`}>
      <div className="relative px-4 pt-4 pb-2 z-50">
        <div
          className={`pointer-events-none absolute inset-x-4 bottom-0 h-px ${
            theme === "dark"
              ? "bg-gradient-to-r from-transparent via-slate-600 to-transparent"
              : "bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          }`}
        />
        <div className="flex items-center justify-between gap-3 animate-[fadeSlide_.45s_ease-out]">
          <div className="flex items-center gap-3">
           
            <div>
              <p
                className={`panel-heading text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                  theme === "dark" ? "panel-heading-dark" : "panel-heading-light"
                }`}
              >
                Resume Preview
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 rounded-full px-2 py-1.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
              theme === "dark"
                ? "bg-slate-700/60 ring-1 ring-slate-600/80"
                : "bg-white/80 ring-1 ring-slate-200"
            }`
          }>
            <div className="relative" ref={templateMenuRef}>
              <button
                type="button"
                onClick={() => setIsTemplateMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)] transition-all duration-300 hover:bg-emerald-600"
              >
                <span>
                  {templateOptions.find((option) => option.value === selectedTemplate)?.label}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isTemplateMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

            {isTemplateMenuOpen && (
              <div
                className={`absolute right-0 z-20 mt-2 min-w-[156px] overflow-hidden rounded-2xl border shadow-lg animate-[fadeSlide_.18s_ease-out] ${
                  theme === "dark"
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                {templateOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      dispatch(setSelectedTemplate(option.value));
                      setIsTemplateMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-xs font-semibold transition-all duration-200 rounded-full ${
                    selectedTemplate === option.value
                      ? "bg-emerald-500 text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)]"
                      : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-slate-600 hover:bg-slate-50"
                  }`}
                  >
                    <span>{option.label}</span>
                    {selectedTemplate === option.value && (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
      <div
        ref={previewScrollRef}
        className={`flex-1 w-full overflow-y-auto p-2 md:p-3 transition-colors duration-300 ${
          theme === "dark" ? "bg-slate-950" : "bg-white"
        }`}
      >
        {!hasContent ? (
          <div className="flex h-64 items-center justify-center animate-fade-in">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src="/images/logo.jpg"
                    alt=""
                  />
                </div>
              </div>
              <h3 className={`mb-2 text-base font-bold transition-colors duration-300 ${
                theme === "dark" ? "text-slate-200" : "text-slate-800"
              }`}>
                Resume Preview
              </h3>
              <p className={`text-xs transition-colors duration-300 ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}>
                Start filling out the form to see your resume preview here
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center animate-scale-in">
            <div ref={printRef} className="w-full">
              {selectedTemplate === 1 && <Template1 {...templateProps} />}
              {selectedTemplate === 2 && <Template2 {...templateProps} />}
              {selectedTemplate === 3 && <Template3 {...templateProps} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
