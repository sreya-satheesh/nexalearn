import Header from '@/components/layout/header';
import LoginForm from '@/components/auth/login-form';
import { Logo } from '@/components/shared/icons';

export default function LoginPage() {
  return (
    <div className="min-h-full w-full bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto bg-primary rounded-2xl shadow-2xl overflow-hidden">
          <div className="hidden md:flex flex-col items-center justify-center text-center p-8 bg-primary text-primary-foreground">
            <Logo className="h-16 w-16 mb-4" />
            <h1 className="text-4xl font-bold">NexaLearn</h1>
            <p className="mt-2 text-lg">
              Your AI-Powered Learning Co-Pilot
            </p>
          </div>
          <div className="bg-card">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
