// ============================================================================
// FOOTER COMPONENT
// ============================================================================
// Premium AI Commerce Platform - Light Theme

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative py-8 bg-gradient-to-br from-[#F0EDE8] to-[#E8E4DD] border-t border-[#D4CFC8] overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-100/20 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Bottom bar */}
          <div className="pt-0">
            <p className="text-[#6B6660] text-sm text-center font-light tracking-wide">
              © 2026 VendSway. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;