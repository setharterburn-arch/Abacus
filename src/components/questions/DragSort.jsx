import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';

/**
 * DragSort - Drag to reorder items into correct sequence
 * 
 * Question format:
 * {
 *   type: "drag-sort",
 *   question: "Order these fractions from smallest to largest",
 *   items: ["1/2", "1/4", "3/4", "1/8"],
 *   answer: ["1/8", "1/4", "1/2", "3/4"]
 * }
 */
const DragSort = ({ 
  question, 
  onAnswer, 
  showFeedback = false,
  isCorrect = null,
  disabled = false 
}) => {
  // Shuffle items initially
  const [items, setItems] = useState(() => {
    const shuffled = [...(question.items || [])];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const handleReorder = (newOrder) => {
    if (disabled) return;
    setItems(newOrder);
    onAnswer(newOrder);
  };

  const getItemStyle = (item, index) => {
    const base = "px-6 py-4 rounded-xl border-2 font-medium text-lg select-none ";
    
    if (showFeedback) {
      const correctIndex = question.answer?.indexOf(item);
      if (correctIndex === index) {
        return base + "bg-green-100 border-green-400 text-green-800";
      } else {
        return base + "bg-red-100 border-red-400 text-red-800";
      }
    }
    
    return base + "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-grab active:cursor-grabbing";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        {question.question}
      </h3>
      
      <Reorder.Group 
        axis="y" 
        values={items} 
        onReorder={handleReorder}
        className="space-y-3 max-w-md mx-auto"
      >
        {items.map((item, index) => (
          <Reorder.Item
            key={item}
            value={item}
            disabled={disabled}
          >
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={getItemStyle(item, index)}
            >
              <div className="flex items-center gap-4">
                {/* Position number */}
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                  {index + 1}
                </span>
                
                {/* Item content */}
                <span className="flex-1">{item}</span>
                
                {/* Drag handle */}
                {!disabled && (
                  <span className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </span>
                )}
                
                {/* Feedback icon */}
                {showFeedback && (
                  <span>
                    {question.answer?.indexOf(item) === index ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </span>
                )}
              </div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      
      {/* Feedback */}
      {showFeedback && (
        <div className="text-center mt-4">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? '✓ Perfect order!' : '✗ Not quite right'}
          </span>
        </div>
      )}
      
      {/* Instructions */}
      <p className="text-sm text-gray-500 text-center">
        Drag items to reorder them
      </p>
    </div>
  );
};

export default DragSort;
