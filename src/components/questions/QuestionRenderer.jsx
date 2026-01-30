import React from 'react';
import MultipleChoice from './MultipleChoice';
import NumberLine from './NumberLine';
import FractionShade from './FractionShade';
import DragSort from './DragSort';
import ArrayBuilder from './ArrayBuilder';

/**
 * QuestionRenderer - Routes questions to the correct interactive component
 * based on question type. Defaults to MultipleChoice for backward compatibility.
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
      return <NumberLine {...commonProps} />;
    
    case 'fraction-shade':
      return <FractionShade {...commonProps} />;
    
    case 'drag-sort':
      return <DragSort {...commonProps} />;
    
    case 'array-builder':
      return <ArrayBuilder {...commonProps} />;
    
    case 'multiple-choice':
    default:
      return <MultipleChoice {...commonProps} />;
  }
};

export default QuestionRenderer;
