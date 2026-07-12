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

const registerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  async function onSubmit(values: RegisterFormValues): Promise<void> {
    setServerError(null);

    try {
      await registerUser(values);
      navigate('/dashboard');
    } catch (error) {
      setServerError(extractErrorMessage(error));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">
          Create your account
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Start managing your GitHub repositories with AI.
        </p>

        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
        >
          {serverError ? <Alert message={serverError} /> : null}

          <TextField
            label="Full name"
            placeholder="Jane Doe"
            {...register('name')}
            error={errors.name?.message}
          />

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
            placeholder="At least 8 characters"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button type="submit" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}