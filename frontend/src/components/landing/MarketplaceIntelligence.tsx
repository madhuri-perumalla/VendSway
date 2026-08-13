// ============================================================================
// MARKETPLACE INTELLIGENCE COMPONENT
// ============================================================================
// Large Dashboard Preview with Callouts

import { motion } from 'framer-motion';

const MarketplaceIntelligence = () => {
  return (
    <section id="marketplace" className="relative py-12 overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-3xl" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/50 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-600 tracking-wider uppercase">Intelligence</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-[#2D2A26] leading-[1.15] tracking-tight mb-4">
              Marketplace Intelligence
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto mb-6 rounded-full" />
            <p className="text-base text-[#6B6660] max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Platform capabilities for regional market analysis
            </p>
          </motion.div>

          {/* Feature Previews - Large Icon Grid */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Demand Heatmap",
                  description: "Visualize regional demand patterns",
                  icon: "🗺️",
                  delay: 0.2
                },
                {
                  title: "Catalog Gap Explorer",
                  description: "Identify missing products",
                  icon: "🔍",
                  delay: 0.3
                },
                {
                  title: "Regional Trend Timeline",
                  description: "Track demand trends over time",
                  icon: "📈",
                  delay: 0.4
                },
                {
                  title: "Opportunity Queue",
                  description: "Prioritize catalog gaps",
                  icon: "📋",
                  delay: 0.5
                },
                {
                  title: "Seller Matching",
                  description: "Connect gaps with suppliers",
                  icon: "🤝",
                  delay: 0.6
                },
                {
                  title: "Market Analytics",
                  description: "Analyze market dynamics",
                  icon: "📊",
                  delay: 0.7
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  className="text-center group cursor-pointer"
                >
                  <div className="relative inline-block mb-4">
                    <div className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-xl font-light text-[#2D2A26] mb-2 group-hover:text-[#8B7AB8] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#6B6660] leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MarketplaceIntelligence;
