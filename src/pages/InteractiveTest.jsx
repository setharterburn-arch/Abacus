import React, { useState } from 'react';
import { QuestionRenderer } from '../components/questions';
import curriculumData from '../data/curriculum.json';

/**
 * Test page for interactive question types
 * Access at /test route
 */
const InteractiveTest = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Get the test skill with interactive questions
  const testSkill = curriculumData.find(s => s.id === 'test-interactive-questions');
  const questions = testSkill?.questions || [];
  const currentQuestion = questions[currentIndex];

  const checkAnswer = (answer) => {
    setUserAnswer(answer);
    setShowFeedback(true);
  };

  const isCorrect = () => {
    if (!currentQuestion || userAnswer === null) return false;
    
    const type = currentQuestion.type || 'multiple-choice';
    const correctAnswer = currentQuestion.answer;
    
    switch (type) {
      case 'number-line':
        const tolerance = currentQuestion.tolerance || 0.05;
        return Math.abs(userAnswer - correctAnswer) <= tolerance;
      
      case 'fraction-shade':
        return userAnswer === correctAnswer;
      
      case 'drag-sort':
        if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return false;
        return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
      
      case 'array-builder':
        if (typeof correctAnswer === 'number') {
          return userAnswer?.product === correctAnswer;
        }
        return userAnswer?.rows === correctAnswer.rows && userAnswer?.cols === correctAnswer.cols;
      
      case 'multiple-choice':
      default:
        return userAnswer === correctAnswer;
    }
  };

  const handleNext = () => {
    setUserAnswer(null);
    setShowFeedback(false);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4">
          <p className="text-yellow-800">
            No test questions found. Make sure 'test-interactive-questions' skill exists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Interactive Question Types Test
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
            Type: {currentQuestion.type || 'multiple-choice'}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <QuestionRenderer
          question={currentQuestion}
          onAnswer={checkAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect()}
          disabled={showFeedback}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {showFeedback && (
          <button
            onClick={handleNext}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Next Question →
          </button>
        )}
        
        <button
          onClick={() => window.history.back()}
          className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Debug info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs font-mono">
        <div className="text-gray-500 mb-2">Debug Info:</div>
        <pre className="whitespace-pre-wrap text-gray-600">
          {JSON.stringify({ 
            type: currentQuestion.type, 
            answer: currentQuestion.answer,
            userAnswer,
            isCorrect: isCorrect()
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default InteractiveTest;
