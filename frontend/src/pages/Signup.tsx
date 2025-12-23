import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    grade: '',
    medium: 'bangla',
    terms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Validate terms acceptance
    if (!formData.terms) {
      setError('Please accept the Terms and Conditions');
      return;
    }

    // Validate student fields
    if (formData.role === 'student' && !formData.grade) {
      setError('Please select your grade');
      return;
    }

    setLoading(true);

    try {
      // Import authAPI dynamically
      const { authAPI } = await import('../services/apiClient');
      
      // Prepare registration data
      const registrationData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        role: formData.role,
        grade: formData.role === 'student' ? parseInt(formData.grade) : 6,
        medium: formData.role === 'student' ? formData.medium : 'bangla',
      };
      
      // Call registration API
      await authAPI.register(registrationData);
      
      // Show success message and redirect
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{
      fontFamily: '"Quicksand", "Noto Sans Bengali", sans-serif'
    }}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] bg-fuchsia-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-sky-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-amber-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 z-0 opacity-100" style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%237C3AED" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/60 border-b border-white/20 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white p-1.5 rounded-lg shadow-lg shadow-violet-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
<a href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-fuchsia-600">
            শিক্ষাসাধী
          </a>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a className="hover:text-violet-600 transition-colors" href="#features">Features</a>
          <a className="hover:text-violet-600 transition-colors" href="#about">About</a>
          <a className="hover:text-violet-600 transition-colors" href="#pricing">Pricing</a>
          <a className="hover:text-violet-600 transition-colors" href="#contact">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <a className="text-sm font-semibold text-slate-700 hover:text-violet-600 transition-colors" href="/login">
            Log In
          </a>
          <a 
            href="/signup"
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-violet-500/30 transition-all transform hover:-translate-y-0.5"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          {/* Gradient Top Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500"></div>
          
          <div className="p-8 sm:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex justify-center items-center p-4 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl mb-4 shadow-inner">
                <svg className="w-10 h-10 text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-fuchsia-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
              <p className="text-slate-500 text-sm">একটি নতুন অ্যাকাউন্ট তৈরি করুন</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="fullName">
                  Full Name <span className="text-xs text-slate-400 ml-1">/ পূর্ণ নাম</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-violet-500 group-focus-within:text-violet-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    className="pl-10 block w-full rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm py-3 transition-all hover:bg-slate-50"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                  Email <span className="text-xs text-slate-400 ml-1">/ ইমেইল</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-fuchsia-500 group-focus-within:text-fuchsia-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    className="pl-10 block w-full rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:text-sm py-3 transition-all hover:bg-slate-50"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="role">
                  I am a <span className="text-xs text-slate-400 ml-1">/ আমি একজন</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-sky-500 group-focus-within:text-sky-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <select
                    className="pl-10 block w-full rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm py-3 appearance-none transition-all hover:bg-slate-50"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">Student / শিক্ষার্থী</option>
                    <option value="teacher">Teacher / শিক্ষক</option>
                    <option value="parent">Parent / অভিভাবক</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Grade and Medium - Only for students */}
              {formData.role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="grade">
                      Grade <span className="text-xs text-slate-400 ml-1">/ শ্রেণী</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-amber-500 group-focus-within:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <select
                        className="pl-10 block w-full rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm py-3 appearance-none transition-all hover:bg-slate-50"
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                      >
                        <option disabled value="">Select</option>
                        <option value="6">Class 6</option>
                        <option value="7">Class 7</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="medium">
                      Medium <span className="text-xs text-slate-400 ml-1">/ মাধ্যম</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-rose-500 group-focus-within:text-rose-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                      </div>
                      <select
                        className="pl-10 block w-full rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm py-3 appearance-none transition-all hover:bg-slate-50"
                        id="medium"
                        name="medium"
                        value={formData.medium}
                        onChange={handleChange}
                      >
                        <option value="bangla">Bangla</option>
                        <option value="english">English</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                  Password <span className="text-xs text-slate-400 ml-1">/ পাসওয়ার্ড</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-emerald-500 group-focus-within:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    className="pl-10 pr-10 block w-full rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-3 transition-all hover:bg-slate-50"
                    id="password"
                    name="password"
                    placeholder="Create a strong password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-emerald-500 transition-colors">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="confirmPassword">
                  Confirm Password <span className="text-xs text-slate-400 ml-1">/ পাসওয়ার্ড নিশ্চিত করুন</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-teal-500 group-focus-within:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    className="pl-10 pr-10 block w-full rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-3 transition-all hover:bg-slate-50"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-teal-500 transition-colors">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showConfirmPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    className="focus:ring-violet-500 h-4 w-4 text-violet-600 border-slate-300 rounded"
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-slate-600" htmlFor="terms">
                    I agree to the{' '}
                    <a className="text-violet-600 hover:text-violet-700 underline decoration-violet-300 underline-offset-2" href="#">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a className="text-violet-600 hover:text-violet-700 underline decoration-violet-300 underline-offset-2" href="#">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Create Account Button */}
              <div>
                <button
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-violet-500/30 text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8 mb-6 relative">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-slate-500">Or sign up with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <div>
              <button
                className="group w-full inline-flex justify-center items-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all hover:border-violet-300"
                type="button"
              >
                <img
                  alt="Google Logo"
                  className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbYPlpwwNfGhVlAnhoK_2aSVe4Vl2PPk4Ji69W0-0d1QknMuu6qUW2UiwYVAONd85NhzKJC8S9Be1ElzuStisvioT3j9rO2Uya0EttnStv0Vgj5jjgEhIi7aBqP-KBth6JlcH6SgyhJsVpah58VZ3vILUYShidHsa8SN0HHtVRHOJs0Ys9jeIciX83XMfMyy_RYEns3D9qFydbcDIR5nTKoqc4PJ05REqrLtWvuFTTopL1dHWiwpyCnN-aXvarzdxaw-v2vl7xQz20"
                />
                Sign up with Google
              </button>
            </div>

            {/* Sign In Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-slate-500">Already have an account?</span>
              <a className="font-bold text-violet-600 hover:text-fuchsia-600 ml-1 transition-colors" href="/login">
                Sign in here
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-400">
        © 2024 Shikshasathi. All rights reserved.
      </footer>
    </div>
  );
};

export default Signup;
