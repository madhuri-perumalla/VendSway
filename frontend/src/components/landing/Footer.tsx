// ============================================================================
// FOOTER COMPONENT
// ============================================================================
// Premium AI Commerce Platform - Light Theme

const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-white/40">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Brand section */}
            <div>
              <h3 className="text-3xl font-light text-[#2D2A26] tracking-tight mb-4">
                VendSway
              </h3>
              <p className="text-sm text-[#6B6660] font-light tracking-wide mb-2">
                AI-powered Regional Commerce Intelligence Platform
              </p>
              <p className="text-sm text-[#6B6660] font-light leading-relaxed tracking-wide max-w-md">
                Helping marketplaces understand regional demand, discover local sellers, and build localized commerce experiences.
              </p>
            </div>

            {/* Copyright */}
            <div className="md:text-right">
              <p className="text-sm text-[#6B6660] font-light tracking-wide">
                © 2024 VendSway. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
