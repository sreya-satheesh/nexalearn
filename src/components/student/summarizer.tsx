'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { summarizeContent } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { type SummarizedContent } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Separator } from '../ui/separator';

const summarizerSchema = z.object({
  notes: z.string().min(50, 'Please enter at least 50 characters to summarize.'),
});

type SummarizerFormValues = z.infer<typeof summarizerSchema>;

export default function Summarizer() {
  const [summary, setSummary] = useState<SummarizedContent | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();

  const form = useForm<SummarizerFormValues>({
    resolver: zodResolver(summarizerSchema),
    defaultValues: { notes: '' },
  });

  const handleSummarizeSubmit: SubmitHandler<SummarizerFormValues> = async (
    data
  ) => {
    setIsSummarizing(true);
    setSummary(null);

    const result = await summarizeContent({ notes: data.notes });

    if (result.success && result.data) {
      setSummary(result.data);
      toast({
        title: 'Content Summarized!',
        description: 'Your notes have been processed.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Could not summarize your notes.',
      });
    }
    setIsSummarizing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Note Summarizer & Study Aid Generator</CardTitle>
          <CardDescription>
            Paste your notes to get a summary, mind map, and flashcards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSummarizeSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your notes here..."
                        {...field}
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      The more detailed your notes, the better the result.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSummarizing} size="lg">
                {isSummarizing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Summarize & Generate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isSummarizing && (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">
            Processing your notes...
          </p>
        </div>
      )}

      {summary && (
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-accent" />
              Generated Study Aids
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold text-xl mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary.summary}</p>
            </div>
            <Separator />
            <div>
                <h3 className="font-semibold text-xl mb-2">Mind Map</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap font-code">{summary.mindMap}</p>
            </div>
             <Separator />
            <div>
                <h3 className="font-semibold text-xl mb-2">Flashcards</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary.flashcards}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
