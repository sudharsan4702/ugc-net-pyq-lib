# UGC NET Topic-Wise PYQ Library & Archive

An academic, topic-first question repository and study platform for NTA UGC NET aspirants.

## Features

- **Topic-Wise Curated Indexing**:
  - **Paper 1 (General Paper)**: All 10 official UGC NET units (Teaching, Research, Comprehension, Communication, Mathematical Reasoning, Logical Reasoning, Data Interpretation, ICT, People & Environment, Higher Education).
  - **Paper 2 (Computer Science & Applications - Code 87)**: All 10 official units (Discrete Math, Computer Architecture, Programming & Graphics, DBMS, OS, Software Engineering, Networks, TOC & Compilers, Cloud & Big Data, AI).
- **Specialized Question Renderers**:
  - **Match-the-Following**: Side-by-side List-I and List-II comparison cards with styled badges.
  - **Data Interpretation & Comprehension**: Split/docked reading box with responsive data tables and trend calculations.
  - **Code Blocks**: Formatted terminal/IDE styled windows for C/C++ programming questions.
  - **Diagrams & Automata**: Zoomable high-resolution figures for circuits, DFAs, and geometric reflections.
  - **Statements & Ordering**: Clean enumerated statement lists with logical order options.
- **Study & Navigation Utilities**:
  - **Stream View**: Continuous scroll through all questions of a selected topic (book-grade reading experience).
  - **Focus Mode**: Carousel view to flip through questions one-by-one with `←` / `→` arrow keys.
  - **Instant Search**: Search across question texts, options, subtopics, and question IDs.
  - **Print / PDF Ready**: Clean print stylesheet to export all questions of a topic into hard-copy revision sheets without web clutter.
  - **Bookmarking**: Star tricky questions for quick review (persisted locally).

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## How to Add Future UGC NET Papers (e.g. Dec 2025, Jun 2025)

This archive is designed to scale across multiple exam years seamlessly.

1. **Place new question files in `public/`:**
   ```
   public/
   ├── ugc-net-dec-2025/
   │     ├── questions.json
   │     ├── shared_passages.json (if any)
   │     └── figures/ (if any)
   ```

2. **Register the paper in `src/data/loader.js`:**
   ```javascript
   export const EXAM_REGISTRY = [
     {
       id: 'ugc-net-jun-2026',
       title: 'UGC NET June 2026',
       year: 2026,
       session: 'June',
       questionsPath: '/ugc-net-jun-2026/questions.json',
       passagesPath: '/ugc-net-jun-2026/shared_passages.json',
       figuresDir: '/ugc-net-jun-2026/figures'
     },
     {
       id: 'ugc-net-dec-2025',
       title: 'UGC NET Dec 2025',
       year: 2025,
       session: 'December',
       questionsPath: '/ugc-net-dec-2025/questions.json',
       passagesPath: '/ugc-net-dec-2025/shared_passages.json',
       figuresDir: '/ugc-net-dec-2025/figures'
     }
   ];
   ```

3. **Map Questions to Topics:**
   - Include `"unit_number": 4` and `"subtopic": "..."` directly on the question objects in your JSON, OR
   - Add mappings to `src/data/questionTopicMap.json`.

All questions matching that unit across all registered years will immediately aggregate into that topic's unified feed!
