'use server';

/**
 * @fileOverview Generates quizzes and flashcards based on a lesson plan.
 *
 * - generateQuizAndFlashcards - A function that generates quizzes and flashcards.
 * - QuizAndFlashcardInput - The input type for the generateQuizAndFlashcards function.
 * - QuizAndFlashcardOutput - The return type for the generateQuizAndFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizAndFlashcardInputSchema = z.object({
  lessonPlan: z
    .string()
    .describe('The lesson plan to generate questions and flashcards from.'),
});
export type QuizAndFlashcardInput = z.infer<typeof QuizAndFlashcardInputSchema>;

const QuizAndFlashcardOutputSchema = z.object({
  multipleChoiceQuestions: z
    .array(z.string())
    .describe('Multiple choice questions generated from the lesson plan.'),
  shortAnswerQuestions: z
    .array(z.string())
    .describe('Short answer questions generated from the lesson plan.'),
  flashcards: z
    .array(z.object({term: z.string(), definition: z.string()}))
    .describe('Flashcards generated from the lesson plan.'),
});
export type QuizAndFlashcardOutput = z.infer<typeof QuizAndFlashcardOutputSchema>;

export async function generateQuizAndFlashcards(
  input: QuizAndFlashcardInput
): Promise<QuizAndFlashcardOutput> {
  return quizAndFlashcardFlow(input);
}

const quizAndFlashcardPrompt = ai.definePrompt({
  name: 'quizAndFlashcardPrompt',
  input: {schema: QuizAndFlashcardInputSchema},
  output: {schema: QuizAndFlashcardOutputSchema},
  prompt: `You are an AI assistant designed to generate quizzes and flashcards for teachers.

  Based on the provided lesson plan, generate multiple choice questions, short answer questions, and flashcards.

  Lesson Plan: {{{lessonPlan}}}

  Output the multipleChoiceQuestions, shortAnswerQuestions, and flashcards in JSON format.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const quizAndFlashcardFlow = ai.defineFlow(
  {
    name: 'quizAndFlashcardFlow',
    inputSchema: QuizAndFlashcardInputSchema,
    outputSchema: QuizAndFlashcardOutputSchema,
  },
  async input => {
    const {output} = await quizAndFlashcardPrompt(input);
    return output!;
  }
);
