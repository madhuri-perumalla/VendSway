// ============================================================================
// SOLUTION FLOW COMPONENT
// ============================================================================
// Horizontal Step Pattern

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Brain, BarChart, Globe, ArrowRight } from 'lucide-react';

const SolutionFlow = () => {
  const steps = [
    {
      icon: Database,
      title: "Collect Data",
      description: "Regional demand signals",
      color: "from-purple-400 to-purple-500"
    },
    {
      icon: Brain,
      title: "Find Gaps",
      description: "Missing product opportunities",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: BarChart,
      title: "Match Sellers",
      description: "Connect verified suppliers",
      color: "from-pink-400 to-rose-400"
    },
    {
      icon: Globe,
      title: "Launch",
      description: "Deploy local experiences",
      color: "from-rose-400 to-orange-400"
    }
  ];

  return (
    <section id="workflow" className="relative py-12 overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-100/20 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-600 tracking-wider uppercase">Process</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-[#2D2A26] leading-[1.15] tracking-tight mb-4">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-6 rounded-full" />
            <p className="text-base text-[#6B6660] max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Connect regional demand with local sellers to build targeted catalogs
            </p>
          </motion.div>

          {/* Horizontal Steps */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="flex flex-col items-center text-center flex-1"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, y: -5 }}
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-xl mb-4`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-light text-[#2D2A26] mb-2 tracking-wide">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-[#6B6660] leading-relaxed tracking-wide">
                    {step.description}
                  </p>
                </motion.div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.1 }}
                    className="hidden md:flex items-center justify-center px-4"
                  >
                    <ArrowRight className="w-8 h-8 text-purple-400" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile vertical connector */}
          <div className="md:hidden flex flex-col items-center gap-2 mt-8">
            {steps.map((_, index) => (
              index < steps.length - 1 && (
                <div key={index} className="w-px h-8 bg-purple-300" />
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionFlow;
