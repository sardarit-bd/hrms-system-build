'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import logo from "../../../public/logo.png";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const DEMO_CREDENTIALS = [
  { email: 'admin@hrms.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'hr@hrms.com', password: 'hr123', role: 'hr_manager', name: 'HR Manager' },
  { email: 'head@hrms.com', password: 'head123', role: 'dept_head', name: 'Department Head' },
  { email: 'manager@hrms.com', password: 'manager123', role: 'manager', name: 'Team Manager' },
  { email: 'employee@hrms.com', password: 'emp123', role: 'employee', name: 'Employee' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@hrms.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {

   
      const roleRoutes = {
    admin: '/workspace/admin/dashboard',
    manager: '/workspace/manager/dashboard',
    hr_manager: '/workspace/hr/dashboard',
    dept_head: '/workspace/leader/dashboard',
    employee: '/workspace/employee/dashboard',
  };

  const userRole = result?.user?.role;

  router.push(
    roleRoutes[userRole] || '/workspace/employee/dashboard'
  );


    } else {
      setError(result.error);
    }


    setLoading(false);
  };

  const setDemoCredentials = (credentials) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 bg-white dark:bg-slate-900">
        <div className="max-w-sm mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-3">Demo Credentials:</p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((cred, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDemoCredentials(cred)}
                  className="w-full text-left px-2 py-1.5 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
                >
                  <span className="font-medium">{cred.role.replace('_', ' ')}</span>: {cred.email}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-accent hover:text-accent/80 font-medium"
              >
                Sign up
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
          <div className="mb-6 inline-flex items-center justify-center">
            <Image src={logo} alt="Logo" width={250} height={200} />
          </div>
          <p className="text-blue-100 text-lg leading-relaxed">
            Streamline your HR operations with our comprehensive employee
            management platform. Track attendance, manage leaves, and grow your
            team efficiently.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold text-white">100+</div>
              <p className="text-blue-100 text-sm mt-1">Employees</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">150+</div>
              <p className="text-blue-100 text-sm mt-1">Companies</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <p className="text-blue-100 text-sm mt-1">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
