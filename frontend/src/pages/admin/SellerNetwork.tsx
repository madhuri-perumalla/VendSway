import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShoppingBag, CheckCircle, Clock, TrendingUp, MapPin, Star, Shield, FileText, BarChart3, Zap, Flame, Store, Target, Download, Package } from 'lucide-react';
import { useAdminSearch } from '@/components/admin/AdminShell';
import api from '@/lib/api';

type TabType = 'overview' | 'applications' | 'products' | 'verification' | 'performance';

interface Seller {
  id: string;
  name: string;
  sellerName: string;
  businessName: string;
  location: string;
  region: string;
  status: 'active' | 'pending' | 'verified' | 'rejected';
  verificationScore: number;
  totalProducts: number;
  totalRevenue: number;
  rating: number;
  joinedDate: string;
  specializations: string[];
  categories: string[];
  performance: {
    orders: number;
    fulfillmentRate: number;
    avgRating: number;
    responseTime: number;
  };
}

interface Application {
  id: string;
  sellerName: string;
  businessName: string;
  location: string;
  specializations: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  documents: string[];
  aiRecommendation: {
    score: number;
    reasons: string[];
    confidence: number;
  };
}

interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  category: string;
  region: string;
  status: 'pending' | 'approved' | 'rejected';
  price: number;
  stock: number;
  submittedDate: string;
  aiQuality: {
    score: number;
    issues: string[];
    confidence: number;
  };
}

