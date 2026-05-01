import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Leaf, Recycle, Truck } from 'lucide-react';

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');
    setLoginSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication
      if (data.email === 'admin@basurasmart.com' && data.password === 'admin123') {
        setLoginSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          console.log('Navigate to dashboard');
        }, 1500);
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      {/* Logo Section */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4 animate-pulse-green">
          <Leaf className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">BasuraSmart</h1>
        <p className="text-secondary-600 text-sm">Waste Management System</p>
      </div>

      {/* Login Form */}
      <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="input-field pl-10"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="error-text animate-slide-up">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="input-field pl-10 pr-10"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600 transition-colors" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="error-text animate-slide-up">{errors.password.message}</p>
            )}
          </div>

          {/* Error/Success Messages */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slide-up">
              <p className="text-sm">{loginError}</p>
            </div>
          )}

          {loginSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg animate-slide-up">
              <p className="text-sm">{loginSuccess}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          </div>
        </form>
      </div>

      {/* Demo Credentials */}
      <div className="mt-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="inline-flex items-center justify-center p-3 bg-accent-50 rounded-lg">
          <div className="text-left">
            <p className="text-xs font-medium text-accent-800 mb-1">Demo Credentials:</p>
            <p className="text-xs text-accent-600">Email: admin@basurasmart.com</p>
            <p className="text-xs text-accent-600">Password: admin123</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-center space-x-4 text-secondary-500 text-xs">
          <div className="flex items-center">
            <Recycle className="w-4 h-4 mr-1" />
            <span>Eco-Friendly</span>
          </div>
          <div className="flex items-center">
            <Truck className="w-4 h-4 mr-1" />
            <span>Smart Collection</span>
          </div>
        </div>
        <p className="text-secondary-400 text-xs mt-2">
          © 2024 BasuraSmart. Clean communities, smart solutions.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
