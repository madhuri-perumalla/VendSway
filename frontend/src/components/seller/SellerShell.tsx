import { ReactNode, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Package, TrendingUp, LayoutDashboard, ChevronDown, Loader2, Activity } from 'lucide-react';
import api from '@/lib/api';

interface SellerShellProps {
  children: ReactNode;
}

interface SellerProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  businessName?: string;
  sellerStatus?: string;
  profilePicture?: string;
}

const workspaces = [
  { id: 'overview', label: 'Overview', path: '/seller/overview', icon: LayoutDashboard },
  { id: 'application', label: 'Application', path: '/seller/application', icon: Package },
  { id: 'products', label: 'Products', path: '/seller/products', icon: Package },
  { id: 'opportunities', label: 'Opportunities', path: '/seller/opportunities', icon: TrendingUp },
];

const SellerShell = ({ children }: SellerShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      
      // Try to get seller application status
      let sellerStatus = 'NOT_STARTED';
      let businessName = user.name;
      
      try {
        const appResponse = await api.get(`/sellers/applications/status?email=${user.email}`);
        if (appResponse.data.data) {
          sellerStatus = appResponse.data.data.status;
          businessName = appResponse.data.data.businessName || user.name;
          
          // Store sellerId for other pages
          if (appResponse.data.data.sellerId) {
            localStorage.setItem('sellerIdForProducts', appResponse.data.data.sellerId);
          }
        }
      } catch (err) {
        console.error('Failed to fetch seller application:', err);
      }
      
      setSeller({
        ...user,
        businessName,
        sellerStatus,
      });
    } catch (err) {
      console.error('Failed to fetch seller:', err);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header */}
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
                <p className="text-xs text-[#6B6660]">Seller Growth Hub</p>
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

          {/* Right: Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition-all"
            >
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                </div>
              ) : seller?.profilePicture ? (
                <img
                  src={seller.profilePicture}
                  alt={seller.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#8B7AB8] flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(seller?.name || 'User')}
                </div>
              )}
              <ChevronDown className="w-4 h-4 text-[#6B6660]" />
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-20">
                <div className="p-4 border-b border-slate-100">
                  <p className="text-sm font-medium text-[#2D2A26]">{seller?.name}</p>
                  <p className="text-xs text-[#6B6660]">{seller?.email}</p>
                  {seller?.sellerStatus && (
                    <p className="text-xs text-[#8B7AB8] mt-1">Status: {seller.sellerStatus}</p>
                  )}
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/seller/profile');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#2D2A26] hover:bg-slate-100 transition-all text-sm"
                  >
                    <User className="w-4 h-4 text-[#6B6660]" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-rose-600 hover:bg-rose-50 transition-all text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-16 py-6">{children}</main>
    </div>
  );
};

export default SellerShell;