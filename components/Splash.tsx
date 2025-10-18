import React, { useEffect, useState } from 'react';

interface SplashProps {
  onFinished: () => void;
}

const Splash: React.FC<SplashProps> = ({ onFinished }) => {
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeout(true);
    }, 2500); // Start fade out after 2.5s

    const timer2 = setTimeout(() => {
      onFinished();
    }, 3000); // Finish after 3s (allowing for fadeout)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 bg-gray-900 z-50 flex items-center justify-center transition-opacity duration-500 ${fadeout ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
          <div className="relative w-24 h-24 bg-[#DC241F] rounded-full flex items-center justify-center animate-pulse mx-auto">
              <div className="w-12 h-12 bg-white rounded-full"></div>
          </div>
          <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-gray-200">
              Flat PPR Asri and Dzak Housewarming Party
          </h1>
          <p className="mt-2 text-lg text-gray-400">Please mind the gap.</p>
      </div>
    </div>
  );
};

export default Splash;