'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'General',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signup(
      formData.email,
      formData.password,
      formData.name,
      formData.department
    );

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 bg-white dark:bg-slate-900">
        <div className="max-w-sm mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Join us to manage your HR operations efficiently
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-blue-500"
              >
                <option>General</option>
                <option>Engineering</option>
                <option>HR</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
                className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground dark:text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-accent hover:text-accent/80 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Design */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-blue-900 dark:from-slate-900 dark:to-slate-950 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Join Our Team
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Start managing your HR operations today. Create an account and get
            instant access to all features including attendance, leave
            management, and employee records.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <p className="text-blue-100 text-sm mt-1">Digital</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Instant</div>
              <p className="text-blue-100 text-sm mt-1">Setup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
