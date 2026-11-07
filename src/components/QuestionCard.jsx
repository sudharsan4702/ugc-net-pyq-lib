import React, { useState } from 'react';
import MatchListRenderer from './renderers/MatchListRenderer';
import PassageRenderer from './renderers/PassageRenderer';
import DiagramRenderer from './renderers/DiagramRenderer';
import CodeSnippetRenderer from './renderers/CodeSnippetRenderer';
import StatementsRenderer from './renderers/StatementsRenderer';
import TableRenderer from './renderers/TableRenderer';

export default function QuestionCard({
  question,
  passage,
  onInspectImage,
  isBookmarked,
  onToggleBookmark
}) {
  const [copied, setCopied] = useState(false);

  if (!question) return null;

  const {
    question_id,
    original_question_number,
    source_page,
    question_type,
    question_text,
    options,
    additional_content,
    unit_number,
    unit_title,
    subtopic,
    exam_title
  } = question;

  const handleCopyQuestion = () => {
    let text = `[${question_id}] Q.${original_question_number} (Unit ${unit_number}: ${unit_title} - ${subtopic})\n`;
    text += `${question_text}\n\n`;

    if (additional_content?.statements?.length) {
      additional_content.statements.forEach(s => {
        text += `(${s.label}) ${s.text}\n`;
      });
      text += '\n';
    }

    if (additional_content?.matching_items) {
      const mi = additional_content.matching_items;
      text += `${mi.list_I_title || 'List-I'} vs ${mi.list_II_title || 'List-II'}:\n`;
      mi.list_I?.forEach((it, i) => {
        const other = mi.list_II?.[i];
        text += `  ${it.label}. ${it.text}  |  ${other ? other.label + '. ' + other.text : ''}\n`;
      });
      text += '\n';
    }

    if (additional_content?.code) {
      text += `\`\`\`\n${additional_content.code}\n\`\`\`\n\n`;
    }

    if (options?.length) {
      options.forEach(opt => {
        text += `(${opt.label}) ${opt.text}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatQuestionType = (type) => {
    if (!type) return 'Multiple Choice';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <article className="question-card" id={question_id}>
      {/* Passage Component if linked */}
      {passage && <PassageRenderer passage={passage} />}

      {/* Header Metadata */}
      <header className="question-header">
        <div className="meta-left">
          <span className="q-number-badge">Q.{original_question_number}</span>
          <span className="badge badge-unit">Unit {unit_number}: {unit_title}</span>
          {subtopic && <span className="badge badge-subtopic">{subtopic}</span>}
          <span className="badge badge-type">{formatQuestionType(question_type)}</span>
        </div>

        <div className="meta-right">
          <span className="source-info">
            {exam_title} • p.{source_page}
          </span>
          <button
            type="button"
            onClick={() => onToggleBookmark && onToggleBookmark(question_id)}
            className={`btn-action-icon ${isBookmarked ? 'bookmarked' : ''}`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
          <button
            type="button"
            onClick={handleCopyQuestion}
            className="btn-action-icon"
            title="Copy question text & options"
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
      </header>

      {/* Main Question Body */}
      <div className="question-body">
        <div className="question-text-content">
          {question_text}
        </div>

        {/* Specialized Renderers based on schema */}
        {additional_content?.matching_items && (
          <MatchListRenderer matchingItems={additional_content.matching_items} />
        )}

        {additional_content?.statements && additional_content.statements.length > 0 && (
          <StatementsRenderer statements={additional_content.statements} />
        )}

        {additional_content?.code && (
          <CodeSnippetRenderer code={additional_content.code} />
        )}

        {additional_content?.visual_reference && (
          <DiagramRenderer
            visualReference={additional_content.visual_reference}
            figuresDir={`/${question.exam_id}`}
            onInspect={onInspectImage}
          />
        )}

        {additional_content?.table && (
          <TableRenderer table={additional_content.table} />
        )}
      </div>

      {/* Options List */}
      {options && options.length > 0 && (
        <div className="options-container">
          <div className="options-grid">
            {options.map((opt) => (
              <div key={opt.label} className="option-item">
                <span className="option-label-circle">{opt.label}</span>
                <span className="option-content">{opt.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Footer / ID */}
      <footer className="question-footer">
        <span className="question-id-code">{question_id}</span>
        {question.uncertainty_notes && question.uncertainty_notes.length > 0 && (
          <span className="uncertainty-tag">⚠️ Verification Note Attached</span>
        )}
      </footer>
    </article>
  );
}

