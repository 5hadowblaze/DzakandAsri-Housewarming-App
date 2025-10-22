import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface SplashProps {
  onFinished: () => void;
}

const splashContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.6 }
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } },
};

const TrailerScreen: React.FC<{ title: string; main: string; sub: string; ledColor: string; }> = ({ title, main, sub, ledColor }) => (
    <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeIn" } }}
    >
        {/* Tube-style header */}
        <motion.div 
            className="bg-black border-2 border-gray-600 rounded-2xl p-6 shadow-2xl max-w-2xl w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
            <div className="flex items-center justify-center space-x-3 mb-4">
                <motion.div 
                    className={`w-3 h-3 rounded-full`}
                    style={{ backgroundColor: ledColor }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.h2 
                    className="text-xl text-white font-mono font-bold tracking-widest uppercase"
                    animate={{ 
                        textShadow: [
                            `0 0 10px ${ledColor}`,
                            `0 0 20px ${ledColor}`, 
                            `0 0 10px ${ledColor}`
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    {title}
                </motion.h2>
                <motion.div 
                    className={`w-3 h-3 rounded-full`}
                    style={{ backgroundColor: ledColor }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
            </div>
            
            <motion.p 
                className="text-4xl sm:text-6xl text-white font-mono font-bold my-6 tracking-wide"
                animate={{ 
                    textShadow: [
                        "0 0 15px #ffffff",
                        "0 0 30px #ffffff", 
                        "0 0 15px #ffffff"
                    ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                {main}
            </motion.p>
            
            <motion.p 
                className="text-lg text-gray-300 font-mono tracking-wide uppercase"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                {sub}
            </motion.p>
        </motion.div>
    </motion.div>
);

const Splash: React.FC<SplashProps> = ({ onFinished }) => {
    // 0: Roundel, 1: Date, 2: Location, 3: Fading out
    const [step, setStep] = useState(0);
    const [isSkipped, setIsSkipped] = useState(false);

    const handleSkip = () => {
        console.log('Skip button clicked!'); // Debug log
        setIsSkipped(true);
        setStep(3); // Go to fade out immediately
        setTimeout(() => onFinished(), 300); // Small delay for fade effect
    };

    useEffect(() => {
        if (isSkipped) return; // Don't set timers if already skipped

        const roundelTimer = setTimeout(() => setStep(1), 3000); // Show roundel for 3s
        const dateTimer = setTimeout(() => setStep(2), 5500); // Show date for 2.5s
        const locationTimer = setTimeout(() => setStep(3), 8000); // Show location for 2.5s
        const finishTimer = setTimeout(() => onFinished(), 8500); // Fade out and finish

        // Add keyboard shortcut for skip (Escape key)
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape' || event.key === ' ') {
                handleSkip();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            clearTimeout(roundelTimer);
            clearTimeout(dateTimer);
            clearTimeout(locationTimer);
            clearTimeout(finishTimer);
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [onFinished, isSkipped]);

    return (
        <div className={`fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-50 transition-opacity duration-500 ${step === 3 ? 'opacity-0' : 'opacity-100'}`} style={{ pointerEvents: 'auto' }}>
            {/* Skip Button - Bottom Right Corner */}
            <motion.button
                onClick={handleSkip}
                className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600 rounded-2xl px-4 py-2 shadow-lg hover:from-gray-700 hover:to-gray-600 transition-all duration-300 cursor-pointer"
                style={{ pointerEvents: 'all' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title="Skip splash screen (Press Escape or Space)"
                aria-label="Skip splash screen"
            >
                <div className="flex items-center space-x-2">
                    <motion.div 
                        className="w-2 h-2 bg-yellow-400 rounded-full"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-white font-mono text-xs font-bold tracking-wider uppercase">Skip</span>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3 text-gray-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </motion.button>

            {/* Tube-style background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" 
                     style={{
                         backgroundImage: `
                             linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%),
                             linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)
                         `,
                         backgroundSize: '100px 100px'
                     }}
                />
            </div>
            
            <AnimatePresence mode="wait">
                {step === 0 && (
                    <motion.div
                        key="roundel"
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
                        className="w-full h-full flex items-center justify-center"
                    >
                      <motion.div
                        className="text-center max-w-4xl mx-auto px-4"
                        variants={splashContainerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                          {/* Custom Flat PPR Logo with tube styling */}
                          <motion.div
                            className="relative flex items-center justify-center mx-auto mb-8"
                            initial={{ opacity: 1, scale: 4 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 100,
                              damping: 15,
                              duration: 0.8,
                            }}
                          >
                            <motion.div
                              className="w-40 h-40 flex items-center justify-center"
                              animate={{ 
                                scale: [1, 1.04, 1],
                                filter: [
                                  "drop-shadow(0 0 20px rgba(220, 36, 31, 0.5))",
                                  "drop-shadow(0 0 40px rgba(220, 36, 31, 0.8))",
                                  "drop-shadow(0 0 20px rgba(220, 36, 31, 0.5))"
                                ]
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <img 
                                src="/flat-ppr-logo.svg" 
                                alt="Flat PPR Asri & Dzak" 
                                className="w-full h-full object-contain"
                              />
                            </motion.div>
                          </motion.div>

                          {/* Tube-style title with LED indicators */}
                          <motion.div 
                            className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl p-8 shadow-2xl"
                            variants={textVariants}
                          >
                            <div className="flex items-center justify-center space-x-2 mb-6">
                              <motion.div 
                                className="w-2 h-2 bg-red-400 rounded-full"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <span className="text-white font-mono text-sm font-bold tracking-wider uppercase">Flat PPR Network</span>
                              <motion.div 
                                className="w-2 h-2 bg-red-400 rounded-full"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                              />
                            </div>
                            
                            <motion.h1 
                              className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-wide uppercase leading-tight"
                              animate={{ 
                                textShadow: [
                                  "0 0 10px #3b82f6",
                                  "0 0 20px #3b82f6", 
                                  "0 0 10px #3b82f6"
                                ]
                              }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              Flat PPR Asri & Dzak
                            </motion.h1>
                            
                            <motion.div 
                              className="mt-4 text-2xl sm:text-3xl font-mono font-bold text-yellow-300 tracking-wider uppercase"
                              animate={{ 
                                textShadow: [
                                  "0 0 10px #fbbf24",
                                  "0 0 20px #fbbf24", 
                                  "0 0 10px #fbbf24"
                                ]
                              }}
                              transition={{ duration: 4, repeat: Infinity }}
                            >
                              Housewarming Party
                            </motion.div>
                          </motion.div>

                          <motion.div 
                            className="mt-6 bg-black/40 border border-gray-600 rounded-xl p-4"
                            variants={textVariants}
                          >
                            <motion.p 
                              className="text-lg text-gray-300 font-mono tracking-wide uppercase"
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 4, repeat: Infinity }}
                            >
                              🚇 Please mind the gap 🚇
                            </motion.p>
                          </motion.div>
                      </motion.div>
                    </motion.div>
                )}

                {step === 1 && (
                    <TrailerScreen
                        key="date"
                        title="Service Schedule"
                        main="Saturday, 25th October"
                        sub="All-day service from 11:00 onwards"
                        ledColor="#10b981"
                    />
                )}

                {step === 2 && (
                    <TrailerScreen
                        key="location"
                        title="Platform Location"
                        main="Flat 21, Sporle Court"
                        sub="London, SW11 2EP - Clapham Junction"
                        ledColor="#3b82f6"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Splash;