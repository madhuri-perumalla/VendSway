// ============================================================================
// SELLER DISCOVERY FLOW COMPONENT
// ============================================================================
// Animated visual flow showing the seller discovery process

import { motion } from 'framer-motion';
import { Building2, Bot, CheckCircle, Package, Rocket, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Building2,
    title: 'Marketplace',
    description: 'Catalog gaps identified through demand analysis',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 2,
    icon: Bot,
    title: 'AI Matching Engine',
    description: 'Algorithm matches gaps with seller capabilities',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
  },
  {
    id: 3,
    icon: CheckCircle,
    title: 'Verified Seller',
    description: 'Qualified suppliers vetted for quality and reliability',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
  },
  {
    id: 4,
    icon: Package,
    title: 'Catalog Recommendation',
    description: 'Product suggestions tailored to regional demand',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50',
  },
  {
    id: 5,
    icon: Rocket,
    title: 'Marketplace Listing',
    description: 'Products listed and connected to customers',
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
  },
];

const SellerDiscoveryFlow = () => {
  return (
    <section id="seller" className="relative py-12 overflow-hidden">

      <div className="relative px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100/50 rounded-full mb-6">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-cyan-600 tracking-wider uppercase">Discovery</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-light text-[#2D2A26] leading-[1.15] tracking-tight mb-4">
            Seller Discovery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 mx-auto mb-6 rounded-full" />
          <p className="text-base text-[#6B6660] max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            From catalog gap to marketplace listing
          </p>
        </motion.div>

        {/* Flow Steps */}
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-1 text-center group"
                >
                  {/* Step */}
                  <div className="relative">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className={`inline-flex p-4 bg-gradient-to-br ${step.color} rounded-2xl shadow-lg mb-4`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-[#2D2A26] mb-2">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#6B6660] leading-relaxed">
                      {step.description}
                    </p>

                    {/* Connector arrow */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                        <ArrowRight className="w-5 h-5 text-purple-300" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerDiscoveryFlow;
