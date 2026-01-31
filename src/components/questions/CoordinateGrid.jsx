import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CoordinateGrid - Interactive coordinate plane for plotting points
 * 
 * Question format:
 * {
 *   type: "coordinate-grid",
 *   question: "Plot the point (3, 4)",
 *   mode: "plot",          // "plot" (user plots point) or "identify" (user names plotted point)
 *   answer: { x: 3, y: 4 },
 *   displayPoints: [],     // Points already on grid (for identify mode)
 *   gridSize: 10,          // Grid extends from -gridSize to +gridSize
 *   showQuadrants: true    // Label quadrants
 * }
 */
const CoordinateGrid = ({ 
  question, 
  onAnswer, 
  showFeedback = false,
  isCorrect = null,
  disabled = false 
}) => {
  const mode = question.mode || 'plot';
  const gridSize = question.gridSize || 10;
  const showQuadrants = question.showQuadrants !== false;
  const displayPoints = question.displayPoints || [];
  
  const [plotted, setPlotted] = useState(null);
  const [hovering, setHovering] = useState(null);
  const gridRef = useRef(null);

  const svgSize = 320;
  const padding = 30;
  const gridArea = svgSize - 2 * padding;
  const scale = gridArea / (gridSize * 2);

  const toSvg = (coord) => ({
    x: padding + (coord.x + gridSize) * scale,
    y: padding + (gridSize - coord.y) * scale
  });

  const fromSvg = (x, y) => ({
    x: Math.round((x - padding) / scale - gridSize),
    y: Math.round(gridSize - (y - padding) / scale)
  });

  const handleClick = (e) => {
    if (disabled || mode === 'identify') return;
    
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coord = fromSvg(x, y);
    
    // Clamp to grid
    coord.x = Math.max(-gridSize, Math.min(gridSize, coord.x));
    coord.y = Math.max(-gridSize, Math.min(gridSize, coord.y));
    
    setPlotted(coord);
    onAnswer(coord);
  };

  const handleMouseMove = (e) => {
    if (disabled || mode === 'identify') {
      setHovering(null);
      return;
    }
    
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coord = fromSvg(x, y);
    
    if (coord.x >= -gridSize && coord.x <= gridSize && 
        coord.y >= -gridSize && coord.y <= gridSize) {
      setHovering(coord);
    } else {
      setHovering(null);
    }
  };

  const getPointColor = (isAnswer = false) => {
    if (!showFeedback) return '#6366f1';
    if (isAnswer) return isCorrect ? '#22c55e' : '#6366f1';
    return isCorrect ? '#22c55e' : '#ef4444';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 text-center">
        {question.question}
      </h3>
      
      <div className="flex justify-center">
        <svg 
          ref={gridRef}
          width={svgSize} 
          height={svgSize}
          className="bg-white rounded-lg border-2 border-gray-200 cursor-crosshair"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovering(null)}
        >
          {/* Grid lines */}
          {Array.from({ length: gridSize * 2 + 1 }).map((_, i) => {
            const pos = padding + i * scale;
            const isAxis = i === gridSize;
            
            return (
              <g key={i}>
                {/* Vertical line */}
                <line 
                  x1={pos} y1={padding} 
                  x2={pos} y2={svgSize - padding}
                  stroke={isAxis ? '#374151' : '#e5e7eb'}
                  strokeWidth={isAxis ? 2 : 1}
                />
                {/* Horizontal line */}
                <line 
                  x1={padding} y1={pos}
                  x2={svgSize - padding} y2={pos}
                  stroke={isAxis ? '#374151' : '#e5e7eb'}
                  strokeWidth={isAxis ? 2 : 1}
                />
              </g>
            );
          })}
          
          {/* Axis labels */}
          {[-gridSize, -gridSize/2, gridSize/2, gridSize].map(n => {
            if (n === 0) return null;
            const xPos = toSvg({ x: n, y: 0 });
            const yPos = toSvg({ x: 0, y: n });
            return (
              <g key={n}>
                <text 
                  x={xPos.x} 
                  y={svgSize - padding + 18} 
                  textAnchor="middle" 
                  className="text-xs fill-gray-600"
                >
                  {n}
                </text>
                <text 
                  x={padding - 12} 
                  y={yPos.y + 4} 
                  textAnchor="middle" 
                  className="text-xs fill-gray-600"
                >
                  {n}
                </text>
              </g>
            );
          })}
          
          {/* Origin label */}
          <text 
            x={padding - 12} 
            y={svgSize - padding + 12} 
            textAnchor="middle" 
            className="text-xs fill-gray-600"
          >
            0
          </text>
          
          {/* Axis arrows */}
          <polygon 
            points={`${svgSize - padding + 10},${padding + gridSize * scale} ${svgSize - padding},${padding + gridSize * scale - 5} ${svgSize - padding},${padding + gridSize * scale + 5}`}
            fill="#374151"
          />
          <polygon 
            points={`${padding + gridSize * scale},${padding - 10} ${padding + gridSize * scale - 5},${padding} ${padding + gridSize * scale + 5},${padding}`}
            fill="#374151"
          />
          <text x={svgSize - padding + 15} y={padding + gridSize * scale + 5} className="text-sm fill-gray-600">x</text>
          <text x={padding + gridSize * scale + 8} y={padding - 5} className="text-sm fill-gray-600">y</text>
          
          {/* Quadrant labels */}
          {showQuadrants && (
            <>
              <text x={svgSize - padding - 25} y={padding + 20} className="text-xs fill-gray-400">I</text>
              <text x={padding + 10} y={padding + 20} className="text-xs fill-gray-400">II</text>
              <text x={padding + 10} y={svgSize - padding - 10} className="text-xs fill-gray-400">III</text>
              <text x={svgSize - padding - 25} y={svgSize - padding - 10} className="text-xs fill-gray-400">IV</text>
            </>
          )}
          
          {/* Display points (for identify mode) */}
          {displayPoints.map((point, i) => {
            const pos = toSvg(point);
            return (
              <circle
                key={i}
                cx={pos.x}
                cy={pos.y}
                r="8"
                fill="#6366f1"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Hover indicator */}
          {hovering && !plotted && (
            <g>
              <circle
                cx={toSvg(hovering).x}
                cy={toSvg(hovering).y}
                r="6"
                fill="rgba(99, 102, 241, 0.3)"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="4"
              />
              <text
                x={toSvg(hovering).x + 12}
                y={toSvg(hovering).y - 8}
                className="text-xs fill-indigo-600 font-medium"
              >
                ({hovering.x}, {hovering.y})
              </text>
            </g>
          )}
          
          {/* Plotted point */}
          {plotted && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <circle
                cx={toSvg(plotted).x}
                cy={toSvg(plotted).y}
                r="10"
                fill={getPointColor()}
                stroke="white"
                strokeWidth="3"
              />
              <text
                x={toSvg(plotted).x + 15}
                y={toSvg(plotted).y - 10}
                className="text-sm font-bold"
                fill={getPointColor()}
              >
                ({plotted.x}, {plotted.y})
              </text>
            </motion.g>
          )}
          
          {/* Show correct answer on feedback */}
          {showFeedback && !isCorrect && question.answer && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <circle
                cx={toSvg(question.answer).x}
                cy={toSvg(question.answer).y}
                r="10"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray="4"
              />
              <text
                x={toSvg(question.answer).x + 15}
                y={toSvg(question.answer).y + 15}
                className="text-sm font-bold fill-green-600"
              >
                Correct: ({question.answer.x}, {question.answer.y})
              </text>
            </motion.g>
          )}
        </svg>
      </div>
      
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
              : `✗ The answer was (${question.answer.x}, ${question.answer.y})`
            }
          </span>
        </motion.div>
      )}
      
      {/* Instructions */}
      {mode === 'plot' && !disabled && !showFeedback && (
        <p className="text-sm text-gray-500 text-center">
          Click on the coordinate grid to plot your point
        </p>
      )}
    </div>
  );
};

export default CoordinateGrid;
