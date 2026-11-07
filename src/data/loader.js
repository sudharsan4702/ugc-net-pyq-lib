import { PAPER_1_UNITS, PAPER_2_UNITS } from './syllabus.js';
import topicMappings from './questionTopicMap.json';

// Registered Exam Papers Archive
// To add more PYQ papers in the future, simply add them here and place the JSON in /public
export const EXAM_REGISTRY = [
  {
    id: 'ugc-net-jun-2026',
    title: 'UGC NET June 2026',
    year: 2026,
    session: 'June',
    questionsPath: '/ugc-net-jun-2026/questions.json',
    passagesPath: '/ugc-net-jun-2026/shared_passages.json',
    figuresDir: '/ugc-net-jun-2026/figures'
  }
];

export async function fetchAllExamData() {
  const allQuestions = [];
  const passagesMap = {};

  for (const exam of EXAM_REGISTRY) {
    try {
      const [qRes, pRes] = await Promise.all([
        fetch(exam.questionsPath),
        fetch(exam.passagesPath).catch(() => null)
      ]);

      if (qRes.ok) {
        const questions = await qRes.json();
        
        // Passages
        if (pRes && pRes.ok) {
          const passages = await pRes.json();
          passages.forEach(p => {
            passagesMap[p.passage_id] = p;
          });
        }

        // Enrich questions with syllabus units and subtopics
        questions.forEach(q => {
          const mapping = topicMappings[q.question_id] || {};
          const unitNumber = q.unit_number || mapping.unit_number || 1;
          const subtopic = q.subtopic || mapping.subtopic || 'General';

          const syllabusUnits = q.paper_number === 1 ? PAPER_1_UNITS : PAPER_2_UNITS;
          const unitObj = syllabusUnits.find(u => u.unit === unitNumber) || syllabusUnits[0];

          allQuestions.push({
            ...q,
            exam_id: exam.id,
            exam_title: exam.title,
            figuresDir: exam.figuresDir,
            unit_number: unitNumber,
            unit_title: unitObj.title,
            unit_short_title: unitObj.shortTitle,
            subtopic: subtopic
          });
        });
      }
    } catch (err) {
      console.error(`Failed to load exam ${exam.id}:`, err);
    }
  }

  return {
    questions: allQuestions,
    passages: passagesMap
  };
}

