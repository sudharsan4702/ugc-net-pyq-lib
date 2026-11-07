import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import TopicSidebar from './components/TopicSidebar';
import QuestionCard from './components/QuestionCard';
import FocusCardView from './components/FocusCardView';
import ImageViewerModal from './components/ImageViewerModal';
import DataSummaryModal from './components/DataSummaryModal';
import { PAPER_1_UNITS, PAPER_2_UNITS } from './data/syllabus';
import { fetchAllExamData, EXAM_REGISTRY } from './data/loader';
import './App.css';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [passagesMap, setPassagesMap] = useState({});

  // Navigation & Filtering State
  const [selectedPaper, setSelectedPaper] = useState(2); // Default to Paper 2 (Computer Science)
  const [selectedUnit, setSelectedUnit] = useState(null); // null = All units
  const [selectedExamId, setSelectedExamId] = useState(''); // '' = All Exams (June 2026 + June 2025)
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('stream'); // 'stream' | 'focus'
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [inspectModal, setInspectModal] = useState({ isOpen: false, src: '', alt: '' });
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // LocalStorage Bookmarks
  const [bookmarkedSet, setBookmarkedSet] = useState(() => {
    try {
      const saved = localStorage.getItem('ugc_net_bookmarked_questions');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleBookmark = (questionId) => {
    setBookmarkedSet((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      try {
        localStorage.setItem('ugc_net_bookmarked_questions', JSON.stringify([...next]));
      } catch (err) {
        console.error('Failed to save bookmarks:', err);
      }
      return next;
    });
  };

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth <= 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Data Loading
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { questions, passages } = await fetchAllExamData();
        setAllQuestions(questions);
        setPassagesMap(passages);
        setLoading(false);
      } catch (err) {
        console.error('Error loading question library:', err);
        setError('Failed to load question archive. Please refresh the page.');
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Units for currently selected paper
  const currentUnits = useMemo(() => {
    return selectedPaper === 1 ? PAPER_1_UNITS : PAPER_2_UNITS;
  }, [selectedPaper]);

  // Questions belonging to currently selected paper
  const paperQuestions = useMemo(() => {
    return allQuestions.filter((q) => q.paper_number === selectedPaper);
  }, [allQuestions, selectedPaper]);

  // Counts by exam for active paper
  const paperQuestionsByExam = useMemo(() => {
    const counts = {};
    paperQuestions.forEach((q) => {
      counts[q.exam_id] = (counts[q.exam_id] || 0) + 1;
    });
    return counts;
  }, [paperQuestions]);

  // Available question types in current paper
  const availableTypes = useMemo(() => {
    const types = new Set();
    paperQuestions.forEach((q) => {
      if (q.question_type) types.add(q.question_type);
    });
    return Array.from(types);
  }, [paperQuestions]);

  // Counts by unit for the active paper (taking into account selectedExamId if any)
  const questionCountsByUnit = useMemo(() => {
    const counts = {};
    paperQuestions.forEach((q) => {
      if (!selectedExamId || q.exam_id === selectedExamId) {
        counts[q.unit_number] = (counts[q.unit_number] || 0) + 1;
      }
    });
    return counts;
  }, [paperQuestions, selectedExamId]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return paperQuestions.filter((q) => {
      // Filter by exam session
      if (selectedExamId && q.exam_id !== selectedExamId) {
        return false;
      }

      // Filter by unit
      if (selectedUnit !== null && q.unit_number !== selectedUnit) {
        return false;
      }

      // Filter by question type
      if (selectedType && q.question_type !== selectedType) {
        return false;
      }

      // Filter by bookmarks
      if (showOnlyBookmarked && !bookmarkedSet.has(q.question_id)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textMatch = q.question_text?.toLowerCase().includes(query);
        const subtopicMatch = q.subtopic?.toLowerCase().includes(query);
        const idMatch = q.question_id?.toLowerCase().includes(query);
        const optionMatch = q.options?.some((o) => o.text?.toLowerCase().includes(query));
        if (!textMatch && !subtopicMatch && !idMatch && !optionMatch) {
          return false;
        }
      }

      return true;
    });
  }, [paperQuestions, selectedExamId, selectedUnit, selectedType, showOnlyBookmarked, bookmarkedSet, searchQuery]);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  const selectedUnitObj = currentUnits.find((u) => u.unit === selectedUnit);
  const selectedExamObj = EXAM_REGISTRY.find((e) => e.id === selectedExamId);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h2>Loading UGC NET Question Library...</h2>
        <p>Indexing 300 questions across multiple exam cycles and 20 syllabus units</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>⚠️ System Error</h2>
        <p>{error}</p>
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Sticky Header Navbar */}
      <Navbar
        selectedPaper={selectedPaper}
        onSelectPaper={(p) => {
          setSelectedPaper(p);
          setSelectedUnit(null); // Reset unit filter when switching paper
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onPrint={handlePrint}
        onOpenInfo={() => setInfoModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        totalFilteredQuestions={filteredQuestions.length}
      />

      <div className="main-content-layout">
        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Sticky Syllabus Units Sidebar */}
        <TopicSidebar
          units={currentUnits}
          selectedUnit={selectedUnit}
          onSelectUnit={(unit) => {
            setSelectedUnit(unit);
            setSidebarOpen(false);
          }}
          questionCountsByUnit={questionCountsByUnit}
          totalQuestionsCount={selectedExamId ? (paperQuestionsByExam[selectedExamId] || 0) : paperQuestions.length}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          availableTypes={availableTypes}
          exams={EXAM_REGISTRY}
          selectedExamId={selectedExamId}
          onSelectExamId={setSelectedExamId}
          paperQuestionsByExam={paperQuestionsByExam}
          showOnlyBookmarked={showOnlyBookmarked}
          onToggleBookmarksOnly={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
          bookmarkedCount={paperQuestions.filter((q) => bookmarkedSet.has(q.question_id)).length}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Question Feed / Reader Area */}
        <main className="question-feed-container">
          {/* Active Topic Banner */}
          <div className="topic-header-banner">
            <div className="topic-header-main">
              <div className="topic-badge-row">
                <span className="paper-badge">
                  Paper {selectedPaper}: {selectedPaper === 1 ? 'General Paper' : 'Computer Science'}
                </span>
                {selectedExamObj && (
                  <span className="unit-badge">{selectedExamObj.title}</span>
                )}
                {selectedUnit ? (
                  <span className="unit-badge">Unit {selectedUnit}</span>
                ) : (
                  <span className="unit-badge">All Units Combined</span>
                )}
              </div>
              <h2 className="active-topic-title">
                {selectedUnitObj ? selectedUnitObj.title : 'Complete Topic Repository'}
              </h2>
              {selectedUnitObj?.subtopics && (
                <div className="subtopics-cloud">
                  {selectedUnitObj.subtopics.map((sub, idx) => (
                    <span key={idx} className="subtopic-chip">
                      {sub}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="topic-stats-box">
              <div className="stat-count">{filteredQuestions.length}</div>
              <div className="stat-label">Questions</div>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {(selectedExamId || selectedUnit !== null || selectedType || searchQuery || showOnlyBookmarked) && (
            <div className="active-filters-bar">
              <span className="filter-label">Filters:</span>
              {selectedExamId && (
                <span className="filter-chip">
                  Session: {selectedExamObj?.title || selectedExamId}
                  <button type="button" onClick={() => setSelectedExamId('')}>✕</button>
                </span>
              )}
              {selectedUnit !== null && (
                <span className="filter-chip">
                  Unit {selectedUnit}
                  <button type="button" onClick={() => setSelectedUnit(null)}>✕</button>
                </span>
              )}
              {selectedType && (
                <span className="filter-chip">
                  Type: {selectedType.replace('_', ' ')}
                  <button type="button" onClick={() => setSelectedType('')}>✕</button>
                </span>
              )}
              {showOnlyBookmarked && (
                <span className="filter-chip">
                  Bookmarked Only
                  <button type="button" onClick={() => setShowOnlyBookmarked(false)}>✕</button>
                </span>
              )}
              {searchQuery && (
                <span className="filter-chip">
                  "{searchQuery}"
                  <button type="button" onClick={() => setSearchQuery('')}>✕</button>
                </span>
              )}
              <button
                type="button"
                className="btn-clear-all"
                onClick={() => {
                  setSelectedExamId('');
                  setSelectedUnit(null);
                  setSelectedType('');
                  setShowOnlyBookmarked(false);
                  setSearchQuery('');
                }}
              >
                Clear All
              </button>
            </div>
          )}

          {/* Render Stream View or Focus View */}
          {filteredQuestions.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-icon">🔍</div>
              <h3>No questions match your criteria</h3>
              <p>Try resetting filters or searching for different keywords.</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedExamId('');
                  setSelectedUnit(null);
                  setSelectedType('');
                  setShowOnlyBookmarked(false);
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'focus' ? (
            <FocusCardView
              questions={filteredQuestions}
              passages={passagesMap}
              onInspectImage={(src, alt) => setInspectModal({ isOpen: true, src, alt })}
              bookmarkedSet={bookmarkedSet}
              onToggleBookmark={toggleBookmark}
            />
          ) : (
            <div className="question-stream-list">
              {filteredQuestions.map((q) => {
                const passage = q.passage_key ? passagesMap[q.passage_key] : (q.shared_passage ? passagesMap[q.shared_passage.passage_id] : null);
                return (
                  <QuestionCard
                    key={q.question_id}
                    question={q}
                    passage={passage}
                    onInspectImage={(src, alt) => setInspectModal({ isOpen: true, src, alt })}
                    isBookmarked={bookmarkedSet.has(q.question_id)}
                    onToggleBookmark={toggleBookmark}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Lightbox / Modal for Diagram Inspection */}
      <ImageViewerModal
        isOpen={inspectModal.isOpen}
        src={inspectModal.src}
        alt={inspectModal.alt}
        onClose={() => setInspectModal({ isOpen: false, src: '', alt: '' })}
      />

      {/* Developer & Schema Guide Modal */}
      <DataSummaryModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        totalQuestions={allQuestions.length}
        loadedExams={EXAM_REGISTRY}
      />
    </div>
  );
}
