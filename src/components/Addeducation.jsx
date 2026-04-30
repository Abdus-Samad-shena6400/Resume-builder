import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addEducation, updateEducation, removeEducation } from './redux';

const Addeducation = () => {
  const dispatch = useDispatch();
  const education = useSelector((state) => state.education);

  const inputClassName =
    "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none shadow-sm transition-all duration-200 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200";

  const labelClassName = "mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500";


  const handleAddEducation = () => {
    dispatch(addEducation());
  };

  const handleUpdateEducation = (index, data) => {
    dispatch(updateEducation({ index, data }));
  };

  const handleRemoveEducation = (index) => {
    dispatch(removeEducation(index));
  };


  return (
    <div>
       <div className="flex gap-2">
  {education.map((edu, index) => (
    <button
      key={index}
      onClick={() => dispatch(setActiveEducation(index))}
      className={`tab ${activeEduIndex === index ? "active" : ""}`}
    >
      Edu{index + 1}
    </button>
  ))}

  <button onClick={() => dispatch(addEducation())}>+</button>
</div>
    </div>
  )
}

export default Addeducation
