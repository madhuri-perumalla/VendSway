// ============================================================================
// CTA SECTION COMPONENT
// ============================================================================
// Minimal Premium Immersive Section

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section id="cta" className="relative py-12 overflow-hidden">
      {/* Large decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lavender-200/20 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-8 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Main CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/50 rounded-full mb-6">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-purple-600 tracking-wider uppercase">Get Started</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-light text-[#2D2A26] leading-[1.1] tracking-tight mb-4">
              Start Finding Regional Demand
              <span className="block font-serif italic text-[#8B7AB8] mt-3">Today</span>
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6 rounded-full" />
            
            <p className="text-base text-[#6B6660] max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Connect with verified local sellers and build targeted catalogs for your regional markets
            </p>
          </motion.div>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-12 py-6 bg-[#8B7AB8] hover:bg-[#7A69A7] text-white text-lg font-medium rounded-full transition-all duration-500 shadow-2xl hover:shadow-3xl overflow-hidden tracking-wide"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
