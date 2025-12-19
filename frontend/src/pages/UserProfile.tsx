import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Settings, Camera, Save, X } from 'lucide-react';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  grade?: number;
  medium?: 'bangla' | 'english';
  role: 'student' | 'teacher' | 'parent';
  profilePicture?: string;
  bio?: string;
  subjects?: string[];
  totalXP: number;
  currentLevel: number;
  currentStreak: number;
  joinedDate: string;
}

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    id: '123e4567-e89b-12d3-a456-426614174000',
    fullName: 'রাহুল আহমেদ',
    email: 'rahul@example.com',
    phone: '+880 1712-345678',
    address: 'Dhaka, Bangladesh',
    dateOfBirth: '2008-05-15',
    grade: 9,
    medium: 'bangla',
    role: 'student',
    bio: 'Passionate about learning science and mathematics. Love to explore new concepts!',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    totalXP: 2450,
    currentLevel: 5,
    currentStreak: 7,
    joinedDate: '2024-01-15'
  });

  const [editedData, setEditedData] = useState<UserData>(userData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    // In real app, save to API
    console.log('Saving user data:', editedData);
  };

  const handleChange = (field: keyof UserData, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('profilePicture', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">User Profile</h1>
              <p className="text-neutral-700 mt-1">ব্যবহারকারী প্রোফাইল</p>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-900 font-medium rounded-lg transition-all shadow-sm"
              >
                <Settings className="h-5 w-5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-900 font-medium rounded-lg transition-all shadow-sm"
                >
                  <X className="h-5 w-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-all shadow-sm"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-neutral-900 shadow-lg">
                    {editedData.profilePicture ? (
                      <img
                        src={editedData.profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      editedData.fullName.charAt(0)
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-2 bg-primary hover:bg-primary-600 rounded-full cursor-pointer shadow-lg transition-all">
                      <Camera className="h-5 w-5 text-neutral-900" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-bold text-neutral-900 text-center">
                  {editedData.fullName}
                </h2>
                <p className="text-sm text-neutral-600 capitalize">{editedData.role}</p>
              </div>

              {/* Stats */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-sm">Level</span>
                  </div>
                  <span className="font-bold text-neutral-900">{userData.currentLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Award className="h-5 w-5 text-secondary" />
                    <span className="text-sm">Total XP</span>
                  </div>
                  <span className="font-bold text-neutral-900">{userData.totalXP.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Award className="h-5 w-5 text-accent" />
                    <span className="text-sm">Current Streak</span>
                  </div>
                  <span className="font-bold text-neutral-900">{userData.currentStreak} days 🔥</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Calendar className="h-5 w-5 text-neutral-500" />
                    <span className="text-sm">Joined</span>
                  </div>
                  <span className="text-sm text-neutral-900">
                    {new Date(userData.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-neutral-900">{userData.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-neutral-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-neutral-500" />
                      {userData.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-neutral-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-neutral-500" />
                      {userData.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedData.dateOfBirth || ''}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-neutral-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-neutral-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-500" />
                      {userData.address || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information (for students) */}
            {userData.role === 'student' && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Grade/Class
                    </label>
                    {isEditing ? (
                      <select
                        value={editedData.grade || ''}
                        onChange={(e) => handleChange('grade', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                          <option key={grade} value={grade}>Class {grade}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-neutral-900">Class {userData.grade}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Medium
                    </label>
                    {isEditing ? (
                      <select
                        value={editedData.medium || 'bangla'}
                        onChange={(e) => handleChange('medium', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="bangla">Bangla Medium</option>
                        <option value="english">English Medium</option>
                      </select>
                    ) : (
                      <p className="text-neutral-900 capitalize">{userData.medium} Medium</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Subjects
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {userData.subjects?.map(subject => (
                        <span
                          key={subject}
                          className="px-3 py-1 bg-primary/20 text-neutral-900 rounded-full text-sm font-medium"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">
                About Me
              </h3>
              {isEditing ? (
                <textarea
                  value={editedData.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-neutral-700">{userData.bio || 'No bio provided yet.'}</p>
              )}
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">
                Account Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">Password</p>
                    <p className="text-sm text-neutral-600">Last changed 30 days ago</p>
                  </div>
                  <button className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-all">
                    Change Password
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">Two-Factor Authentication</p>
                    <p className="text-sm text-neutral-600">Add extra security to your account</p>
                  </div>
                  <button className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-900 text-sm font-medium rounded-lg border border-neutral-300 transition-all">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
