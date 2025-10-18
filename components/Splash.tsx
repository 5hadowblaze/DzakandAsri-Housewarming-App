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

const TrailerScreen: React.FC<{ title: string; main: string; sub: string; }> = ({ title, main, sub }) => (
    <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeIn" } }}
    >
        <h2 className="text-xl text-gray-400 font-light tracking-widest uppercase">{title}</h2>
        <p className="text-4xl sm:text-6xl text-gray-100 font-bold my-4">{main}</p>
        <p className="text-lg text-gray-300">{sub}</p>
    </motion.div>
);

const Splash: React.FC<SplashProps> = ({ onFinished }) => {
    // 0: Roundel, 1: Date, 2: Location, 3: Fading out
    const [step, setStep] = useState(0);

    useEffect(() => {
        const roundelTimer = setTimeout(() => setStep(1), 3000); // Show roundel for 3s
        const dateTimer = setTimeout(() => setStep(2), 5500); // Show date for 2.5s
        const locationTimer = setTimeout(() => setStep(3), 8000); // Show location for 2.5s
        const finishTimer = setTimeout(() => onFinished(), 8500); // Fade out and finish

        return () => {
            clearTimeout(roundelTimer);
            clearTimeout(dateTimer);
            clearTimeout(locationTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinished]);

    return (
        <div className={`fixed inset-0 bg-gray-900 z-50 transition-opacity duration-500 ${step === 3 ? 'opacity-0' : 'opacity-100'}`}>
            <AnimatePresence mode="wait">
                {step === 0 && (
                    <motion.div
                        key="roundel"
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
                        className="w-full h-full flex items-center justify-center"
                    >
                      <motion.div
                        className="text-center"
                        variants={splashContainerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                          <motion.div
                            className="relative w-24 h-24 bg-[#DC241F] rounded-full flex items-center justify-center mx-auto"
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
                              className="w-full h-full bg-[#DC241F] rounded-full flex items-center justify-center"
                              animate={{ scale: [1, 1.04, 1] }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <div className="w-12 h-12 bg-white rounded-full"></div>
                            </motion.div>
                          </motion.div>
                          <motion.h1 
                            className="mt-6 text-3xl sm:text-4xl font-bold text-gray-200"
                            variants={textVariants}
                          >
                              Flat PPR Asri and Dzak Housewarming Party
                          </motion.h1>
                          <motion.p 
                            className="mt-2 text-lg text-gray-400"
                            variants={textVariants}
                          >
                              Please mind the gap.
                          </motion.p>
                      </motion.div>
                    </motion.div>
                )}

                {step === 1 && (
                    <TrailerScreen
                        key="date"
                        title="Save the Date"
                        main="Saturday, 25th October"
                        sub="From 11:00 AM Onwards"
                    />
                )}

                {step === 2 && (
                    <TrailerScreen
                        key="location"
                        title="The Location"
                        main="Flat 21, Sporle Court"
                        sub="London, SW11 2EP"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Splash;