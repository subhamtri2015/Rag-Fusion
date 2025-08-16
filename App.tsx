
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { processQuery } from './services/ragService';
import type { Message, GraphNode, Thought, Document, Source } from './types';
import { GraphState } from './types';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import GraphVisualizer from './components/GraphVisualizer';
import ThoughtProcess from './components/ThoughtProcess';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentGraphState, setCurrentGraphState] = useState<GraphState>(GraphState.Idle);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, thoughts]);

  const addThought = (thought: Thought) => {
    setThoughts(prev => [...prev, thought]);
  };

  const handleSendMessage = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentGraphState(GraphState.Routing);
    setThoughts([]);
    
    addThought({ state: GraphState.Routing, content: "Starting..." });

    try {
      const finalAnswer = await processQuery(query, (state, content) => {
        setCurrentGraphState(state);
        addThought({ state, content });
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: finalAnswer.answer,
        sources: finalAnswer.sources,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Sorry, I encountered an error. Please check the console or try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setCurrentGraphState(GraphState.Idle);
    }
  }, [isLoading]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-cyan-400">Adaptive RAG Explorer</h1>
          <p className="text-gray-400 mt-2">An interactive visualization of a decision-making AI pipeline.</p>
        </header>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-4">
          {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        </div>
        
        <div className="mt-6">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
      <aside className="w-[400px] bg-gray-800/50 border-l border-gray-700 flex flex-col p-6">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400 border-b border-gray-600 pb-2">AI Thought Process</h2>
        <GraphVisualizer activeState={currentGraphState} />
        <div className="mt-6 flex-1 overflow-y-auto pr-2 -mr-2">
            <ThoughtProcess thoughts={thoughts} />
        </div>
      </aside>
    </div>
  );
};

export default App;
