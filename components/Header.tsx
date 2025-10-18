import React from 'react';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const tabs: { id: AppTab; label: string }[] = [
  { id: 'plan', label: 'Plan' },
  { id: 'info', label: 'Info' },
  { id: 'photos', label: 'Photos' },
];

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <header className="bg-gray-800/80 backdrop-blur-md shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-2 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#DC241F] rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-200 hidden sm:block">Asri & Dzak's</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="relative flex items-center bg-gray-700/70 rounded-full p-1">
              <div
                className="absolute bg-gray-800 h-full top-0 rounded-full shadow-md transition-all duration-300 ease-in-out"
                style={{
                  width: `calc(100% / 3 - 0.25rem)`,
                  left: `calc(${activeIndex * (100 / 3)}% + 0.125rem)`,
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