import { EmotionEntry, InterviewAttempt, InterviewSession, WeakResponse } from '../types';
import { getInterviewQuestionsForRole } from '../config/mockData';

export function analyzeInterviewSession(
  roleId: string,
  transcripts: { [questionId: string]: string },
  emotionLogs: EmotionEntry[]
): { session: InterviewSession; attempt: InterviewAttempt } {
  const allRoleQuestions = getInterviewQuestionsForRole(roleId);

  // Filter questions to only those actually answered with substantial content
  const answeredQuestions = allRoleQuestions.filter(q => {
    const speech = (transcripts[q.id] || '').trim();
    return speech.length > 0 && speech.split(/\s+/).filter(Boolean).length >= 2;
  });

  // If candidate did not answer any questions (silent / mic off / skipped all)
  if (answeredQuestions.length === 0) {
    const session: InterviewSession = {
      score: 0,
      metrics: { communication: 0, technical: 0, problemSolving: 0, confidence: 0 },
      aiFeedback: [
        {
          category: 'Communication Clarity',
          comment: 'No spoken or typed responses were detected. Please enable your microphone, check audio input levels, or use the direct answer box.',
          score: 0
        },
        {
          category: 'Technical Accuracy',
          comment: 'No technical answers were submitted for domain evaluation.',
          score: 0
        },
        {
          category: 'Problem-Solving Structure',
          comment: 'Questions were not attempted. Practice answering aloud using the STAR method.',
          score: 0
        },
        {
          category: 'Confidence & Facial Expressiveness',
          comment: emotionLogs.length > 0
            ? 'Webcam was active, but speech answers are required for complete scoring.'
            : 'No audio or webcam responses recorded.',
          score: 0
        }
      ],
      weakResponses: allRoleQuestions.map(q => ({
        question: q.question,
        yourAnswer: '[Not Attempted / No Audio Detected]',
        modelAnswer: q.sampleModelAnswer,
        tip: `Key terms to cover: ${q.idealKeywords.slice(0, 4).join(', ')}`
      })),
      focusAreas: [
        'Check browser microphone permissions or use the text editor to submit answers',
        'Provide structured answers covering technical tradeoffs and architectural patterns',
        'Speak in a clear, measured pace while maintaining camera engagement'
      ]
    };

    const attempt: InterviewAttempt = {
      date: new Date(),
      jobRole: roleId,
      score: 0,
      transcript: '[No Audio Detected / Session Not Attempted]',
      emotionLog: emotionLogs
    };

    return { session, attempt };
  }

  const weakResponses: WeakResponse[] = [];

  let totalComm = 0;
  let totalTech = 0;
  let totalProb = 0;
  let totalConf = 0;

  answeredQuestions.forEach((q) => {
    const userSpeech = (transcripts[q.id] || '').trim();
    const speechLower = userSpeech.toLowerCase();
    const words = userSpeech.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Check keyword matches against ideal answers
    const matchedKeywords = q.idealKeywords.filter(kw => speechLower.includes(kw.toLowerCase()));
    const keywordCoverage = q.idealKeywords.length > 0 
      ? matchedKeywords.length / q.idealKeywords.length 
      : 0.5;

    // Accurate score calculation per question based on real content
    const commScore = Math.min(10, Math.max(1, Math.round(wordCount / 12) + (wordCount > 30 ? 2 : 0)));
    const techScore = Math.min(10, Math.max(1, Math.round(keywordCoverage * 8) + (matchedKeywords.length > 0 ? 2 : 0)));
    const probScore = Math.min(10, Math.max(1, Math.round((commScore * 0.4) + (techScore * 0.6))));
    
    // Confidence factored with emotion analysis if available
    let confScore = Math.min(10, Math.max(1, Math.round(commScore * 0.6 + techScore * 0.4)));
    if (emotionLogs.length > 0) {
      const confidentFrames = emotionLogs.filter(e => e.emotion === 'confident' || e.emotion === 'focused' || e.emotion === 'neutral').length;
      const confRatio = confidentFrames / emotionLogs.length;
      confScore = Math.min(10, Math.max(1, Math.round(confScore * 0.7 + confRatio * 3)));
    }

    totalComm += commScore;
    totalTech += techScore;
    totalProb += probScore;
    totalConf += confScore;

    const questionAvgScore = Math.round(((commScore + techScore + probScore + confScore) / 40) * 100);

    // If score < 70 or low keyword coverage, add to weak responses
    if (questionAvgScore < 70 || keywordCoverage < 0.5 || wordCount < 15) {
      weakResponses.push({
        question: q.question,
        yourAnswer: userSpeech,
        modelAnswer: q.sampleModelAnswer,
        tip: `Include key terminology such as: ${q.idealKeywords.slice(0, 3).join(', ')} to boost technical accuracy.`
      });
    }
  });

  // Flag skipped questions
  allRoleQuestions.forEach((q) => {
    const speech = (transcripts[q.id] || '').trim();
    if (!speech) {
      weakResponses.push({
        question: q.question,
        yourAnswer: "[Skipped / Not Attempted]",
        modelAnswer: q.sampleModelAnswer,
        tip: "Answer this question during your next mock attempt to demonstrate full range."
      });
    }
  });

  const questionCount = allRoleQuestions.length; // Average over all role questions
  const communication = Math.round(totalComm / questionCount);
  const technical = Math.round(totalTech / questionCount);
  const problemSolving = Math.round(totalProb / questionCount);
  const confidence = Math.round(totalConf / questionCount);

  const overallScore = Math.min(100, Math.round(((communication + technical + problemSolving + confidence) / 40) * 100));

  const session: InterviewSession = {
    score: overallScore,
    metrics: { communication, technical, problemSolving, confidence },
    aiFeedback: [
      {
        category: 'Communication Clarity',
        comment: communication >= 7 ? 'Excellent clarity, steady pacing, and clear articulation throughout.' : 'Pacing was brief or uneven. Practice expanding on key points with structured phrasing.',
        score: communication
      },
      {
        category: 'Technical Accuracy',
        comment: technical >= 7 ? 'Demonstrated strong domain knowledge with precise architectural terms.' : 'Incorporate more specific frameworks, data structures, and edge-case handlings.',
        score: technical
      },
      {
        category: 'Problem-Solving Structure',
        comment: problemSolving >= 7 ? 'Used structured STAR (Situation-Task-Action-Result) framing effectively.' : 'Structure answers systematically: define the core problem, outline solutions, then state results.',
        score: problemSolving
      },
      {
        category: 'Confidence & Facial Expressiveness',
        comment: confidence >= 7 ? 'Maintained excellent camera engagement and positive facial composure.' : 'Work on eye contact with the camera and steady posture during complex explanations.',
        score: confidence
      }
    ],
    weakResponses,
    focusAreas: [
      'Master core STAR framing for technical scenario questions',
      'Elaborate on specific architectural tradeoffs and system bottlenecks',
      'Maintain direct camera eye contact to reinforce interviewer confidence'
    ]
  };

  const attempt: InterviewAttempt = {
    date: new Date(),
    jobRole: roleId,
    score: overallScore,
    transcript: Object.values(transcripts).filter(Boolean).join(' \n') || "[Partial Interview Session]",
    emotionLog: emotionLogs
  };

  return { session, attempt };
}
