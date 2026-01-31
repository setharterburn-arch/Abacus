import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * MasteryMap - Visual skill tree showing mastery progress
 * 
 * Displays topics as nodes with connections showing prerequisites.
 * Click a node to start practicing that topic.
 */

const topicData = {
  'K-2': {
    nodes: [
      { id: 'counting', topic: 'Counting', x: 50, y: 20, icon: '🔢' },
      { id: 'shapes', topic: 'Shapes', x: 80, y: 20, icon: '🔷' },
      { id: 'addition', topic: 'Addition', x: 35, y: 50, icon: '➕', prereqs: ['counting'] },
      { id: 'subtraction', topic: 'Subtraction', x: 65, y: 50, icon: '➖', prereqs: ['counting'] },
      { id: 'measurement', topic: 'Measurement', x: 85, y: 50, icon: '📏', prereqs: ['shapes'] },
      { id: 'place-value', topic: 'Place Value', x: 50, y: 80, icon: '🏛️', prereqs: ['addition', 'subtraction'] },
    ],
    edges: [
      ['counting', 'addition'],
      ['counting', 'subtraction'],
      ['shapes', 'measurement'],
      ['addition', 'place-value'],
      ['subtraction', 'place-value'],
    ]
  },
  '3-5': {
    nodes: [
      { id: 'multiplication', topic: 'Multiplication', x: 30, y: 15, icon: '✖️' },
      { id: 'division', topic: 'Division', x: 70, y: 15, icon: '➗' },
      { id: 'fractions', topic: 'Fractions', x: 50, y: 40, icon: '🍕', prereqs: ['multiplication', 'division'] },
      { id: 'decimals', topic: 'Decimals', x: 25, y: 65, icon: '🔹', prereqs: ['fractions'] },
      { id: 'geometry', topic: 'Geometry', x: 75, y: 65, icon: '📐', prereqs: ['fractions'] },
      { id: 'word-problems', topic: 'Word Problems', x: 50, y: 85, icon: '📝', prereqs: ['decimals', 'geometry'] },
    ],
    edges: [
      ['multiplication', 'fractions'],
      ['division', 'fractions'],
      ['fractions', 'decimals'],
      ['fractions', 'geometry'],
      ['decimals', 'word-problems'],
      ['geometry', 'word-problems'],
    ]
  },
  '6-8': {
    nodes: [
      { id: 'ratios', topic: 'Ratios', x: 25, y: 15, icon: '⚖️' },
      { id: 'percents', topic: 'Percents', x: 75, y: 15, icon: '💯' },
      { id: 'expressions', topic: 'Expressions', x: 50, y: 40, icon: '📝', prereqs: ['ratios', 'percents'] },
      { id: 'equations', topic: 'Equations', x: 30, y: 65, icon: '⚖️', prereqs: ['expressions'] },
      { id: 'statistics', topic: 'Statistics', x: 70, y: 65, icon: '📊', prereqs: ['expressions'] },
      { id: 'functions', topic: 'Functions', x: 50, y: 90, icon: '📈', prereqs: ['equations'] },
    ],
    edges: [
      ['ratios', 'expressions'],
      ['percents', 'expressions'],
      ['expressions', 'equations'],
      ['expressions', 'statistics'],
      ['equations', 'functions'],
    ]
  }
};

const MasteryMap = ({ grade = 3, masteryScores = {}, onTopicSelect }) => {
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState(null);
  
  // Determine which map to show based on grade
  const mapKey = grade <= 2 ? 'K-2' : grade <= 5 ? '3-5' : '6-8';
  const map = topicData[mapKey];

  const getMasteryLevel = (nodeId) => {
    const score = masteryScores[nodeId] || 0;
    if (score >= 100) return { level: 'mastery', color: '#a855f7', label: 'Mastered' };
    if (score >= 90) return { level: 'challenge', color: '#f97316', label: 'Challenge' };
    if (score >= 80) return { level: 'proficient', color: '#22c55e', label: 'Proficient' };
    if (score >= 50) return { level: 'building', color: '#3b82f6', label: 'Building' };
    if (score > 0) return { level: 'started', color: '#6b7280', label: 'Started' };
    return { level: 'new', color: '#d1d5db', label: 'Not Started' };
  };

  const handleNodeClick = (node) => {
    if (onTopicSelect) {
      onTopicSelect(node.topic);
    } else {
      navigate(`/practice?topic=${encodeURIComponent(node.topic)}`);
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>
        🗺️ Mastery Map
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
        Click a topic to start practicing. Complete prerequisites to unlock advanced topics!
      </p>
      
      <div style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        background: 'var(--color-bg)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Edges (connections) */}
          {map.edges.map(([from, to], idx) => {
            const fromNode = map.nodes.find(n => n.id === from);
            const toNode = map.nodes.find(n => n.id === to);
            const fromMastery = getMasteryLevel(from);
            const toMastery = getMasteryLevel(to);
            
            // Dim edges for non-mastered paths
            const isComplete = fromMastery.level === 'mastery';
            
            return (
              <line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isComplete ? '#22c55e' : '#d1d5db'}
                strokeWidth="0.5"
                strokeDasharray={isComplete ? '0' : '2'}
                opacity={isComplete ? 1 : 0.5}
              />
            );
          })}
          
          {/* Nodes */}
          {map.nodes.map((node) => {
            const mastery = getMasteryLevel(node.id);
            const score = masteryScores[node.id] || 0;
            const isHovered = hoveredNode === node.id;
            
            // Check if prerequisites are met
            const prereqsMet = !node.prereqs || node.prereqs.every(
              prereq => (masteryScores[prereq] || 0) >= 80
            );
            
            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow for mastered nodes */}
                {mastery.level === 'mastery' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="7"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="0.5"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      values="7;9;7"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0.2;0.5"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                
                {/* Main circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 6.5 : 5.5}
                  fill={prereqsMet ? mastery.color : '#9ca3af'}
                  stroke="white"
                  strokeWidth="0.8"
                  style={{ transition: 'all 0.2s' }}
                />
                
                {/* Progress ring */}
                {score > 0 && score < 100 && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="5"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray={`${(score / 100) * 31.4} 31.4`}
                    transform={`rotate(-90 ${node.x} ${node.y})`}
                    opacity="0.7"
                  />
                )}
                
                {/* Icon */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="4"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.icon}
                </text>
                
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + 10}
                  textAnchor="middle"
                  fontSize="2.5"
                  fill="var(--color-text)"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {node.topic}
                </text>
                
                {/* Score badge */}
                {score > 0 && (
                  <text
                    x={node.x + 5}
                    y={node.y - 4}
                    textAnchor="middle"
                    fontSize="2"
                    fill={mastery.color}
                    fontWeight="bold"
                  >
                    {Math.round(score)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1rem',
        justifyContent: 'center',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#d1d5db' }} />
          <span>New</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3b82f6' }} />
          <span>Building</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
          <span>Proficient</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f97316' }} />
          <span>Challenge</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#a855f7' }} />
          <span>Mastered</span>
        </div>
      </div>
    </div>
  );
};

export default MasteryMap;
