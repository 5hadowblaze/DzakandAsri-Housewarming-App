import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
      <div className="w-64 h-20 relative">
        <svg viewBox="0 0 256 80" className="w-full h-full">
          <path d="M 10 70 C 50 70, 60 20, 128 20 S 206 70, 246 70" className="stroke-gray-600" strokeWidth="3" fill="none" strokeDasharray="5 5" />
          <g>
            <rect x="-15" y="-10" width="30" height="15" fill="#E32017" rx="2" />
            <circle cx="-10" cy="10" r="4" fill="#333" />
            <circle cx="10" cy="10" r="4" fill="#333" />
            <animateMotion dur="3s" repeatCount="indefinite" path="M 10 70 C 50 70, 60 20, 128 20 S 206 70, 246 70" />
          </g>
        </svg>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-300">Arriving at the party...</p>
    </div>
  );
};

export default LoadingAnimation;