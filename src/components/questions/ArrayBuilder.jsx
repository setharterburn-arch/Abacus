import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ArrayBuilder - Build arrays to represent multiplication
 * 
 * Question format:
 * {
 *   type: "array-builder",
 *   question: "Build an array to show 3 × 4",
 *   maxRows: 6,
 *   maxCols: 6,
 *   answer: { rows: 3, cols: 4 }  // or answer: 12 (just the product)
 * }
 */
const ArrayBuilder = ({ 
  question, 
  onAnswer, 
  showFeedback = false,
  isCorrect = null,
  disabled = false 
}) => {
  const [grid, setGrid] = useState(() => {
    const rows = question.maxRows || 6;
    const cols = question.maxCols || 6;
    return Array(rows).fill(null).map(() => Array(cols).fill(false));
  });
  
  const maxRows = question.maxRows || 6;
  const maxCols = question.maxCols || 6;

  // Calculate current selection dimensions
  const getSelectedDimensions = () => {
    let maxRow = 0, maxCol = 0;
    
    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          maxRow = Math.max(maxRow, r + 1);
          maxCol = Math.max(maxCol, c + 1);
        }
      });
    });
    
    return { rows: maxRow, cols: maxCol };
  };

  const toggleCell = (rowIndex, colIndex) => {
    if (disabled) return;
    
    const newGrid = grid.map((row, r) => 
      row.map((cell, c) => {
        // Fill all cells from (0,0) to clicked cell
        return r <= rowIndex && c <= colIndex;
      })
    );
    
    setGrid(newGrid);
    
    const dims = { rows: rowIndex + 1, cols: colIndex + 1 };
    const product = dims.rows * dims.cols;
    
    // Send both dimensions and product
    onAnswer({ ...dims, product });
  };

  const getCellColor = (rowIndex, colIndex) => {
    const isSelected = grid[rowIndex]?.[colIndex];
    
    if (!isSelected) {
      return 'bg-gray-100 border-gray-200 hover:bg-indigo-100 hover:border-indigo-300';
    }
    
    if (showFeedback) {
      return isCorrect 
        ? 'bg-green-400 border-green-500' 
        : 'bg-red-400 border-red-500';
    }
    
    return 'bg-indigo-400 border-indigo-500';
  };

  const dims = getSelectedDimensions();
  const product = dims.rows * dims.cols;

  // Check what the correct answer format is
  const getCorrectProduct = () => {
    if (typeof question.answer === 'number') {
      return question.answer;
    }
    if (question.answer?.rows && question.answer?.cols) {
      return question.answer.rows * question.answer.cols;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        {question.question}
      </h3>
      
      <div className="flex justify-center">
        <div 
          className="inline-grid gap-1 p-2 bg-gray-50 rounded-xl"
          style={{ 
            gridTemplateColumns: `repeat(${maxCols}, 1fr)` 
          }}
        >
          {grid.map((row, rowIndex) => 
            row.map((_, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={{ scale: disabled ? 1 : 1.1 }}
                whileTap={{ scale: disabled ? 1 : 0.9 }}
                className={`w-10 h-10 rounded-lg border-2 transition-colors duration-150 ${getCellColor(rowIndex, colIndex)}`}
                onClick={() => toggleCell(rowIndex, colIndex)}
                disabled={disabled}
              >
                {grid[rowIndex][colIndex] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="w-4 h-4 rounded-full bg-white/50" />
                  </motion.div>
                )}
              </motion.button>
            ))
          )}
        </div>
      </div>
      
      {/* Current selection display */}
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold text-indigo-600">
          {dims.rows > 0 && dims.cols > 0 ? (
            <>
              {dims.rows} × {dims.cols} = <span className="text-green-600">{product}</span>
            </>
          ) : (
            <span className="text-gray-400">Click to build your array</span>
          )}
        </div>
        
        {dims.rows > 0 && dims.cols > 0 && (
          <div className="text-sm text-gray-500">
            {dims.rows} row{dims.rows !== 1 ? 's' : ''} × {dims.cols} column{dims.cols !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      {/* Feedback */}
      {showFeedback && (
        <div className="text-center">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect 
              ? '✓ Correct!' 
              : `✗ The answer should be ${getCorrectProduct()}`
            }
          </span>
        </div>
      )}
      
      {/* Instructions */}
      <p className="text-sm text-gray-500 text-center">
        Click a cell to fill the array from the top-left corner
      </p>
    </div>
  );
};

export default ArrayBuilder;
