import React, { useState } from 'react';
import { CODE_SNIPPETS } from '../../constants/snippets';
import { CodeSnippet } from '../../types';

interface SnippetPanelProps {
  onInsertSnippet: (snippet: CodeSnippet) => void;
}

export const SnippetPanel: React.FC<SnippetPanelProps> = ({ onInsertSnippet }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (snippet: CodeSnippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="snippet-panel">
      <div className="panel-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        <span>Motion Code Snippets</span>
      </div>

      <div className="snippet-list">
        {CODE_SNIPPETS.map((snippet) => (
          <div key={snippet.id} className="snippet-card">
            <div className="snippet-header">
              <span className="snippet-title">{snippet.title}</span>
              <span className="snippet-badge">{snippet.category}</span>
            </div>
            <p className="snippet-desc">{snippet.description}</p>
            <div className="snippet-actions">
              <button
                type="button"
                className="btn-snippet btn-insert"
                onClick={() => onInsertSnippet(snippet)}
                title="Append to JavaScript editor"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>Append JS</span>
              </button>
              <button
                type="button"
                className="btn-snippet btn-copy"
                onClick={() => handleCopy(snippet)}
                title="Copy code to clipboard"
              >
                {copiedId === snippet.id ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
