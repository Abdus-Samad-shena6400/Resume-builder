import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, ChevronDown } from "lucide-react";
import { setSelectedTemplate, updateResumeData, addExperience, removeExperience, setActiveTab, setActiveExpIndex, setActiveEducationIndex, addEducation, removeEducation } from "./redux";
import AddProject from "./AddProject";
import ProficiencyRating from "./ProficiencyRating";

const TABS = [
  { id: "basic", label: "Basic" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills & Languages" },
  { id: "template", label: "Template" },
];

const getInputClassName = (theme) => `rounded-xl border px-3 py-2.5 text-xs font-medium outline-none shadow-sm transition-all duration-200 disabled:cursor-not-allowed ${
  theme === "dark"
    ? "border-slate-700 bg-slate-900 text-slate-100 focus:border-slate-500 focus:bg-slate-900 focus:ring-2 focus:ring-slate-700/70 disabled:bg-slate-900 disabled:opacity-50"
    : "border-slate-200 bg-slate-50 text-slate-700 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
}`;
const getLabelClassName = (theme) => `mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
  theme === "dark" ? "text-slate-400" : "text-slate-500"
}`;
const sectionWrapperClassName = "grid grid-cols-1 text-xs sm:grid-cols-2 gap-3 animate-[fadeSlide_.25s_ease-out]";
const fieldWrapperClassName = "flex flex-col gap-2";
const buttonClassName = "rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)] transition-all duration-300 hover:bg-emerald-600";
const buttonSecondaryClassName = "rounded-full bg-slate-100 text-slate-700 px-3 py-1.5 text-xs font-semibold transition-all duration-300 hover:bg-slate-200";
const parseListValue = (value) => {
  const items = String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : [""];
};

const ResumeForm = () => {
  const resumeData = useSelector((state) => state.resume);
  const dispatch = useDispatch();
  const { activeTab, activeExpIndex, activeEducationIndex, isEditMode, theme } = resumeData;
  const experience = resumeData.experience || [];
  const education = resumeData.education || [];
  const [skillInputs, setSkillInputs] = React.useState(() =>
    parseListValue(resumeData.skills)
  );
  const [languageInputs, setLanguageInputs] = React.useState(() =>
    parseListValue(resumeData.languages)
  );
  const templateMenuRef = React.useRef(null);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = React.useState(false);
  const activeTabLabel =
    TABS.find((tab) => tab.id === activeTab)?.label || "Basic";
  const templateOptions = [
    { value: 1, label: "Template 1 - Modern" },
    { value: 2, label: "Template 2 - Color Coded" },
    { value: 3, label: "Template 3 - Professional Dark" },
  ];

  React.useEffect(() => {
    setSkillInputs(parseListValue(resumeData.skills));
  }, [resumeData.skills]);

  React.useEffect(() => {
    setLanguageInputs(parseListValue(resumeData.languages));
  }, [resumeData.languages]);

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!templateMenuRef.current?.contains(event.target)) {
        setIsTemplateMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleChange = (field, value) => {
    if (field === "profilePicture" && value) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch(updateResumeData({ [field]: e.target.result }));
      };
      reader.readAsDataURL(value);
    } else {
      dispatch(updateResumeData({ [field]: value }));
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    dispatch(updateResumeData({ experience: updated }));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    dispatch(updateResumeData({ education: updated }));
  };

  const updateListField = (field, items) => {
    dispatch(
      updateResumeData({
        [field]: items.map((item) => item.trim()).filter(Boolean).join(", "),
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

  const handleListInputChange = (field, index, value) => {
    if (field === "skills") {
      const updatedInputs = skillInputs.map((item, itemIndex) =>
        itemIndex === index ? value : item
      );
      setSkillInputs(updatedInputs);
      updateListField("skills", updatedInputs);
      return;
    }

    const updatedInputs = languageInputs.map((item, itemIndex) =>
      itemIndex === index ? value : item
    );
    setLanguageInputs(updatedInputs);
    updateListField("languages", updatedInputs);
  };

  const handleAddListItem = (field) => {
    if (field === "skills") {
      if (!skillInputs[skillInputs.length - 1]?.trim()) return;
      setSkillInputs([...skillInputs, ""]);
      return;
    }

    if (!languageInputs[languageInputs.length - 1]?.trim()) return;
    setLanguageInputs([...languageInputs, ""]);
  };

  const renderBasicTab = () => (
    <div className="space-y-4 animate-[fadeSlide_.25s_ease-out]">
      <div className={sectionWrapperClassName}>
        <div className={fieldWrapperClassName}>
          <label className={getLabelClassName(theme)}>Full Name</label>
          <input type="text" value={resumeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} placeholder="Your full name" className={getInputClassName(theme)} />
        </div>
        <div className={fieldWrapperClassName}>
          <label className={getLabelClassName(theme)}>Email</label>
          <input type="email" value={resumeData.email || ""} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@example.com" className={getInputClassName(theme)} />
        </div>
        <div className={fieldWrapperClassName}>
          <label className={getLabelClassName(theme)}>Phone</label>
          <input type="text" value={resumeData.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+92 326 5760279" className={getInputClassName(theme)} />
        </div>
        <div className={fieldWrapperClassName}>
          <label className={getLabelClassName(theme)}>Address</label>
          <input type="text" value={resumeData.address || ""} onChange={(e) => handleChange("address", e.target.value)} placeholder="City, Country" className={getInputClassName(theme)} />
        </div>
      </div>

      <div className={fieldWrapperClassName}>
        <label className={getLabelClassName(theme)}>Summary</label>
        <textarea rows="2" value={resumeData.summary || ""} onChange={(e) => handleChange("summary", e.target.value)} placeholder="Write your professional summary" className={`${getInputClassName(theme)} resize-none`} />
      </div>

      <div className={fieldWrapperClassName}>
        <label className={getLabelClassName(theme)}>Profile Picture</label>
        <input type="file" accept="image/*" onChange={(e) => handleChange("profilePicture", e.target.files?.[0] || null)} className={`${getInputClassName(theme)} py-1`} />
      </div>
    </div>
  );

  const renderEducationTab = () => (
    <div className="space-y-3 animate-[fadeSlide_.25s_ease-out]">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {education.map((edu, index) => (
          <button
            key={index}
            onClick={() => dispatch(setActiveEducationIndex(index))}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              activeEducationIndex === index
                ? "bg-emerald-500 text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)]"
                : buttonSecondaryClassName
            }`}
          >
            Edu-{index + 1}
          </button>
        ))}
      </div>

      <div className="space-y-3 animate-[fadeSlide_.2s_ease-out]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className={fieldWrapperClassName}>
            <label className={getLabelClassName(theme)}>Institution</label>
            <input type="text" value={education[activeEducationIndex]?.institution || ""} onChange={(e) => handleEducationChange(activeEducationIndex, "institution", e.target.value)} placeholder="School/University name" className={getInputClassName(theme)} />
          </div>
          <div className={fieldWrapperClassName}>
            <label className={getLabelClassName(theme)}>Degree</label>
            <input type="text" value={education[activeEducationIndex]?.degree || ""} onChange={(e) => handleEducationChange(activeEducationIndex, "degree", e.target.value)} placeholder="e.g., Bachelor of Science" className={getInputClassName(theme)} />
          </div>
          <div className={fieldWrapperClassName}>
            <label className={getLabelClassName(theme)}>Field of Study</label>
            <input type="text" value={education[activeEducationIndex]?.field || ""} onChange={(e) => handleEducationChange(activeEducationIndex, "field", e.target.value)} placeholder="e.g., Computer Science" className={getInputClassName(theme)} />
          </div>
          <div className={fieldWrapperClassName}>
            <label className={getLabelClassName(theme)}>Year</label>
            <input type="text" value={education[activeEducationIndex]?.year || ""} onChange={(e) => handleEducationChange(activeEducationIndex, "year", e.target.value)} placeholder="e.g., 2020" className={getInputClassName(theme)} />
          </div>
        </div>
        <div className="flex gap-2 pt-3">
          {education.length > 1 && (
            <button onClick={() => dispatch(removeEducation(activeEducationIndex))} className="flex-1 rounded-full bg-red-500 text-white px-2 py-1.5 text-xs font-semibold shadow-[0_8px_18px_rgba(239,68,68,0.25)] transition-all duration-300 hover:bg-red-600">
              Remove
            </button>
          )}
          <button onClick={() => { dispatch(addEducation({ institution: "", degree: "", field: "", year: "" })); dispatch(setActiveEducationIndex(education.length)); }} className={`flex-1 ${buttonClassName}`}>
            + Add
          </button>
        </div>
      </div>
    </div>
  );

  const renderSkillsTab = () => (
    <div className="space-y-3 animate-[fadeSlide_.25s_ease-out]">
      <div className={sectionWrapperClassName}>
        <div className={fieldWrapperClassName}>
          <label className={getLabelClassName(theme)}>Skills</label>
          <div className="space-y-3">
            {skillInputs.map((skill, index) => (
              <div key={`skill-input-${index}`} className="space-y-2">
                <div className="flex items-stretch gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) =>
                      handleListInputChange("skills", index, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddListItem("skills");
                      }
                    }}
                    placeholder={`Enter skill ${index + 1}`}
                    className={`${getInputClassName(theme)} flex-1`}
                  />
                  {index === skillInputs.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleAddListItem("skills")}
                      title="Add skill"
                      className={`${buttonClassName} h-auto self-stretch`}
                    >
                      Add Skill
                    </button>
                  )}
                </div>
                {skill.trim() && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Proficiency:
                    </span>
                    <ProficiencyRating
                      level={resumeData.skillProficiency?.[skill.trim()] || 3}
                      maxLevel={5}
                      onChange={(level) => handleProficiencyChange("skills", skill.trim(), level)}
                      isEditMode={true}
                      size="small"
                      color="yellow"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={fieldWrapperClassName}>
          <label className={getLabelClassName(theme)}>Languages</label>
          <div className="space-y-3">
            {languageInputs.map((language, index) => (
              <div key={`language-input-${index}`} className="space-y-2">
                <div className="flex items-stretch gap-2">
                  <input
                    type="text"
                    value={language}
                    onChange={(e) =>
                      handleListInputChange("languages", index, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddListItem("languages");
                      }
                    }}
                    placeholder={`Enter language ${index + 1}`}
                    className={`${getInputClassName(theme)} flex-1`}
                  />
                  {index === languageInputs.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleAddListItem("languages")}
                      title="Add language"
                      className={`${buttonClassName} h-auto self-stretch`}
                    >
                      Add Language
                    </button>
                  )}
                </div>
                {language.trim() && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Proficiency:
                    </span>
                    <ProficiencyRating
                      level={resumeData.languageProficiency?.[language.trim()] || 3}
                      maxLevel={5}
                      onChange={(level) => handleProficiencyChange("languages", language.trim(), level)}
                      isEditMode={true}
                      size="small"
                      color="yellow"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExperienceTab = () => (
    <div className="space-y-3 animate-[fadeSlide_.25s_ease-out]">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {experience.map((exp, index) => (
          <button
            key={index}
            onClick={() => dispatch(setActiveExpIndex(index))}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              activeExpIndex === index
                ? "bg-emerald-500 text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)]"
                : buttonSecondaryClassName
            }`}
          >
            Exp-{index + 1}
          </button>
        ))}
      </div>

      <div className="space-y-3 animate-[fadeSlide_.2s_ease-out]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className={fieldWrapperClassName}>
            <label className={getLabelClassName(theme)}>Company</label>
            <input type="text" value={experience[activeExpIndex]?.company || ""} onChange={(e) => handleExperienceChange(activeExpIndex, "company", e.target.value)} placeholder="Company name" className={getInputClassName(theme)} />
          </div>
          <div className={fieldWrapperClassName}>
            <label className={getLabelClassName(theme)}>Role/Position</label>
            <input type="text" value={experience[activeExpIndex]?.role || ""} onChange={(e) => handleExperienceChange(activeExpIndex, "role", e.target.value)} placeholder="Job title" className={getInputClassName(theme)} />
          </div>
        </div>
        <div className={fieldWrapperClassName}>
          <label className={getLabelClassName(theme)}>Duration</label>
          <input type="text" value={experience[activeExpIndex]?.duration || ""} onChange={(e) => handleExperienceChange(activeExpIndex, "duration", e.target.value)} placeholder="e.g., Jan 2020 - Dec 2021" className={getInputClassName(theme)} />
        </div>
        <div className={fieldWrapperClassName}>
          <label className={getLabelClassName(theme)}>Description</label>
          <textarea rows="2" value={experience[activeExpIndex]?.description || ""} onChange={(e) => handleExperienceChange(activeExpIndex, "description", e.target.value)} placeholder="Describe your responsibilities and achievements" className={`${getInputClassName(theme)} resize-none`} />
        </div>
        <div className="flex gap-2 pt-3">
          {experience.length > 1 && (
            <button onClick={() => dispatch(removeExperience(activeExpIndex))} className="flex-1 rounded-full bg-red-500 text-white px-2 py-1.5 text-xs font-semibold shadow-[0_8px_18px_rgba(239,68,68,0.25)] transition-all duration-300 hover:bg-red-600">
              Remove
            </button>
          )}
          <button onClick={() => { dispatch(addExperience()); dispatch(setActiveExpIndex(experience.length)); }} className={`flex-1 ${buttonClassName}`}>
            + Add
          </button>
        </div>
      </div>
    </div>
  );

  const renderTemplateTab = () => (
    <div className="space-y-3 animate-[fadeSlide_.25s_ease-out]">
      <div className={fieldWrapperClassName}>
        <label className={getLabelClassName(theme)}>Select Template</label>
        <div className="relative" ref={templateMenuRef}>
          <button
            type="button"
            onClick={() => setIsTemplateMenuOpen((open) => !open)}
            className={`${getInputClassName(theme)} flex w-full items-center justify-between text-left`}
          >
            <span>
              {templateOptions.find(
                (option) => option.value === (resumeData.selectedTemplate || 1)
              )?.label}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isTemplateMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isTemplateMenuOpen && (
            <div
              className={`absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border shadow-lg animate-[fadeSlide_.18s_ease-out] ${
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
                    resumeData.selectedTemplate === option.value
                      ? "bg-emerald-500 text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)]"
                      : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{option.label}</span>
                  {resumeData.selectedTemplate === option.value && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProjectsTab = () => <AddProject />;

  return (
    <div
      className={`flex h-full w-full mb-3 overflow-hidden flex-col form-panel animate-[fadeSlide_.25s_ease-out] border transition-colors duration-300 ${
        theme === "dark"
          ? "border-slate-800 bg-slate-950"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="relative px-4 pt-4 pb-2">
        <div
          className={`pointer-events-none absolute inset-x-4 bottom-0 h-px ${
            theme === "dark"
              ? "bg-gradient-to-r from-transparent via-slate-700 to-transparent"
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
                Resume Form
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="px-3 py-2 transition-colors duration-300 sm:px-4">
        <div className="flex gap-2 flex-wrap pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveTab(tab.id))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)]"
                  : theme === "dark"
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`flex-1 max-h-[350px] overflow-y-auto p-2 transition-colors duration-300 sm:max-h-[450px] sm:p-3 lg:max-h-[calc(100vh-200px)] ${
          theme === "dark" ? "bg-slate-950" : "bg-white"
        }`}
      >
        {activeTab === "basic" && renderBasicTab()}
        {activeTab === "education" && renderEducationTab()}
        {activeTab === "experience" && renderExperienceTab()}
        {activeTab === "skills" && renderSkillsTab()}
        {activeTab === "projects" && renderProjectsTab()}
        {activeTab === "template" && renderTemplateTab()}
      </div>
    </div>
  );
};

export default ResumeForm;
