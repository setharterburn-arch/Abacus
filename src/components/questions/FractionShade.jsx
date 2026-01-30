import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * FractionShade - Click to shade parts of a shape to represent fractions
 * 
 * Question format:
 * {
 *   type: "fraction-shade",
 *   question: "Shade 2/5 of the rectangle",
 *   shape: "rectangle",    // rectangle, circle, or square
 *   parts: 5,              // Number of equal parts
 *   answer: 2,             // Number of parts to shade
 *   orientation: "horizontal"  // horizontal or vertical (for rectangles)
 * }
 */
const FractionShade = ({ 
  question, 
  onAnswer, 
  showFeedback = false,
  isCorrect = null,
  disabled = false 
}) => {
  const [shadedParts, setShadedParts] = useState(new Set());
  
  const shape = question.shape || 'rectangle';
  const parts = question.parts || 4;
  const orientation = question.orientation || 'horizontal';
  const correctAnswer = question.answer || 1;

  const togglePart = (index) => {
    if (disabled) return;
    
    const newShaded = new Set(shadedParts);
    if (newShaded.has(index)) {
      newShaded.delete(index);
    } else {
      newShaded.add(index);
    }
    setShadedParts(newShaded);
    onAnswer(newShaded.size);
  };

  const getPartColor = (index) => {
    const isShaded = shadedParts.has(index);
    
    if (showFeedback) {
      if (isShaded && shadedParts.size === correctAnswer) {
        return 'bg-green-400 border-green-500';
      } else if (isShaded && shadedParts.size !== correctAnswer) {
        return 'bg-red-400 border-red-500';
      }
    }
    
    return isShaded 
      ? 'bg-indigo-400 border-indigo-500' 
      : 'bg-white border-gray-300 hover:bg-indigo-100';
  };

  // Render rectangle shape
  const renderRectangle = () => {
    const isHorizontal = orientation === 'horizontal';
    
    return (
      <div 
        className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} border-2 border-gray-400 rounded-lg overflow-hidden`}
        style={{ 
          width: isHorizontal ? '100%' : '120px',
          height: isHorizontal ? '80px' : `${parts * 50}px`,
          maxWidth: '400px'
        }}
      >
        {Array.from({ length: parts }).map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`flex-1 border ${isHorizontal ? 'border-l' : 'border-t'} first:border-0 transition-colors duration-200 ${getPartColor(index)}`}
            onClick={() => togglePart(index)}
            disabled={disabled}
          />
        ))}
      </div>
    );
  };

  // Render circle shape (pie chart style)
  const renderCircle = () => {
    const size = 200;
    const center = size / 2;
    const radius = size / 2 - 10;
    
    return (
      <svg width={size} height={size} className="mx-auto">
        {Array.from({ length: parts }).map((_, index) => {
          const startAngle = (index / parts) * 360 - 90;
          const endAngle = ((index + 1) / parts) * 360 - 90;
          
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const x1 = center + radius * Math.cos(startRad);
          const y1 = center + radius * Math.sin(startRad);
          const x2 = center + radius * Math.cos(endRad);
          const y2 = center + radius * Math.sin(endRad);
          
          const largeArc = endAngle - startAngle > 180 ? 1 : 0;
          
          const pathD = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          
          const isShaded = shadedParts.has(index);
          let fill = isShaded ? '#818cf8' : '#ffffff';
          let stroke = isShaded ? '#6366f1' : '#d1d5db';
          
          if (showFeedback && isShaded) {
            if (shadedParts.size === correctAnswer) {
              fill = '#4ade80';
              stroke = '#22c55e';
            } else {
              fill = '#f87171';
              stroke = '#ef4444';
            }
          }
          
          return (
            <path
              key={index}
              d={pathD}
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
              className={`cursor-pointer transition-colors duration-200 ${!disabled && !isShaded ? 'hover:fill-indigo-100' : ''}`}
              onClick={() => togglePart(index)}
            />
          );
        })}
      </svg>
    );
  };

  // Render square grid
  const renderSquare = () => {
    const cols = Math.ceil(Math.sqrt(parts));
    
    return (
      <div 
        className="inline-grid gap-0.5 border-2 border-gray-400 rounded-lg overflow-hidden p-0.5 bg-gray-400"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          width: `${cols * 60}px`
        }}
      >
        {Array.from({ length: parts }).map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`aspect-square transition-colors duration-200 ${getPartColor(index)}`}
            onClick={() => togglePart(index)}
            disabled={disabled}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        {question.question}
      </h3>
      
      <div className="flex justify-center py-6">
        {shape === 'circle' && renderCircle()}
        {shape === 'rectangle' && renderRectangle()}
        {shape === 'square' && renderSquare()}
      </div>
      
      {/* Counter */}
      <div className="text-center">
        <span className="text-lg font-medium text-gray-700">
          Shaded: <span className="text-indigo-600">{shadedParts.size}</span> / {parts}
        </span>
      </div>
      
      {/* Feedback */}
      {showFeedback && (
        <div className="text-center">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? '✓ Correct!' : `✗ You should shade ${correctAnswer} parts`}
          </span>
        </div>
      )}
      
      {/* Instructions */}
      <p className="text-sm text-gray-500 text-center">
        Click on parts to shade or unshade them
      </p>
    </div>
  );
};

export default FractionShade;
