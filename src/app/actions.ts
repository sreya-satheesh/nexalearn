'use server';

import {
  generateLessonPlan as generateLessonPlanFlow,
  type LessonPlanInput as LessonPlanInputType,
  type LessonPlanOutput as LessonPlanOutputType,
} from '@/ai/flows/lesson-plan-generation';
import {
  generateQuizAndFlashcards as generateQuizAndFlashcardsFlow,
  type QuizAndFlashcardInput as QuizAndFlashcardInputType,
  type QuizAndFlashcardOutput as QuizAndFlashcardOutputType,
} from '@/ai/flows/quiz-flashcard-generation';
import {
  summarizeContent as summarizeContentFlow,
  type SummarizeContentInput as SummarizeContentInputType,
  type SummarizeContentOutput as SummarizeContentOutputType,
} from '@/ai/flows/content-summarization';
import {
  generatePersonalizedQuiz as generatePersonalizedQuizFlow,
  type PersonalizedQuizInput as PersonalizedQuizInputType,
  type PersonalizedQuizOutput as PersonalizedQuizOutputType,
} from '@/ai/flows/personalized-practice-quizzes';

// Export types for use in components
export type LessonPlanInput = LessonPlanInputType;
export type LessonPlanOutput = LessonPlanOutputType;
export type QuizAndFlashcardInput = QuizAndFlashcardInputType;
export type QuizAndFlashcardOutput = QuizAndFlashcardOutputType;
export type SummarizeContentInput = SummarizeContentInputType;
export type SummarizeContentOutput = SummarizeContentOutputType;
export type PersonalizedQuizInput = PersonalizedQuizInputType;
export type PersonalizedQuizOutput = PersonalizedQuizOutputType;

// Wrapper function for generateLessonPlan
export async function generateLessonPlan(
  input: LessonPlanInput
): Promise<{ success: boolean; data?: LessonPlanOutput; error?: string }> {
  try {
    const data = await generateLessonPlanFlow(input);
    return { success: true, data };
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    return { success: false, error: 'Failed to generate lesson plan.' };
  }
}

// Wrapper function for generateQuizAndFlashcards
export async function generateQuizAndFlashcards(
  input: QuizAndFlashcardInput
): Promise<{
  success: boolean;
  data?: QuizAndFlashcardOutput;
  error?: string;
}> {
  try {
    const data = await generateQuizAndFlashcardsFlow(input);
    return { success: true, data };
  } catch (error) {
    console.error('Error generating quiz and flashcards:', error);
    return { success: false, error: 'Failed to generate quiz and flashcards.' };
  }
}

// Wrapper function for summarizeContent
export async function summarizeContent(
  input: SummarizeContentInput
): Promise<{
  success: boolean;
  data?: SummarizeContentOutput;
  error?: string;
}> {
  try {
    const data = await summarizeContentFlow(input);
    return { success: true, data };
  } catch (error) {
    console.error('Error summarizing content:', error);
    return { success: false, error: 'Failed to summarize content.' };
  }
}

// Wrapper function for generatePersonalizedQuiz
export async function generatePersonalizedQuiz(
  input: PersonalizedQuizInput
): Promise<{
  success: boolean;
  data?: PersonalizedQuizOutput;
  error?: string;
}> {
  try {
    const data = await generatePersonalizedQuizFlow(input);
    return { success: true, data };
  } catch (error) {
    console.error('Error generating personalized quiz:', error);
    return { success: false, error: 'Failed to generate personalized quiz.' };
  }
}
