// ============================================================================
// IMPACT COMPONENT
// ============================================================================
// Premium AI Commerce Platform - Impact Section

import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Users, Clock } from 'lucide-react';

const Impact = () => {
  const metrics = [
    {
      icon: TrendingUp,
      value: "47%",
      label: "Regional Sales Increase",
      description: "Average growth in regional market penetration"
    },
    {
      icon: ShoppingBag,
      value: "3x",
      label: "Catalog Coverage",
      description: "More products available in local markets"
    },
    {
      icon: Users,
      value: "2,500+",
      label: "Verified Sellers",
      description: "Connected across regional markets"
    },
    {
      icon: Clock,
      value: "85%",
      label: "Faster Time to Market",
      description: "Reduce product launch cycles in new regions"
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl"
        />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative container mx-auto px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-light text-white leading-[1.15] tracking-tight mb-6">
              Measurable Impact
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
              Real results from regional commerce optimization
            </p>
          </motion.div>

          {/* Metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white/15 backdrop-blur-md rounded-2xl p-10 border border-white/25 overflow-hidden text-center hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-purple-500/10 to-transparent rounded-2xl pointer-events-none" />
                {/* Continuous subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-purple-500/15 to-white/10 rounded-2xl animate-subtle-glow pointer-events-none" />
                {/* Shine effect */}
                <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-shine pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <metric.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-lg font-semibold text-white mb-3">{metric.label}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{metric.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;