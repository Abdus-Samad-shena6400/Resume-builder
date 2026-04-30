import EditableText from "./EditableText";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import ProficiencyRating from "../ProficiencyRating";

const Template3 = ({
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
    summary,
    experience,
    education,
    address,
    skills,
    projects = [],
    languages,
    profilePicture,
  } = resumeData || {};

  const skillItems = skills
    ? skills.split(",").map((item) => item.trim()).filter(Boolean)
    : [];
  const languageItems = languages
    ? languages.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  const uppercaseName = (name || "").toUpperCase();
  const nameParts = uppercaseName.trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const renderSectionTitle = (sectionKey, fallback) => (
    <EditableText
      as="span"
      value={sectionHeadings?.[sectionKey] || fallback}
      placeholder={fallback}
      onChange={(value) => onSectionHeadingChange(sectionKey, value)}
      isEditMode={isEditMode}
      className="inline-block"
    />
  );

  const Heading = ({ title }) => (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-black uppercase tracking-widest inline-block border-b-[3px] border-red-500 pb-1">
        {title}
      </h3>
    </div>
  );

  return (
    <div className="template3 w-full bg-white relative shadow-lg min-h-[1123px] pb-24 overflow-hidden flex flex-col">
      {/* TOP HEADER */}
      <div className="relative h-[280px] w-full flex-shrink-0">
        {/* Background diagonal shapes (SVG for PDF compatibility) */}
        <svg className="absolute right-0 top-0 w-[85%] h-full z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="30,0 100,0 100,100 15,100" fill="black" />
        </svg>

        <div className="relative z-10 flex h-full items-center">
          {/* Left part of header: Profile Picture */}
          <div className="w-[45%] flex justify-center pl-4">
             <div className="relative">
               {profilePicture ? (
                 <div className="p-1.5 rounded-full border-[5px] border-red-500 bg-white shadow-xl">
                   <img
                     src={profilePicture}
                     alt="Profile"
                     className="w-48 h-48 rounded-full object-cover object-top"
                   />
                 </div>
               ) : (
                 <div className="p-1.5 rounded-full border-[5px] border-red-500 bg-white shadow-xl">
                   <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-medium">
                     No Image
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Right part of header: Name and Profession */}
          <div className="w-[55%] flex flex-col justify-center pr-16 text-right mt-4">
             <div className="flex justify-end gap-3 text-3xl md:text-4xl font-black uppercase tracking-wider mb-2">
               <EditableText
                 as="span"
                 value={firstName}
                 placeholder="JOHN"
                 onChange={(value) => {
                   const newName = `${value} ${lastName}`.trim();
                   onFieldChange("name", newName);
                 }}
                 isEditMode={isEditMode}
                 className="text-red-500"
               />
               <EditableText
                 as="span"
                 value={lastName}
                 placeholder="DOE"
                 onChange={(value) => {
                   const newName = `${firstName} ${value}`.trim();
                   onFieldChange("name", newName);
                 }}
                 isEditMode={isEditMode}
                 className="text-white"
               />
             </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex w-full px-12 pt-12 flex-grow relative pb-12">
        {/* Vertical divider line separating the two columns */}
        <div className="absolute left-[38%] top-6 bottom-0 w-px bg-red-200 z-0"></div>

        {/* LEFT COLUMN - 38% */}
        <div className="w-[38%] pr-10 relative z-10 flex flex-col space-y-12">
          
          {/* CONTACTS */}
          <div className="page-break-avoid">
            <Heading title={renderSectionTitle("contact", "CONTACTS")} />
            <div className="space-y-5 text-sm font-medium text-gray-700">
              {(phone || isEditMode) && (
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <FaPhone className="text-red-500 text-base" />
                  </div>
                  <EditableText
                    as="p"
                    value={phone || ""}
                    placeholder="+123 456 7890"
                    onChange={(value) => onFieldChange("phone", value)}
                    isEditMode={isEditMode}
                    className="break-words"
                  />
                </div>
              )}
              {(email || isEditMode) && (
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <FaEnvelope className="text-red-500 text-base" />
                  </div>
                  <EditableText
                    as="p"
                    value={email || ""}
                    placeholder="your@email.com"
                    onChange={(value) => onFieldChange("email", value)}
                    isEditMode={isEditMode}
                    className="break-words"
                  />
                </div>
              )}
              {(address || isEditMode) && (
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <FaMapMarkerAlt className="text-red-500 text-base" />
                  </div>
                  <EditableText
                    as="p"
                    value={address || ""}
                    placeholder="124 Street Area, Location"
                    onChange={(value) => onFieldChange("address", value)}
                    isEditMode={isEditMode}
                    className="break-words leading-tight"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SKILLS */}
          {skillItems.length > 0 && (
            <div className="page-break-avoid">
              <Heading title={renderSectionTitle("skills", "SKILLS")} />
              <div className="space-y-3">
                {skillItems.map((skill, index) => (
                  <div key={index} className="flex flex-col mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                      <EditableText
                        as="span"
                        value={skill}
                        placeholder="Skill"
                        onChange={(value) => onListItemChange("skills", index, value)}
                        isEditMode={isEditMode}
                        className="text-sm font-medium text-gray-800 break-words"
                      />
                    </div>
                    <div className="pl-5 mt-1">
                      <ProficiencyRating 
                        level={resumeData.skillProficiency?.[skill] || 4} 
                        onChange={(val) => onProficiencyChange && onProficiencyChange("skills", skill, val)} 
                        isEditMode={isEditMode} 
                        color="red"
                        size="small"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languageItems.length > 0 && (
            <div className="page-break-avoid">
              <Heading title={renderSectionTitle("languages", "LANGUAGES")} />
              <div className="space-y-3">
                {languageItems.map((language, index) => (
                  <div key={index} className="flex flex-col mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                      <EditableText
                        as="span"
                        value={language}
                        placeholder="Language"
                        onChange={(value) => onListItemChange("languages", index, value)}
                        isEditMode={isEditMode}
                        className="text-sm font-medium text-gray-800 break-words"
                      />
                    </div>
                    <div className="pl-5 mt-1">
                      <ProficiencyRating 
                        level={resumeData.languageProficiency?.[language] || 4} 
                        onChange={(val) => onProficiencyChange && onProficiencyChange("languages", language, val)} 
                        isEditMode={isEditMode} 
                        color="red"
                        size="small"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - 62% */}
        <div className="w-[62%] pl-10 relative z-10 flex flex-col space-y-12">
          
          {/* ABOUT ME */}
          {(summary || isEditMode) && (
            <div className="page-break-avoid">
              <Heading title={renderSectionTitle("summary", "ABOUT ME")} />
              <EditableText
                as="p"
                value={summary || ""}
                placeholder="Write your professional summary"
                onChange={(value) => onFieldChange("summary", value)}
                isEditMode={isEditMode}
                multiline
                className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-justify"
              />
            </div>
          )}

          {/* EDUCATION */}
          {Array.isArray(education) &&
            education.some(
              (edu) => edu && (edu.institution || edu.degree || edu.field || edu.year)
            ) && (
              <div className="page-break-avoid">
                <Heading title={renderSectionTitle("education", "EDUCATION")} />
                <div className="ml-2">
                  {education.map((item, index) => (
                    item && (item.institution || item.degree || item.field || item.year) ? (
                      <div key={index} className="relative border-l border-gray-300 pl-6 pb-8 last:pb-0">
                        {/* Red Dot */}
                        <div className="absolute w-3.5 h-3.5 bg-red-500 rounded-full -left-[7.5px] top-1"></div>
                        
                        <EditableText
                          as="h4"
                          value={item.institution || ""}
                          placeholder="Institution Name"
                          onChange={(value) => onArrayItemChange("education", index, "institution", value)}
                          isEditMode={isEditMode}
                          className="font-bold text-gray-900 text-base"
                        />
                        <div className="text-gray-600 text-sm mt-1 font-medium">
                          {Boolean((item.degree || "").trim()) && (
                            <EditableText
                              as="span"
                              value={item.degree || ""}
                              placeholder="Degree"
                              onChange={(value) => onArrayItemChange("education", index, "degree", value)}
                              isEditMode={isEditMode}
                              className="inline"
                            />
                          )}
                          {item.degree && item.field && <span> in </span>}
                          {Boolean((item.field || "").trim()) && (
                            <EditableText
                              as="span"
                              value={item.field || ""}
                              placeholder="Field of Study"
                              onChange={(value) => onArrayItemChange("education", index, "field", value)}
                              isEditMode={isEditMode}
                              className="inline"
                            />
                          )}
                        </div>
                        {Boolean((item.year || "").trim()) && (
                          <EditableText
                            as="div"
                            value={item.year || ""}
                            placeholder="2021 - 2023"
                            onChange={(value) => onArrayItemChange("education", index, "year", value)}
                            isEditMode={isEditMode}
                            className="text-xs text-gray-500 mt-1.5 font-semibold tracking-wide"
                          />
                        )}
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
          )}

          {/* EXPERIENCE */}
          {Array.isArray(experience) &&
            experience.some(
              (exp) => exp && (exp.company || exp.role || exp.duration || exp.description)
            ) && (
              <div className="page-break-avoid">
                <Heading title={renderSectionTitle("experience", "EXPERIENCE")} />
                <div className="ml-2">
                  {experience.map((item, index) => (
                    item && (item.company || item.role || item.duration || item.description) ? (
                      <div key={index} className="relative border-l border-gray-300 pl-6 pb-8 last:pb-0">
                        {/* Red Dot */}
                        <div className="absolute w-3.5 h-3.5 bg-red-500 rounded-full -left-[7.5px] top-1"></div>
                        
                        <EditableText
                          as="h4"
                          value={item.company || ""}
                          placeholder="Company Name"
                          onChange={(value) => onArrayItemChange("experience", index, "company", value)}
                          isEditMode={isEditMode}
                          className="font-bold text-gray-900 text-base uppercase"
                        />
                        <div className="text-gray-700 text-sm mt-1 font-semibold">
                          {Boolean((item.role || "").trim()) && (
                            <EditableText
                              as="span"
                              value={item.role || ""}
                              placeholder="Role / Title"
                              onChange={(value) => onArrayItemChange("experience", index, "role", value)}
                              isEditMode={isEditMode}
                              className="inline"
                            />
                          )}
                        </div>
                        {Boolean((item.duration || "").trim()) && (
                          <EditableText
                            as="div"
                            value={item.duration || ""}
                            placeholder="2020 - Present"
                            onChange={(value) => onArrayItemChange("experience", index, "duration", value)}
                            isEditMode={isEditMode}
                            className="text-xs text-gray-500 mt-1.5 font-semibold"
                          />
                        )}
                        {Boolean((item.description || "").trim()) && (
                          <EditableText
                            as="p"
                            value={item.description || ""}
                            placeholder="Description of responsibilities and achievements."
                            onChange={(value) => onArrayItemChange("experience", index, "description", value)}
                            isEditMode={isEditMode}
                            multiline
                            className="text-gray-600 text-sm mt-2.5 leading-relaxed whitespace-pre-wrap break-words text-justify"
                          />
                        )}
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
          )}

          {/* PROJECTS / AWARDS (Mapping Projects to Awards style) */}
          {Array.isArray(projects) &&
            projects.some(
              (proj) => proj && (proj.title || proj.description)
            ) && (
              <div className="page-break-avoid">
                <Heading title={renderSectionTitle("projects", "AWARDS & PROJECTS")} />
                <div className="ml-2">
                  {projects.map((item, index) => (
                    item && (item.title || item.description) ? (
                      <div key={index} className="relative border-l border-gray-300 pl-6 pb-8 last:pb-0">
                        {/* Red Dot */}
                        <div className="absolute w-3.5 h-3.5 bg-red-500 rounded-full -left-[7.5px] top-1"></div>
                        
                        <EditableText
                          as="h4"
                          value={item.title || ""}
                          placeholder="Project or Award Title"
                          onChange={(value) => onArrayItemChange("projects", index, "title", value)}
                          isEditMode={isEditMode}
                          className="font-bold text-gray-900 text-base uppercase"
                        />
                        {Boolean((item.description || "").trim()) && (
                          <EditableText
                            as="p"
                            value={item.description || ""}
                            placeholder="Description of the project or award."
                            onChange={(value) => onArrayItemChange("projects", index, "description", value)}
                            isEditMode={isEditMode}
                            multiline
                            className="text-gray-600 text-sm mt-2.5 leading-relaxed whitespace-pre-wrap break-words text-justify"
                          />
                        )}
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
          )}

        </div>
      </div>

      {/* BOTTOM FOOTER SHAPES (SVG for PDF compatibility) */}
      <div className="absolute bottom-0 w-full h-[50px] flex z-0 overflow-hidden mt-auto">
        <svg className="w-[38%] h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="0,0 100,0 85,100 0,100" fill="black" />
        </svg>
        <svg className="w-[65%] h-full -ml-[3%]" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="10,0 100,0 100,100 0,100" fill="#dc2626" />
        </svg>
      </div>
    </div>
  );
};

export default Template3;
