
import React from 'react';
import type { GraphNode } from '../types';
import { GraphState } from '../types';
import { GRAPH_NODES } from '../constants';

interface GraphVisualizerProps {
  activeState: GraphState;
}

const Node: React.FC<{ node: GraphNode; isActive: boolean }> = ({ node, isActive }) => (
  <div className={`p-3 rounded-md text-center border-2 transition-all duration-300 ${isActive ? 'bg-cyan-500 border-cyan-400 shadow-lg scale-105' : 'bg-gray-700 border-gray-600'}`}>
    <p className="font-bold text-sm">{node.label}</p>
    <p className="text-xs text-gray-400 mt-1">{node.description}</p>
  </div>
);

const Arrow: React.FC<{ type?: 'solid' | 'dashed' }> = ({ type = 'solid' }) => (
    <div className="w-full flex items-center justify-center my-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={type === 'dashed' ? "4 4" : "none"}/>
            <path d="M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);


const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ activeState }) => {
  const getNode = (id: GraphState) => GRAPH_NODES.find(n => n.id === id)!;

  return (
    <div className="space-y-2">
      <Node node={getNode(GraphState.Routing)} isActive={activeState === GraphState.Routing} />
      <Arrow />

      <div className="grid grid-cols-3 gap-2 items-start">
        <div className="col-span-1">
            <Node node={getNode(GraphState.WebSearch)} isActive={activeState === GraphState.WebSearch} />
        </div>
        <div className="col-span-1">
            <Node node={getNode(GraphState.DirectAnswer)} isActive={activeState === GraphState.DirectAnswer} />
        </div>
        <div className="col-span-1 space-y-2">
            <Node node={getNode(GraphState.GenerateQueries)} isActive={activeState === GraphState.GenerateQueries} />
            <Arrow />
            <Node node={getNode(GraphState.Retrieving)} isActive={activeState === GraphState.Retrieving} />
            <Arrow />
            <Node node={getNode(GraphState.Grading)} isActive={activeState === GraphState.Grading} />
            <Arrow type="dashed" />
            <Node node={getNode(GraphState.Generating)} isActive={activeState === GraphState.Generating} />
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
