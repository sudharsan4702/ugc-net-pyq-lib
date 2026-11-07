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
        {/* Top / Left Section */}
        <div className="navbar-top-row">
          <div className="nav-left">
            <button
              type="button"
              className="btn-hamburger"
              onClick={onToggleSidebar}
              title="Toggle topics sidebar"
              aria-label="Toggle topics menu"
            >
              ☰
            </button>
            <div className="brand-group">
              <span className="brand-logo-icon">📚</span>
              <div className="brand-titles">
                <h1 className="brand-title">UGC NET PYQ</h1>
                <span className="brand-subtitle">Topic Archive</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Stream/Focus, Print, Info) */}
          <div className="nav-quick-actions">
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

            <button
              type="button"
              className="btn btn-outline btn-print-nav"
              onClick={onPrint}
              title="Print or export current topic questions to clean PDF"
            >
              🖨️ <span className="btn-text-label">Print</span>
            </button>

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

        {/* Paper Switcher */}
        <div className="nav-center">
          <div className="paper-tabs-group">
            <button
              type="button"
              className={`paper-tab ${selectedPaper === 1 ? 'active' : ''}`}
              onClick={() => onSelectPaper(1)}
            >
              <span className="tab-pill">P-1</span>
              <span className="tab-name">General Paper</span>
            </button>
            <button
              type="button"
              className={`paper-tab ${selectedPaper === 2 ? 'active' : ''}`}
              onClick={() => onSelectPaper(2)}
            >
              <span className="tab-pill">P-2</span>
              <span className="tab-name">Computer Science (87)</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="nav-search-area">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search questions or topics..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
