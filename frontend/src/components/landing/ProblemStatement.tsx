// ============================================================================
// PROBLEM STATEMENT COMPONENT
// ============================================================================
// SVG Connected Flow Visualization

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const ProblemStatement = () => {
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  
  const demandRef = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLDivElement>(null);
  const sellerRef = useRef<HTMLDivElement>(null);
  const storefrontRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const nodes = {
        demand: demandRef.current,
        gap: gapRef.current,
        seller: sellerRef.current,
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
    { from: 'demand', to: 'gap' },
    { from: 'gap', to: 'seller' },
    { from: 'seller', to: 'storefront' },
  ];

  const nodes = [
    {
      id: 'demand',
      ref: demandRef,
      icon: '🔍',
      title: 'Regional Demand',
      description: 'Unknown products searched by customers',
      color: 'from-amber-400 to-orange-500',
      borderColor: 'border-amber-200',
      delay: 0.1
    },
    {
      id: 'gap',
      ref: gapRef,
      icon: '📦',
      title: 'Catalog Gap',
      description: 'Marketplace inventory missing regional products',
      color: 'from-red-400 to-rose-500',
      borderColor: 'border-red-200',
      delay: 0.2
    },
    {
      id: 'seller',
      ref: sellerRef,
      icon: '🏪',
      title: 'Seller Discovery',
      description: 'Regional suppliers identified but not connected',
      color: 'from-blue-400 to-cyan-500',
      borderColor: 'border-blue-200',
      delay: 0.3
    },
    {
      id: 'storefront',
      ref: storefrontRef,
      icon: '🏠',
      title: 'Localized Storefront',
      description: 'Connect demand to local supply',
      color: 'from-emerald-400 to-green-500',
      borderColor: 'border-emerald-300',
      highlight: true,
      delay: 0.4
    }
  ];

  return (
    <section id="problem" className="relative py-12 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-200/30 rounded-full blur-3xl" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/50 rounded-full mb-6">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-purple-600 tracking-wider uppercase">Problem</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-[#2D2A26] leading-[1.15] tracking-tight mb-4">
              The Problem
              <span className="block font-serif italic text-[#8B7AB8] mt-2">Flow</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6 rounded-full" />
            <p className="text-base text-[#6B6660] max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Marketplaces don't know what local customers want. Sellers can't find demand signals.
              Catalogs miss regional opportunities.
            </p>
          </motion.div>

          {/* Connected Flow Visualization */}
          <div className="max-w-3xl mx-auto" ref={containerRef}>
            <div className="relative min-h-[700px]">
              {/* SVG Connections Layer */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                {Object.keys(nodePositions).length === 4 && connections.map((conn, index) => {
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
              <div className="relative w-full h-full flex flex-col items-center gap-8" style={{ zIndex: 1 }}>
                {nodes.map((node, index) => (
                  <motion.div
                    key={node.id}
                    ref={node.ref}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: node.delay }}
                    className="flex items-center gap-6 w-full group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, x: -4 }}
                      transition={{ duration: 0.3 }}
                      className={`relative flex-shrink-0 w-28 h-28 rounded-2xl flex items-center justify-center text-6xl shadow-xl bg-gradient-to-br ${node.color} overflow-hidden`}
                    >
                      {/* Shine effect */}
                      <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] group-hover:animate-shine pointer-events-none" />
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
                        <h3 className="text-xl font-light text-[#2D2A26] mb-3">
                          {node.title}
                        </h3>
                        <p className="text-base leading-relaxed text-[#6B6660]">
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

export default ProblemStatement;
