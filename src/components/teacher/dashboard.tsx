'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateLessonPlan,
  generateQuizAndFlashcards,
} from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  BookCopy,
  ClipboardCheck,
  Lightbulb,
  Loader2,
  Sparkles,
  FileText,
} from 'lucide-react';
import { type LessonPlan, type QuizAndFlashcards } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '../ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const lessonPlanSchema = z.object({
  topic: z.string().min(5, 'Please enter a topic with at least 5 characters.'),
});

type LessonPlanFormValues = z.infer<typeof lessonPlanSchema>;

export default function TeacherDashboard() {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [quizAndFlashcards, setQuizAndFlashcards] =
    useState<QuizAndFlashcards | null>(null);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const { toast } = useToast();

  const form = useForm<LessonPlanFormValues>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues: {
      topic: '',
    },
  });

  const handleLessonPlanSubmit: SubmitHandler<LessonPlanFormValues> = async (
    data
  ) => {
    setIsGeneratingLesson(true);
    setLessonPlan(null);
    setQuizAndFlashcards(null);

    const result = await generateLessonPlan({ topic: data.topic });

    if (result.success && result.data) {
      setLessonPlan(result.data);
      toast({
        title: 'Lesson Plan Generated!',
        description: 'Your new lesson plan is ready.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Could not generate lesson plan.',
      });
    }
    setIsGeneratingLesson(false);
  };

  const handleQuizGeneration = async () => {
    if (!lessonPlan) return;

    setIsGeneratingQuiz(true);
    setQuizAndFlashcards(null);

    const lessonPlanString = `Title: ${lessonPlan.title}\nObjective: ${
      lessonPlan.objective
    }\nKey Concepts: ${lessonPlan.keyConcepts.join(
      ', '
    )}\nActivities: ${lessonPlan.activities.join(', ')}`;

    const result = await generateQuizAndFlashcards({
      lessonPlan: lessonPlanString,
    });

    if (result.success && result.data) {
      setQuizAndFlashcards(result.data);
      toast({
        title: 'Quizzes & Flashcards Generated!',
        description: 'New study materials are available.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          result.error || 'Could not generate quizzes and flashcards.',
      });
    }
    setIsGeneratingQuiz(false);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-accent" />
            Lesson Plan Generator
          </CardTitle>
          <CardDescription>
            Enter a topic to generate a complete lesson plan outline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLessonPlanSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Topic</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'The Water Cycle', 'Introduction to Python Programming'"
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Be as specific or general as you like.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isGeneratingLesson} size="lg">
                {isGeneratingLesson ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Lesson Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isGeneratingLesson && (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">
            Generating your lesson plan...
          </p>
        </div>
      )}

      {lessonPlan && (
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">
              {lessonPlan.title}
            </CardTitle>
            <CardDescription>{lessonPlan.objective}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <BookCopy /> Key Concepts
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {lessonPlan.keyConcepts.map((concept, i) => (
                  <li key={i}>{concept}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <ClipboardCheck /> Activities
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {lessonPlan.activities.map((activity, i) => (
                  <li key={i}>{activity}</li>
                ))}
              </ul>
            </div>
            <Separator />
            <div className="text-center">
              <Button
                onClick={handleQuizGeneration}
                disabled={isGeneratingQuiz}
                size="lg"
                variant="outline"
              >
                {isGeneratingQuiz ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Quiz & Flashcards
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isGeneratingQuiz && (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">
            Creating study materials...
          </p>
        </div>
      )}

      {quizAndFlashcards && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText /> Generated Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">Multiple Choice Questions</h3>
              <ul className="list-decimal pl-5 space-y-2">
                {quizAndFlashcards.multipleChoiceQuestions.map((q, i) => (
                  <li key={`mc-${i}`}>{q}</li>
                ))}
              </ul>
              <h3 className="font-semibold">Short Answer Questions</h3>
              <ul className="list-decimal pl-5 space-y-2">
                {quizAndFlashcards.shortAnswerQuestions.map((q, i) => (
                  <li key={`sa-${i}`}>{q}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Flashcards</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full max-w-md mx-auto">
                <CarouselContent>
                  {quizAndFlashcards.flashcards.map((card, i) => (
                    <CarouselItem key={`flashcard-${i}`}>
                      <div className="p-1">
                        <Card className="h-64 flex flex-col justify-center items-center text-center">
                          <CardHeader>
                            <CardTitle>{card.term}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{card.definition}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
