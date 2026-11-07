import React from 'react';

export default function DataSummaryModal({ isOpen, onClose, totalQuestions, loadedExams }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content info-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📦 How to Add More PYQs (Schema & Registry Guide)</h2>
          <button type="button" className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body-scrollable">
          <div className="info-summary-box">
            <h4>Current Archive Status</h4>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-num">{totalQuestions}</span>
                <span className="status-label">Total Questions Loaded</span>
              </div>
              <div className="status-item">
                <span className="status-num">{loadedExams.length}</span>
                <span className="status-label">Exam Papers Registered</span>
              </div>
              <div className="status-item">
                <span className="status-num">20</span>
                <span className="status-label">Total Units (P1 + P2)</span>
              </div>
            </div>
          </div>

          <div className="guide-section">
            <h3>How to drop in future UGC NET papers (e.g. Dec 2025, Jun 2025):</h3>
            
            <ol className="guide-steps-list">
              <li>
                <strong>Place your new files in the <code>public/</code> folder:</strong>
                <pre className="code-hint">
{`public/
  ├── ugc-net-dec-2025/
  │     ├── questions.json
  │     ├── shared_passages.json (optional)
  │     └── figures/ (optional diagrams)`}
                </pre>
              </li>

              <li>
                <strong>Register the paper in <code>src/data/loader.js</code>:</strong>
                <pre className="code-hint">
{`// Add an entry to EXAM_REGISTRY in src/data/loader.js:
{
  id: 'ugc-net-dec-2025',
  title: 'UGC NET Dec 2025',
  year: 2025,
  session: 'December',
  questionsPath: '/ugc-net-dec-2025/questions.json',
  passagesPath: '/ugc-net-dec-2025/shared_passages.json',
  figuresDir: '/ugc-net-dec-2025/figures'
}`}
                </pre>
              </li>

              <li>
                <strong>Tag questions with their unit:</strong>
                <p>
                  You can either add <code>"unit_number": 4</code> and <code>"subtopic": "..."</code> directly to each question inside your new <code>questions.json</code>, OR add entries to <code>src/data/questionTopicMap.json</code>.
                </p>
                <p>
                  Once added, all questions across all years matching that unit will immediately show up in that topic's unified feed!
                </p>
              </li>
            </ol>
          </div>

          <div className="guide-section">
            <h3>Standard Question JSON Schema (Quick Reference):</h3>
            <pre className="code-hint">
{`{
  "question_id": "NET-2025-DEC-P2-Q001",
  "paper_number": 2,
  "unit_number": 4,                       // 1 to 10
  "subtopic": "Relational Algebra",
  "question_type": "multiple_choice",     // match_the_following, passage_based, etc.
  "question_text": "Which normal form...",
  "options": [
    { "label": "1", "text": "1NF" },
    { "label": "2", "text": "2NF" },
    { "label": "3", "text": "3NF" },
    { "label": "4", "text": "BCNF" }
  ]
}`}
            </pre>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

