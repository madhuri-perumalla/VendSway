// ============================================================================
// REGIONAL PERSONALIZATION COMPONENT
// ============================================================================
// SVG Connected Flow Visualization

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const RegionalPersonalization = () => {
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  
  const regionRef = useRef<HTMLDivElement>(null);
  const preferencesRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const festivalRef = useRef<HTMLDivElement>(null);
  const storefrontRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const nodes = {
        region: regionRef.current,
        preferences: preferencesRef.current,
        catalog: catalogRef.current,
        festival: festivalRef.current,
        storefront: storefrontRef.current,
      };

      const positions: Record<string, { x: number; y: number; width: number; height: number }> = {};

      Object.entries(nodes).forEach(([key, node]) => {
        if (node) {
          const rect = node.getBoundingClientRect();
          positions[key] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            width: rect.width,
            height: rect.height,
          };
        }
      });

      setNodePositions(positions);
    };

    const timeouts = [
      setTimeout(updatePositions, 100),
      setTimeout(updatePositions, 300),
      setTimeout(updatePositions, 600),
    ];
    
    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, []);

  const generatePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const controlOffset = Math.min(distance * 0.4, 100);
    
    const cp1x = from.x;
    const cp1y = from.y + (dy > 0 ? controlOffset : -controlOffset);
    const cp2x = to.x;
    const cp2y = to.y - (dy > 0 ? controlOffset : -controlOffset);
    
    return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
  };

  const getEdgePoint = (
    from: { x: number; y: number; width: number; height: number },
    to: { x: number; y: number }
  ) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    const radiusX = from.width / 2 + 8;
    const radiusY = from.height / 2 + 8;
    
    return {
      x: from.x + Math.cos(angle) * radiusX,
      y: from.y + Math.sin(angle) * radiusY,
    };
  };

  const connections = [
    { from: 'region', to: 'preferences' },
    { from: 'preferences', to: 'catalog' },
    { from: 'catalog', to: 'festival' },
    { from: 'festival', to: 'storefront' },
  ];

  const nodes = [
    {
      id: 'region',
      ref: regionRef,
      step: '1',
      icon: '📍',
      title: 'Region Selection',
      description: 'Marketplace selects target region for intelligence analysis',
      color: 'from-teal-400 to-cyan-500',
      borderColor: 'border-teal-200',
      delay: 0.1
    },
    {
      id: 'preferences',
      ref: preferencesRef,
      step: '2',
      icon: '⚙️',
      title: 'Regional Preferences Loaded',
      description: 'System loads cultural preferences, language, and regional trends',
      color: 'from-indigo-400 to-blue-500',
      borderColor: 'border-indigo-200',
      delay: 0.2
    },
    {
      id: 'catalog',
      ref: catalogRef,
      step: '3',
      icon: '�',
      title: 'Demand Intelligence',
      description: 'AI analyzes regional demand patterns and catalog gaps',
      color: 'from-violet-400 to-purple-500',
      borderColor: 'border-violet-200',
      delay: 0.3
    },
    {
      id: 'festival',
      ref: festivalRef,
      step: '4',
      icon: '🎉',
      title: 'Seasonal Insights',
      description: 'Festival and seasonal demand forecasting',
      color: 'from-pink-400 to-rose-500',
      borderColor: 'border-pink-200',
      delay: 0.4
    },
    {
      id: 'storefront',
      ref: storefrontRef,
      step: '5',
      icon: '🏠',
      title: 'Seller Onboarding',
      description: 'Regional sellers matched and onboarded to marketplace',
      color: 'from-emerald-400 to-green-500',
      borderColor: 'border-emerald-300',
      highlight: true,
      delay: 0.5
    }
  ];

  return (
    <section id="personalization" className="relative py-12 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100/50 rounded-full mb-6">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-pink-600 tracking-wider uppercase">Journey</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-[#2D2A26] leading-[1.15] tracking-tight mb-4">
              Customer Journey
              <span className="block font-serif italic text-[#8B7AB8] mt-2">Flow</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-400 mx-auto mb-6 rounded-full" />
            <p className="text-base text-[#6B6660] max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Customer journey to personalized shopping
            </p>
          </motion.div>

          {/* Customer Journey Flow */}
          <div className="max-w-3xl mx-auto" ref={containerRef}>
            <div className="relative min-h-[800px]">
              {/* SVG Connections Layer */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                {Object.keys(nodePositions).length === 5 && connections.map((conn, index) => {
                  const fromNode = nodePositions[conn.from];
                  const toNode = nodePositions[conn.to];
                  
                  if (!fromNode || !toNode) return null;
                  
                  const fromEdge = getEdgePoint(fromNode, toNode);
                  const toEdge = getEdgePoint(toNode, fromNode);
                  const pathData = generatePath(fromEdge, toEdge);
                  
                  return (
                    <g key={`${conn.from}-${conn.to}`}>
                      <motion.path
                        d={pathData}
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: index * 0.2 }}
                      />
                      
                      <motion.circle
                        r="3"
                        fill="#8B7AB8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        animate={{
                          opacity: [0, 0.7, 0],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 0.6,
                        }}
                      >
                        <animateMotion
                          dur="2.5s"
                          repeatCount="indefinite"
                          begin={`${index * 0.6}s`}
                          path={pathData}
                          rotate="auto"
                        />
                      </motion.circle>
                    </g>
                  );
                })}
                
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B7AB8" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#8B7AB8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#8B7AB8" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Nodes - Vertical Layout */}
              <div className="relative w-full h-full flex flex-col items-center gap-6" style={{ zIndex: 1 }}>
                {nodes.map((node, index) => (
                  <motion.div
                    key={node.id}
                    ref={node.ref}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: node.delay }}
                    className="flex items-center gap-6 w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, x: -4 }}
                      transition={{ duration: 0.3 }}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center text-4xl shadow-lg bg-gradient-to-br ${node.color} overflow-hidden`}
                    >
                      {/* Shine effect */}
                      <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-shine pointer-events-none" />
                      {node.icon}
                    </motion.div>
                    <div className="relative flex-1 bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/50 hover:border-white/70 overflow-hidden hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500">
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-purple-50/40 to-transparent rounded-2xl pointer-events-none" />
                      {/* Continuous subtle glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-purple-100/30 to-white/40 rounded-2xl animate-subtle-glow pointer-events-none" />
                      {/* Shine effect */}
                      <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] group-hover:animate-shine pointer-events-none" />
                      <div className="relative">
                        <div className="text-base font-medium text-[#8B7AB8] mb-2">{node.step}</div>
                        <h3 className="text-xl font-light text-[#2D2A26] mb-2">
                          {node.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#6B6660]">
                          {node.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegionalPersonalization;