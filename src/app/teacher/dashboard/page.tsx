'use client';

import { useRouter } from 'next/navigation';
import TeacherDashboard from '@/components/teacher/dashboard';
import Header from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function TeacherDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-full w-full bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-headline">Teacher Dashboard</CardTitle>
                <CardDescription>
                  Create lesson plans, generate quizzes, and manage your educational resources.
                </CardDescription>
              </div>
               <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardHeader>
            <CardContent>
              <TeacherDashboard />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
