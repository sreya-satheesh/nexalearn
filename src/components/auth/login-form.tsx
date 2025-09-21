'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, User, LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  role: z.enum(['teacher', 'student']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'teacher',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    setIsLoading(true);

    // Static credentials check
    const isTeacher = data.role === 'teacher' && data.email === 'teacher@nexalearn.com' && data.password === 'nexalearn';
    const isStudent = data.role === 'student' && data.email === 'student@nexalearn.com' && data.password === 'nexalearn';

    setTimeout(() => {
      if (isTeacher) {
        toast({ title: 'Login Successful', description: 'Redirecting to teacher dashboard...' });
        router.push('/teacher/dashboard');
      } else if (isStudent) {
        toast({ title: 'Login Successful', description: 'Redirecting to student dashboard...' });
        router.push('/student/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password for the selected role.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <Card className="rounded-none md:rounded-l-none shadow-none border-none">
      <CardHeader className="pt-8">
        <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>Please sign in to continue</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="teacher">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          Teacher
                        </TabsTrigger>
                        <TabsTrigger value="student">
                          <User className="mr-2 h-4 w-4" />
                          Student
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} className="bg-secondary"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} className="bg-secondary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading} size="lg">
              {isLoading ? 'Signing In...' : 'Sign In'}
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
