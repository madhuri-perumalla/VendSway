// ============================================================================
// PAGE NAVIGATOR COMPONENT
// ============================================================================
// Premium Floating Navigation - Apple VisionOS / Linear / Stripe Style

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PageNavigator = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { id: 'hero', title: 'Problem' },
    { id: 'workflow', title: 'Workflow' },
    { id: 'marketplace', title: 'Marketplace' },
    { id: 'ecosystem', title: 'Ecosystem' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      ).filter(Boolean);

      let currentSection = 'hero';
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            currentSection = sections[i].id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className="hidden xl:block fixed right-0 top-28 z-[100] max-w-[180px]"
      aria-label="Page navigation"
    >
      <div className="space-y-1">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          
          return (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative w-full text-left px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-white/40"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3">
                {/* Active Indicator */}
                <motion.div
                  className="relative flex-shrink-0"
                  animate={{
                    scale: isActive ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-[#8B7AB8]' : 'bg-[#6B6660]'
                    }`}
                    animate={
                      isActive
                        ? {
                            boxShadow: [
                              '0 0 0 0 rgba(139, 122, 184, 0.4)',
                              '0 0 0 8px rgba(139, 122, 184, 0)',
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1.5,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeOut",
                    }}
                  />
                </motion.div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    className={`text-[11px] font-semibold tracking-tight transition-all duration-300 ${
                      isActive 
                        ? 'text-[#2D2A26] text-[13px]' 
                        : 'text-[#6B6660] opacity-70 group-hover:opacity-100'
                    }`}
                    animate={{
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {section.title}
                  </motion.div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default PageNavigator;
