import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Summarizer from './summarizer';
import QuizGenerator from './quiz-generator';
import { FileText, PencilRuler } from 'lucide-react';

export default function StudentDashboard() {
  return (
    <Tabs defaultValue="summarizer" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="summarizer">
          <FileText className="mr-2 h-4 w-4" />
          Note Summarizer
        </TabsTrigger>
        <TabsTrigger value="quiz">
          <PencilRuler className="mr-2 h-4 w-4" />
          Personalized Quiz
        </TabsTrigger>
      </TabsList>
      <TabsContent value="summarizer" className="mt-4">
        <Summarizer />
      </TabsContent>
      <TabsContent value="quiz" className="mt-4">
        <QuizGenerator />
      </TabsContent>
    </Tabs>
  );
}
