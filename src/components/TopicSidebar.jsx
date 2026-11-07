import React from 'react';

export default function TopicSidebar({
  units,
  selectedUnit,
  onSelectUnit,
  questionCountsByUnit,
  totalQuestionsCount,
  selectedType,
  onSelectType,
  availableTypes,
  exams = [],
  selectedExamId = '',
  onSelectExamId,
  paperQuestionsByExam = {},
  showOnlyBookmarked,
  onToggleBookmarksOnly,
  bookmarkedCount,
  isOpen,
  onClose
}) {
  const formatQuestionType = (type) => {
    if (!type) return 'All Types';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <aside className={`topic-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <h2 className="sidebar-title">Syllabus Topics</h2>
          <button type="button" className="btn-close-sidebar" onClick={onClose} title="Close sidebar">✕</button>
        </div>
        <p className="sidebar-subtitle">Filter questions by curriculum unit</p>
      </div>

      <div className="sidebar-scroll-area">
        {/* All Questions Button */}
        <button
          type="button"
          onClick={() => onSelectUnit(null)}
          className={`topic-nav-btn ${selectedUnit === null ? 'active' : ''}`}
        >
          <div className="topic-nav-main">
            <span className="topic-name">All Units</span>
          </div>
          <span className="count-pill">{totalQuestionsCount}</span>
        </button>

        {/* Units Navigation List */}
        <div className="topic-units-list">
          {units.map((u) => {
            const count = questionCountsByUnit[u.unit] || 0;
            const isSelected = selectedUnit === u.unit;

            return (
              <button
                key={u.unit}
                type="button"
                onClick={() => onSelectUnit(u.unit)}
                className={`topic-nav-btn ${isSelected ? 'active' : ''}`}
              >
                <div className="topic-nav-main">
                  <span className="unit-number-tag">U{u.unit}</span>
                  <div className="unit-name-box">
                    <span className="topic-name">{u.title}</span>
                  </div>
                </div>
                <span className={`count-pill ${count === 0 ? 'zero' : ''}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Exam Session Filter */}
        {exams.length > 1 && (
          <div className="sidebar-section">
            <h3 className="section-label">Exam Session</h3>
            <div className="type-filters-pill-group">
              <button
                type="button"
                onClick={() => onSelectExamId && onSelectExamId('')}
                className={`type-pill ${selectedExamId === '' ? 'active' : ''}`}
              >
                All Years ({totalQuestionsCount})
              </button>
              {exams.map((exam) => {
                const count = paperQuestionsByExam[exam.id] || 0;
                return (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => onSelectExamId && onSelectExamId(exam.id)}
                    className={`type-pill ${selectedExamId === exam.id ? 'active' : ''}`}
                  >
                    {exam.session} {exam.year} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter by Question Type */}
        <div className="sidebar-section">
          <h3 className="section-label">Question Type</h3>
          <div className="type-filters-pill-group">
            <button
              type="button"
              onClick={() => onSelectType('')}
              className={`type-pill ${selectedType === '' ? 'active' : ''}`}
            >
              All Types
            </button>
            {availableTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onSelectType(type)}
                className={`type-pill ${selectedType === type ? 'active' : ''}`}
              >
                {formatQuestionType(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Starred / Bookmarked Filter */}
        <div className="sidebar-section">
          <h3 className="section-label">Saved Questions</h3>
          <button
            type="button"
            onClick={onToggleBookmarksOnly}
            className={`topic-nav-btn ${showOnlyBookmarked ? 'active' : ''}`}
          >
            <div className="topic-nav-main">
              <span className="bookmark-icon">★</span>
              <span className="topic-name">Bookmarked Only</span>
            </div>
            <span className="count-pill">{bookmarkedCount}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
