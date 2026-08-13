import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Building, Calendar, Edit, Lock, LogOut, Camera, Phone, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '@/lib/api';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  profilePicture: string | null;
  role: string;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const Profile: React.FC = () => {
  const location = useLocation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Automatically open password modal if on change-password route
  useEffect(() => {
    if (location.pathname === '/admin/change-password') {
      setShowPasswordModal(true);
    }
  }, [location.pathname]);

  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/auth/me');
      setProfile(response.data.data.user);
      setEditForm({
        fullName: response.data.data.user.name,
        phone: response.data.data.user.phone || ''
      });
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      setUpdating(true);
      await api.put('/auth/profile', {
        name: editForm.fullName,
        phone: editForm.phone || null
      });
      await fetchProfile(); // Refresh profile data
      setShowEditModal(false);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      setUpdating(true);
      setPasswordError(null);
      await api.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      alert('Password changed successfully');
    } catch (err: any) {
      console.error('Failed to change password:', err);
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="space-y-6 px-6 py-4">
        <div>
          <h1 className="text-4xl font-light text-[#2D2A26] tracking-tight mb-1">
            My Profile
          </h1>
          <p className="text-[#6B6660] font-light tracking-wide">
            Manage your account settings
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#8B7AB8] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6 px-6 py-4">
        <div>
          <h1 className="text-4xl font-light text-[#2D2A26] tracking-tight mb-1">
            My Profile
          </h1>
          <p className="text-[#6B6660] font-light tracking-wide">
            Manage your account settings
          </p>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
          <div>
            <p className="text-rose-800 font-medium">Error loading profile</p>
            <p className="text-rose-600 text-base">{error || 'Profile data not available'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light text-[#2D2A26] tracking-tight mb-1">
          My Profile
        </h1>
        <p className="text-[#6B6660] font-light tracking-wide">
          Manage your account settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#8B7AB8] to-[#7A69A7] flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {getInitials(profile.name)}
              </div>
            )}
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center shadow-md hover:border-[#8B7AB8] transition-all"
            >
              <Camera className="w-4 h-4 text-[#6B6660]" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#2D2A26] mb-1">{profile.name}</h2>
                <p className="text-[#6B6660] font-light">{profile.role === 'ADMIN' ? 'Marketplace Admin' : profile.role}</p>
              </div>
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#E8E3F5] text-[#8B7AB8] rounded-xl hover:bg-[#8B7AB8] hover:text-white transition-all text-base font-light"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#E8E3F5] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#8B7AB8]" />
                </div>
                <div>
                  <p className="text-base text-[#6B6660] font-light">Email</p>
                  <p className="text-base text-[#2D2A26]">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#EDE9F7] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#8B7AB8]" />
                </div>
                <div>
                  <p className="text-base text-[#6B6660] font-light">Phone</p>
                  <p className="text-base text-[#2D2A26]">{profile.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#DFD9F0] flex items-center justify-center">
                  <Building className="w-5 h-5 text-[#8B7AB8]" />
                </div>
                <div>
                  <p className="text-base text-[#6B6660] font-light">Role</p>
                  <p className="text-base text-[#2D2A26]">{profile.role === 'ADMIN' ? 'Marketplace Admin' : profile.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#E8E3F5] flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#8B7AB8]" />
                </div>
                <div>
                  <p className="text-base text-[#6B6660] font-light">Member Since</p>
                  <p className="text-base text-[#2D2A26]">{formatDate(profile.createdAt)}</p>
                </div>
              </div>

              {profile.lastLoginAt && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#EDE9F7] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#8B7AB8]" />
                  </div>
                  <div>
                    <p className="text-base text-[#6B6660] font-light">Last Login</p>
                    <p className="text-base text-[#2D2A26]">{formatDate(profile.lastLoginAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-light text-[#2D2A26] tracking-tight mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-[#E8E3F5] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#8B7AB8]" />
              </div>
              <span className="text-[#2D2A26] font-light">Change Password</span>
            </div>
            <div className="text-[#6B6660] group-hover:text-[#8B7AB8] transition-colors">
              →
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <LogOut className="w-5 h-5 text-rose-600" />
              </div>
              <span className="text-rose-600 font-light">Logout</span>
            </div>
            <div className="text-rose-400 group-hover:text-rose-600 transition-colors">
              →
            </div>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light text-[#2D2A26] tracking-tight">Edit Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <User className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-base font-light text-[#6B6660] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#8B7AB8] focus:ring-2 focus:ring-[#8B7AB8]/20 outline-none transition-all font-light"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-base font-light text-[#6B6660] mb-2">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#8B7AB8] focus:ring-2 focus:ring-[#8B7AB8]/20 outline-none transition-all font-light"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleEditProfile}
                    disabled={updating}
                    className="flex-1 py-3 bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] text-white font-light rounded-xl hover:shadow-md transition-all text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    disabled={updating}
                    className="px-6 py-3 border-2 border-slate-200 text-[#6B6660] font-light rounded-xl hover:bg-slate-50 transition-all text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light text-[#2D2A26] tracking-tight">Change Password</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <Lock className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {passwordError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <p className="text-rose-600 text-base">{passwordError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-base font-light text-[#6B6660] mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#8B7AB8] focus:ring-2 focus:ring-[#8B7AB8]/20 outline-none transition-all font-light"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-base font-light text-[#6B6660] mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#8B7AB8] focus:ring-2 focus:ring-[#8B7AB8]/20 outline-none transition-all font-light"
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>

                <div>
                  <label className="block text-base font-light text-[#6B6660] mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#8B7AB8] focus:ring-2 focus:ring-[#8B7AB8]/20 outline-none transition-all font-light"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={updating}
                    className="flex-1 py-3 bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] text-white font-light rounded-xl hover:shadow-md transition-all text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {updating ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    disabled={updating}
                    className="px-6 py-3 border-2 border-slate-200 text-[#6B6660] font-light rounded-xl hover:bg-slate-50 transition-all text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;