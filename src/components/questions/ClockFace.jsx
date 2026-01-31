import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ClockFace - Interactive analog clock for time-telling questions
 * 
 * Question format:
 * {
 *   type: "clock-face",
 *   question: "Set the clock to 3:45",
 *   mode: "set",           // "set" (user sets time) or "read" (user reads displayed time)
 *   answer: { hour: 3, minute: 45 },
 *   displayTime: { hour: 3, minute: 45 },  // For "read" mode
 *   showDigital: false,    // Show digital display below clock
 *   allowQuarter: true     // Snap to 15-minute intervals
 * }
 */
const ClockFace = ({ 
  question, 
  onAnswer, 
  showFeedback = false,
  isCorrect = null,
  disabled = false 
}) => {
  const mode = question.mode || 'set';
  const displayTime = question.displayTime || { hour: 12, minute: 0 };
  const showDigital = question.showDigital !== false;
  const allowQuarter = question.allowQuarter !== false;
  
  const [hour, setHour] = useState(mode === 'read' ? displayTime.hour : 12);
  const [minute, setMinute] = useState(mode === 'read' ? displayTime.minute : 0);
  const [dragging, setDragging] = useState(null); // 'hour' or 'minute'
  const clockRef = useRef(null);

  const getAngleFromEvent = (e) => {
    if (!clockRef.current) return 0;
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX || e.touches?.[0]?.clientX) - centerX;
    const y = (e.clientY || e.touches?.[0]?.clientY) - centerY;
    let angle = Math.atan2(x, -y) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
  };

  const handleMouseDown = (type) => (e) => {
    if (disabled || mode === 'read') return;
    e.preventDefault();
    setDragging(type);
  };

  const handleMouseMove = (e) => {
    if (!dragging || disabled || mode === 'read') return;
    
    const angle = getAngleFromEvent(e);
    
    if (dragging === 'hour') {
      let newHour = Math.round(angle / 30) % 12;
      if (newHour === 0) newHour = 12;
      setHour(newHour);
    } else {
      let newMinute = Math.round(angle / 6) % 60;
      if (allowQuarter) {
        newMinute = Math.round(newMinute / 15) * 15;
        if (newMinute === 60) newMinute = 0;
      }
      setMinute(newMinute);
    }
  };

  const handleMouseUp = () => {
    if (dragging && mode === 'set') {
      onAnswer({ hour, minute });
    }
    setDragging(null);
  };

  // Calculate hand angles
  const minuteAngle = (minute / 60) * 360;
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30;

  // Format time for display
  const formatTime = (h, m) => {
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const period = h >= 12 ? 'PM' : 'AM';
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const getHandColor = (type) => {
    if (!showFeedback) return type === 'hour' ? '#1e40af' : '#3b82f6';
    return isCorrect ? '#22c55e' : '#ef4444';
  };

  const size = 240;
  const center = size / 2;

  return (
    <div 
      className="space-y-6"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <h3 className="text-xl font-semibold text-gray-800 text-center">
        {question.question}
      </h3>
      
      <div className="flex justify-center py-4">
        <div 
          ref={clockRef}
          className="relative"
          style={{ width: size, height: size }}
        >
          {/* Clock face */}
          <svg width={size} height={size} className="drop-shadow-lg">
            {/* Background circle */}
            <circle 
              cx={center} 
              cy={center} 
              r={center - 5} 
              fill="white" 
              stroke="#d1d5db" 
              strokeWidth="4"
            />
            
            {/* Hour markers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const x1 = center + (center - 20) * Math.cos(angle);
              const y1 = center + (center - 20) * Math.sin(angle);
              const x2 = center + (center - 35) * Math.cos(angle);
              const y2 = center + (center - 35) * Math.sin(angle);
              const textX = center + (center - 50) * Math.cos(angle);
              const textY = center + (center - 50) * Math.sin(angle);
              
              return (
                <g key={i}>
                  <line 
                    x1={x1} y1={y1} x2={x2} y2={y2} 
                    stroke="#374151" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                  <text 
                    x={textX} 
                    y={textY} 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    className="text-sm font-bold fill-gray-700"
                  >
                    {i === 0 ? 12 : i}
                  </text>
                </g>
              );
            })}
            
            {/* Minute markers */}
            {Array.from({ length: 60 }).map((_, i) => {
              if (i % 5 === 0) return null;
              const angle = (i * 6 - 90) * (Math.PI / 180);
              const x1 = center + (center - 15) * Math.cos(angle);
              const y1 = center + (center - 15) * Math.sin(angle);
              const x2 = center + (center - 22) * Math.cos(angle);
              const y2 = center + (center - 22) * Math.sin(angle);
              
              return (
                <line 
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="#9ca3af" 
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Hour hand */}
            <motion.line
              x1={center}
              y1={center}
              x2={center + 55 * Math.sin(hourAngle * Math.PI / 180)}
              y2={center - 55 * Math.cos(hourAngle * Math.PI / 180)}
              stroke={getHandColor('hour')}
              strokeWidth="6"
              strokeLinecap="round"
              animate={{ 
                x2: center + 55 * Math.sin(hourAngle * Math.PI / 180),
                y2: center - 55 * Math.cos(hourAngle * Math.PI / 180)
              }}
              transition={{ type: "spring", stiffness: 100 }}
              onMouseDown={handleMouseDown('hour')}
              onTouchStart={handleMouseDown('hour')}
              style={{ cursor: mode === 'set' && !disabled ? 'grab' : 'default' }}
            />
            
            {/* Minute hand */}
            <motion.line
              x1={center}
              y1={center}
              x2={center + 80 * Math.sin(minuteAngle * Math.PI / 180)}
              y2={center - 80 * Math.cos(minuteAngle * Math.PI / 180)}
              stroke={getHandColor('minute')}
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ 
                x2: center + 80 * Math.sin(minuteAngle * Math.PI / 180),
                y2: center - 80 * Math.cos(minuteAngle * Math.PI / 180)
              }}
              transition={{ type: "spring", stiffness: 100 }}
              onMouseDown={handleMouseDown('minute')}
              onTouchStart={handleMouseDown('minute')}
              style={{ cursor: mode === 'set' && !disabled ? 'grab' : 'default' }}
            />
            
            {/* Center dot */}
            <circle cx={center} cy={center} r="8" fill="#374151" />
            <circle cx={center} cy={center} r="4" fill="white" />
          </svg>
          
          {/* Drag indicator */}
          <AnimatePresence>
            {dragging && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                Adjusting {dragging} hand
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Digital display */}
      {showDigital && (
        <div className="text-center">
          <motion.div 
            className="inline-block bg-gray-900 text-green-400 font-mono text-2xl px-6 py-2 rounded-lg"
            animate={{ 
              backgroundColor: showFeedback ? (isCorrect ? '#166534' : '#991b1b') : '#111827'
            }}
          >
            {formatTime(hour, minute)}
          </motion.div>
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
              : `✗ The answer was ${formatTime(question.answer.hour, question.answer.minute)}`
            }
          </span>
        </motion.div>
      )}
      
      {/* Instructions */}
      {mode === 'set' && !disabled && !showFeedback && (
        <p className="text-sm text-gray-500 text-center">
          Drag the clock hands to set the time
        </p>
      )}
    </div>
  );
};

export default ClockFace;
