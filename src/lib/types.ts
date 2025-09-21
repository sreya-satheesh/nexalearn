import type {
  LessonPlanOutput,
  QuizAndFlashcardOutput,
  SummarizeContentOutput,
} from './actions';

export type LessonPlan = LessonPlanOutput;
export type QuizAndFlashcards = QuizAndFlashcardOutput;

export type SummarizedContent = SummarizeContentOutput;

export type PersonalizedQuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type PersonalizedQuiz = {
  questions: PersonalizedQuizQuestion[];
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};
