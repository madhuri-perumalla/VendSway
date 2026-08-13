// ============================================================================
// PLATFORM ECOSYSTEM COMPONENT
// ============================================================================
// Premium AI Commerce Platform - Light Theme

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const PlatformEcosystem = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  
  const marketplaceRef = useRef<HTMLDivElement>(null);
  const aiEngineRef = useRef<HTMLDivElement>(null);
  const sellerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate node positions dynamically
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const nodes = {
        marketplace: marketplaceRef.current,
        aiEngine: aiEngineRef.current,
        seller: sellerRef.current,
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

    // Use ResizeObserver to detect layout changes
    let resizeObserver: ResizeObserver | null = null;
    
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updatePositions);
      });
      resizeObserver.observe(containerRef.current);
    }

    // Initial updates with delays to ensure layout is rendered
    const timeouts = [
      setTimeout(updatePositions, 100),
      setTimeout(updatePositions, 300),
      setTimeout(updatePositions, 600),
      setTimeout(updatePositions, 1000),
    ];
    
    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    return () => {
      timeouts.forEach(clearTimeout);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, []);

  // Generate Bézier curve path between two points
  const generatePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Control points for elegant curve
    const controlOffset = Math.min(distance * 0.4, 100);
    
    const cp1x = from.x + (dx > 0 ? controlOffset : -controlOffset);
    const cp1y = from.y;
    const cp2x = to.x - (dx > 0 ? controlOffset : -controlOffset);
    const cp2y = to.y;
    
    return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
  };

  // Calculate edge points for connections
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
    { from: 'marketplace', to: 'aiEngine' },
    { from: 'aiEngine', to: 'seller' },
    { from: 'seller', to: 'marketplace' },
  ];

  const getConnectionOpacity = (from: string, to: string) => {
    if (hoveredNode === null) return 1;
    if (hoveredNode === from || hoveredNode === to) return 1;
    return 0.2;
  };

  return (
    <section id="ecosystem" className="relative py-12 overflow-hidden">
      <div className="relative container mx-auto px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/50 rounded-full mb-6">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-indigo-600 tracking-wider uppercase">Ecosystem</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-[#2D2A26] leading-[1.15] tracking-tight mb-4">
              Connected
              <span className="block font-serif italic text-[#8B7AB8] mt-2">Ecosystem</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto mb-6 rounded-full" />
            <p className="text-base text-[#6B6660] max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              All stakeholders connected through one intelligent platform
            </p>
          </motion.div>

          {/* Connected Ecosystem Flow */}
          <div className="max-w-5xl mx-auto" ref={containerRef}>
            <div className="relative min-h-[600px]">
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
                  const opacity = getConnectionOpacity(conn.from, conn.to);
                  
                  return (
                    <g key={`${conn.from}-${conn.to}`}>
                      {/* Main connection line */}
                      <motion.path
                        d={pathData}
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: index * 0.2 }}
                        style={{ opacity }}
                      />
                      
                      {/* Animated particle traveling along path */}
                      {opacity === 1 && (
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
                      )}
                    </g>
                  );
                })}
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B7AB8" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#8B7AB8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#8B7AB8" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Nodes - Symmetrical Layout */}
              <div className="relative w-full h-full grid grid-cols-3 grid-rows-2 gap-8" style={{ zIndex: 1 }}>
                {/* Marketplace - Top Center */}
                <motion.div
                  ref={marketplaceRef}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="col-start-2 row-start-1 justify-self-center"
                  onMouseEnter={() => setHoveredNode('marketplace')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="relative bg-white/50 backdrop-blur-md rounded-2xl p-8 border border-white/50 hover:border-white/70 overflow-hidden hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-purple-50/40 to-transparent rounded-2xl pointer-events-none" />
                    {/* Continuous subtle glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-purple-100/30 to-white/40 rounded-2xl animate-subtle-glow pointer-events-none" />
                    {/* Shine effect */}
                    <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] group-hover:animate-shine pointer-events-none" />
                    <div className="relative">
                      <div className="text-6xl mb-5">🏢</div>
                      <h3 className="text-3xl font-light text-[#1a1a1a] mb-4">Marketplace</h3>
                      <div className="mt-5 pt-5 border-t border-purple-200">
                        <p className="text-base text-purple-600 font-medium mb-2">Problem</p>
                        <p className="text-base text-[#4a4a4a] mb-4">Regional catalog blind spots</p>
                        <p className="text-base text-purple-600 font-medium mb-2">Solution</p>
                        <p className="text-base text-[#4a4a4a]">Regional intelligence and catalog planning</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Seller - Left Center */}
                <motion.div
                  ref={sellerRef}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="col-start-1 row-start-2 justify-self-center self-center"
                  onMouseEnter={() => setHoveredNode('seller')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="relative bg-white/50 backdrop-blur-md rounded-2xl p-8 border border-white/50 hover:border-white/70 overflow-hidden hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-purple-50/40 to-transparent rounded-2xl pointer-events-none" />
                    {/* Continuous subtle glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-purple-100/30 to-white/40 rounded-2xl animate-subtle-glow pointer-events-none" />
                    {/* Shine effect */}
                    <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] group-hover:animate-shine pointer-events-none" />
                    <div className="relative">
                      <div className="text-6xl mb-5">🏪</div>
                      <h3 className="text-3xl font-light text-[#1a1a1a] mb-4">Seller</h3>
                      <div className="mt-5 pt-5 border-t border-blue-200">
                        <p className="text-base text-blue-600 font-medium mb-2">Problem</p>
                        <p className="text-base text-[#4a4a4a] mb-4">Limited marketplace visibility</p>
                        <p className="text-base text-blue-600 font-medium mb-2">Solution</p>
                        <p className="text-base text-[#4a4a4a]">Growth opportunities and marketplace visibility</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* AI Engine - Center */}
                <motion.div
                  ref={aiEngineRef}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="col-start-2 row-start-2 justify-self-center self-center group"
                  onMouseEnter={() => setHoveredNode('aiEngine')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="relative w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:shadow-3xl overflow-hidden">
                    {/* Shine effect */}
                    <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] group-hover:animate-shine pointer-events-none" />
                    <div className="relative text-center">
                      <div className="text-5xl mb-3">🧠</div>
                      <div className="text-white text-base font-light tracking-wider">AI Engine</div>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformEcosystem;
