import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';
import { getAuthenticatedRedirect } from '@/utils/authRouting';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'ADMIN' as 'ADMIN' | 'SELLER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect authenticated users to their role-based home
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(getAuthenticatedRedirect(role), { replace: true });
    }
  }, [authLoading, isAuthenticated, role, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        setSuccess('Login successful! Redirecting...');
        // AuthContext handles the redirect automatically
      } else {
        await authService.register(formData);
        setSuccess('Registration successful! Please check your email to verify your account.');

        // Switch to login mode after successful registration
        setTimeout(() => {
          setIsLogin(true);
          setSuccess(null);
        }, 3000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8E3F5]/80 via-[#EDE9F7]/60 to-[#DFD9F0]/70 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8B7AB8] to-[#7A69A7] flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            <span className="text-4xl">🎨</span>
          </motion.div>
          <h1 className="text-3xl font-light bg-gradient-to-r from-[#8B7AB8] via-[#7A69A7] to-[#8B7AB8] bg-clip-text text-transparent tracking-tight mb-2">
            VendSway
          </h1>
          <p className="text-[#6B6660] font-light tracking-wide">{isLogin ? 'Sign in to your account' : 'Create your account'}</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center"
          >
            <p className="text-red-700 font-light text-sm tracking-wide">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center"
          >
            <p className="text-green-700 font-light text-sm tracking-wide">{success}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-white/50 shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field for signup */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-light text-[#2D2A26] mb-2 tracking-wide">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B7AB8] focus:ring-2 focus:ring-[#8B7AB8]/20 outline-none transition-all placeholder:text-gray-400 placeholder:font-light"
                  placeholder="Enter your full name"
                />
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-light text-[#2D2A26] mb-2 tracking-wide">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B7AB8] focus:ring-2 focus:ring-[#8B7AB8]/20 outline-none transition-all placeholder:text-gray-400 placeholder:font-light"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-light text-[#2D2A26] mb-2 tracking-wide">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B7AB8] focus:ring-2 focus:ring-[#8B7AB8]/20 outline-none transition-all placeholder:text-gray-400 placeholder:font-light"
                placeholder="Enter your password (min 8 characters)"
              />
            </div>

            {/* Role selection for signup */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-light text-[#2D2A26] mb-2 tracking-wide">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B7AB8] focus:ring-2 focus:ring-[#8B7AB8]/20 outline-none transition-all bg-white font-light"
                >
                  <option value="SELLER">Seller</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </motion.div>
            )}

            {/* Forgot Password */}
            {isLogin && (
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#8B7AB8] hover:text-[#7A69A7] font-light tracking-wide"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] text-white font-light rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 tracking-wide"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-light tracking-wide">{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </div>
              ) : (
                <span className="font-light tracking-wide">{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-[#6B6660] text-sm font-light tracking-wide">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-[#8B7AB8] hover:text-[#7A69A7] font-light tracking-wide"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Back to Landing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Link
            to="/"
            className="text-sm text-[#6B6660] hover:text-[#2D2A26] transition-colors font-light tracking-wide"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
