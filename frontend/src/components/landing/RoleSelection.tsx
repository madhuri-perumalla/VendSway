// ============================================================================
// ROLE SELECTION COMPONENT
// ============================================================================
// Floating Portals - Immersive Experience Selection

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/shared';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const portals = [
    {
      id: 'admin',
      title: 'Admin',
      subtitle: 'Commerce Intelligence Console',
      description: 'Access regional analytics, catalog gaps, seller discovery, and AI-powered commerce intelligence across your marketplace',
      icon: '👨‍💼',
      color: 'from-cyan-400 to-blue-500',
      glow: 'rgba(34,211,238,0.6)',
      bgGradient: 'from-cyan-500/20 to-blue-500/20',
      particles: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'seller',
      title: 'Seller',
      subtitle: 'Seller Growth & Onboarding',
      description: 'Register products, manage catalog, track growth recommendations, and optimize your seller journey with AI guidance',
      icon: '🏪',
      color: 'from-purple-400 to-pink-500',
      glow: 'rgba(167,139,250,0.6)',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      particles: 'from-purple-400 to-pink-500',
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      subtitle: 'Localized Shopping Experience',
      description: 'Explore personalized regional storefronts, discover festival collections, and shop authentic products from local sellers',
      icon: '🛍️',
      color: 'from-emerald-400 to-cyan-500',
      glow: 'rgba(16,185,129,0.6)',
      bgGradient: 'from-emerald-500/20 to-cyan-500/20',
      particles: 'from-emerald-400 to-cyan-500',
    },
  ];

  const handlePortalSelect = () => {
    navigate('/login');
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-48 bg-[#0a0a0f] overflow-hidden"
    >
      {/* Dynamic portal environment */}
      <div className="absolute inset-0">
        {/* Ambient lighting that changes based on hovered portal */}
        <motion.div 
          animate={{
            background: hoveredPortal ? portals.find(p => p.id === hoveredPortal)?.bgGradient : 'from-transparent to-transparent'
          }}
          transition={{ duration: 1 }}
          className="absolute inset-0 opacity-30 blur-3xl"
        />
        
        {/* Dynamic mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,50,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,50,0.3)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
        
        {/* Floating ambient particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-white/20 to-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Floating headline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center mb-24"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight"
            style={{ textShadow: "0 0 60px rgba(99, 102, 241, 0.3)" }}
          >
            Ready to Transform Your
            <br />
            <motion.span 
              className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "200% auto" }}
            >
              Commerce Strategy?
            </motion.span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-400 mb-16 leading-relaxed font-light"
          >
            Join the marketplaces that are already discovering hidden regional demand and connecting with local sellers.
          </motion.p>

          {/* Magnetic CTA buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="relative bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-semibold px-12 py-5 text-xl rounded-2xl transition-all duration-300 border border-white/20"
              >
                Start Your Free Trial
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="relative bg-white/5 backdrop-blur-xl text-white font-semibold px-12 py-5 text-xl rounded-2xl border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                Schedule a Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating trust signals */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 flex items-center justify-center gap-12 text-sm text-gray-500"
          >
            {[
              { text: "No credit card required" },
              { text: "14-day free trial" },
              { text: "Cancel anytime" }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                animate={{
                  y: [0, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
                className="flex items-center gap-3"
              >
                <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating portals */}
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto mt-32" style={{ perspective: "2000px" }}>
          {portals.map((portal, index) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 100, rotateX: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
              onHoverStart={() => setHoveredPortal(portal.id)}
              onHoverEnd={() => setHoveredPortal(null)}
              whileHover={{ 
                y: -30,
                rotateX: 10,
                rotateY: 10,
                scale: 1.08,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="relative cursor-pointer"
              onClick={handlePortalSelect}
              style={{ 
                transformStyle: "preserve-3d",
                zIndex: hoveredPortal === portal.id ? 20 : 10
              }}
            >
              {/* Portal atmosphere */}
              <motion.div
                animate={{
                  opacity: hoveredPortal === portal.id ? 0.4 : 0.1,
                  scale: hoveredPortal === portal.id ? 1.2 : 1
                }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 bg-gradient-to-br ${portal.bgGradient} rounded-2xl blur-2xl -z-10`}
              />
              
              {/* Portal-specific particle system */}
              {hoveredPortal === portal.id && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 bg-gradient-to-r ${portal.particles} rounded-full`}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -40, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 0.5
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Main portal */}
              <div className="relative h-full">
                {/* Glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-purple-50/20 to-transparent rounded-2xl blur-sm pointer-events-none" />
                
                <div className="relative bg-white/15 backdrop-blur-md rounded-2xl p-12 border border-white/25 hover:border-white/35 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 overflow-hidden" style={{ boxShadow: `0 0 80px ${portal.glow}` }}>
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-purple-500/15 to-transparent rounded-2xl pointer-events-none" />
                  {/* Continuous subtle glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-purple-500/20 to-white/15 rounded-2xl animate-subtle-glow pointer-events-none" />
                  {/* Shine effect */}
                  <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-shine pointer-events-none" />
                  {/* Animated mesh background */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] rounded-2xl" />
                  
                  <div className="relative" style={{ transform: "translateZ(30px)" }}>
                    {/* Floating icon */}
                    <motion.div
                      animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                      className={`w-28 h-28 bg-gradient-to-br ${portal.color} rounded-2xl flex items-center justify-center mb-10 text-6xl shadow-[0_0_50px_${portal.glow}] border border-white/20`}
                    >
                      {portal.icon}
                    </motion.div>

                    <h3 className="text-5xl font-bold text-white mb-3">{portal.title}</h3>
                    <p className={`text-xl font-semibold bg-gradient-to-r ${portal.color} bg-clip-text text-transparent mb-5`}>
                      {portal.subtitle}
                    </p>
                    <p className="text-gray-400 leading-relaxed text-lg">{portal.description}</p>
                  </div>
                </div>

                {/* Portal edge glow */}
                <motion.div
                  animate={{
                    opacity: hoveredPortal === portal.id ? 0.4 : 0.1,
                    scale: hoveredPortal === portal.id ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                  className={`absolute -inset-1 bg-gradient-to-br ${portal.color} opacity-20 rounded-2xl blur-xl -z-10`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;