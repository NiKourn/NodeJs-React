import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const requestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const RequestPasswordReset: React.FC = () => {
  const { requestPasswordReset } = useAuth();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // if redirect from expired link then set error message
  const location = useLocation();
  const expired = location.state?.expired;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    setError: setFormError,
    reset,
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit = async (data: RequestFormValues) => {
    clearErrors();
    setError('');
    setSuccess('');
    try {
      await requestPasswordReset(data.email);
      await new Promise((res) => setTimeout(res, 300));
      setSuccess('We just sent you a reset link. Please check your inbox.');
      reset();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  React.useEffect(() => {
    if (expired) {
      setError(expired);
    }
  }, [expired]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Remembered it?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Back to sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Email address"
                {...register('email')}
              />
              {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending link...
                </span>
              ) : (
                'Send reset link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPasswordReset;
