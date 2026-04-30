import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExperience, updateExperience, removeExperience } from "./redux";

function AddExperience() {
  const dispatch = useDispatch();
  const resumeData = useSelector((state) => state.resume);
  const [activeExpTab, setActiveExpTab] = React.useState(0);

  const experience = resumeData.experience || [];

  const inputClassName =
    "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none shadow-sm transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200";

  const labelClassName = "mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500";

  const handleExperienceChange = (index, field, value) => {
    const updated = experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    dispatch(updateExperience(updated));
  };

  const handleAdd = () => {
    dispatch(addExperience());
    setActiveExpTab(experience.length);
  };

  const handleRemove = (index) => {
    dispatch(removeExperience(index));
    if (activeExpTab >= experience.length - 1 && activeExpTab > 0) {
      setActiveExpTab(activeExpTab - 1);
    }
  };

  
  React.useEffect(() => {
    if (experience.length > 0 && activeExpTab >= experience.length) {
      setActiveExpTab(experience.length - 1);
    }
  }, [experience.length, activeExpTab]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {experience.map((exp, index) => (
          <button
            key={index}
            onClick={() => setActiveExpTab(index)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              activeExpTab === index
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {exp.company || `Experience ${index + 1}`}
          </button>
        ))}
      </div>

      {/* Active experience */}
      {experience.length > 0 && (
        <div className="flex-1 min-h-0 space-y-4 animate-[fadeSlide_.25s_ease-out] rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <label className={labelClassName}>Company</label>
            <input
              type="text"
              value={experience[activeExpTab]?.company || ""}
              onChange={(e) =>
                handleExperienceChange(activeExpTab, "company", e.target.value)
              }
              placeholder="Company name"
              className={inputClassName}
              autoFocus
            />
          </div>

          <div>
            <label className={labelClassName}>Role/Position</label>
            <input
              type="text"
              value={experience[activeExpTab]?.role || ""}
              onChange={(e) =>
                handleExperienceChange(activeExpTab, "role", e.target.value)
              }
              placeholder="Job title"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Duration</label>
            <input
              type="text"
              value={experience[activeExpTab]?.duration || ""}
              onChange={(e) =>
                handleExperienceChange(activeExpTab, "duration", e.target.value)
              }
              placeholder="e.g., Jan 2020 - Dec 2021"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Description</label>
            <textarea
              rows="4"
              value={experience[activeExpTab]?.description || ""}
              onChange={(e) =>
                handleExperienceChange(activeExpTab, "description", e.target.value)
              }
              placeholder="Describe your responsibilities and achievements"
              className={`${inputClassName} resize-none`}
            />
          </div>

         
          {experience.length > 1 && (
            <button
              onClick={() => handleRemove(activeExpTab)}
              className="rounded-lg bg-red-500 text-white px-4 py-2 text-sm font-semibold hover:bg-red-600 transition-all duration-200"
            >
              Remove This Experience
            </button>
          )}
        </div>
      )}

      
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105"
        >
          + Add Experience
        </button>
      </div> 
    </div>
  );
}

export default AddExperience;
