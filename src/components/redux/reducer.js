import { initialState } from "./state";

export function resumeReducer(state = initialState, action) {

  switch (action.type) {
    case "updateResumeData":
      return { ...state, ...action.payload };
    case "setSelectedTemplate":
      return { ...state, selectedTemplate: action.payload };
    case "setActiveTab":
      return { ...state, activeTab: action.payload };
    case "setActiveExpIndex":
      return { ...state, activeExpIndex: action.payload };
    case "setActiveProjectIndex":
      return { ...state, activeProjectIndex: action.payload };
    case "setActiveEducationIndex":
      return { ...state, activeEducationIndex: action.payload };
    case "toggleEditMode":
      return { ...state, isEditMode: !state.isEditMode };
    case "toggleTheme":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    case "resetResumeData":
      return initialState;

    case "addEducation":
      return { ...state, education: [...state.education, action.payload] };

    case "updateEducation":
      const updatedEducation = state.education.map((edu, i) =>
        i === action.payload.index ? action.payload.data : edu
      );
      return { ...state, education: updatedEducation };

    case "removeEducation":
      const filteredEducation = state.education.filter((_, i) => i !== action.payload);
      return { ...state, education: filteredEducation };  

    case "addExperience":
      return { ...state, experience: [...state.experience, { company: "", role: "", duration: "", description: "" }] };

    case "updateExperience":
      return { ...state, experience: action.payload };

    case "removeExperience":
      const updatedExp = state.experience.filter((_, i) => i !== action.payload);
      return { 
        ...state, 
        experience: updatedExp,
        activeExpIndex: state.activeExpIndex >= updatedExp.length && state.activeExpIndex > 0 
          ? state.activeExpIndex - 1 
          : state.activeExpIndex
      };

   

    case "addProject":
      return {
        ...state,
        projects: [...state.projects, { title: "", description: "" }],
      };
    case "updateProjects":
      return {
        ...state,
        projects: action.payload,
      };
    case "removeProject":
      const updatedProjects = state.projects.filter((_, i) => i !== action.payload);
      return {
        ...state,
        projects: updatedProjects,
        activeProjectIndex: state.activeProjectIndex >= updatedProjects.length && state.activeProjectIndex > 0
          ? state.activeProjectIndex - 1
          : state.activeProjectIndex
      };

    default:
      return state;
  }
}

export default resumeReducer;
