// ============================================================================
// SELLER DISCOVERY COMPONENT
// ============================================================================
// Network Visualization Concept

import { motion } from 'framer-motion';

const SellerDiscovery = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-cyan-100/30 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100/50 rounded-full mb-6">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-teal-600 tracking-wider uppercase">Discovery</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-[#2D2A26] leading-[1.15] tracking-tight mb-4">
              Seller Discovery
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto mb-6 rounded-full" />
            <p className="text-base text-[#6B6660] max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              From catalog gap to marketplace listing
            </p>
          </motion.div>

          {/* Workflow Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Marketplace",
                  description: "Catalog gaps identified through demand analysis",
                  icon: "🏢",
                  delay: 0.2
                },
                {
                  step: "2",
                  title: "AI Matching Engine",
                  description: "Algorithm matches gaps with seller capabilities",
                  icon: "🤖",
                  delay: 0.3
                },
                {
                  step: "3",
                  title: "Verified Seller",
                  description: "Qualified suppliers vetted for quality and reliability",
                  icon: "✓",
                  delay: 0.4
                },
                {
                  step: "4",
                  title: "Catalog Recommendation",
                  description: "Product suggestions tailored to regional demand",
                  icon: "📦",
                  delay: 0.5
                },
                {
                  step: "5",
                  title: "Marketplace Listing",
                  description: "Products listed and connected to customers",
                  icon: "🚀",
                  delay: 0.6
                }
              ].map((workflow, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: workflow.delay }}
                  className="flex items-center gap-6"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-2xl flex items-center justify-center text-white text-2xl font-light shadow-lg">
                    {workflow.step}
                  </div>
                  <div className="flex-1 bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg shadow-purple-200/30">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{workflow.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-light text-[#2D2A26] mb-2">{workflow.title}</h3>
                        <p className="text-base text-[#6B6660]">{workflow.description}</p>
                      </div>
                    </div>
                  </div>
                  {index < 4 && (
                    <div className="flex-shrink-0 text-gray-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default SellerDiscovery;
