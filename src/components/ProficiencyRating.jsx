import React from 'react';

const ProficiencyRating = ({ 
  level = 3, 
  maxLevel = 5, 
  onChange, 
  isEditMode = false,
  size = 'small',
  color = 'blue'
}) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const colorClasses = {
    blue: {
      filled: 'text-blue-400',
      empty: 'text-blue-200'
    },
    red: {
      filled: 'text-red-500',
      empty: 'text-red-200'
    },
    yellow: {
      filled: 'text-yellow-400',
      empty: 'text-yellow-200'
    },
    gray: {
      filled: 'text-gray-400',
      empty: 'text-gray-200'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.small;
  const currentColor = colorClasses[color] || colorClasses.blue;

  const handleClick = (index) => {
    if (isEditMode && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <span className={`inline-flex items-center gap-0.5 ${currentSize}`}>
      {Array.from({ length: maxLevel }, (_, index) => (
        <span
          key={index}
          onClick={() => handleClick(index)}
          className={`
            transition-all duration-200 
            ${index < level 
              ? currentColor.filled 
              : currentColor.empty
            }
            ${isEditMode ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
          `}
          title={isEditMode ? `Click to set level ${index + 1}` : `Proficiency: ${level}/${maxLevel}`}
        >
          ★
        </span>
      ))}
    </span>
  );
};

export default ProficiencyRating;
