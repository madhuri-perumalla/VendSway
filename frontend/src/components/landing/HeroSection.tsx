// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================
// Premium AI Commerce Platform - Editorial Experience

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden flex items-center">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-lavender-200/20 to-transparent rounded-full blur-3xl" />

      <div className="relative container mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-16 items-center max-w-7xl mx-auto">
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-6xl lg:text-7xl font-light text-[#2D2A26] leading-[1.1] tracking-tight mb-8">
              Find Hidden
              <span className="block font-serif italic bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mt-3 pb-2">
                Regional Demand
              </span>
            </h1>
            <p className="text-xl text-[#6B6660] max-w-xl leading-relaxed font-light tracking-wide mb-12">
              Detect missing catalog opportunities, discover verified local sellers, 
              and connect them to marketplaces.
            </p>

            {/* CTA button */}
            <button 
              onClick={() => navigate('/login')}
              className="group relative px-10 py-5 bg-[#8B7AB8] hover:bg-[#7A69A7] text-white font-light rounded-full transition-all duration-500 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl overflow-hidden tracking-wide"
            >
              <span className="relative z-10">Login</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
