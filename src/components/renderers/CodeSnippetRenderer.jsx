import React, { useState } from 'react';

export default function CodeSnippetRenderer({ code, language = 'c' }) {
  const [copied, setCopied] = useState(false);

  if (!code) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <div className="code-block-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
          <span className="code-lang-label">{language.toUpperCase()} Snippet</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="btn-text btn-copy-code"
          title="Copy code snippet"
        >
          {copied ? '✓ Copied' : '📋 Copy Code'}
        </button>
      </div>
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

