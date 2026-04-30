import EditableText from "./EditableText";

const Template2 = ({
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
    profession,
    email,
    phone,
    address,
    summary,
    experience,
    education,
    projects = [],
    languages,
    skills,
    profilePicture,
  } = resumeData || {};

  const skillItems = skills
    ? skills.split(",").map((item) => item.trim()).filter(Boolean)
    : [];
  const languageItems = languages
    ? languages.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  const SectionHeading = ({ title, placeholder, field, onHeadingChange }) => (
    <div className="relative mb-6 flex items-center">
      <div 
        className="relative px-6 py-2 uppercase font-bold tracking-widest z-10 text-white"
        style={{ paddingRight: '2.5rem' }}
      >
        <svg className="absolute inset-0 w-full h-full -z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="0,0 92,0 100,50 92,100 0,100" fill="#0b1c5a" />
        </svg>
        <EditableText
          as="span"
          value={title}
          placeholder={placeholder}
          onChange={(value) => onHeadingChange(field, value)}
          isEditMode={isEditMode}
          className="inline-block relative z-10"
        />
      </div>
      <div className="flex-grow h-px bg-gray-300 ml-[-1rem]"></div>
    </div>
  );

  const RightSectionHeading = ({ title, placeholder, field, onHeadingChange }) => (
    <div className="mb-6">
      <EditableText
        as="h2"
        value={title}
        placeholder={placeholder}
        onChange={(value) => onHeadingChange(field, value)}
        isEditMode={isEditMode}
        className="text-lg font-bold text-white uppercase tracking-widest mb-2"
      />
      <div className="w-12 h-1 bg-white mb-6"></div>
    </div>
  );

  return (
    <div className="template2 w-full bg-white flex min-h-[1123px] relative shadow-lg overflow-hidden pb-12">
      
      {/* LEFT COLUMN */}
      <div className="w-[60%] bg-white flex flex-col">
        
        {/* Name and Profession Header */}
        <div className="relative h-48 mb-8">
          <div className="absolute inset-0 flex flex-col justify-center pl-12 pr-20 text-white z-10">
            <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polygon points="0,0 100,0 85,100 0,100" fill="#0b1c5a" />
            </svg>
            <EditableText
              as="h1"
              value={name || ""}
              placeholder="NAME SURNAME"
              onChange={(value) => onFieldChange("name", value)}
              isEditMode={isEditMode}
              className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-2"
            />
            <EditableText
              as="h2"
              value={profession || resumeData.role || ""}
              placeholder="PROFESSION HERE"
              onChange={(value) => onFieldChange("profession", value)}
              isEditMode={isEditMode}
              className="text-lg uppercase tracking-widest text-gray-300"
            />
          </div>
        </div>

        <div className="px-12 pb-12 flex-grow space-y-10">
          
          {/* About Me Section */}
          {(summary || isEditMode) && (
            <div className="page-break-avoid">
              <SectionHeading 
                title={sectionHeadings?.[2]?.summary || "ABOUT ME"} 
                placeholder="ABOUT ME"
                field="summary"
                onHeadingChange={onSectionHeadingChange}
              />
              <EditableText
                as="p"
                value={summary || ""}
                placeholder="Write your professional summary"
                onChange={(value) => onFieldChange("summary", value)}
                isEditMode={isEditMode}
                multiline
                className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap text-justify"
              />
            </div>
          )}

          {/* Education Section */}
          {Array.isArray(education) &&
            education.some(
              (edu) => edu && (edu.institution || edu.degree || edu.field || edu.year)
            ) && (
              <div className="page-break-avoid">
                <SectionHeading 
                  title={sectionHeadings?.[2]?.education || "EDUCATION"} 
                  placeholder="EDUCATION"
                  field="education"
                  onHeadingChange={onSectionHeadingChange}
                />
                <div className="space-y-6">
                  {education.map((item, index) => (
                    item && (item.institution || item.degree || item.field || item.year) ? (
                      <div key={index} className="flex gap-6">
                        <div className="w-1/4 flex-shrink-0">
                          <EditableText
                            as="p"
                            value={item.year || ""}
                            placeholder="Year"
                            onChange={(value) => onArrayItemChange("education", index, "year", value)}
                            isEditMode={isEditMode}
                            className="text-sm font-bold text-gray-800"
                          />
                        </div>
                        <div className="w-3/4 pb-6 border-b border-gray-200">
                          <EditableText
                            as="h3"
                            value={item.degree || ""}
                            placeholder="Degree"
                            onChange={(value) => onArrayItemChange("education", index, "degree", value)}
                            isEditMode={isEditMode}
                            className="font-bold text-[#0b1c5a] text-base uppercase mb-1"
                          />
                          <EditableText
                            as="p"
                            value={item.institution || ""}
                            placeholder="Institution"
                            onChange={(value) => onArrayItemChange("education", index, "institution", value)}
                            isEditMode={isEditMode}
                            className="text-sm text-gray-600 uppercase"
                          />
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
          )}

          {/* Experience Section */}
          {Array.isArray(experience) &&
            experience.some(
              (exp) => exp && (exp.company || exp.role || exp.duration || exp.description)
            ) && (
              <div className="page-break-avoid">
                <SectionHeading 
                  title={sectionHeadings?.[2]?.experience || "EXPERIENCE"} 
                  placeholder="EXPERIENCE"
                  field="experience"
                  onHeadingChange={onSectionHeadingChange}
                />
                <div className="space-y-6">
                  {experience.map((item, index) => (
                    item && (item.company || item.role || item.duration || item.description) ? (
                      <div key={index} className="flex gap-6">
                        <div className="w-1/4 flex-shrink-0">
                          <EditableText
                            as="p"
                            value={item.duration || ""}
                            placeholder="Duration"
                            onChange={(value) => onArrayItemChange("experience", index, "duration", value)}
                            isEditMode={isEditMode}
                            className="text-sm font-bold text-gray-800"
                          />
                        </div>
                        <div className="w-3/4 pb-6 border-b border-gray-200">
                          <EditableText
                            as="h3"
                            value={item.role || ""}
                            placeholder="Job Title"
                            onChange={(value) => onArrayItemChange("experience", index, "role", value)}
                            isEditMode={isEditMode}
                            className="font-bold text-[#0b1c5a] text-base uppercase mb-1"
                          />
                          <EditableText
                            as="p"
                            value={item.company || ""}
                            placeholder="Company"
                            onChange={(value) => onArrayItemChange("experience", index, "company", value)}
                            isEditMode={isEditMode}
                            className="text-sm text-gray-600 uppercase mb-3"
                          />
                          <EditableText
                            as="p"
                            value={item.description || ""}
                            placeholder="Description"
                            onChange={(value) => onArrayItemChange("experience", index, "description", value)}
                            isEditMode={isEditMode}
                            multiline
                            className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap text-justify"
                          />
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
          )}

          {/* Projects Section */}
          {Array.isArray(projects) &&
            projects.some(
              (proj) => proj && (proj.title || proj.description)
            ) && (
              <div className="page-break-avoid">
                <SectionHeading 
                  title={sectionHeadings?.[2]?.projects || "PROJECTS"} 
                  placeholder="PROJECTS"
                  field="projects"
                  onHeadingChange={onSectionHeadingChange}
                />
                <div className="space-y-6">
                  {projects.map((item, index) => (
                    item && (item.title || item.description) ? (
                      <div key={index} className="flex gap-6">
                        <div className="w-1/4 flex-shrink-0">
                          <p className="text-sm font-bold text-gray-800">Project</p>
                        </div>
                        <div className="w-3/4 pb-6 border-b border-gray-200">
                          <EditableText
                            as="h3"
                            value={item.title || ""}
                            placeholder="Project Title"
                            onChange={(value) => onArrayItemChange("projects", index, "title", value)}
                            isEditMode={isEditMode}
                            className="font-bold text-[#0b1c5a] text-base uppercase mb-2"
                          />
                          <EditableText
                            as="p"
                            value={item.description || ""}
                            placeholder="Description"
                            onChange={(value) => onArrayItemChange("projects", index, "description", value)}
                            isEditMode={isEditMode}
                            multiline
                            className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap text-justify"
                          />
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-[40%] bg-[#0b1c5a] px-10 py-12 flex flex-col text-white">
        
        {/* Profile Picture */}
        <div className="flex justify-center mb-12 relative z-20">
           {profilePicture ? (
             <div className="relative w-48 h-48 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white">
               <img
                 src={profilePicture}
                 alt="Profile"
                 className="w-full h-full object-cover object-top"
               />
             </div>
           ) : (
             <div className="relative w-48 h-48 rounded-full border-4 border-white overflow-hidden shadow-xl bg-gray-300/20 flex items-center justify-center text-gray-400">
               <span className="font-medium">No Image</span>
             </div>
           )}
        </div>

        <div className="space-y-10">
          
          {/* Contact Section */}
          <div className="page-break-avoid">
            <RightSectionHeading 
              title={sectionHeadings?.[2]?.contact || "CONTACT"} 
              placeholder="CONTACT"
              field="contact"
              onHeadingChange={onSectionHeadingChange}
            />
            <div className="space-y-4 text-sm">
              {(phone || isEditMode) && (
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">📞</span>
                  </div>
                  <EditableText
                    as="p"
                    value={phone || ""}
                    placeholder="Phone Number"
                    onChange={(value) => onFieldChange("phone", value)}
                    isEditMode={isEditMode}
                    className="break-words font-medium"
                  />
                </div>
              )}
              {(email || isEditMode) && (
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">✉</span>
                  </div>
                  <EditableText
                    as="p"
                    value={email || ""}
                    placeholder="Email Address"
                    onChange={(value) => onFieldChange("email", value)}
                    isEditMode={isEditMode}
                    className="break-words font-medium"
                  />
                </div>
              )}
              {(address || isEditMode) && (
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">📍</span>
                  </div>
                  <EditableText
                    as="p"
                    value={address || ""}
                    placeholder="Location"
                    onChange={(value) => onFieldChange("address", value)}
                    isEditMode={isEditMode}
                    className="break-words font-medium"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {skillItems.length > 0 && (
            <div className="page-break-avoid">
              <RightSectionHeading 
                title={sectionHeadings?.[2]?.skills || "SKILLS"} 
                placeholder="SKILLS"
                field="skills"
                onHeadingChange={onSectionHeadingChange}
              />
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {skillItems.map((skill, index) => {
                  const level = resumeData.skillProficiency?.[skill] || 4; // default to 80%
                  const percentage = level * 20;
                  const dashOffset = 175 - (175 * percentage) / 100;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className={`relative w-16 h-16 flex items-center justify-center mb-3 ${isEditMode ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                        onClick={() => isEditMode && onProficiencyChange && onProficiencyChange("skills", skill, level >= 5 ? 1 : level + 1)}
                        title={isEditMode ? "Click to change proficiency" : undefined}
                      >
                        <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/20" />
                          <circle 
                            cx="32" cy="32" r="28" 
                            stroke="currentColor" strokeWidth="3" fill="transparent" 
                            strokeDasharray="175" strokeDashoffset={dashOffset} 
                            className="text-white transition-all duration-1000" 
                          />
                        </svg>
                        <span className="text-sm font-bold relative z-10">{percentage}%</span>
                      </div>
                      <EditableText
                        as="span"
                        value={skill}
                        placeholder="Skill"
                        onChange={(value) => onListItemChange("skills", index, value)}
                        isEditMode={isEditMode}
                        className="text-center font-medium text-sm uppercase tracking-wide"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {languageItems.length > 0 && (
            <div className="page-break-avoid">
              <RightSectionHeading 
                title={sectionHeadings?.[2]?.languages || "LANGUAGE"} 
                placeholder="LANGUAGE"
                field="languages"
                onHeadingChange={onSectionHeadingChange}
              />
              <div className="space-y-5">
                {languageItems.map((language, index) => {
                  const level = resumeData.languageProficiency?.[language] || 4;
                  const percentage = level * 20;
                  return (
                    <div key={index}>
                      <EditableText
                        as="div"
                        value={language}
                        placeholder="Language"
                        onChange={(value) => onListItemChange("languages", index, value)}
                        isEditMode={isEditMode}
                        className="font-medium text-sm mb-2 uppercase tracking-wide"
                      />
                      <div 
                        className={`w-full bg-white/20 h-1.5 rounded-full overflow-hidden ${isEditMode ? 'cursor-pointer' : ''}`}
                        onClick={() => isEditMode && onProficiencyChange && onProficiencyChange("languages", language, level >= 5 ? 1 : level + 1)}
                        title={isEditMode ? "Click to change proficiency" : undefined}
                      >
                        <div className="bg-white h-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
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

export default Template2;
