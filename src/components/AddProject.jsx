import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProject, updateProjects, removeProject, setActiveProjectIndex } from "./redux";

function AddProject() {
    const resumeData = useSelector((state) => state.resume);
    const { theme } = resumeData;
    
    const getInputClassName = (theme) => `rounded-xl border px-3 py-2.5 text-xs font-medium outline-none shadow-sm transition-all duration-200 disabled:cursor-not-allowed ${
      theme === "dark"
        ? "border-slate-700 bg-slate-900 text-slate-100 focus:border-slate-500 focus:bg-slate-900 focus:ring-2 focus:ring-slate-700/70 disabled:bg-slate-900 disabled:opacity-50"
        : "border-slate-200 bg-slate-50 text-slate-700 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
    }`;
    
    const getLabelClassName = (theme) => `mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
      theme === "dark" ? "text-slate-400" : "text-slate-500"
    }`;
    
    const buttonClassName = "rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)] transition-all duration-300 hover:bg-emerald-600";
    const buttonSecondaryClassName = "rounded-full bg-slate-100 text-slate-700 px-3 py-1.5 text-xs font-semibold transition-all duration-300 hover:bg-slate-200";
    
    const dispatch = useDispatch();
    const { activeProjectIndex, isEditMode } = resumeData;

    const projects = Array.isArray(resumeData.projects) && resumeData.projects.length > 0
      ? resumeData.projects
      : [{ title: "", description: "" }];

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = projects.map((project, projectIndex) =>
            projectIndex === index ? { ...project, [field]: value } : project
        );
        dispatch(updateProjects(updatedProjects));
    };

    return (
        <div className="flex h-full w-full flex-col gap-3 animate-[fadeSlide_.25s_ease-out]">
            {projects.length > 0 && (
                <>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {projects.map((project, index) => (
                            <button
                                key={index}
                                onClick={() => dispatch(setActiveProjectIndex(index))}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                                    activeProjectIndex === index
                                        ? "bg-emerald-500 text-white shadow-[0_8px_18px_rgba(16,185,129,0.25)]"
                                        : buttonSecondaryClassName
                                }`}
                            >
                                Pro-{index + 1}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 min-h-0 space-y-3 animate-[fadeSlide_.25s_ease-out]">
                        <div className={`flex flex-col`}>
                            <label className={getLabelClassName(theme)}>Project Title</label>
                            <input
                                type="text"
                                value={projects[activeProjectIndex]?.title || ""}
                                onChange={(e) => handleProjectChange(activeProjectIndex, "title", e.target.value)}
                                placeholder="Enter project title"
                                className={getInputClassName(theme)}
                                autoFocus
                            />
                        </div>

                        <div className={`flex flex-col`}>
                            <label className={getLabelClassName(theme)}>Project Description</label>
                            <textarea
                                rows="2"
                                value={projects[activeProjectIndex]?.description || ""}
                                onChange={(e) => handleProjectChange(activeProjectIndex, "description", e.target.value)}
                                placeholder="Enter project description"
                                className={`${getInputClassName(theme)} resize-none`}
                            />
                        </div>

                        <div className="flex gap-2 pt-3">
                            {projects.length > 1 && (
                                <button
                                    onClick={() => dispatch(removeProject(activeProjectIndex))}
                                    className="flex-1 rounded-full bg-red-500 text-white px-2 py-1.5 text-xs font-semibold shadow-[0_8px_18px_rgba(239,68,68,0.25)] transition-all duration-300 hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            )}
                            <button
                                onClick={() => { dispatch(addProject()); dispatch(setActiveProjectIndex(projects.length)); }}
                                className={`flex-1 ${buttonClassName}`}
                            >
                                + Add
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AddProject;
