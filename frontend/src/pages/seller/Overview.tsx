import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Clock, AlertCircle, ArrowRight, Package, TrendingUp, FileText, MapPin, Activity } from 'lucide-react';
import api from '@/lib/api';

interface SellerData {
  id: string;
  businessName: string | null;
  email: string;
  applicationStatus: string;
  productCount: number;
  opportunityCount: number;
  topOpportunity: any | null;
  recentActivity: any[];
}

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    if (!user) return;
    
    try {
      let applicationStatus = 'NOT_STARTED';
      let productCount = 0;
      let opportunityCount = 0;
      let sellerId = null;
      let topOpportunity = null;
      let recentActivity: any[] = [];

      try {
        const sellerResponse = await api.get(`/sellers/applications/status?email=${user.email}`);
        if (sellerResponse.data.data) {
          applicationStatus = sellerResponse.data.data.status;
          sellerId = sellerResponse.data.data.sellerId;
          
          if (sellerId) {
            localStorage.setItem('sellerIdForProducts', sellerId);
          }
          
          if (applicationStatus === 'APPROVED' && sellerId) {
            try {
              const productsResponse = await api.get(`/products/seller/${sellerId}`);
              productCount = productsResponse.data.data.products?.length || 0;
              
              try {
                const oppResponse = await api.get(`/commerce-agent/opportunities/${sellerId}`);
                const opportunities = oppResponse.data.data || [];
                opportunityCount = opportunities.length;
                topOpportunity = opportunities.length > 0 ? opportunities[0] : null;
              } catch (err) {
                console.error('Failed to fetch opportunities:', err);
              }
            } catch (err) {
              console.error('Failed to fetch products:', err);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch seller application:', err);
      }

      setSellerData({
        id: user.id,
        businessName: null,
        email: user.email,
        applicationStatus,
        productCount,
        opportunityCount,
        topOpportunity,
        recentActivity,
      });
    } catch (err) {
      setError('Failed to load seller data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStatusDisplay = () => {
    switch (sellerData?.applicationStatus) {
      case 'APPROVED':
        return { label: 'Approved', icon: CheckCircle, color: 'text-emerald-600' };
      case 'UNDER_REVIEW':
        return { label: 'Under Review', icon: Clock, color: 'text-amber-600' };
      case 'REJECTED':
        return { label: 'Rejected', icon: AlertCircle, color: 'text-rose-600' };
      case 'SUBMITTED':
        return { label: 'Submitted', icon: FileText, color: 'text-blue-600' };
      default:
        return { label: 'Not Started', icon: FileText, color: 'text-slate-500' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-[#6B6660]">{error}</p>
        </div>
      </div>
    );
  }

  const statusDisplay = getApplicationStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  // STATE 1: No application
  if (sellerData?.applicationStatus === 'NOT_STARTED') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#2D2A26] mb-2">Seller Growth Hub</h1>
          <p className="text-[#6B6660]">Welcome back</p>
        </div>

        <div className="mb-8">
          <p className="text-[#2D2A26] mb-6">
            Complete your seller application to unlock<br />
            regional opportunities and product management.
          </p>

          <div className="flex items-center gap-3 mb-8">
            <StatusIcon className={`w-5 h-5 ${statusDisplay.color}`} />
            <span className="text-sm text-[#6B6660]">APPLICATION</span>
            <span className="text-sm font-medium text-[#2D2A26]">{statusDisplay.label}</span>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <p className="text-sm text-[#6B6660] mb-2">YOUR NEXT STEP</p>
            <p className="text-[#2D2A26] mb-6">
              Tell VendSway about your business and<br />
              product categories.
            </p>
            <button
              onClick={() => navigate('/seller/application')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all text-sm font-medium"
            >
              Complete Application
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <p className="text-sm text-[#6B6660] mb-6">WHAT HAPPENS NEXT</p>
          <div className="space-y-6">
            {[
              { num: '01', title: 'Submit Application', desc: 'Provide your business and regional details.' },
              { num: '02', title: 'Get Verified', desc: 'VendSway reviews your application.' },
              { num: '03', title: 'Add Products', desc: 'Add products after approval.' },
              { num: '04', title: 'Discover Opportunities', desc: 'Receive regional demand opportunities relevant to your business.' },
            ].map((step, index) => (
              <div key={step.num} className="flex gap-4">
                <div className="w-8 text-sm font-medium text-[#8B7AB8]">{step.num}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#2D2A26] mb-1">{step.title}</p>
                  <p className="text-sm text-[#6B6660]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // STATE 2: Application submitted/under review
  if (sellerData?.applicationStatus === 'SUBMITTED' || sellerData?.applicationStatus === 'UNDER_REVIEW') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#2D2A26] mb-2">Seller Growth Hub</h1>
          <p className="text-[#6B6660]">Welcome back</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <StatusIcon className={`w-5 h-5 ${statusDisplay.color}`} />
            <span className="text-sm text-[#6B6660]">APPLICATION</span>
            <span className="text-sm font-medium text-[#2D2A26]">{statusDisplay.label}</span>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <p className="text-sm text-[#6B6660] mb-2">YOUR NEXT STEP</p>
            <p className="text-[#2D2A26] mb-6">
              Your application is being reviewed by our team.<br />
              We'll notify you once it's approved.
            </p>
            <button
              onClick={() => navigate('/seller/application')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all text-sm font-medium"
            >
              Check Status
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <p className="text-sm text-[#6B6660] mb-4">YOUR PROFILE</p>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-[#6B6660]">Email</span>
              <span className="text-sm text-[#2D2A26]">{sellerData.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-[#6B6660]">Products</span>
              <span className="text-sm text-[#2D2A26]">{sellerData.productCount}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-[#6B6660]">New Opportunities</span>
              <span className="text-sm text-[#2D2A26]">{sellerData.opportunityCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STATE 3: Application rejected
  if (sellerData?.applicationStatus === 'REJECTED') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#2D2A26] mb-2">Seller Growth Hub</h1>
          <p className="text-[#6B6660]">Welcome back</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <StatusIcon className={`w-5 h-5 ${statusDisplay.color}`} />
            <span className="text-sm text-[#6B6660]">APPLICATION</span>
            <span className="text-sm font-medium text-[#2D2A26]">{statusDisplay.label}</span>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <p className="text-sm text-[#6B6660] mb-2">YOUR NEXT STEP</p>
            <p className="text-[#2D2A26] mb-6">
              Please review and update your application with<br />
              the required information.
            </p>
            <button
              onClick={() => navigate('/seller/application')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all text-sm font-medium"
            >
              Update Application
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATE 4, 5, 6: Approved seller
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#2D2A26] mb-2">Seller Growth Hub</h1>
        <p className="text-[#6B6660]">Welcome back</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-5 h-5 ${statusDisplay.color}`} />
          <div>
            <p className="text-xs text-[#6B6660]">APPLICATION</p>
            <p className="text-sm font-medium text-[#2D2A26]">{statusDisplay.label}</p>
          </div>
        </div>
      {sellerData && (
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-[#8B7AB8]" />
          <div>
            <p className="text-xs text-[#6B6660]">PRODUCTS</p>
            <p className="text-sm font-medium text-[#2D2A26]">{sellerData.productCount}</p>
          </div>
        </div>
      )}
      {sellerData && (
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[#8B7AB8]" />
          <div>
            <p className="text-xs text-[#6B6660]">NEW OPPORTUNITIES</p>
            <p className="text-sm font-medium text-[#2D2A26]">{sellerData.opportunityCount}</p>
          </div>
        </div>
      )}
      </div>

      {/* STATE 4: Approved but no products */}
      {sellerData && sellerData.productCount === 0 && (
        <div className="border-t border-slate-200 pt-8">
          <p className="text-sm text-[#6B6660] mb-2">YOUR NEXT STEP</p>
          <p className="text-[#2D2A26] mb-6">
            Add your first product to start receiving<br />
            regional opportunities.
          </p>
          <button
            onClick={() => navigate('/seller/products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all text-sm font-medium"
          >
            Add Your First Product
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STATE 6: Has opportunities */}
      {sellerData && sellerData.topOpportunity && (
        <div className="border-t border-slate-200 pt-8">
          <p className="text-sm text-[#6B6660] mb-4">YOUR NEXT OPPORTUNITY</p>
          <div className="border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#2D2A26] mb-2">{sellerData.topOpportunity.title}</h3>
            <div className="flex items-center gap-4 text-sm text-[#6B6660] mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {sellerData.topOpportunity.region}
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {sellerData.topOpportunity.category}
              </div>
            </div>
            <p className="text-sm text-[#2D2A26] mb-4">{sellerData.topOpportunity.reason}</p>
            <p className="text-sm text-[#8B7AB8] font-medium mb-4">
              Recommended action: {sellerData.topOpportunity.recommendedAction}
            </p>
            <button
              onClick={() => navigate('/seller/opportunities')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all text-sm font-medium"
            >
              View Opportunity
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STATE 5: Has products but no opportunities */}
      {sellerData && !sellerData.topOpportunity && sellerData.productCount > 0 && (
        <div className="border-t border-slate-200 pt-8">
          <p className="text-sm text-[#6B6660] mb-4">YOUR NEXT OPPORTUNITY</p>
          <p className="text-[#2D2A26] mb-6">
            No relevant opportunities detected yet.
          </p>
          <button
            onClick={() => navigate('/seller/opportunities')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-[#2D2A26] rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
          >
            View Opportunities
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Overview;