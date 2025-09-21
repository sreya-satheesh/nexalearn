'use server';

/**
 * @fileOverview Generates personalized practice quizzes based on student's identified weaknesses.
 *
 * - generatePersonalizedQuiz - A function that generates a personalized quiz.
 * - PersonalizedQuizInput - The input type for the generatePersonalizedQuiz function.
 * - PersonalizedQuizOutput - The return type for the generatePersonalizedQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedQuizInputSchema = z.object({
  material: z.string().describe('The learning material for the quiz.'),
  weaknesses: z.string().describe('The identified weaknesses and gaps in the material for the student.'),
  numberOfQuestions: z.number().describe('The desired number of questions in the quiz.'),
});
export type PersonalizedQuizInput = z.infer<typeof PersonalizedQuizInputSchema>;

const PersonalizedQuizOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in JSON format.'),
});
export type PersonalizedQuizOutput = z.infer<typeof PersonalizedQuizOutputSchema>;

export async function generatePersonalizedQuiz(input: PersonalizedQuizInput): Promise<PersonalizedQuizOutput> {
  return personalizedPracticeQuizzesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedPracticeQuizzesPrompt',
  input: {schema: PersonalizedQuizInputSchema},
  output: {schema: PersonalizedQuizOutputSchema},
  prompt: `You are an expert quiz generator, skilled at creating quizzes tailored to specific learning needs.

  Based on the provided learning material and the student's identified weaknesses, generate a quiz with the specified number of questions.
  The quiz should focus on the areas where the student needs the most improvement.

  Learning Material: {{{material}}}
  Weaknesses: {{{weaknesses}}}
  Number of Questions: {{{numberOfQuestions}}}

  Format the quiz as a JSON object with the following structure:
  {
    "questions": [
      {
        "question": "Question 1 text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Correct Option (A, B, C, or D)",
        "explanation": "Explanation of the correct answer"
      },
      {
        "question": "Question 2 text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Correct Option (A, B, C, or D)",
        "explanation": "Explanation of the correct answer"
      }
      // ... more questions
    ]
  }
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

const personalizedPracticeQuizzesFlow = ai.defineFlow(
  {
    name: 'personalizedPracticeQuizzesFlow',
    inputSchema: PersonalizedQuizInputSchema,
    outputSchema: PersonalizedQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
