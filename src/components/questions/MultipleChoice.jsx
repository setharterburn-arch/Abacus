import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * MultipleChoice - Standard multiple choice question component
 */
const MultipleChoice = ({ 
  question, 
  onAnswer, 
  showFeedback = false,
  isCorrect = null,
  disabled = false 
}) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    if (disabled) return;
    setSelected(option);
    onAnswer(option);
  };

  const getOptionStyle = (option) => {
    const base = "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 font-medium ";
    
    if (showFeedback && selected === option) {
      if (isCorrect) {
        return base + "bg-green-100 border-green-500 text-green-800";
      } else {
        return base + "bg-red-100 border-red-500 text-red-800";
      }
    }
    
    if (selected === option) {
      return base + "bg-indigo-100 border-indigo-500 text-indigo-800";
    }
    
    return base + "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        {question.question}
      </h3>
      
      <div className="grid gap-3">
        {question.options?.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: disabled ? 1 : 1.01 }}
            whileTap={{ scale: disabled ? 1 : 0.99 }}
            className={getOptionStyle(option)}
            onClick={() => handleSelect(option)}
            disabled={disabled}
          >
            <span className="inline-flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;
