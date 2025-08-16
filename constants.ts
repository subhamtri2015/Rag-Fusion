
import type { Document, GraphNode } from './types';
import { GraphState } from './types';

export const VECTOR_STORE: Document[] = [
  {
    id: 'doc1',
    source: 'ReactJS Official Docs',
    content: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture, allowing developers to create encapsulated components that manage their own state. State changes trigger re-renders of the component and its children.',
  },
  {
    id: 'doc2',
    source: 'ReactJS Official Docs',
    content: 'Hooks are functions that let you “hook into” React state and lifecycle features from function components. The most common hooks are useState for managing local state and useEffect for performing side effects.',
  },
  {
    id: 'doc3',
    source: 'Tailwind CSS Docs',
    content: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.',
  },
  {
    id: 'doc4',
    source: 'Gemini API Docs',
    content: 'The Gemini API provides access to Google\'s latest generation of large language models. It supports multimodal queries, function calling, and embedded computations for a wide range of applications.',
  },
  {
    id: 'doc5',
    source: 'General Knowledge Base',
    content: 'The sky appears blue to the human eye because of a phenomenon called Rayleigh scattering. Short-wavelength blue light is scattered more effectively by the tiny molecules of air in Earth\'s atmosphere than long-wavelength red light.',
  },
];

export const GRAPH_NODES: GraphNode[] = [
  { id: GraphState.Routing, label: 'Route Query', description: 'Analyze the query to decide the best path.' },
  { id: GraphState.WebSearch, label: 'Web Search', description: 'Use Google Search for up-to-date info.' },
  { id: GraphState.DirectAnswer, label: 'Direct Answer', description: 'Answer directly without retrieval.' },
  { id: GraphState.GenerateQueries, label: 'Generate Sub-Queries', description: 'Create query variations for better retrieval.' },
  { id: GraphState.Retrieving, label: 'Retrieve Docs', description: 'Search the vector store for relevant documents.' },
  { id: GraphState.Grading, label: 'Grade Documents', description: 'Check if retrieved documents are relevant.' },
  { id: GraphState.Generating, label: 'Generate Answer', description: 'Synthesize the final answer from documents.' },
];
