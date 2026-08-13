// ============================================================================
// PUBLIC LAYOUT COMPONENT
// ============================================================================
// Premium AI Commerce Platform - Light Theme

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="relative pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;