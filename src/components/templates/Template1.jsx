import EditableText from "./EditableText";
import ProficiencyRating from "../ProficiencyRating";

const Template1 = ({
  resumeData,
  isEditMode,
  sectionHeadings,
  onFieldChange,
  onArrayItemChange,
  onListItemChange,
  onSectionHeadingChange,
  onProficiencyChange,
}) => {
  const {
    name,
    email,
    phone,
    address,
    summary,
    experience,
    education,
    projects,
    languages,
    profilePicture,
    skills,
    skillProficiency,
    languageProficiency,
  } = resumeData || {};

  const skillItems = skills
    ? skills.split(",").map((item) => item.trim()).filter(Boolean)
    : [];
  const languageItems = languages
    ? languages.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  // Handler for proficiency changes in template
  const handleProficiencyChange = (type, item, level) => {
    if (onProficiencyChange) {
      onProficiencyChange(type, item, level);
    }
  };

  return (
    <div className="template1 w-full bg-white">
      {/* Main two-column layout */}
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-blue-800 to-blue-700 text-white p-8 space-y-8 page-break-avoid">
          {/* Profile Picture */}
          {profilePicture && (
            <div className="flex justify-center">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover object-top border-4 border-white shadow-lg"
              />
            </div>
          )}

          {/* PERSONAL Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider border-b border-blue-600 pb-2">
              PERSONAL
            </h3>
            
            {(name || isEditMode) && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
                  <span className="text-lg">👤</span>
                  <span>Name</span>
                </div>
                <div className="ml-8">
                  <EditableText
                    as="p"
                    value={name || ""}
                    placeholder="Your Name"
                    onChange={(value) => onFieldChange("name", value)}
                    isEditMode={isEditMode}
                    className="text-sm break-words"
                  />
                </div>
              </div>
            )}

            {(address || isEditMode) && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
                  <span className="text-lg">📍</span>
                  <span>Address</span>
                </div>
                <div className="ml-8">
                  <EditableText
                    as="p"
                    value={address || ""}
                    placeholder="Enter your address"
                    onChange={(value) => onFieldChange("address", value)}
                    isEditMode={isEditMode}
                    className="text-sm break-words"
                  />
                </div>
              </div>
            )}

            {(phone || isEditMode) && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
                  <span className="text-lg">📱</span>
                  <span>Phone number</span>
                </div>
                <div className="ml-8">
                  <EditableText
                    as="p"
                    value={phone || ""}
                    placeholder="+92 300 0000000"
                    onChange={(value) => onFieldChange("phone", value)}
                    isEditMode={isEditMode}
                    className="text-sm break-words"
                  />
                </div>
              </div>
            )}

            {(email || isEditMode) && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
                  <span className="text-lg">✉️</span>
                  <span>Email</span>
                </div>
                <div className="ml-8">
                  <EditableText
                    as="p"
                    value={email || ""}
                    placeholder="you@example.com"
                    onChange={(value) => onFieldChange("email", value)}
                    isEditMode={isEditMode}
                    className="text-sm break-words"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SKILLS Section */}
          {skillItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-blue-600 pb-2">
                <EditableText
                  as="span"
                  value={sectionHeadings.skills || "Skills"}
                  placeholder="Skills"
                  onChange={(value) => onSectionHeadingChange("skills", value)}
                  isEditMode={isEditMode}
                  className="inline"
                />
              </h3>
              <div className="space-y-3">
                {skillItems.map((skill, index) => (
                  <div key={index} className="text-sm flex items-center justify-between">
                    <EditableText
                      as="div"
                      value={skill}
                      placeholder="Skill name"
                      onChange={(value) => onListItemChange("skills", index, value)}
                      isEditMode={isEditMode}
                      className="font-medium break-words flex-1"
                    />
                    <ProficiencyRating
                      level={skillProficiency?.[skill] || 3}
                      maxLevel={5}
                      onChange={(level) => handleProficiencyChange("skills", skill, level)}
                      isEditMode={isEditMode}
                      size="small"
                      color="blue"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES Section */}
          {languageItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-blue-600 pb-2">
                <EditableText
                  as="span"
                  value={sectionHeadings.languages || "Languages"}
                  placeholder="Languages"
                  onChange={(value) => onSectionHeadingChange("languages", value)}
                  isEditMode={isEditMode}
                  className="inline"
                />
              </h3>
              <div className="space-y-3">
                {languageItems.map((language, index) => (
                  <div key={index} className="text-sm flex items-center justify-between">
                    <EditableText
                      as="div"
                      value={language}
                      placeholder="Language name"
                      onChange={(value) =>
                        onListItemChange("languages", index, value)
                      }
                      isEditMode={isEditMode}
                      className="font-medium break-words flex-1"
                    />
                    <ProficiencyRating
                      level={languageProficiency?.[language] || 3}
                      maxLevel={5}
                      onChange={(level) => handleProficiencyChange("languages", language, level)}
                      isEditMode={isEditMode}
                      size="small"
                      color="yellow"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Content Area */}
        <div className="w-2/3 bg-white p-8 space-y-8">
          {/* Name Header */}
          <div>
            <EditableText
              as="h1"
              value={name || ""}
              placeholder="Your Name"
              onChange={(value) => onFieldChange("name", value)}
              isEditMode={isEditMode}
              className="text-4xl font-bold text-gray-800 mb-4 break-words uppercase tracking-wider"
            />
            
            {/* Professional Summary */}
            {summary && (
              <div>
                <EditableText
                  as="p"
                  value={summary || ""}
                  placeholder="Write your professional summary"
                  onChange={(value) => onFieldChange("summary", value)}
                  isEditMode={isEditMode}
                  multiline
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-sm"
                />
              </div>
            )}
          </div>

          {/* WORK EXPERIENCE Section with Timeline */}
          {Array.isArray(experience) &&
            experience.some(
              (exp) => exp && (exp.company || exp.role || exp.duration || exp.description)
            ) && (
              <div className="space-y-6 page-break-avoid">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💼</span>
                  <EditableText
                    as="h2"
                    value={sectionHeadings.experience || "WORK EXPERIENCE"}
                    placeholder="Work Experience"
                    onChange={(value) => onSectionHeadingChange("experience", value)}
                    isEditMode={isEditMode}
                    className="text-xl font-bold text-gray-800 uppercase"
                  />
                </div>
                
                <div className="space-y-6 pl-4 relative">
                  {experience
                    .filter(
                      (item) =>
                        item &&
                        (item.company || item.role || item.duration || item.description)
                    )
                    .map((item, index) => {
                      const isFirst = index === 0;
                      return (
                        <div key={index} className="relative pl-6 page-break-avoid">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-1 w-3 h-3 bg-gray-400 rounded-full -ml-1.5"></div>
                          {/* Vertical timeline line - only show after first item */}
                          {!isFirst && (
                            <div className="absolute left-0 -top-5 w-0.5 bg-gray-300" style={{height: 'calc(100% + 10px)'}}></div>
                          )}
                          {/* Vertical timeline line for first item - starts from dot */}
                          {isFirst && (
                            <div className="absolute left-0 top-1 w-0.5 bg-gray-300" style={{height: 'calc(100% - 4px)'}}></div>
                          )}
                        
                          <div className="flex gap-4">
                            <div className="w-20 flex-shrink-0">
                              <EditableText
                                as="p"
                                value={item.duration || ""}
                                placeholder="Jan 2020 - Dec 2021"
                                onChange={(value) =>
                                  onArrayItemChange("experience", index, "duration", value)
                                }
                                isEditMode={isEditMode}
                                className="text-xs text-gray-600 break-words"
                              />
                            </div>
                            <div className="flex-1">
                              <EditableText
                                as="h3"
                                value={item.role || ""}
                                placeholder="Job title"
                                onChange={(value) =>
                                  onArrayItemChange("experience", index, "role", value)
                                }
                                isEditMode={isEditMode}
                                className="font-bold text-gray-800 break-words uppercase"
                              />
                              <EditableText
                                as="p"
                                value={item.company || ""}
                                placeholder="Company name"
                                onChange={(value) =>
                                  onArrayItemChange("experience", index, "company", value)
                                }
                                isEditMode={isEditMode}
                                className="text-sm text-gray-600 break-words"
                              />
                              {item.description && (
                                <div className="mt-2">
                                  <EditableText
                                    as="p"
                                    value={item.description || ""}
                                    placeholder="Describe your work"
                                    onChange={(value) =>
                                      onArrayItemChange(
                                        "experience",
                                        index,
                                        "description",
                                        value
                                      )
                                    }
                                    isEditMode={isEditMode}
                                    multiline
                                    className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

          {/* EDUCATION AND QUALIFICATIONS Section with Timeline */}
          {Array.isArray(education) &&
            education.some(
              (edu) => edu && (edu.institution || edu.degree || edu.field || edu.year)
            ) && (
              <div className="space-y-6 page-break-avoid">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎓</span>
                  <EditableText
                    as="h2"
                    value={sectionHeadings.education || "EDUCATION AND QUALIFICATIONS"}
                    placeholder="Education"
                    onChange={(value) => onSectionHeadingChange("education", value)}
                    isEditMode={isEditMode}
                    className="text-xl font-bold text-gray-800 uppercase"
                  />
                </div>
                
                <div className="space-y-6 pl-4 relative">
                  {education
                    .filter(
                      (item) =>
                        item && (item.institution || item.degree || item.field || item.year)
                    )
                    .map((item, index) => {
                      const isFirst = index === 0;
                      return (
                        <div key={index} className="relative pl-6 page-break-avoid">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-1 w-3 h-3 bg-gray-400 rounded-full -ml-1.5"></div>
                          {/* Vertical timeline line - only show after first item */}
                          {!isFirst && (
                            <div className="absolute left-0 -top-5 w-0.5 bg-gray-300" style={{height: 'calc(100% + 10px)'}}></div>
                          )}
                          {/* Vertical timeline line for first item - starts from dot */}
                          {isFirst && (
                            <div className="absolute left-0 top-1 w-0.5 bg-gray-300" style={{height: 'calc(100% - 4px)'}}></div>
                          )}
                        
                          <div className="flex gap-4">
                            <div className="w-20 flex-shrink-0">
                              <EditableText
                                as="p"
                                value={item.year || ""}
                                placeholder="2020"
                                onChange={(value) =>
                                  onArrayItemChange("education", index, "year", value)
                                }
                                isEditMode={isEditMode}
                                className="text-xs text-gray-600 break-words"
                              />
                            </div>
                            <div className="flex-1">
                              <EditableText
                                as="h3"
                                value={item.degree || ""}
                                placeholder="Degree"
                                onChange={(value) =>
                                  onArrayItemChange("education", index, "degree", value)
                                }
                                isEditMode={isEditMode}
                                className="font-bold text-gray-800 break-words uppercase"
                              />
                              <EditableText
                                as="p"
                                value={item.institution || ""}
                                placeholder="Institution"
                                onChange={(value) =>
                                  onArrayItemChange("education", index, "institution", value)
                                }
                                isEditMode={isEditMode}
                                className="text-sm text-gray-600 break-words"
                              />
                              {item.field && (
                                <EditableText
                                  as="p"
                                  value={item.field || ""}
                                  placeholder="Field of study"
                                  onChange={(value) =>
                                    onArrayItemChange("education", index, "field", value)
                                  }
                                  isEditMode={isEditMode}
                                  className="text-sm text-gray-600 break-words"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

          {/* PROJECTS Section with Timeline */}
          {Array.isArray(projects) &&
            projects.some((proj) => proj.title || proj.description) && (
              <div className="space-y-6 page-break-avoid">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <EditableText
                    as="h2"
                    value={sectionHeadings.projects || "PROJECTS"}
                    placeholder="Projects"
                    onChange={(value) => onSectionHeadingChange("projects", value)}
                    isEditMode={isEditMode}
                    className="text-xl font-bold text-gray-800 uppercase"
                  />
                </div>
                
                <div className="space-y-6 pl-4 relative">
                  {projects
                    .filter((proj) => proj.title || proj.description)
                    .map((proj, index) => {
                      const isFirst = index === 0;
                      return (
                        <div key={index} className="relative pl-6 page-break-avoid">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-1 w-3 h-3 bg-gray-400 rounded-full -ml-1.5"></div>
                          {/* Vertical timeline line - only show after first item */}
                          {!isFirst && (
                            <div className="absolute left-0 -top-5 w-0.5 bg-gray-300" style={{height: 'calc(100% + 10px)'}}></div>
                          )}
                          {/* Vertical timeline line for first item - starts from dot */}
                          {isFirst && (
                            <div className="absolute left-0 top-1 w-0.5 bg-gray-300" style={{height: 'calc(100% - 4px)'}}></div>
                          )}
                        
                          <div className="flex-1">
                            <EditableText
                              as="h3"
                              value={proj.title || ""}
                              placeholder="Project Title"
                              onChange={(value) =>
                                onArrayItemChange("projects", index, "title", value)
                              }
                              isEditMode={isEditMode}
                              className="font-bold text-gray-800 mb-2 break-words uppercase"
                            />
                            <EditableText
                              as="p"
                              value={proj.description || ""}
                              placeholder="Project description"
                              onChange={(value) =>
                                onArrayItemChange("projects", index, "description", value)
                              }
                              isEditMode={isEditMode}
                              multiline
                              className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words"
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Template1;
