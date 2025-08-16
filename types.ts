
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: Source[];
}

export interface Document {
  id: string;
  content: string;
  source: string;
}

export interface Source {
  title: string;
  uri: string;
}

export enum GraphState {
    Idle = "IDLE",
    Routing = "ROUTING",
    GenerateQueries = "GENERATE_QUERIES",
    Retrieving = "RETRIEVING",
    Grading = "GRADING",
    Generating = "GENERATING",
    WebSearch = "WEB_SEARCH",
    DirectAnswer = "DIRECT_ANSWER",
    Finished = "FINISHED"
}

export interface GraphNode {
    id: GraphState;
    label: string;
    description: string;
}

export interface Thought {
    state: GraphState;
    content: string;
}

export type RouteDecision = 'vectorstore' | 'web_search' | 'direct';
