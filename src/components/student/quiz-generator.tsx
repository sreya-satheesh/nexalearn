'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generatePersonalizedQuiz } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { type PersonalizedQuiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2, Sparkles, CheckCircle, HelpCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

const quizGeneratorSchema = z.object({
  material: z
    .string()
    .min(50, 'Please provide more study material for a better quiz.'),
  weaknesses: z
    .string()
    .min(10, 'Describe your weaknesses in at least 10 characters.'),
  numberOfQuestions: z.coerce
    .number()
    .min(1, 'Please enter at least 1 question.')
    .max(10, 'You can generate a maximum of 10 questions at a time.'),
});

type QuizGeneratorFormValues = z.infer<typeof quizGeneratorSchema>;

export default function QuizGenerator() {
  const [quiz, setQuiz] = useState<PersonalizedQuiz | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuizGeneratorFormValues>({
    resolver: zodResolver(quizGeneratorSchema),
    defaultValues: {
      material: '',
      weaknesses: '',
      numberOfQuestions: 5,
    },
  });

  const handleSubmit: SubmitHandler<QuizGeneratorFormValues> = async (
    data
  ) => {
    setIsGenerating(true);
    setQuiz(null);

    const result = await generatePersonalizedQuiz(data);

    if (result.success && result.data) {
      try {
        const parsedQuiz: PersonalizedQuiz = JSON.parse(result.data.quiz);
        setQuiz(parsedQuiz);
        toast({
          title: 'Personalized Quiz Ready!',
          description: 'Test your knowledge on your weak spots.',
        });
      } catch (e) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not parse the generated quiz.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Could not generate the quiz.',
      });
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalized Practice Quiz Generator</CardTitle>
          <CardDescription>
            Create a quiz focused on your areas of weakness.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Study Material</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the chapter, article, or notes you're studying..."
                        {...field}
                        className="h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weaknesses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identified Weaknesses</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I don't understand the difference between meiosis and mitosis', 'I struggle with for-loops'..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Quiz
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isGenerating && (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">
            Crafting your personalized quiz...
          </p>
        </div>
      )}

      {quiz && (
        <Card>
          <CardHeader>
            <CardTitle>Your Personalized Quiz</CardTitle>
            <CardDescription>
              Click on a question to reveal the answer and explanation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {quiz.questions.map((q, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left">
                    <span className="mr-2 font-bold">{index + 1}.</span> {q.question}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2"><HelpCircle size={16} /> Options:</h4>
                      <ul className="list-disc pl-5">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-muted rounded-md space-y-2">
                       <h4 className="font-semibold flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> Answer & Explanation:</h4>
                       <p><Badge variant="secondary">Correct Answer</Badge> {q.answer}</p>
                       <p className="text-sm text-muted-foreground">{q.explanation}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
