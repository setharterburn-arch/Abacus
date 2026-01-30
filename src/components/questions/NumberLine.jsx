import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * NumberLine - Interactive number line for placing values
 * 
 * Question format:
 * {
 *   type: "number-line",
 *   question: "Place 3/4 on the number line",
 *   range: [0, 1],        // Start and end values
 *   divisions: 4,         // Number of tick marks
 *   answer: 0.75,         // Correct position
 *   tolerance: 0.05,      // Acceptable error margin
 *   showLabels: true      // Show numbers at ticks
 * }
 */
const NumberLine = ({ 
  question, 
  onAnswer, 
  showFeedback = false,
  isCorrect = null,
  disabled = false 
}) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const lineRef = useRef(null);
  
  const range = question.range || [0, 1];
  const divisions = question.divisions || 10;
  const showLabels = question.showLabels !== false;
  const [min, max] = range;
  
  // Calculate tick positions
  const ticks = [];
  for (let i = 0; i <= divisions; i++) {
    const value = min + (max - min) * (i / divisions);
    const percent = (i / divisions) * 100;
    ticks.push({ value, percent });
  }

  const handleLineClick = (e) => {
    if (disabled) return;
    
    const rect = lineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const value = min + (max - min) * (percent / 100);
    
    // Snap to nearest tick if close enough
    const snapThreshold = 100 / divisions / 3;
    let snappedPercent = percent;
    
    for (const tick of ticks) {
      if (Math.abs(percent - tick.percent) < snapThreshold) {
        snappedPercent = tick.percent;
        break;
      }
    }
    
    const snappedValue = min + (max - min) * (snappedPercent / 100);
    setMarkerPosition(snappedPercent);
    onAnswer(snappedValue);
  };

  const getMarkerColor = () => {
    if (!showFeedback) return "bg-indigo-500";
    return isCorrect ? "bg-green-500" : "bg-red-500";
  };

  const formatLabel = (value) => {
    // Handle fractions nicely
    if (Number.isInteger(value)) return value;
    
    // Check for common fractions
    const fractions = {
      0.25: "¼", 0.5: "½", 0.75: "¾",
      0.333: "⅓", 0.667: "⅔",
      0.2: "⅕", 0.4: "⅖", 0.6: "⅗", 0.8: "⅘",
    };
    
    for (const [dec, frac] of Object.entries(fractions)) {
      if (Math.abs(value - parseFloat(dec)) < 0.01) return frac;
    }
    
    return value.toFixed(2).replace(/\.?0+$/, '');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        {question.question}
      </h3>
      
      <div className="py-8 px-4">
        {/* Number Line Container */}
        <div 
          ref={lineRef}
          className="relative h-16 cursor-pointer select-none"
          onClick={handleLineClick}
        >
          {/* Main Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded-full transform -translate-y-1/2" />
          
          {/* Ticks and Labels */}
          {ticks.map((tick, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${tick.percent}%` }}
            >
              {/* Tick mark */}
              <div className="w-0.5 h-4 bg-gray-400 mx-auto" style={{ marginTop: '24px' }} />
              
              {/* Label */}
              {showLabels && (
                <div className="text-sm text-gray-600 mt-2 text-center font-medium">
                  {formatLabel(tick.value)}
                </div>
              )}
            </div>
          ))}
          
          {/* Draggable Marker */}
          {markerPosition !== null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${markerPosition}%`, top: '50%' }}
            >
              <div className={`w-6 h-6 rounded-full ${getMarkerColor()} shadow-lg border-2 border-white`}>
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1.5" />
              </div>
              {/* Arrow pointing down */}
              <div className={`w-0 h-0 mx-auto border-l-4 border-r-4 border-t-6 border-transparent ${getMarkerColor().replace('bg-', 'border-t-')}`} 
                   style={{ marginTop: '-2px', borderTopWidth: '8px' }} />
            </motion.div>
          )}
          
          {/* Click hint */}
          {markerPosition === null && !disabled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-gray-400 text-sm bg-white px-3 py-1 rounded-full shadow">
                Click to place marker
              </span>
            </div>
          )}
        </div>
        
        {/* Answer indicator */}
        {showFeedback && (
          <div className="mt-4 text-center">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isCorrect ? '✓ Correct!' : `✗ The answer was ${formatLabel(question.answer)}`}
            </span>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <p className="text-sm text-gray-500 text-center">
        Click on the number line to place your answer
      </p>
    </div>
  );
};

export default NumberLine;
