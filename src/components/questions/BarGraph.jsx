import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * BarGraph - Interactive bar graph for reading and creating data visualizations
 * 
 * Question format:
 * {
 *   type: "bar-graph",
 *   question: "What is the value of the tallest bar?",
 *   mode: "read",          // "read" (interpret graph) or "create" (build graph)
 *   data: [
 *     { label: "Mon", value: 5 },
 *     { label: "Tue", value: 8 },
 *     ...
 *   ],
 *   maxValue: 10,          // Maximum y-axis value
 *   answer: 8,             // For read mode - the correct answer
 *   targetData: [...]      // For create mode - target values to match
 * }
 */
const BarGraph = ({ 
  question, 
  onAnswer, 
  showFeedback = false,
  isCorrect = null,
  disabled = false 
}) => {
  const mode = question.mode || 'read';
  const data = question.data || [];
  const maxValue = question.maxValue || 10;
  const targetData = question.targetData || [];
  
  const [userValues, setUserValues] = useState(
    data.map(d => mode === 'create' ? 0 : d.value)
  );
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const chartWidth = 320;
  const chartHeight = 200;
  const barWidth = (chartWidth - 60) / data.length - 10;
  const padding = { left: 40, right: 20, top: 20, bottom: 30 };

  const toY = (value) => {
    const graphHeight = chartHeight - padding.top - padding.bottom;
    return chartHeight - padding.bottom - (value / maxValue) * graphHeight;
  };

  const handleBarClick = (index) => {
    if (disabled || mode !== 'create') return;
    
    // Cycle through values 0 to maxValue
    const newValues = [...userValues];
    newValues[index] = (newValues[index] + 1) % (maxValue + 1);
    setUserValues(newValues);
    
    // Check if matches target
    if (targetData.length > 0) {
      const matches = newValues.every((v, i) => v === targetData[i]?.value);
      onAnswer({ values: newValues, correct: matches });
    }
  };

  const handleReadAnswer = (answer) => {
    if (disabled) return;
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const getBarColor = (index) => {
    if (mode === 'create' && showFeedback) {
      if (targetData[index] && userValues[index] === targetData[index].value) {
        return '#22c55e';
      }
      return '#ef4444';
    }
    
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 text-center">
        {question.question}
      </h3>
      
      <div className="flex justify-center">
        <svg 
          width={chartWidth} 
          height={chartHeight}
          className="bg-white rounded-lg"
        >
          {/* Y-axis */}
          <line 
            x1={padding.left} 
            y1={padding.top} 
            x2={padding.left} 
            y2={chartHeight - padding.bottom}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* X-axis */}
          <line 
            x1={padding.left} 
            y1={chartHeight - padding.bottom} 
            x2={chartWidth - padding.right} 
            y2={chartHeight - padding.bottom}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Y-axis labels and grid lines */}
          {[0, maxValue/4, maxValue/2, maxValue*3/4, maxValue].map((value, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={toY(value)}
                x2={chartWidth - padding.right}
                y2={toY(value)}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray={i === 0 ? "0" : "4"}
              />
              <text
                x={padding.left - 8}
                y={toY(value) + 4}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {value}
              </text>
            </g>
          ))}
          
          {/* Bars */}
          {data.map((item, index) => {
            const value = mode === 'create' ? userValues[index] : item.value;
            const barHeight = (value / maxValue) * (chartHeight - padding.top - padding.bottom);
            const x = padding.left + 20 + index * (barWidth + 10);
            const y = chartHeight - padding.bottom - barHeight;
            
            return (
              <g key={index}>
                {/* Bar */}
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={getBarColor(index)}
                  rx="4"
                  initial={{ height: 0, y: chartHeight - padding.bottom }}
                  animate={{ height: barHeight, y }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleBarClick(index)}
                  style={{ cursor: mode === 'create' && !disabled ? 'pointer' : 'default' }}
                  className={mode === 'create' && !disabled ? 'hover:opacity-80' : ''}
                />
                
                {/* Value label on top */}
                {value > 0 && (
                  <motion.text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-sm font-bold fill-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {value}
                  </motion.text>
                )}
                
                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - padding.bottom + 18}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
          
          {/* Target indicators for create mode */}
          {mode === 'create' && targetData.map((target, index) => {
            const x = padding.left + 20 + index * (barWidth + 10);
            const y = toY(target.value);
            
            return (
              <g key={`target-${index}`}>
                <line
                  x1={x - 5}
                  y1={y}
                  x2={x + barWidth + 5}
                  y2={y}
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Answer options for read mode */}
      {mode === 'read' && question.options && (
        <div className="flex justify-center gap-3 flex-wrap">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const showCorrect = showFeedback && option === question.answer;
            const showWrong = showFeedback && isSelected && option !== question.answer;
            
            return (
              <motion.button
                key={index}
                whileHover={{ scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                onClick={() => handleReadAnswer(option)}
                disabled={disabled}
                className={`px-6 py-3 rounded-xl font-bold text-lg transition-colors ${
                  showCorrect ? 'bg-green-500 text-white' :
                  showWrong ? 'bg-red-500 text-white' :
                  isSelected ? 'bg-indigo-500 text-white' :
                  'bg-gray-100 hover:bg-indigo-100 text-gray-800'
                }`}
              >
                {option}
                {showCorrect && ' ✓'}
                {showWrong && ' ✗'}
              </motion.button>
            );
          })}
        </div>
      )}
      
      {/* Feedback */}
      {showFeedback && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect 
              ? '✓ Correct!' 
              : mode === 'read' 
                ? `✗ The answer was ${question.answer}`
                : '✗ Check the dashed lines for correct values'
            }
          </span>
        </motion.div>
      )}
      
      {/* Instructions for create mode */}
      {mode === 'create' && !disabled && !showFeedback && (
        <p className="text-sm text-gray-500 text-center">
          Click on bars to increase their values. Match the dashed lines!
        </p>
      )}
    </div>
  );
};

export default BarGraph;
