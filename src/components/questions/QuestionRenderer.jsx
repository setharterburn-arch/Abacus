import React from 'react';
import MultipleChoice from './MultipleChoice';
import NumberLine from './NumberLine';
import FractionShade from './FractionShade';
import DragSort from './DragSort';
import ArrayBuilder from './ArrayBuilder';
import ClockFace from './ClockFace';
import CoordinateGrid from './CoordinateGrid';
import BarGraph from './BarGraph';

/**
 * QuestionRenderer - Routes questions to the correct interactive component
 * based on question type. Defaults to MultipleChoice for backward compatibility.
 * 
 * Supported types:
 * - multiple-choice: Standard A/B/C/D selection
 * - number-line: Place values on a number line
 * - fraction-shade: Shade parts of shapes to represent fractions
 * - drag-sort: Drag items to sort/order them
 * - array-builder: Build arrays for multiplication
 * - clock-face: Set or read analog clock times
 * - coordinate-grid: Plot points on coordinate plane
 * - bar-graph: Read or create bar graphs
 */
const QuestionRenderer = ({ 
  question, 
  onAnswer, 
  showFeedback = false,
  isCorrect = null,
  disabled = false 
}) => {
  const type = question.type || 'multiple-choice';
  
  const commonProps = {
    question,
    onAnswer,
    showFeedback,
    isCorrect,
    disabled
  };

  switch (type) {
    case 'number-line':
    case 'NumberLine':
      return <NumberLine {...commonProps} />;
    
    case 'fraction-shade':
    case 'FractionShade':
      return <FractionShade {...commonProps} />;
    
    case 'drag-sort':
    case 'DragSort':
      return <DragSort {...commonProps} />;
    
    case 'array-builder':
    case 'ArrayBuilder':
      return <ArrayBuilder {...commonProps} />;
    
    case 'clock-face':
    case 'ClockFace':
      return <ClockFace {...commonProps} />;
    
    case 'coordinate-grid':
    case 'CoordinateGrid':
      return <CoordinateGrid {...commonProps} />;
    
    case 'bar-graph':
    case 'BarGraph':
      return <BarGraph {...commonProps} />;
    
    case 'multiple-choice':
    case 'choice':
    case 'input':
    default:
      return <MultipleChoice {...commonProps} />;
  }
};

export default QuestionRenderer;
