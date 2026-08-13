import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleBasedHomeRoute } from '@/utils/authRouting';

import PublicLayout from '@/components/layout/PublicLayout';
import AdminShell from '@/components/admin/AdminShell';
import SellerShell from '@/components/seller/SellerShell';

// Role protection component
const SellerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div></div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== 'SELLER') {
    return <Navigate to={getRoleBasedHomeRoute(role)} replace />;
  }
  
  return <>{children}</>;
};

// Admin role protection component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div></div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== 'ADMIN') {
    return <Navigate to={getRoleBasedHomeRoute(role)} replace />;
  }
  
  return <>{children}</>;
};

// Lazy load pages
const Landing = lazy(() => import('@/pages/Landing'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/Login'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

// Admin pages
const AICommandCenter = lazy(() => import('@/pages/admin/AICommandCenter'));
const RegionalIntelligenceNew = lazy(() => import('@/pages/admin/RegionalIntelligenceNew'));
const OpportunityPipeline = lazy(() => import('@/pages/admin/OpportunityPipeline'));
const SellerNetwork = lazy(() => import('@/pages/admin/SellerNetwork'));
const Profile = lazy(() => import('@/pages/admin/Profile'));

// Seller pages
const SellerOverview = lazy(() => import('@/pages/seller/Overview'));
const SellerApplication = lazy(() => import('@/pages/seller/Application'));
const SellerProducts = lazy(() => import('@/pages/seller/Products'));
const SellerOpportunities = lazy(() => import('@/pages/seller/Opportunities'));
const SellerProfile = lazy(() => import('@/pages/seller/Profile'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
);

// Root route handler - redirects authenticated users to role-based home
const RootRoute = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleBasedHomeRoute(role)} replace />;
  }

  return (
    <PublicLayout>
      <Landing />
    </PublicLayout>
  );
};

const Router = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Root route - handles role-based redirect */}
        <Route path="/" element={<RootRoute />} />

        {/* Public routes */}
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminShell>
                <AICommandCenter />
              </AdminShell>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/regional-intelligence-new"
          element={
            <AdminRoute>
              <AdminShell>
                <RegionalIntelligenceNew />
              </AdminShell>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/opportunity-pipeline"
          element={
            <AdminRoute>
              <AdminShell>
                <OpportunityPipeline />
              </AdminShell>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/seller-network"
          element={
            <AdminRoute>
              <AdminShell>
                <SellerNetwork />
              </AdminShell>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminShell>
                <Profile />
              </AdminShell>
            </AdminRoute>
          }
        />

        {/* Seller routes */}
        <Route
          path="/seller/overview"
          element={
            <SellerRoute>
              <SellerShell>
                <SellerOverview />
              </SellerShell>
            </SellerRoute>
          }
        />
        <Route
          path="/seller/application"
          element={
            <SellerRoute>
              <SellerShell>
                <SellerApplication />
              </SellerShell>
            </SellerRoute>
          }
        />
        <Route
          path="/seller/products"
          element={
            <SellerRoute>
              <SellerShell>
                <SellerProducts />
              </SellerShell>
            </SellerRoute>
          }
        />
        <Route
          path="/seller/opportunities"
          element={
            <SellerRoute>
              <SellerShell>
                <SellerOpportunities />
              </SellerShell>
            </SellerRoute>
          }
        />
        <Route
          path="/seller/profile"
          element={
            <SellerRoute>
              <SellerShell>
                <SellerProfile />
              </SellerShell>
            </SellerRoute>
          }
        />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
