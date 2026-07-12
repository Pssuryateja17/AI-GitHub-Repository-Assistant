import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../utils/extractErrorMessage';

const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(values: LoginFormValues): Promise<void> {
    setServerError(null);

    try {
      await login(values);
      navigate('/dashboard');
    } catch (error) {
      setServerError(extractErrorMessage(error));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">
          Welcome back
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Sign in to continue to your dashboard.
        </p>

        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
        >
          {serverError ? <Alert message={serverError} /> : null}

          <TextField
            label="Email address"
            type="email"
            placeholder="jane@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <TextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button type="submit" isLoading={isSubmitting}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-brand-600 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}