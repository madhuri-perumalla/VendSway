import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ROUTES } from '@/utils/authRouting';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole } = useApp();

  const adminNavItems = [
    { path: ROUTES.ADMIN_AI_COMMAND_CENTER, label: 'AI Command Center' },
    { path: ROUTES.ADMIN_REGIONAL_INTELLIGENCE, label: 'Regional Intelligence' },
    { path: ROUTES.ADMIN_OPPORTUNITY_PIPELINE, label: 'Opportunity Pipeline' },
    { path: ROUTES.ADMIN_SELLER_NETWORK, label: 'Seller Network' },
    { path: ROUTES.ADMIN_PROFILE, label: 'Profile' },
  ];

  const sellerNavItems = [
    { path: ROUTES.SELLER_OVERVIEW, label: 'Seller Portal' },
    { path: ROUTES.SELLER_PRODUCTS, label: 'Product Management' },
  ];



  const getNavItems = () => {
    if (!userRole) return [];
    switch (userRole as string) {
      case 'admin':
        return adminNavItems;
      case 'seller':
        return sellerNavItems;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 pt-16">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
