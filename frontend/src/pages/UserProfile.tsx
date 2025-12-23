import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useProfile } from '../hooks/useProfile';
import { useDashboardData } from '../hooks/useDashboardData';

const UserProfile: React.FC = () => {
  const { user, loading: userLoading } = useUser();
  const { studentProgress } = useDashboardData();
  const { updating, error, updateProfile, clearError } = useProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    full_name: '',
    email: '',
    grade: 6,
    medium: 'bangla' as 'bangla' | 'english'
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setEditedData({
        full_name: user.full_name || '',
        email: user.email || '',
        grade: user.grade || 6,
        medium: user.medium || 'bangla'
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    clearError();
    setSuccessMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    clearError();
    setSuccessMessage('');
    // Reset to original user data
    if (user) {
      setEditedData({
        full_name: user.full_name || '',
        email: user.email || '',
        grade: user.grade || 6,
        medium: user.medium || 'bangla'
      });
    }
  };

  const handleSave = async () => {
    clearError();
    setSuccessMessage('');
    
    const success = await updateProfile(editedData);
    if (success) {
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleChange = (field: keyof typeof editedData, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  if (userLoading) {
    return (
      <div className="bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-icons-round text-red-600 text-5xl mb-4">error</span>
          <p className="text-text-light">Unable to load profile. Please try again.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-background-light text-text-light font-sans antialiased min-h-screen flex flex-col transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card-light/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                  S
                </div>
                <span className="ml-2.5 text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                  Shikshasathi
                </span>
              </div>
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                <a className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-gray-500 hover:text-primary transition-colors" href="#">
                  Features
                </a>
                <a className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-gray-500 hover:text-primary transition-colors" href="#">
                  About
                </a>
                <a className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-gray-500 hover:text-primary transition-colors" href="#">
                  Pricing
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-slate-100 text-gray-500 transition-colors relative">
                <span className="material-icons-round text-xl">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
              </button>
              <div className="hidden md:flex items-center space-x-3">
                <a className="text-sm font-bold text-gray-500 hover:text-primary transition-colors" href="#">
                  Log In
                </a>
                <a className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-bold rounded-xl shadow-md text-white bg-gradient-to-r from-primary to-accent hover:from-indigo-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:-translate-y-0.5" href="#">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-gray-900 tracking-tight">
              User Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-display font-medium flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              ব্যবহারকারী প্রোফাইল
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-5 py-2.5 bg-white border-2 border-indigo-100 rounded-xl shadow-sm text-sm font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="material-icons-round text-lg mr-2">edit</span>
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={updating}
                className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all shadow-sm disabled:opacity-50"
              >
                <span className="material-icons-round text-lg mr-2">close</span>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updating}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-sm disabled:opacity-50"
              >
                {updating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <span className="material-icons-round text-lg mr-2">save</span>
                )}
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <span className="material-icons-round">check_circle</span>
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <span className="material-icons-round">error</span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="bg-card-light rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-0 flex flex-col items-center relative overflow-hidden group">
              {/* Header Background */}
              <div className="w-full h-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
                <div className="absolute top-10 -left-10 w-20 h-20 bg-yellow-300/30 rounded-full blur-xl"></div>
              </div>

              {/* Profile Picture */}
              <div className="relative -mt-14 mb-4">
                <div className="p-1.5 rounded-full bg-white shadow-sm">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl font-extrabold font-display text-white shadow-inner">
                    {getInitials(user.full_name)}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm" title="Online"></div>
              </div>

              {/* Profile Info */}
              <div className="text-center w-full px-6 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  {user.full_name}
                </h2>
                <div className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide">
                  {user.role}
                </div>

                {/* Stats */}
                <div className="w-full space-y-3 mt-8">
                  <div className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center text-gray-600">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-600 mr-3">
                        <span className="material-icons-round text-xl">emoji_events</span>
                      </div>
                      <span className="text-sm font-semibold">Level</span>
                    </div>
                    <span className="font-bold text-gray-900 font-display text-lg">
                      {studentProgress?.currentLevel || 1}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center text-gray-600">
                      <div className="p-2 rounded-lg bg-fuchsia-100 text-fuchsia-600 mr-3">
                        <span className="material-icons-round text-xl">stars</span>
                      </div>
                      <span className="text-sm font-semibold">Total XP</span>
                    </div>
                    <span className="font-bold text-gray-900 font-display text-lg">
                      {studentProgress?.totalXP || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center text-gray-600">
                      <div className="p-2 rounded-lg bg-orange-100 text-orange-600 mr-3">
                        <span className="material-icons-round text-xl">local_fire_department</span>
                      </div>
                      <span className="text-sm font-semibold">Current Streak</span>
                    </div>
                    <span className="font-bold text-orange-500 font-display text-lg">
                      {studentProgress?.currentStreak || 0} days 🔥
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center text-gray-600">
                      <div className="p-2 rounded-lg bg-sky-100 text-sky-600 mr-3">
                        <span className="material-icons-round text-xl">calendar_today</span>
                      </div>
                      <span className="text-sm font-semibold">Joined</span>
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Keep Learning Card */}
            <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-2xl shadow-lg shadow-indigo-500/20 p-6 text-white relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
              <div className="absolute -left-10 bottom-0 w-32 h-32 bg-purple-500/30 rounded-full blur-xl"></div>
              <span className="material-icons-round absolute right-4 top-4 text-white/20 text-4xl transform group-hover:rotate-12 transition-transform duration-500">
                psychology
              </span>
              <h3 className="text-xl font-bold font-display mb-2 relative z-10">Keep Learning!</h3>
              <p className="text-indigo-100 text-sm mb-6 relative z-10 font-medium">
                Complete your daily goal to earn more XP and level up.
              </p>
              <div className="w-full bg-black/20 rounded-full h-3 relative z-10 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-yellow-300 to-orange-400 h-3 rounded-full shadow-sm" style={{width: '10%'}}></div>
              </div>
              <div className="flex justify-between items-center mt-3 relative z-10">
                <p className="text-xs font-bold text-indigo-100 bg-white/10 px-2 py-1 rounded">Daily Goal</p>
                <p className="text-sm font-bold text-white">10%</p>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Personal Information */}
            <div className="bg-card-light rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-transparent flex items-center">
                <div className="p-2 bg-white rounded-lg shadow-sm mr-3 text-indigo-500">
                  <span className="material-icons-round">person_outline</span>
                </div>
                <h3 className="text-lg font-bold text-indigo-900 font-display">Personal Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-hover:text-primary transition-colors">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.full_name}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      className="w-full text-lg font-semibold text-gray-900 bg-slate-50 p-3 rounded-lg border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-gray-900 bg-slate-50 p-3 rounded-lg border border-transparent group-hover:border-slate-200 transition-colors">
                      {user.full_name}
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 group-hover:text-primary transition-colors">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full text-lg font-semibold text-gray-900 bg-slate-50 p-3 rounded-lg border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center text-lg font-semibold text-gray-900 bg-slate-50 p-3 rounded-lg border border-transparent group-hover:border-slate-200 transition-colors">
                      <span className="material-icons-round text-base text-gray-400 mr-2">email</span>
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            {user.role === 'student' && (
              <div className="bg-card-light rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-teal-100 bg-gradient-to-r from-teal-50/80 to-transparent flex items-center">
                  <div className="p-2 bg-white rounded-lg shadow-sm mr-3 text-teal-500">
                    <span className="material-icons-round">school</span>
                  </div>
                  <h3 className="text-lg font-bold text-teal-900 font-display">Academic Information</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Grade/Class
                    </label>
                    {isEditing ? (
                      <select
                        value={editedData.grade}
                        onChange={(e) => handleChange('grade', parseInt(e.target.value))}
                        className="w-full px-4 py-2 rounded-xl text-sm font-bold bg-teal-50 text-teal-700 border border-teal-100 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                      >
                        {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                          <option key={grade} value={grade}>Class {grade}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-teal-50 text-teal-700 border border-teal-100 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                        Class {user.grade}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Medium
                    </label>
                    {isEditing ? (
                      <select
                        value={editedData.medium}
                        onChange={(e) => handleChange('medium', e.target.value as 'bangla' | 'english')}
                        className="w-full text-base font-medium text-gray-900 bg-slate-50 p-3 rounded-lg border border-transparent hover:border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors"
                      >
                        <option value="bangla">Bangla Medium</option>
                        <option value="english">English Medium</option>
                      </select>
                    ) : (
                      <div className="text-base font-medium text-gray-900 flex items-center">
                        <span className="material-icons-round text-gray-400 mr-2 text-sm">language</span>
                        {user.medium === 'english' ? 'English Medium' : 'Bangla Medium'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Account Security */}
            <div className="bg-card-light rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 py-4 border-b border-rose-100 bg-gradient-to-r from-rose-50/80 to-transparent flex items-center">
                <div className="p-2 bg-white rounded-lg shadow-sm mr-3 text-rose-500">
                  <span className="material-icons-round">shield</span>
                </div>
                <h3 className="text-lg font-bold text-rose-900 font-display">Account Security</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Password</label>
                    <p className="text-xs text-gray-500">Secure your account with a strong password</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
                    Change Password
                  </button>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">Account Status</label>
                      <p className="text-xs text-gray-500">Your account is currently active</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dark Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="p-3.5 rounded-full bg-white shadow-xl shadow-indigo-500/20 border border-slate-200 hover:scale-110 hover:-rotate-12 transition-all duration-300 text-slate-700 group">
          <span className="material-icons-round group-hover:text-indigo-600 transition-colors">dark_mode</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
