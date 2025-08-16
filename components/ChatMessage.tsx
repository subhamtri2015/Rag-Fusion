
import React from 'react';
import type { Message } from '../types';
import Sources from './Sources';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const formatText = (text: string) => {
    // A simple markdown-like formatter for bold text and newlines
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    return { __html: html };
  };

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
          AI
        </div>
      )}
      <div className={`max-w-xl p-4 rounded-lg shadow-md ${isUser ? 'bg-cyan-500 text-white' : 'bg-gray-700'}`}>
        <div className="prose prose-invert prose-sm" dangerouslySetInnerHTML={formatText(message.text)} />
        {message.sources && message.sources.length > 0 && (
          <Sources sources={message.sources} />
        )}
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
          U
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
