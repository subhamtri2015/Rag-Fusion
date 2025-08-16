
import { GoogleGenAI, Type } from "@google/genai";
import type { Document, RouteDecision, Source } from '../types';
import { GraphState } from '../types';
import { VECTOR_STORE } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

type StateUpdater = (state: GraphState, content: string) => void;

// --- Node 1: Route Query ---
async function routeQuery(query: string, updateState: StateUpdater): Promise<RouteDecision> {
  updateState(GraphState.Routing, `Analyzing query: "${query}"`);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Based on the user query, decide the best path to answer it. The options are:
    1.  'web_search': For queries about recent events, news, or specific real-time information.
    2.  'vectorstore': For queries about technology topics like React, Tailwind CSS, Gemini API, or general knowledge that might be in a database.
    3.  'direct': For simple greetings, conversational questions, or questions that don't require external knowledge.

    User query: "${query}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: {
            type: Type.STRING,
            description: "The chosen path: 'web_search', 'vectorstore', or 'direct'."
          },
        },
      },
    },
  });

  try {
    const json = JSON.parse(response.text);
    const decision = json.decision as RouteDecision;
    updateState(GraphState.Routing, `Decision: ${decision}.`);
    return decision;
  } catch (e) {
    console.error("Failed to parse routing decision:", response.text);
    updateState(GraphState.Routing, "Error in routing. Defaulting to vectorstore.");
    return 'vectorstore';
  }
}

// --- Node 2a: Generate Sub-Queries (RAG Fusion) ---
async function generateSubQueries(query: string, updateState: StateUpdater): Promise<string[]> {
    updateState(GraphState.GenerateQueries, "Generating sub-queries for RAG Fusion...");
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert at query expansion. Take the following user query and generate 3 different versions of it to improve search retrieval. The queries should be diverse but semantically similar.
        
        Original Query: "${query}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    queries: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        }
    });

    try {
        const json = JSON.parse(response.text);
        const queries = [query, ...json.queries];
        updateState(GraphState.GenerateQueries, `Generated ${queries.length} queries: ${queries.join(', ')}`);
        return queries;
    } catch (e) {
        console.error("Failed to generate sub-queries:", response.text);
        updateState(GraphState.GenerateQueries, "Could not generate sub-queries. Using original query.");
        return [query];
    }
}


// --- Node 2b: Retrieve from Vector Store ---
async function retrieveDocuments(queries: string[], updateState: StateUpdater): Promise<Document[]> {
    updateState(GraphState.Retrieving, "Searching simulated vector store...");

    // Simulate vector search with keyword matching
    const allKeywords = queries.flatMap(q => q.toLowerCase().split(/\s+/)).filter(Boolean);
    const uniqueKeywords = [...new Set(allKeywords)];
    
    const scoredDocs: Map<Document, number> = new Map();

    uniqueKeywords.forEach(keyword => {
        VECTOR_STORE.forEach(doc => {
            if (doc.content.toLowerCase().includes(keyword)) {
                scoredDocs.set(doc, (scoredDocs.get(doc) || 0) + 1);
            }
        });
    });

    const sortedDocs = Array.from(scoredDocs.entries())
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
    
    const topDocs = sortedDocs.slice(0, 3);
    
    updateState(GraphState.Retrieving, `Found ${topDocs.length} potentially relevant documents.`);
    return topDocs;
}

// --- Node 3: Grade Documents ---
async function gradeDocuments(query: string, documents: Document[], updateState: StateUpdater): Promise<Document[]> {
    if (documents.length === 0) {
        updateState(GraphState.Grading, "No documents to grade.");
        return [];
    }
    updateState(GraphState.Grading, `Assessing relevance of ${documents.length} documents...`);

    const docContents = documents.map(d => `Source: ${d.source}\nContent: ${d.content}`).join('\n---\n');
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Given the user query and the retrieved documents, identify which documents are relevant to answer the query. Return a list of the source names of the relevant documents.
        
        User Query: "${query}"
        
        Documents:
        ${docContents}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    relevant_sources: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "An array of source names from the provided documents that are relevant."
                    }
                }
            }
        }
    });

    try {
        const json = JSON.parse(response.text);
        const relevantSources: string[] = json.relevant_sources || [];
        const relevantDocs = documents.filter(doc => relevantSources.includes(doc.source));
        updateState(GraphState.Grading, `Found ${relevantDocs.length} relevant documents.`);
        return relevantDocs;
    } catch (e) {
        console.error("Failed to grade documents:", response.text);
        updateState(GraphState.Grading, "Error during grading. Assuming all are relevant.");
        return documents;
    }
}

// --- Node 4: Generate Final Answer ---
async function generateAnswer(query: string, documents: Document[], updateState: StateUpdater): Promise<{answer: string, sources: Source[]}> {
    updateState(GraphState.Generating, "Synthesizing final answer from documents...");
    
    const context = documents.map(d => `Source: ${d.source}\nContent: ${d.content}`).join('\n\n');
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a helpful AI assistant. Based on the provided context documents, answer the user's query. Be concise and cite the sources you used from the context. If the context does not contain the answer, say so.
        
        Context:
        ${context}
        
        User Query: "${query}"`,
    });
    
    updateState(GraphState.Generating, "Final answer generated.");
    
    const sources = documents.map(d => ({ title: d.source, uri: '#' }));
    return { answer: response.text, sources };
}


// --- Fallback/Alternative Nodes ---
async function webSearch(query: string, updateState: StateUpdater): Promise<{answer: string, sources: Source[]}> {
    updateState(GraphState.WebSearch, `Performing web search for: "${query}"`);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Answer the following user query based on up-to-date information from the web.
        Query: ${query}`,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: Source[] = groundingChunks ? groundingChunks.map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
    })) : [];

    updateState(GraphState.WebSearch, `Web search complete. Found ${sources.length} sources.`);
    return { answer: response.text, sources };
}

async function directAnswer(query: string, updateState: StateUpdater): Promise<{answer: string, sources: Source[]}> {
    updateState(GraphState.DirectAnswer, "Generating a direct response...");
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
    });
    updateState(GraphState.DirectAnswer, "Direct answer generated.");
    return { answer: response.text, sources: [] };
}


// --- Main Orchestrator ---
export async function processQuery(query: string, updateState: StateUpdater): Promise<{answer: string, sources: Source[]}> {
  const decision = await routeQuery(query, updateState);

  if (decision === 'direct') {
    return directAnswer(query, updateState);
  }

  if (decision === 'web_search') {
    return webSearch(query, updateState);
  }

  // Vectorstore path
  const subQueries = await generateSubQueries(query, updateState);
  const retrievedDocs = await retrieveDocuments(subQueries, updateState);
  const relevantDocs = await gradeDocuments(query, retrievedDocs, updateState);

  if (relevantDocs.length > 0) {
    return generateAnswer(query, relevantDocs, updateState);
  } else {
    // Fallback if vectorstore search fails
    updateState(GraphState.Grading, "No relevant documents found in vector store. Falling back to web search.");
    return webSearch(query, updateState);
  }
}
