import React, { useEffect, useState } from 'react';
import QuestionCard from './QuestionCard';

export default function FocusCardView({
  questions,
  passages,
  onInspectImage,
  bookmarkedSet,
  onToggleBookmark
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when question list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [questions.length]);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'j') {
        setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [questions.length]);

  if (!questions || questions.length === 0) {
    return (
      <div className="empty-state-box">
        <div className="empty-icon">📂</div>
        <h3>No questions found</h3>
        <p>Try clearing your search query or selecting a different unit.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const passage = currentQ.passage_key ? passages[currentQ.passage_key] : (currentQ.shared_passage ? passages[currentQ.shared_passage.passage_id] : null);

  return (
    <div className="focus-view-container">
      {/* Focus Navigation Toolbar */}
      <div className="focus-toolbar">
        <div className="focus-controls-left">
          <button
            type="button"
            className="btn btn-outline"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          >
            ← Previous
          </button>
        </div>

        <div className="focus-counter-group">
          <span className="focus-step-text">
            Question <strong>{currentIndex + 1}</strong> of <strong>{questions.length}</strong>
          </span>
          <span className="focus-keys-hint">(Use ← / → arrow keys to navigate)</span>
        </div>

        <div className="focus-controls-right">
          <button
            type="button"
            className="btn btn-primary"
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
          >
            Next →
          </button>
        </div>
      </div>

      {/* The Single Question Displayed */}
      <div className="focus-card-wrapper">
        <QuestionCard
          question={currentQ}
          passage={passage}
          onInspectImage={onInspectImage}
          isBookmarked={bookmarkedSet.has(currentQ.question_id)}
          onToggleBookmark={onToggleBookmark}
        />
      </div>
    </div>
  );
}