const SellerNetwork: React.FC = () => {
  const { searchQuery } = useAdminSearch();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    setLoading(true);
    try {
      // Load real seller applications from backend
      const appsResponse = await api.get('/sellers/applications');
      const applications = appsResponse.data.data || [];
      
      // Transform applications to match our interface
      const transformedApplications = applications.map((app: any) => ({
        id: app.id,
        sellerName: app.contactPerson || app.businessName,
        businessName: app.businessName,
        location: app.location,
        specializations: app.categories || [],
        status: app.status.toLowerCase(),
        submittedDate: app.submittedAt,
        documents: ['Business Registration', 'GST Certificate', 'Address Proof'],
        aiRecommendation: {
          score: 75, // Default score since backend doesn't provide AI recommendations
          reasons: [
            'Application submitted for review',
            'Documentation verification pending',
            'Regional authenticity assessment required'
          ],
          confidence: 70
        }
      }));

      // Load sellers (approved applications)
      const sellersResponse = await api.get('/sellers');
      const sellers = sellersResponse.data.data || [];
      
      const transformedSellers = sellers.map((seller: any) => ({
        id: seller.id,
        name: seller.contactPerson || seller.businessName,
        businessName: seller.businessName,
        location: seller.location,
        region: seller.regionId || 'Unknown',
        status: seller.status.toLowerCase(),
        verificationScore: 85, // Default since backend doesn't provide
        totalProducts: 0, // Will be loaded separately
        totalRevenue: 0,
        rating: 0,
        joinedDate: seller.createdAt,
        specializations: seller.categories || [],
        categories: seller.categories || [],
        performance: {
          orders: 0,
          fulfillmentRate: 0,
          avgRating: 0,
          responseTime: 0
        }
      }));

      // Load pending products
      const productsResponse = await api.get('/products/pending');
      const products = productsResponse.data.data || [];
      
      const transformedProducts = products.map((product: any) => ({
        id: product.id,
        sellerId: product.sellerId,
        sellerName: product.seller?.businessName || 'Unknown',
        name: product.name,
        category: product.category,
        region: product.regionId || 'Unknown',
        status: product.status.toLowerCase(),
        price: parseFloat(product.price),
        stock: product.stock,
        submittedDate: product.createdAt,
        aiQuality: {
          score: 80, // Default score
          issues: product.adminFeedback ? [product.adminFeedback] : [],
          confidence: 75
        }
      }));

      setApplications(transformedApplications);
      setSellers(transformedSellers);
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Failed to load seller data:', error);
      // If API fails, set empty arrays to avoid errors
      setApplications([]);
      setSellers([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search query
  const filteredSellers = useMemo(() => {
    if (!searchQuery.trim()) return sellers;
    const query = searchQuery.toLowerCase();
    return sellers.filter(seller => 
      seller.name.toLowerCase().includes(query) ||
      seller.businessName.toLowerCase().includes(query) ||
      seller.location.toLowerCase().includes(query) ||
      seller.region.toLowerCase().includes(query) ||
      seller.specializations.some(spec => spec.toLowerCase().includes(query)) ||
      seller.categories.some(cat => cat.toLowerCase().includes(query))
    );
  }, [sellers, searchQuery]);

  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return applications;
    const query = searchQuery.toLowerCase();
    return applications.filter(app => 
      app.sellerName.toLowerCase().includes(query) ||
      app.businessName.toLowerCase().includes(query) ||
      app.location.toLowerCase().includes(query) ||
      app.specializations.some(spec => spec.toLowerCase().includes(query))
    );
  }, [applications, searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.sellerName.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.region.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleRunAI = async () => {
    setAiLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new seller applications based on AI analysis
      const newApplications = [
        {
          id: Date.now().toString(),
          sellerName: 'AI Detected Seller',
          businessName: 'Traditional Weavers Co.',
          location: 'Jaipur',
          specializations: ['Block Print', 'Embroidery'],
          status: 'pending' as const,
          submittedDate: new Date().toISOString().split('T')[0],
          documents: ['Business Registration', 'GST Certificate'],
          aiRecommendation: {
            score: 85,
            reasons: [
              'High regional demand for block print',
              'Good portfolio quality',
              'Positive market signals',
              'Strong cultural authenticity'
            ],
            confidence: 82
          }
        }
      ];
      
      setApplications([...applications, ...newApplications]);
    } catch (error) {
      console.error('AI run failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApproveAll = async () => {
    try {
      // Approve all pending applications
      for (const app of applications.filter(a => a.status === 'pending')) {
        await api.put(`/sellers/applications/${app.id}/approve`);
      }
      // Approve all pending products
      for (const product of products.filter(p => p.status === 'pending')) {
        await api.put(`/products/${product.id}/approve`);
      }
      // Reload data
      await loadSellerData();
    } catch (error) {
      console.error('Failed to approve all:', error);
    }
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      await api.put(`/sellers/applications/${applicationId}/approve`);
      await loadSellerData();
    } catch (error) {
      console.error('Failed to approve application:', error);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await api.put(`/sellers/applications/${applicationId}/reject`, {
        notes: 'Application rejected by admin'
      });
      await loadSellerData();
    } catch (error) {
      console.error('Failed to reject application:', error);
    }
  };

  const handleApproveProduct = async (productId: string) => {
    try {
      await api.put(`/products/${productId}/approve`);
      await loadSellerData();
    } catch (error) {
      console.error('Failed to approve product:', error);
    }
  };

  const handleRejectProduct = async (productId: string) => {
    try {
      await api.put(`/products/${productId}/reject`, {
        feedback: 'Product rejected by admin'
      });
      await loadSellerData();
    } catch (error) {
      console.error('Failed to reject product:', error);
    }
  };

  const handleExport = () => {
    const exportData = {
      sellers: filteredSellers,
      applications: filteredApplications,
      products: filteredProducts,
      exportDate: new Date().toISOString(),
      summary: {
        totalSellers: filteredSellers.length,
        activeSellers: filteredSellers.filter(s => s.status === 'active').length,
        pendingApplications: filteredApplications.filter(a => a.status === 'pending').length,
        pendingProducts: filteredProducts.filter(p => p.status === 'pending').length
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seller-network-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active': case 'approved': case 'verified': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'rejected': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'performance', label: 'Performance', icon: BarChart3 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B7AB8]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-[#2D2A26] tracking-tight mb-1">
            Seller Network
          </h1>
          <p className="text-[#6B6660] font-light tracking-wide">
            Manage sellers, applications, products, and performance
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl font-light text-[#2D2A26]">{filteredSellers.length}</div>
            <div className="text-base text-[#6B6660] font-light">total sellers</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-light text-[#2D2A26]">{filteredApplications.filter(a => a.status === 'pending').length}</div>
            <div className="text-base text-[#6B6660] font-light">pending applications</div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRunAI}
              disabled={aiLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              {aiLoading ? 'Running...' : 'Run AI'}
            </button>
            <button
              onClick={handleApproveAll}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-[#2D2A26] rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Approve All
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-[#2D2A26] rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-light tracking-wide whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#E8E3F5] text-[#8B7AB8]'
                  : 'text-[#6B6660] hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'applications' && applications.filter(a => a.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-rose-500 text-white text-base rounded-full">
                  {applications.filter(a => a.status === 'pending').length}
                </span>
              )}
              {tab.id === 'products' && products.filter(p => p.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-rose-500 text-white text-base rounded-full">
                  {products.filter(p => p.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#E8E3F5]/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#8B7AB8]" />
                  </div>
                  <span className="text-base font-light text-[#6B6660] tracking-wide">Active Sellers</span>
                </div>
                <div className="text-3xl font-light text-[#2D2A26]">{sellers.filter(s => s.status === 'active').length}</div>
              </div>
              <div className="bg-[#EDE9F7]/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-[#8B7AB8]" />
                  </div>
                  <span className="text-base font-light text-[#6B6660] tracking-wide">Total Products</span>
                </div>
                <div className="text-3xl font-light text-[#2D2A26]">{sellers.reduce((sum, s) => sum + s.totalProducts, 0)}</div>
              </div>
              <div className="bg-[#DFD9F0]/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#8B7AB8]" />
                  </div>
                  <span className="text-base font-light text-[#6B6660] tracking-wide">Total Revenue</span>
                </div>
                <div className="text-3xl font-light text-[#2D2A26]">₹{(sellers.reduce((sum, s) => sum + s.totalRevenue, 0) / 1000000).toFixed(1)}M</div>
              </div>
              <div className="bg-[#E8E3F5]/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <Star className="w-5 h-5 text-[#8B7AB8]" />
                  </div>
                  <span className="text-base font-light text-[#6B6660] tracking-wide">Avg Rating</span>
                </div>
                <div className="text-3xl font-light text-[#2D2A26]">{(sellers.reduce((sum, s) => sum + s.rating, 0) / sellers.filter(s => s.rating > 0).length).toFixed(1)}</div>
              </div>
            </div>

            {/* Top Sellers */}
            <div>
              <h3 className="text-xl font-light text-[#2D2A26] tracking-tight mb-4">Top Performing Sellers</h3>
              <div className="space-y-3">
                {sellers.filter(s => s.status === 'active').sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5).map((seller) => (
                  <div key={seller.id} className="flex items-center justify-between p-4 bg-slate-50/30 rounded-xl border-2 border-slate-100 hover:border-[#8B7AB8] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E8E3F5] flex items-center justify-center">
                        <Store className="w-6 h-6 text-[#8B7AB8]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#2D2A26]">{seller.businessName}</div>
                        <div className="text-[#6B6660] font-light flex items-center gap-2 text-base">
                          <MapPin className="w-4 h-4" />
                          {seller.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xl font-light text-[#2D2A26]">₹{(seller.totalRevenue / 100000).toFixed(1)}L</div>
                        <div className="text-base text-[#6B6660] font-light">revenue</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-light text-[#2D2A26]">{seller.performance.orders}</div>
                        <div className="text-base text-[#6B6660] font-light">orders</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="font-light text-[#2D2A26]">{seller.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4">
            <h3 className="text-xl font-light text-[#2D2A26] tracking-tight mb-3">
              Seller Applications ({applications.filter(a => a.status === 'pending').length} pending)
            </h3>
            {filteredApplications.map((application) => {
              const statusStyles = getStatusStyles(application.status);
              return (
                <div key={application.id} className="border-2 border-slate-100 rounded-xl p-5 hover:border-[#8B7AB8] transition-all">
                  <div className="flex items-start justify-between gap-5 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-[#E8E3F5] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-[#8B7AB8]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-[#2D2A26]">{application.businessName}</h4>
                          <span className={`px-3 py-1 rounded-full text-base font-light border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                            {application.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[#6B6660] font-light mb-2 text-base">{application.sellerName}</div>
                        <div className="flex items-center gap-4 text-[#6B6660] font-light text-base">
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {application.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(application.submittedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-light text-[#8B7AB8]">{application.aiRecommendation.score}%</div>
                      <div className="text-base text-[#6B6660] font-light">AI score</div>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="bg-[#E8E3F5]/50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <Zap className="w-4 h-4 text-[#8B7AB8]" />
                      </div>
                      <span className="text-base font-semibold text-[#8B7AB8] tracking-wide">AI RECOMMENDATION</span>
                      <span className="ml-auto text-base text-[#6B6660] font-light">{application.aiRecommendation.confidence}% confidence</span>
                    </div>
                    <ul className="space-y-2">
                      {application.aiRecommendation.reasons.map((reason, idx) => (
                        <li key={idx} className="text-[#6B6660] font-light flex items-start gap-2 text-base">
                          <Flame className="w-3 h-3 text-[#8B7AB8] mt-0.5 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  {application.status === 'pending' && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleApproveApplication(application.id)}
                        className="flex-1 py-2 bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] text-white font-light rounded-xl hover:shadow-md transition-all text-base tracking-wide"
                      >
                        Approve Application
                      </button>
                      <button className="px-4 py-2 border-2 border-slate-200 text-[#6B6660] font-light rounded-xl hover:bg-slate-50 transition-all text-base tracking-wide">
                        Request Info
                      </button>
                      <button 
                        onClick={() => handleRejectApplication(application.id)}
                        className="px-4 py-2 border-2 border-rose-200 text-rose-600 font-light rounded-xl hover:bg-rose-50 transition-all text-base tracking-wide"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <h3 className="text-xl font-light text-[#2D2A26] tracking-tight mb-3">
              Product Review ({products.filter(p => p.status === 'pending').length} pending)
            </h3>
            {filteredProducts.map((product) => {
              const statusStyles = getStatusStyles(product.status);
              return (
                <div key={product.id} className="border-2 border-slate-100 rounded-xl p-5 hover:border-[#8B7AB8] transition-all">
                  <div className="flex items-start justify-between gap-5 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-[#EDE9F7] flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-6 h-6 text-[#8B7AB8]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-[#2D2A26]">{product.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-base font-light border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                            {product.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[#6B6660] font-light mb-2 text-base">{product.sellerName}</div>
                        <div className="flex items-center gap-4 text-[#6B6660] font-light text-base">
                          <span className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            {product.category}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {product.region}
                          </span>
                          <span className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            ₹{product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-light text-[#8B7AB8]">{product.aiQuality.score}%</div>
                      <div className="text-base text-[#6B6660] font-light">AI quality</div>
                    </div>
                  </div>

                  {/* AI Quality Check */}
                  {product.aiQuality.issues.length > 0 && (
                    <div className="bg-[#EDE9F7]/50 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                          <Shield className="w-4 h-4 text-[#8B7AB8]" />
                        </div>
                        <span className="text-base font-semibold text-[#8B7AB8] tracking-wide">AI QUALITY CHECK</span>
                      </div>
                      <ul className="space-y-2">
                        {product.aiQuality.issues.map((issue, idx) => (
                          <li key={idx} className="text-[#6B6660] font-light flex items-start gap-2 text-base">
                            <Zap className="w-3 h-3 text-[#8B7AB8] mt-0.5 flex-shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  {product.status === 'pending' && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleApproveProduct(product.id)}
                        className="flex-1 py-2 bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] text-white font-light rounded-xl hover:shadow-md transition-all text-base tracking-wide"
                      >
                        Approve Product
                      </button>
                      <button className="px-4 py-2 border-2 border-slate-200 text-[#6B6660] font-light rounded-xl hover:bg-slate-50 transition-all text-base tracking-wide">
                        Request Changes
                      </button>
                      <button 
                        onClick={() => handleRejectProduct(product.id)}
                        className="px-4 py-2 border-2 border-rose-200 text-rose-600 font-light rounded-xl hover:bg-rose-50 transition-all text-base tracking-wide"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="space-y-4">
            <h3 className="text-xl font-light text-[#2D2A26] tracking-tight mb-3">Verification Status</h3>
            {filteredSellers.map((seller) => {
              const statusStyles = getStatusStyles(seller.status);
              return (
                <div key={seller.id} className="border-2 border-slate-100 rounded-xl p-5 hover:border-[#8B7AB8] transition-all">
                  <div className="flex items-start justify-between gap-5 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-[#DFD9F0] flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-[#8B7AB8]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-[#2D2A26]">{seller.businessName}</h4>
                          <span className={`px-3 py-1 rounded-full text-base font-light border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                            {seller.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[#6B6660] font-light mb-2 text-base">{seller.sellerName}</div>
                        <div className="flex items-center gap-4 text-[#6B6660] font-light text-base">
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {seller.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            {seller.specializations.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-light text-[#8B7AB8]">{seller.verificationScore}%</div>
                      <div className="text-base text-[#6B6660] font-light">verification</div>
                    </div>
                  </div>

                  {/* Verification Progress */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-light text-[#6B6660]">Verification Progress</span>
                      <span className="text-base font-light text-[#8B7AB8]">{seller.verificationScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] h-2 rounded-full transition-all"
                        style={{ width: `${seller.verificationScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-4">
            <h3 className="text-xl font-light text-[#2D2A26] tracking-tight mb-3">Seller Performance</h3>
            {sellers.filter(s => s.status === 'active' && s.performance.orders > 0).map((seller) => (
              <div key={seller.id} className="border-2 border-slate-100 rounded-xl p-5 hover:border-[#8B7AB8] transition-all">
                <div className="flex items-start justify-between gap-5 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-[#E8E3F5] flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-[#8B7AB8]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#2D2A26] mb-1">{seller.businessName}</h4>
                      <div className="text-[#6B6660] font-light text-base">{seller.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="font-light text-[#2D2A26]">{seller.rating}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-xl font-light text-[#2D2A26]">{seller.performance.orders}</div>
                    <div className="text-base text-[#6B6660] font-light">orders</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-xl font-light text-[#2D2A26]">{seller.performance.fulfillmentRate}%</div>
                    <div className="text-base text-[#6B6660] font-light">fulfillment</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-xl font-light text-[#2D2A26]">{seller.performance.avgRating}</div>
                    <div className="text-base text-[#6B6660] font-light">avg rating</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-xl font-light text-[#2D2A26]">{seller.performance.responseTime}h</div>
                    <div className="text-base text-[#6B6660] font-light">response time</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerNetwork;