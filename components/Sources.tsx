
import React from 'react';
import type { Source } from '../types';

interface SourcesProps {
  sources: Source[];
}

const Sources: React.FC<SourcesProps> = ({ sources }) => {
  return (
    <div className="mt-4 border-t border-gray-600 pt-2">
      <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources:</h4>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 py-1 px-2 rounded-md transition-colors"
          >
            {source.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sources;
