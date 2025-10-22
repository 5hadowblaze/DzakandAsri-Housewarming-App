import React from 'react';
import { motion } from 'framer-motion';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onLogoClick?: () => void;
}

const tabs: { id: AppTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'plan', label: 'RSVP' },
  { id: 'info', label: 'Info' },
  { id: 'photos', label: 'Photos' },
];

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onLogoClick }) => {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <header className="bg-gray-800/80 backdrop-blur-md shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-2 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Interactive Logo with London Underground animations */}
            <motion.div 
              className="w-12 h-12 cursor-pointer relative p-1"
              onClick={onLogoClick}
              initial={{ scale: 1, rotate: 0 }}
              whileHover={{ 
                scale: 1.15,
                rotate: [0, -5, 5, -5, 5, 0],
                filter: "brightness(1.2)"
              }}
              whileTap={{
                scale: [1, 0.8, 1.3, 1],
                rotate: [0, 180, 360],
                filter: [
                  "brightness(1) hue-rotate(0deg)",
                  "brightness(1.5) hue-rotate(90deg)",
                  "brightness(1.8) hue-rotate(180deg)",
                  "brightness(1.2) hue-rotate(0deg)"
                ]
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 20,
                rotate: {
                  duration: 0.6,
                  ease: "easeInOut"
                },
                scale: {
                  duration: 0.8,
                  ease: "easeInOut"
                },
                filter: {
                  duration: 0.8,
                  ease: "easeInOut"
                }
              }}
            >
              {/* Invisible clickable overlay to ensure entire area is clickable */}
              <div className="absolute inset-0 z-10" />
              
              <img 
                src="/flat-ppr-logo.svg" 
                alt="Flat PPR Asri & Dzak" 
                className="w-full h-full object-contain filter drop-shadow-xl pointer-events-none relative z-0"
              />
              
              {/* Dynamic red pulse effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{
                  opacity: [0, 1, 0],
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    "0 0 0px rgba(239, 68, 68, 0)",
                    "0 0 40px rgba(239, 68, 68, 0.6)",
                    "0 0 0px rgba(239, 68, 68, 0)"
                  ]
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut"
                }}
              />
              
              {/* London Underground themed click effects */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileTap={{
                  opacity: [0, 1, 0.8, 0]
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut"
                }}
              >
                {/* Central line circle */}
                <motion.div
                  className="absolute inset-0 border-2 border-red-600 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{
                    scale: [0, 1.2, 1.8],
                    opacity: [0, 1, 0],
                    borderColor: ["#dc2626", "#1d4ed8", "#059669", "#dc2626"]
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeOut"
                  }}
                />
                
                {/* Piccadilly line outer ring */}
                <motion.div
                  className="absolute inset-0 border border-blue-600 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{
                    scale: [0, 1.5, 2.2],
                    opacity: [0, 0.8, 0],
                    borderColor: ["#1d4ed8", "#7c3aed", "#059669", "#1d4ed8"]
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    delay: 0.1
                  }}
                />
              </motion.div>
            </motion.div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-200 hidden sm:block">Asri & Dzak's Housewarming</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="relative flex items-center bg-gray-700/70 rounded-full p-1">
              <div
                className="absolute bg-gray-800 h-full top-0 rounded-full shadow-md transition-all duration-300 ease-in-out"
                style={{
                  width: `calc(${100 / tabs.length}% - 0.25rem)`,
                  left: `calc(${activeIndex * (100 / tabs.length)}% + 0.125rem)`,
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 w-20 sm:w-24 text-center py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                    activeTab === tab.id ? 'text-blue-300' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;