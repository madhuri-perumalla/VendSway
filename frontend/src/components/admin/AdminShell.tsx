import { ReactNode, useMemo, useState, useEffect, createContext, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, LogOut, ChevronDown, Loader2, Bell, Search, Activity } from 'lucide-react';
import api from '@/lib/api';

interface AdminSearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AdminSearchContext = createContext<AdminSearchContextType | undefined>(undefined);

export const useAdminSearch = () => {
  const context = useContext(AdminSearchContext);
  if (!context) {
    throw new Error('useAdminSearch must be used within AdminShell');
  }
  return context;
};

interface AdminShellProps {
  children: ReactNode;
}

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

const workspaces = [
  { id: 'ai-command-center', label: 'AI Command Center', path: '/admin', icon: '🤖' },
  { id: 'regional-intelligence', label: 'Regional Intelligence', path: '/admin/regional-intelligence-new', icon: '🗺️' },
  { id: 'opportunity-pipeline', label: 'Opportunity Pipeline', path: '/admin/opportunity-pipeline', icon: '🎯' },
  { id: 'seller-network', label: 'Seller Network', path: '/admin/seller-network', icon: '👥' },
];

const AdminShell = ({ children }: AdminShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'New seller application', message: 'R.K. Textiles submitted verification', time: '2 min ago', unread: true },
    { id: 2, title: 'AI Opportunity detected', message: 'Kalamkari Sarees collection opportunity', time: '15 min ago', unread: true },
    { id: 3, title: 'Mission approved', message: 'Onam Collection launch approved', time: '1 hour ago', unread: false },
  ];

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data.user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AdminSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="min-h-screen bg-[#F8F9FB]">
      {/* Enterprise Header */}
      <header className="sticky top-0 z-50 h-[80px] bg-white border-b border-slate-200">
        <div className="h-full flex items-center justify-between px-6">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B7AB8] to-[#7A69A7] flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2D2A26] tracking-tight">VendSway</p>
                <p className="text-xs text-[#6B6660]">AI Commerce Intelligence</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {workspaces.map((workspace) => {
                const isActive = location.pathname === workspace.path;
                return (
                  <button
                    key={workspace.id}
                    onClick={() => navigate(workspace.path)}
                    className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
                      isActive
                        ? 'bg-[#8B7AB8] text-white'
                        : 'text-[#6B6660] hover:bg-slate-100'
                    }`}
                  >
                    {workspace.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Environment Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Production
            </span>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <Search className="w-4 h-4 text-[#6B6660]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-base text-[#2D2A26] w-32 placeholder:text-[#9CA3AF]"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <Bell className="w-5 h-5 text-[#6B6660]" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-slate-200 shadow-lg z-20"
                    >
                      <div className="p-4 border-b border-slate-100">
                        <h3 className="text-sm font-semibold text-[#2D2A26]">Notifications</h3>
                        <p className="text-xs text-[#6B6660] mt-1">{notifications.filter(n => n.unread).length} unread</p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => {
                              setShowNotifications(false);
                              alert(`Opening: ${notification.title}`);
                            }}
                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-all ${
                              notification.unread ? 'bg-slate-50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {notification.unread && (
                                <div className="w-2 h-2 rounded-full bg-[#8B7AB8] mt-2 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#2D2A26]">{notification.title}</p>
                                <p className="text-xs text-[#6B6660] mt-1">{notification.message}</p>
                                <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                  </div>
                ) : user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B7AB8] to-[#7A69A7] flex items-center justify-center text-white font-semibold text-sm">
                    {user ? getInitials(user.name) : '?'}
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-[#6B6660]" />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-20"
                    >
                      <div className="p-1">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate('/admin/profile');
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#2D2A26] hover:bg-slate-100 transition-all text-sm"
                        >
                          <User className="w-4 h-4 text-[#6B6660]" />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate('/admin/change-password');
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#2D2A26] hover:bg-slate-100 transition-all text-sm"
                        >
                          <Lock className="w-4 h-4 text-[#6B6660]" />
                          Change Password
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-rose-600 hover:bg-rose-50 transition-all text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-16 py-6">{children}</main>
    </div>
    </AdminSearchContext.Provider>
  );
};

export default AdminShell;