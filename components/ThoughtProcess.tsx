
import React from 'react';
import type { Thought } from '../types';
import { GraphState } from '../types';

interface ThoughtProcessProps {
  thoughts: Thought[];
}

const stateToIcon: Record<GraphState, string> = {
  [GraphState.Idle]: '💤',
  [GraphState.Routing]: '🔀',
  [GraphState.GenerateQueries]: '🔍',
  [GraphState.Retrieving]: '📚',
  [GraphState.Grading]: '⚖️',
  [GraphState.Generating]: '✍️',
  [GraphState.WebSearch]: '🌐',
  [GraphState.DirectAnswer]: '💬',
  [GraphState.Finished]: '✅',
};

const stateToLabel: Record<GraphState, string> = {
  [GraphState.Idle]: 'Idle',
  [GraphState.Routing]: 'Routing Query',
  [GraphState.GenerateQueries]: 'Expanding Query',
  [GraphState.Retrieving]: 'Retrieving',
  [GraphState.Grading]: 'Grading Docs',
  [GraphState.Generating]: 'Generating Answer',
  [GraphState.WebSearch]: 'Web Search',
  [GraphState.DirectAnswer]: 'Direct Answer',
  [GraphState.Finished]: 'Finished',
};


const ThoughtProcess: React.FC<ThoughtProcessProps> = ({ thoughts }) => {
    if (thoughts.length === 0) {
        return <div className="text-center text-gray-500 italic mt-4">Waiting for a new query...</div>;
    }

  return (
    <div className="space-y-3">
      {thoughts.map((thought, index) => (
        <div key={index} className="flex items-start space-x-3 text-sm">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-600 text-lg flex items-center justify-center">{stateToIcon[thought.state]}</div>
          <div>
            <p className="font-bold text-cyan-400">{stateToLabel[thought.state]}</p>
            <p className="text-gray-400">{thought.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThoughtProcess;
