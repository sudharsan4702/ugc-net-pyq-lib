import React from 'react';

export default function Navbar({
  selectedPaper,
  onSelectPaper,
  searchQuery,
  onSearchChange,
  viewMode,
  onChangeViewMode,
  onPrint,
  onOpenInfo,
  onToggleSidebar,
  totalFilteredQuestions
}) {
  return (
    <header className="app-navbar">
      <div className="navbar-container">
        {/* Left: Branding & Mobile Menu */}
        <div className="nav-left">
          <button
            type="button"
            className="btn-hamburger"
            onClick={onToggleSidebar}
            title="Toggle topics sidebar"
          >
            ☰
          </button>
          <div className="brand-group">
            <span className="brand-logo-icon">📚</span>
            <div className="brand-titles">
              <h1 className="brand-title">UGC NET PYQ Archive</h1>
              <span className="brand-subtitle">Topic-Wise Question Repository</span>
            </div>
          </div>
        </div>

        {/* Center: Paper Switcher */}
        <div className="nav-center">
          <div className="paper-tabs-group">
            <button
              type="button"
              className={`paper-tab ${selectedPaper === 1 ? 'active' : ''}`}
              onClick={() => onSelectPaper(1)}
            >
              <span className="tab-pill">Paper 1</span>
              <span className="tab-name">General Paper</span>
            </button>
            <button
              type="button"
              className={`paper-tab ${selectedPaper === 2 ? 'active' : ''}`}
              onClick={() => onSelectPaper(2)}
            >
              <span className="tab-pill">Paper 2</span>
              <span className="tab-name">Computer Science (87)</span>
            </button>
          </div>
        </div>

        {/* Right: Search & View Controls */}
        <div className="nav-right">
          {/* Search Input */}
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search in questions & topics..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => onSearchChange('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="view-mode-group">
            <button
              type="button"
              className={`btn-view-toggle ${viewMode === 'stream' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('stream')}
              title="Continuous Reading Stream"
            >
              ☰ Stream
            </button>
            <button
              type="button"
              className={`btn-view-toggle ${viewMode === 'focus' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('focus')}
              title="One-by-One Focus Card View"
            >
              🗂️ Focus
            </button>
          </div>

          {/* Print / PDF Action */}
          <button
            type="button"
            className="btn btn-outline"
            onClick={onPrint}
            title="Print or export current topic questions to clean PDF"
          >
            🖨️ Print
          </button>

          {/* Info & Schema Guide */}
          <button
            type="button"
            className="btn btn-icon-only"
            onClick={onOpenInfo}
            title="How to add more PYQs & Schema guide"
          >
            ℹ️
          </button>
        </div>
      </div>
    </header>
  );
}

