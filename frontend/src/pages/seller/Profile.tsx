import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Building2, LogOut } from 'lucide-react';
import api from '@/lib/api';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const authService = { logout: async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }};
  const [sellerData, setSellerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const sellerId = localStorage.getItem('sellerIdForProducts');
      if (sellerId) {
        const response = await api.get(`/sellers/${sellerId}`);
        setSellerData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch seller data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#2D2A26] mb-2">Profile</h1>
        <p className="text-[#6B6660]">Manage your account settings</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-[#8B7AB8] flex items-center justify-center text-white text-2xl font-medium">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#2D2A26]">{user?.name}</h2>
            <p className="text-[#6B6660]">{user?.email}</p>
            <p className="text-sm text-[#8B7AB8] mt-1">Role: {user?.role}</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#6B6660]" />
              <div>
                <p className="text-sm text-[#6B6660]">Name</p>
                <p className="text-base font-medium text-[#2D2A26]">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#6B6660]" />
              <div>
                <p className="text-sm text-[#6B6660]">Email</p>
                <p className="text-base font-medium text-[#2D2A26]">{user?.email}</p>
              </div>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#6B6660]" />
                <div>
                  <p className="text-sm text-[#6B6660]">Phone</p>
                  <p className="text-base font-medium text-[#2D2A26]">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {sellerData && (
          <div className="border-t border-slate-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#6B6660]" />
                <div>
                  <p className="text-sm text-[#6B6660]">Business Name</p>
                  <p className="text-base font-medium text-[#2D2A26]">{sellerData.businessName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#6B6660]" />
                <div>
                  <p className="text-sm text-[#6B6660]">Location</p>
                  <p className="text-base font-medium text-[#2D2A26]">{sellerData.location}</p>
                </div>
              </div>
              {sellerData.categories && sellerData.categories.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-sm text-[#6B6660] mb-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {sellerData.categories.map((category: string) => (
                      <span key={category} className="px-3 py-1 bg-slate-100 text-[#2D2A26] rounded-full text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="flex justify-end">
        <button
          onClick={() => authService.logout()}
          className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;