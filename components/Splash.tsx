import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants, useDragControls, PanInfo } from 'framer-motion';

interface SplashProps {
  onFinished: () => void;
}

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 0, 
  speed = 50, 
  className = "", 
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(1);
      }, delay);
      return () => clearTimeout(delayTimer);
    }

    if (currentIndex > 0 && currentIndex <= text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex > text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex > 0 && currentIndex <= text.length && (
        <motion.span
          className="inline-block w-0.5 h-full bg-current ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </span>
  );
};

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

const DragToStartScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const dragControls = useDragControls();

    // Target position for the logo (reduced for better centering)
    const targetY = 200; // Reduced from 300
    const completionThreshold = 180; // Adjusted accordingly

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        
        // Check if logo is close enough to the target
        if (info.offset.y >= completionThreshold) {
            setIsComplete(true);
            // Animate to exact target position
            setLogoPosition({ x: 0, y: targetY });
            // Wait for animation to complete then trigger splash screens
            setTimeout(() => onComplete(), 800);
        } else {
            // Snap back to original position
            setLogoPosition({ x: 0, y: 0 });
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-50 flex flex-col items-center justify-center px-4 overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
        >
            {/* Harry Beck Tube Map Inspired Background */}
            <div className="absolute inset-0 opacity-20">
                {/* Horizontal lines - different tube lines */}
                <motion.div
                    className="absolute w-full h-1 bg-red-500 top-1/4"
                    style={{ 
                        background: 'linear-gradient(90deg, transparent 0%, #dc2626 20%, #dc2626 80%, transparent 100%)'
                    }}
                    animate={{
                        scaleX: [0.8, 1.2, 0.8],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                    className="absolute w-full h-1 bg-blue-500 top-2/4"
                    style={{ 
                        background: 'linear-gradient(90deg, transparent 10%, #3b82f6 30%, #3b82f6 70%, transparent 90%)'
                    }}
                    animate={{
                        scaleX: [0.9, 1.1, 0.9],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                    className="absolute w-full h-1 bg-yellow-500 top-3/4"
                    style={{ 
                        background: 'linear-gradient(90deg, transparent 5%, #eab308 25%, #eab308 75%, transparent 95%)'
                    }}
                    animate={{
                        scaleX: [1, 0.9, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 7, repeat: Infinity, delay: 2 }}
                />

                {/* Vertical lines */}
                <motion.div
                    className="absolute h-full w-1 bg-green-500 left-1/4"
                    style={{ 
                        background: 'linear-gradient(180deg, transparent 0%, #10b981 20%, #10b981 80%, transparent 100%)'
                    }}
                    animate={{
                        scaleY: [0.8, 1.2, 0.8],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 9, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                    className="absolute h-full w-1 bg-purple-500 left-3/4"
                    style={{ 
                        background: 'linear-gradient(180deg, transparent 10%, #8b5cf6 30%, #8b5cf6 70%, transparent 90%)'
                    }}
                    animate={{
                        scaleY: [0.9, 1.1, 0.9],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 1.5 }}
                />

                {/* Diagonal lines for intersections */}
                <motion.div
                    className="absolute w-80 h-1 bg-orange-500 top-1/3 left-1/3 origin-left"
                    style={{ 
                        background: 'linear-gradient(90deg, transparent 0%, #f97316 20%, #f97316 80%, transparent 100%)',
                        transform: 'rotate(30deg)'
                    }}
                    animate={{
                        scaleX: [0.7, 1.3, 0.7],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2.5 }}
                />
                <motion.div
                    className="absolute w-80 h-1 bg-pink-500 top-2/3 right-1/3 origin-right"
                    style={{ 
                        background: 'linear-gradient(90deg, transparent 0%, #ec4899 20%, #ec4899 80%, transparent 100%)',
                        transform: 'rotate(-30deg)'
                    }}
                    animate={{
                        scaleX: [0.8, 1.2, 0.8],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 11, repeat: Infinity, delay: 3 }}
                />

                {/* Station interchange circles */}
                {[
                    { x: '25%', y: '25%', color: '#dc2626', delay: 0 },
                    { x: '75%', y: '25%', color: '#3b82f6', delay: 1 },
                    { x: '50%', y: '50%', color: '#10b981', delay: 2 },
                    { x: '25%', y: '75%', color: '#8b5cf6', delay: 3 },
                    { x: '75%', y: '75%', color: '#eab308', delay: 4 }
                ].map((station, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-4 h-4 rounded-full border-2 border-white"
                        style={{
                            left: station.x,
                            top: station.y,
                            backgroundColor: station.color,
                            transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                            scale: [0.8, 1.4, 0.8],
                            opacity: [0.4, 0.8, 0.4],
                            boxShadow: [
                                `0 0 5px ${station.color}`,
                                `0 0 20px ${station.color}`,
                                `0 0 5px ${station.color}`
                            ]
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            delay: station.delay 
                        }}
                    />
                ))}
            </div>

            {/* Content container with better spacing */}
            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8 relative z-10 py-8">
                {/* Title and instruction - more compact */}
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                >
                    <motion.h1 
                        className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-wider uppercase mb-3"
                        animate={{ 
                            textShadow: [
                                "0 0 20px #ffffff",
                                "0 0 40px #3b82f6", 
                                "0 0 20px #ffffff"
                            ]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        Hi there, Welcome to Dzak and Asri's Housewarming
                    </motion.h1>
                    
                    <motion.p 
                        className="text-sm sm:text-lg text-gray-300 font-mono tracking-wide"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        Drag the logo to the platform to board
                    </motion.p>
                    
                    <motion.div 
                        className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg"
                        animate={{ 
                            borderColor: ['#ef4444', '#f97316', '#ef4444']
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.p 
                            className="text-sm text-red-200 font-mono font-bold text-center"
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            ⚠️ RSVP REQUIRED BEFORE ATTENDANCE ⚠️
                        </motion.p>
                        <motion.p 
                            className="text-xs text-orange-200 font-mono text-center mt-1"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                            Register inside to secure your spot
                        </motion.p>
                    </motion.div>
                </motion.div>

                {/* Draggable Logo - will transition to next screen */}
                <motion.div
                    className="relative z-20 cursor-grab active:cursor-grabbing"
                    layoutId="main-logo" // This enables the logo to transition between screens
                    drag="y"
                    dragControls={dragControls}
                    dragConstraints={{ top: -30, bottom: targetY + 30 }}
                    dragElastic={0.1}
                    animate={{ 
                        x: logoPosition.x, 
                        y: logoPosition.y,
                        scale: isDragging ? 1.1 : 1,
                        rotate: isDragging ? [0, 2, -2, 0] : 0
                    }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30,
                        rotate: { duration: 0.5, repeat: isDragging ? Infinity : 0 }
                    }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: 1.05 }}
                    style={{ 
                        filter: isDragging ? 'drop-shadow(0 10px 30px rgba(59, 130, 246, 0.6))' : 'drop-shadow(0 5px 15px rgba(220, 38, 38, 0.4))'
                    }}
                >
                    <motion.div
                        className="w-24 h-24 sm:w-32 sm:h-32 relative"
                        animate={!isComplete ? {
                            scale: [1, 1.05, 1],
                            filter: [
                                "drop-shadow(0 0 20px rgba(220, 38, 38, 0.5))",
                                "drop-shadow(0 0 40px rgba(220, 38, 38, 0.8)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
                                "drop-shadow(0 0 20px rgba(220, 38, 38, 0.5))"
                            ]
                        } : {}}
                        transition={{ duration: 3, repeat: isComplete ? 0 : Infinity }}
                    >
                        <img 
                            src="/flat-ppr-logo.svg" 
                            alt="Flat PPR Logo" 
                            className="w-full h-full object-contain"
                            draggable={false}
                        />
                    </motion.div>
                </motion.div>

                {/* Dotted connection line - shorter */}
                <motion.div 
                    className="relative z-10 flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <motion.div 
                        className="w-1 bg-gradient-to-b from-transparent via-gray-400 to-transparent"
                        style={{ 
                            height: `${targetY - 60}px`,
                            backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 6px, #9ca3af 6px, #9ca3af 10px)'
                        }}
                        animate={{
                            opacity: [0.3, 0.8, 0.3],
                            backgroundPosition: ['0px 0px', '0px 16px']
                        }}
                        transition={{
                            opacity: { duration: 2, repeat: Infinity },
                            backgroundPosition: { duration: 1.5, repeat: Infinity, ease: "linear" }
                        }}
                    />
                </motion.div>

                {/* Target silhouette platform - more compact */}
                <motion.div 
                    className="relative z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                >
                    {/* Platform base */}
                    <motion.div 
                        className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-xl p-4 border-2 border-gray-500 shadow-2xl relative overflow-hidden"
                        animate={{
                            borderColor: isComplete ? ["#10b981", "#059669", "#10b981"] : ["#6b7280", "#3b82f6", "#6b7280"],
                            boxShadow: isComplete ? 
                                ["0 0 20px rgba(16, 185, 129, 0.5)", "0 0 40px rgba(16, 185, 129, 0.8)", "0 0 20px rgba(16, 185, 129, 0.5)"] :
                                ["0 0 10px rgba(107, 114, 128, 0.3)", "0 0 20px rgba(59, 130, 246, 0.4)", "0 0 10px rgba(107, 114, 128, 0.3)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {/* Platform indicator lights */}
                        <div className="flex justify-center space-x-2 mb-3">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: isComplete ? '#10b981' : '#3b82f6' }}
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [0.8, 1.2, 0.8]
                                    }}
                                    transition={{ 
                                        duration: 1.5, 
                                        repeat: Infinity, 
                                        delay: i * 0.3 
                                    }}
                                />
                            ))}
                        </div>

                        {/* Logo silhouette - smaller */}
                        <motion.div 
                            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto relative"
                            animate={isComplete ? {
                                scale: [1, 1.1, 1],
                                rotate: [0, 360, 0]
                            } : {}}
                            transition={{ duration: 2, repeat: isComplete ? Infinity : 0 }}
                        >
                            <motion.div
                                className="w-full h-full rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden"
                                style={{ 
                                    borderColor: isComplete ? '#10b981' : '#6b7280',
                                    backgroundColor: isComplete ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)'
                                }}
                                animate={{
                                    borderColor: isComplete ? 
                                        ["#10b981", "#059669", "#10b981"] : 
                                        ["#6b7280", "#9ca3af", "#6b7280"]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {/* Silhouette of logo */}
                                <img 
                                    src="/flat-ppr-logo.svg" 
                                    alt="Logo Silhouette" 
                                    className="w-full h-full object-contain opacity-20"
                                    style={{ filter: 'grayscale(100%) brightness(50%)' }}
                                />
                                
                                {/* Success animation overlay */}
                                <AnimatePresence>
                                    {isComplete && (
                                        <motion.div
                                            className="absolute inset-0 bg-green-400 opacity-20 rounded-lg"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 0.3 }}
                                            exit={{ scale: 1.5, opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>

                        <motion.p 
                            className="text-center text-gray-300 font-mono text-xs sm:text-sm mt-3 tracking-wide uppercase"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {isComplete ? '🚇 All Aboard! 🚇' : 'Platform 9¾'}
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Progress indicator - moved to side */}
            <motion.div 
                className="absolute bottom-4 right-4 text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <motion.div 
                    className="text-xs text-gray-400 font-mono tracking-wide"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {Math.min(100, Math.round((logoPosition.y / targetY) * 100))}%
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const TrailerScreen: React.FC<{ title: string; main: string; sub: string; ledColor: string; }> = ({ title, main, sub, ledColor }) => (
    <motion.div
        className="absolute inset-0 flex items-center justify-center text-center px-4 relative overflow-hidden min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeIn" } }}
    >
        {/* Harry Beck Tube Map Background - Authentic Design */}
        <div className="absolute inset-0 opacity-15">
            {/* Central London Tube Lines - Accurate Positioning */}
            {/* Central Line - Red */}
            <motion.div
                className="absolute w-full h-2 top-1/2 transform -translate-y-1/2"
                style={{ 
                    background: `linear-gradient(90deg, transparent 0%, #dc241f 15%, #dc241f 85%, transparent 100%)`,
                    borderRadius: '1px'
                }}
                animate={{
                    scaleX: [0.9, 1.1, 0.9],
                    opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity, delay: 0 }}
            />
            
            {/* Piccadilly Line - Dark Blue */}
            <motion.div
                className="absolute w-full h-2 top-1/3"
                style={{ 
                    background: `linear-gradient(90deg, transparent 10%, #003688 20%, #003688 80%, transparent 90%)`,
                    borderRadius: '1px'
                }}
                animate={{
                    scaleX: [0.8, 1.2, 0.8],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 9, repeat: Infinity, delay: 1 }}
            />
            
            {/* District Line - Green */}
            <motion.div
                className="absolute w-full h-2 top-2/3"
                style={{ 
                    background: `linear-gradient(90deg, transparent 5%, #00782a 25%, #00782a 75%, transparent 95%)`,
                    borderRadius: '1px'
                }}
                animate={{
                    scaleX: [1, 0.9, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 7, repeat: Infinity, delay: 2 }}
            />

            {/* Northern Line - Black (appears as dark gray) */}
            <motion.div
                className="absolute h-full w-2 left-1/4"
                style={{ 
                    background: `linear-gradient(180deg, transparent 0%, #000000 20%, #000000 80%, transparent 100%)`,
                    borderRadius: '1px'
                }}
                animate={{
                    scaleY: [0.8, 1.2, 0.8],
                    opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ duration: 10, repeat: Infinity, delay: 0.5 }}
            />
            
            {/* Victoria Line - Light Blue */}
            <motion.div
                className="absolute h-full w-2 left-3/4"
                style={{ 
                    background: `linear-gradient(180deg, transparent 10%, #0098d4 30%, #0098d4 70%, transparent 90%)`,
                    borderRadius: '1px'
                }}
                animate={{
                    scaleY: [0.9, 1.1, 0.9],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity, delay: 1.5 }}
            />

            {/* Circle Line - Yellow (curved sections) */}
            <motion.div
                className="absolute w-96 h-96 border-4 border-yellow-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                    borderColor: '#ffce00',
                    borderStyle: 'solid'
                }}
                animate={{
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.2, 0.5, 0.2],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, delay: 2.5 }}
            />

            {/* Metropolitan Line - Magenta (diagonal) */}
            <motion.div
                className="absolute w-80 h-2 top-1/4 left-1/4 origin-left"
                style={{ 
                    background: `linear-gradient(90deg, transparent 0%, #9b0056 20%, #9b0056 80%, transparent 100%)`,
                    transform: 'rotate(35deg)',
                    borderRadius: '1px'
                }}
                animate={{
                    scaleX: [0.7, 1.3, 0.7],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 11, repeat: Infinity, delay: 3 }}
            />
            
            {/* Hammersmith & City Line - Pink (diagonal opposite) */}
            <motion.div
                className="absolute w-80 h-2 top-3/4 right-1/4 origin-right"
                style={{ 
                    background: `linear-gradient(90deg, transparent 0%, #f3a9bb 20%, #f3a9bb 80%, transparent 100%)`,
                    transform: 'rotate(-35deg)',
                    borderRadius: '1px'
                }}
                animate={{
                    scaleX: [0.8, 1.2, 0.8],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity, delay: 3.5 }}
            />

            {/* Interchange Stations - Authentic Underground Style */}
            {[
                { x: '20%', y: '20%', color: '#dc241f', name: 'Oxford Circus', size: 'large' },
                { x: '80%', y: '20%', color: '#003688', name: 'King\'s Cross', size: 'large' },
                { x: '50%', y: '50%', color: '#000000', name: 'Bank', size: 'major' },
                { x: '20%', y: '80%', color: '#00782a', name: 'Westminster', size: 'large' },
                { x: '80%', y: '80%', color: '#0098d4', name: 'Victoria', size: 'large' },
                { x: '35%', y: '35%', color: '#9b0056', name: 'Baker Street', size: 'medium' },
                { x: '65%', y: '65%', color: '#f3a9bb', name: 'Paddington', size: 'medium' },
                { x: '50%', y: '25%', color: '#ffce00', name: 'Liverpool Street', size: 'medium' },
                { x: '30%', y: '70%', color: '#dc241f', name: 'Bond Street', size: 'small' },
                { x: '70%', y: '30%', color: '#0098d4', name: 'Green Park', size: 'small' }
            ].map((station, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full border-2 border-white flex items-center justify-center"
                    style={{
                        left: station.x,
                        top: station.y,
                        backgroundColor: station.color,
                        transform: 'translate(-50%, -50%)',
                        width: station.size === 'major' ? '20px' : station.size === 'large' ? '16px' : station.size === 'medium' ? '12px' : '8px',
                        height: station.size === 'major' ? '20px' : station.size === 'large' ? '16px' : station.size === 'medium' ? '12px' : '8px',
                        borderWidth: station.size === 'major' ? '3px' : '2px'
                    }}
                    animate={{
                        scale: [0.8, 1.4, 0.8],
                        opacity: [0.4, 0.8, 0.4],
                        boxShadow: [
                            `0 0 5px ${station.color}`,
                            `0 0 20px ${station.color}`,
                            `0 0 5px ${station.color}`
                        ]
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        delay: i * 0.3 
                    }}
                />
            ))}

            {/* Zone Boundaries - Subtle */}
            <motion.div
                className="absolute inset-0 border-2 border-dashed border-gray-500 rounded-xl opacity-20"
                animate={{
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            
            {/* River Thames Curve - Authentic Shape */}
            <motion.div
                className="absolute bottom-1/4 left-0 w-full h-1"
                style={{
                    background: `linear-gradient(90deg, transparent 20%, #4a90e2 30%, #4a90e2 70%, transparent 80%)`,
                    borderRadius: '2px',
                    transform: 'rotate(-2deg)'
                }}
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scaleX: [0.9, 1.1, 0.9]
                }}
                transition={{ duration: 8, repeat: Infinity, delay: 4 }}
            />
        </div>

        {/* Enhanced Tube-style header */}
        <motion.div 
            className="bg-gradient-to-br from-black via-gray-900 to-black border-2 rounded-3xl p-8 shadow-2xl max-w-3xl w-full relative overflow-hidden"
            style={{ borderColor: ledColor }}
            initial={{ scale: 0.7, opacity: 0, rotateY: -90 }}
            animate={{ 
                scale: 1, 
                opacity: 1, 
                rotateY: 0,
                borderColor: [ledColor, `${ledColor}80`, ledColor],
                boxShadow: [
                    `0 0 20px ${ledColor}40`,
                    `0 0 40px ${ledColor}60`,
                    `0 0 20px ${ledColor}40`
                ]
            }}
            transition={{ 
                scale: { delay: 0.3, type: "spring", stiffness: 150 },
                opacity: { delay: 0.3 },
                rotateY: { delay: 0.3, type: "spring", stiffness: 150 },
                borderColor: { duration: 4, repeat: Infinity },
                boxShadow: { duration: 5, repeat: Infinity }
            }}
        >
            {/* Animated background overlay */}
            <div className="absolute inset-0 opacity-20">
                <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                        background: `radial-gradient(circle at 30% 30%, ${ledColor}30 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${ledColor}20 0%, transparent 50%)`
                    }}
                    animate={{
                        background: [
                            `radial-gradient(circle at 30% 30%, ${ledColor}30 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${ledColor}20 0%, transparent 50%)`,
                            `radial-gradient(circle at 70% 30%, ${ledColor}25 0%, transparent 50%), radial-gradient(circle at 30% 70%, ${ledColor}25 0%, transparent 50%)`,
                            `radial-gradient(circle at 30% 30%, ${ledColor}30 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${ledColor}20 0%, transparent 50%)`
                        ]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
            </div>

            {/* Enhanced header with multiple LEDs */}
            <div className="flex items-center justify-center space-x-4 mb-6 relative z-10">
                {[0, 1, 2].map((i) => (
                    <motion.div 
                        key={i}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: ledColor }}
                        animate={{ 
                            opacity: [0.3, 1, 0.3],
                            scale: [0.7, 1.4, 0.7],
                            boxShadow: [
                                `0 0 5px ${ledColor}`,
                                `0 0 25px ${ledColor}`,
                                `0 0 5px ${ledColor}`
                            ]
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: i * 0.4 
                        }}
                    />
                ))}
                
                <motion.h2 
                    className="text-2xl text-white font-mono font-bold tracking-widest uppercase mx-4"
                    animate={{ 
                        textShadow: [
                            `0 0 10px ${ledColor}`,
                            `0 0 25px ${ledColor}, 0 0 35px #ffffff`, 
                            `0 0 10px ${ledColor}`
                        ],
                        y: [0, -2, 0]
                    }}
                    transition={{ 
                        textShadow: { duration: 3, repeat: Infinity },
                        y: { duration: 4, repeat: Infinity }
                    }}
                >
                    {title}
                </motion.h2>
                
                {[0, 1, 2].map((i) => (
                    <motion.div 
                        key={i + 3}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: ledColor }}
                        animate={{ 
                            opacity: [0.3, 1, 0.3],
                            scale: [0.7, 1.4, 0.7],
                            boxShadow: [
                                `0 0 5px ${ledColor}`,
                                `0 0 25px ${ledColor}`,
                                `0 0 5px ${ledColor}`
                            ]
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: (i + 3) * 0.4 
                        }}
                    />
                ))}
            </div>
            
            {/* Enhanced main text */}
            <motion.p 
                className="text-4xl sm:text-6xl lg:text-7xl text-white font-mono font-bold my-8 tracking-wide relative z-10"
                animate={{ 
                    textShadow: [
                        "0 0 20px #ffffff",
                        "0 0 40px #ffffff, 0 0 60px #ffffff", 
                        "0 0 20px #ffffff"
                    ],
                    scale: [1, 1.02, 1],
                    rotateX: [0, 5, 0]
                }}
                transition={{ 
                    textShadow: { duration: 4, repeat: Infinity },
                    scale: { duration: 6, repeat: Infinity },
                    rotateX: { duration: 8, repeat: Infinity }
                }}
            >
                <motion.span
                    className="inline-block"
                    animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    style={{
                        background: `linear-gradient(90deg, #ffffff, ${ledColor}, #ffffff, ${ledColor}, #ffffff)`,
                        backgroundSize: "300% 100%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                    {main}
                </motion.span>
            </motion.p>
            
            {/* Enhanced subtitle */}
            <motion.div 
                className="bg-gray-800/50 border rounded-2xl p-4 relative z-10"
                style={{ borderColor: `${ledColor}60` }}
                animate={{
                    borderColor: [`${ledColor}60`, `${ledColor}ff`, `${ledColor}60`],
                    backgroundColor: ["rgba(31, 41, 55, 0.5)", "rgba(31, 41, 55, 0.7)", "rgba(31, 41, 55, 0.5)"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                <motion.p 
                    className="text-lg sm:text-xl text-gray-200 font-mono tracking-wide uppercase"
                    animate={{ 
                        opacity: [0.7, 1, 0.7],
                        y: [0, -1, 0]
                    }}
                    transition={{ 
                        opacity: { duration: 3, repeat: Infinity },
                        y: { duration: 2, repeat: Infinity }
                    }}
                >
                    {sub}
                </motion.p>
            </motion.div>
        </motion.div>
    </motion.div>
);

const Splash: React.FC<SplashProps> = ({ onFinished }) => {
    // -1: Drag to start, 0: Roundel, 1: Date, 2: Location, 3: Theme/Dress Code, 4: Fading out
    const [step, setStep] = useState(-1);
    const [isSkipped, setIsSkipped] = useState(false);
    const [sequenceStarted, setSequenceStarted] = useState(false);

    const handleDragComplete = () => {
        console.log('Drag completed, starting sequence');
        setSequenceStarted(true);
        setStep(0); // Start the regular splash sequence
    };

    const handleSkip = () => {
        console.log('Skip button clicked!'); // Debug log
        setIsSkipped(true);
        setStep(4); // Go to fade out immediately
        setTimeout(() => onFinished(), 300); // Small delay for fade effect
    };

    useEffect(() => {
        if (isSkipped || !sequenceStarted) return; // Don't set timers if skipped or sequence not started
        
        console.log('Setting timer for step:', step); // Debug log
        
        let timer: NodeJS.Timeout;
        
        if (step === 0) {
            // Roundel screen - show for 4.5 seconds
            timer = setTimeout(() => {
                console.log('Moving from step 0 to step 1');
                setStep(1);
            }, 4500);
        } else if (step === 1) {
            // Date screen - show for 4 seconds
            timer = setTimeout(() => {
                console.log('Moving from step 1 to step 2');
                setStep(2);
            }, 4000);
        } else if (step === 2) {
            // Location screen - show for 4 seconds
            timer = setTimeout(() => {
                console.log('Moving from step 2 to step 3');
                setStep(3);
            }, 4000);
        } else if (step === 3) {
            // Theme screen - show for 6 seconds (increased for typewriter effect)
            timer = setTimeout(() => {
                console.log('Moving from step 3 to step 4');
                setStep(4);
            }, 6000);
        } else if (step === 4) {
            // Fade out - finish after 500ms
            timer = setTimeout(() => {
                console.log('Finishing splash');
                onFinished();
            }, 500);
        }

        return () => {
            console.log('Cleaning up timer for step:', step);
            if (timer) clearTimeout(timer);
        };
    }, [step, onFinished, isSkipped, sequenceStarted]);

    // Separate effect for keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape' || event.key === ' ') {
                handleSkip();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <div className={`fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-50 transition-opacity duration-500 ${step === 4 ? 'opacity-0' : 'opacity-100'}`} style={{ pointerEvents: 'auto' }}>
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

            {/* Harry Beck Tube Map Background Pattern */}
            <div className="absolute inset-0 opacity-8">
                {/* Subtle tube lines grid */}
                <div className="absolute inset-0" 
                     style={{
                         backgroundImage: `
                             linear-gradient(90deg, transparent 0%, rgba(220, 36, 31, 0.1) 2px, transparent 2px),
                             linear-gradient(0deg, transparent 0%, rgba(0, 54, 136, 0.08) 2px, transparent 2px),
                             linear-gradient(45deg, transparent 0%, rgba(155, 0, 86, 0.06) 1px, transparent 1px),
                             linear-gradient(-45deg, transparent 0%, rgba(0, 120, 42, 0.06) 1px, transparent 1px)
                         `,
                         backgroundSize: '120px 120px, 120px 120px, 80px 80px, 80px 80px'
                     }}
                />
                
                {/* Faint station dots */}
                <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full opacity-20"
                            style={{
                                backgroundColor: ['#dc241f', '#003688', '#00782a', '#9b0056', '#0098d4', '#ffce00', '#f3a9bb', '#a0a5aa'][i],
                                left: `${15 + i * 10}%`,
                                top: `${20 + (i % 3) * 25}%`
                            }}
                            animate={{
                                opacity: [0.1, 0.3, 0.1],
                                scale: [0.8, 1.2, 0.8]
                            }}
                            transition={{
                                duration: 4 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.8
                            }}
                        />
                    ))}
                </div>
            </div>
            
            <AnimatePresence mode="wait">
                {step === -1 && (
                    <DragToStartScreen 
                        key="drag-to-start"
                        onComplete={handleDragComplete}
                    />
                )}

                {step === 0 && (
                    <motion.div
                        key="roundel"
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
                        className="w-full h-full flex items-center justify-center relative overflow-hidden"
                    >
                        {/* Harry Beck Tube Map Background - Full Network */}
                        <div className="absolute inset-0 opacity-12">
                            {/* Major Tube Lines - Accurate Harry Beck Style */}
                            {/* Central Line - Red Horizontal */}
                            <motion.div
                                className="absolute w-full h-2 top-1/2 transform -translate-y-1/2"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 0%, #dc241f 10%, #dc241f 90%, transparent 100%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [0.9, 1.1, 0.9],
                                    opacity: [0.3, 0.7, 0.3]
                                }}
                                transition={{ duration: 8, repeat: Infinity, delay: 0 }}
                            />
                            
                            {/* Northern Line - Black Vertical */}
                            <motion.div
                                className="absolute h-full w-2 left-1/2 transform -translate-x-1/2"
                                style={{ 
                                    background: `linear-gradient(180deg, transparent 0%, #000000 10%, #000000 90%, transparent 100%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleY: [0.8, 1.2, 0.8],
                                    opacity: [0.4, 0.8, 0.4]
                                }}
                                transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                            />
                            
                            {/* Piccadilly Line - Dark Blue */}
                            <motion.div
                                className="absolute w-full h-2 top-1/3"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 15%, #003688 25%, #003688 75%, transparent 85%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [0.8, 1.2, 0.8],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 9, repeat: Infinity, delay: 2 }}
                            />
                            
                            {/* District Line - Green */}
                            <motion.div
                                className="absolute w-full h-2 top-2/3"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 10%, #00782a 20%, #00782a 80%, transparent 90%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [1, 0.9, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 7, repeat: Infinity, delay: 3 }}
                            />

                            {/* Victoria Line - Light Blue Vertical */}
                            <motion.div
                                className="absolute h-full w-2 left-1/4"
                                style={{ 
                                    background: `linear-gradient(180deg, transparent 15%, #0098d4 25%, #0098d4 75%, transparent 85%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleY: [0.9, 1.1, 0.9],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 8, repeat: Infinity, delay: 1.5 }}
                            />
                            
                            {/* Jubilee Line - Gray Vertical */}
                            <motion.div
                                className="absolute h-full w-2 left-3/4"
                                style={{ 
                                    background: `linear-gradient(180deg, transparent 20%, #a0a5aa 30%, #a0a5aa 70%, transparent 80%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleY: [0.9, 1.1, 0.9],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 8, repeat: Infinity, delay: 4 }}
                            />

                            {/* Circle Line - Yellow Curved */}
                            <motion.div
                                className="absolute w-80 h-80 border-4 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                style={{ 
                                    borderColor: '#ffce00',
                                    borderStyle: 'solid'
                                }}
                                animate={{
                                    scale: [0.9, 1.1, 0.9],
                                    opacity: [0.2, 0.5, 0.2],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ duration: 15, repeat: Infinity, delay: 2.5 }}
                            />

                            {/* Metropolitan Line - Magenta Diagonal */}
                            <motion.div
                                className="absolute w-96 h-2 top-1/4 left-0 origin-left"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 0%, #9b0056 15%, #9b0056 85%, transparent 100%)`,
                                    transform: 'rotate(30deg)',
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [0.7, 1.3, 0.7],
                                    opacity: [0.2, 0.5, 0.2]
                                }}
                                transition={{ duration: 12, repeat: Infinity, delay: 3 }}
                            />
                            
                            {/* Hammersmith & City Line - Pink Diagonal */}
                            <motion.div
                                className="absolute w-96 h-2 top-3/4 right-0 origin-right"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 0%, #f3a9bb 15%, #f3a9bb 85%, transparent 100%)`,
                                    transform: 'rotate(-30deg)',
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [0.8, 1.2, 0.8],
                                    opacity: [0.2, 0.5, 0.2]
                                }}
                                transition={{ duration: 11, repeat: Infinity, delay: 4 }}
                            />

                            {/* Waterloo & City Line - Turquoise Short */}
                            <motion.div
                                className="absolute w-32 h-2 top-3/5 left-2/5"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 0%, #95cdba 20%, #95cdba 80%, transparent 100%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [0.8, 1.4, 0.8],
                                    opacity: [0.3, 0.7, 0.3]
                                }}
                                transition={{ duration: 6, repeat: Infinity, delay: 5 }}
                            />

                            {/* Major Interchange Stations - Accurate Network */}
                            {[
                                { x: '50%', y: '50%', color: '#dc241f', name: 'Oxford Circus', size: 'major', lines: 4 },
                                { x: '60%', y: '30%', color: '#003688', name: 'King\'s Cross St. Pancras', size: 'major', lines: 6 },
                                { x: '70%', y: '60%', color: '#000000', name: 'Bank/Monument', size: 'major', lines: 5 },
                                { x: '30%', y: '70%', color: '#00782a', name: 'Westminster', size: 'large', lines: 3 },
                                { x: '40%', y: '40%', color: '#0098d4', name: 'Victoria', size: 'large', lines: 3 },
                                { x: '35%', y: '25%', color: '#9b0056', name: 'Baker Street', size: 'large', lines: 5 },
                                { x: '20%', y: '50%', color: '#f3a9bb', name: 'Paddington', size: 'large', lines: 4 },
                                { x: '55%', y: '35%', color: '#ffce00', name: 'Liverpool Street', size: 'medium', lines: 4 },
                                { x: '45%', y: '55%', color: '#a0a5aa', name: 'London Bridge', size: 'medium', lines: 2 },
                                { x: '40%', y: '45%', color: '#dc241f', name: 'Bond Street', size: 'medium', lines: 2 },
                                { x: '50%', y: '45%', color: '#0098d4', name: 'Green Park', size: 'medium', lines: 3 },
                                { x: '65%', y: '45%', color: '#95cdba', name: 'Waterloo', size: 'medium', lines: 4 },
                                { x: '25%', y: '40%', color: '#003688', name: 'Heathrow T1,2,3', size: 'small', lines: 1 },
                                { x: '80%', y: '25%', color: '#9b0056', name: 'Wembley Park', size: 'small', lines: 1 },
                                { x: '20%', y: '80%', color: '#00782a', name: 'Wimbledon', size: 'small', lines: 1 }
                            ].map((station, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full border border-white flex items-center justify-center"
                                    style={{
                                        left: station.x,
                                        top: station.y,
                                        backgroundColor: station.color,
                                        transform: 'translate(-50%, -50%)',
                                        width: station.size === 'major' ? '18px' : station.size === 'large' ? '14px' : station.size === 'medium' ? '10px' : '6px',
                                        height: station.size === 'major' ? '18px' : station.size === 'large' ? '14px' : station.size === 'medium' ? '10px' : '6px',
                                        borderWidth: station.size === 'major' ? '2px' : '1px'
                                    }}
                                    animate={{
                                        scale: station.size === 'major' ? [0.9, 1.3, 0.9] : [0.8, 1.2, 0.8],
                                        opacity: [0.4, 0.8, 0.4],
                                        boxShadow: [
                                            `0 0 3px ${station.color}`,
                                            `0 0 15px ${station.color}`,
                                            `0 0 3px ${station.color}`
                                        ]
                                    }}
                                    transition={{ 
                                        duration: 3 + (i % 3), 
                                        repeat: Infinity, 
                                        delay: i * 0.2 
                                    }}
                                />
                            ))}

                            {/* Zone Boundaries */}
                            <motion.div
                                className="absolute inset-8 border border-dashed border-gray-600 rounded-2xl opacity-20"
                                animate={{
                                    opacity: [0.1, 0.3, 0.1]
                                }}
                                transition={{ duration: 8, repeat: Infinity }}
                            />
                            
                            <motion.div
                                className="absolute inset-16 border border-dashed border-gray-500 rounded-xl opacity-15"
                                animate={{
                                    opacity: [0.1, 0.25, 0.1]
                                }}
                                transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                            />

                            {/* River Thames - Authentic S-curve */}
                            <motion.div
                                className="absolute bottom-1/3 left-0 w-full h-1"
                                style={{
                                    background: `linear-gradient(90deg, transparent 25%, #4a90e2 35%, #4a90e2 65%, transparent 75%)`,
                                    borderRadius: '2px',
                                    transform: 'rotate(-1deg)'
                                }}
                                animate={{
                                    opacity: [0.2, 0.4, 0.2],
                                    scaleX: [0.9, 1.1, 0.9]
                                }}
                                transition={{ duration: 10, repeat: Infinity, delay: 6 }}
                            />
                            
                            {/* Thames Bend */}
                            <motion.div
                                className="absolute bottom-1/4 left-1/3 w-2/3 h-1"
                                style={{
                                    background: `linear-gradient(90deg, transparent 0%, #4a90e2 20%, #4a90e2 80%, transparent 100%)`,
                                    borderRadius: '2px',
                                    transform: 'rotate(2deg)'
                                }}
                                animate={{
                                    opacity: [0.15, 0.35, 0.15],
                                    scaleX: [0.95, 1.05, 0.95]
                                }}
                                transition={{ duration: 12, repeat: Infinity, delay: 7 }}
                            />
                        </div>

                        <motion.div
                            className="text-center max-w-5xl mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-screen"
                            variants={splashContainerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                          {/* Enhanced Custom Flat PPR Logo - continuing from drag screen */}
                          <motion.div
                            className="relative flex items-center justify-center mx-auto mb-12"
                            layoutId="main-logo" // Same layoutId for seamless transition
                            initial={{ opacity: 1, scale: 1 }} // Start at normal size since it's transitioning
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 150,
                              damping: 20,
                              duration: 1,
                            }}
                          >
                            {/* Outer glow rings */}
                            <motion.div
                                className="absolute inset-0 w-64 h-64 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, rgba(220, 38, 38, 0.1) 40%, transparent 70%)'
                                }}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.4, 0.8, 0.4]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute inset-0 w-64 h-64 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)'
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                    rotate: [0, 360]
                                }}
                                transition={{ 
                                    scale: { duration: 3, repeat: Infinity },
                                    opacity: { duration: 3, repeat: Infinity },
                                    rotate: { duration: 15, repeat: Infinity, ease: "linear" }
                                }}
                            />
                            
                            <motion.div
                              className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center relative"
                              animate={{ 
                                scale: [1, 1.06, 1],
                                rotate: [0, 5, -5, 0],
                                filter: [
                                  "drop-shadow(0 0 20px rgba(220, 36, 31, 0.5))",
                                  "drop-shadow(0 0 60px rgba(220, 36, 31, 0.9)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))",
                                  "drop-shadow(0 0 20px rgba(220, 36, 31, 0.5))"
                                ]
                              }}
                              transition={{
                                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                                filter: { duration: 4, repeat: Infinity }
                              }}
                            >
                              {/* Orbital elements */}
                              {[0, 120, 240].map((angle, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                                  style={{
                                    transformOrigin: '0 0',
                                    transform: `rotate(${angle}deg) translateX(120px)`
                                  }}
                                  animate={{
                                    rotate: [angle, angle + 360],
                                    scale: [0.8, 1.2, 0.8],
                                    opacity: [0.6, 1, 0.6]
                                  }}
                                  transition={{
                                    rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity, delay: i * 0.5 },
                                    opacity: { duration: 2, repeat: Infinity, delay: i * 0.5 }
                                  }}
                                />
                              ))}
                              
                              <img 
                                src="/flat-ppr-logo.svg" 
                                alt="Flat PPR Asri & Dzak" 
                                className="w-full h-full object-contain relative z-10"
                              />
                            </motion.div>
                          </motion.div>

                          {/* Enhanced Tube-style title with dynamic effects */}
                          <motion.div 
                            className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-gray-500 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
                            variants={textVariants}
                            animate={{
                              borderColor: ["#6b7280", "#3b82f6", "#dc2626", "#fbbf24", "#6b7280"],
                              boxShadow: [
                                "0 0 20px rgba(59, 130, 246, 0.3)",
                                "0 0 40px rgba(220, 38, 38, 0.3)", 
                                "0 0 20px rgba(251, 191, 36, 0.3)",
                                "0 0 20px rgba(59, 130, 246, 0.3)"
                              ]
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                          >
                            {/* Animated background pattern */}
                            <div className="absolute inset-0 opacity-20">
                              <motion.div
                                className="absolute inset-0"
                                style={{
                                  backgroundImage: `
                                    linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.1) 25%, transparent 50%, rgba(220, 38, 38, 0.1) 75%, transparent 100%)
                                  `,
                                  backgroundSize: '100px 100px'
                                }}
                                animate={{
                                  backgroundPosition: ["0% 0%", "200% 200%"]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                              />
                            </div>
                            
                            {/* Enhanced LED network indicator */}
                            <div className="flex items-center justify-center space-x-3 mb-8 relative z-10">
                              <motion.div 
                                className="w-3 h-3 bg-red-400 rounded-full"
                                animate={{ 
                                  opacity: [0.3, 1, 0.3],
                                  scale: [0.8, 1.3, 0.8]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <motion.span 
                                className="text-white font-mono text-lg font-bold tracking-wider uppercase"
                                animate={{
                                  textShadow: [
                                    "0 0 5px #ffffff",
                                    "0 0 15px #dc2626",
                                    "0 0 5px #ffffff"
                                  ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                Flat PPR Network
                              </motion.span>
                              <motion.div 
                                className="w-3 h-3 bg-red-400 rounded-full"
                                animate={{ 
                                  opacity: [0.3, 1, 0.3],
                                  scale: [0.8, 1.3, 0.8]
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                              />
                            </div>
                            
                            {/* Enhanced main title */}
                            <motion.h1 
                              className="text-4xl sm:text-6xl lg:text-7xl font-mono font-bold text-white tracking-wide uppercase leading-tight relative z-10"
                              animate={{ 
                                textShadow: [
                                  "0 0 20px #ffffff",
                                  "0 0 40px #3b82f6, 0 0 60px #ffffff", 
                                  "0 0 20px #dc2626, 0 0 40px #ffffff",
                                  "0 0 20px #fbbf24, 0 0 40px #ffffff",
                                  "0 0 20px #ffffff"
                                ],
                                y: [0, -3, 0, 3, 0]
                              }}
                              transition={{ 
                                textShadow: { duration: 6, repeat: Infinity },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                              }}
                            >
                              <motion.span
                                className="inline-block"
                                animate={{ 
                                  rotateY: [0, 5, -5, 0],
                                  scale: [1, 1.02, 1]
                                }}
                                transition={{ 
                                  duration: 8, 
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                Flat PPR Asri & Dzak
                              </motion.span>
                            </motion.h1>
                            
                            {/* Enhanced subtitle */}
                            <motion.div 
                              className="mt-6 text-2xl sm:text-4xl font-mono font-bold tracking-wider uppercase relative z-10"
                              animate={{ 
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                              }}
                              style={{
                                background: "linear-gradient(90deg, #fbbf24, #f59e0b, #dc2626, #3b82f6, #fbbf24)",
                                backgroundSize: "400% 100%",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                              }}
                              transition={{ 
                                backgroundPosition: { duration: 6, repeat: Infinity, ease: "linear" }
                              }}
                            >
                              <motion.span
                                className="inline-block"
                                animate={{ 
                                  scale: [1, 1.05, 1],
                                  rotateX: [0, 10, 0]
                                }}
                                transition={{ 
                                  duration: 5, 
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                Housewarming Party
                              </motion.span>
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

                {step === 3 && (
                    <motion.div
                        key="theme"
                        className="absolute inset-0 flex items-center justify-center text-center px-4 min-h-screen"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeIn" } }}
                    >
                        {/* Harry Beck Tube Map Background - Costume Theme Focus */}
                        <div className="absolute inset-0 opacity-10">
                            {/* Featured Costume Lines - Thematic Selection */}
                            {/* Central Line - Red (Bond Street, Oxford Circus themes) */}
                            <motion.div
                                className="absolute w-full h-2 top-1/2 transform -translate-y-1/2"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 0%, #dc241f 15%, #dc241f 85%, transparent 100%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [0.9, 1.1, 0.9],
                                    opacity: [0.3, 0.7, 0.3]
                                }}
                                transition={{ duration: 8, repeat: Infinity, delay: 0 }}
                            />
                            
                            {/* Metropolitan Line - Magenta (themed stations) */}
                            <motion.div
                                className="absolute w-full h-2 top-1/3"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 10%, #9b0056 20%, #9b0056 80%, transparent 90%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [0.8, 1.2, 0.8],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 9, repeat: Infinity, delay: 1 }}
                            />
                            
                            {/* Piccadilly Line - Dark Blue (airport themes) */}
                            <motion.div
                                className="absolute w-full h-2 top-2/3"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 5%, #003688 25%, #003688 75%, transparent 95%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [1, 0.9, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 7, repeat: Infinity, delay: 2 }}
                            />

                            {/* Northern Line - Black (Angel, King's Cross themes) */}
                            <motion.div
                                className="absolute h-full w-2 left-1/4"
                                style={{ 
                                    background: `linear-gradient(180deg, transparent 0%, #000000 20%, #000000 80%, transparent 100%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleY: [0.8, 1.2, 0.8],
                                    opacity: [0.4, 0.8, 0.4]
                                }}
                                transition={{ duration: 10, repeat: Infinity, delay: 0.5 }}
                            />
                            
                            {/* Victoria Line - Light Blue (Victoria themes) */}
                            <motion.div
                                className="absolute h-full w-2 left-3/4"
                                style={{ 
                                    background: `linear-gradient(180deg, transparent 10%, #0098d4 30%, #0098d4 70%, transparent 90%)`,
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleY: [0.9, 1.1, 0.9],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 8, repeat: Infinity, delay: 1.5 }}
                            />

                            {/* Circle Line - Yellow (thematic circle) */}
                            <motion.div
                                className="absolute w-96 h-96 border-4 border-yellow-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                style={{ 
                                    borderColor: '#ffce00',
                                    borderStyle: 'solid'
                                }}
                                animate={{
                                    scale: [0.8, 1.1, 0.8],
                                    opacity: [0.2, 0.5, 0.2],
                                    rotate: [0, 15, -15, 0]
                                }}
                                transition={{ duration: 12, repeat: Infinity, delay: 2.5 }}
                            />

                            {/* District Line - Green (themed destinations) */}
                            <motion.div
                                className="absolute w-80 h-2 top-1/4 left-1/4 origin-left"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 0%, #00782a 20%, #00782a 80%, transparent 100%)`,
                                    transform: 'rotate(25deg)',
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [0.7, 1.3, 0.7],
                                    opacity: [0.2, 0.5, 0.2]
                                }}
                                transition={{ duration: 11, repeat: Infinity, delay: 3 }}
                            />
                            
                            {/* Hammersmith & City Line - Pink */}
                            <motion.div
                                className="absolute w-80 h-2 top-3/4 right-1/4 origin-right"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent 0%, #f3a9bb 20%, #f3a9bb 80%, transparent 100%)`,
                                    transform: 'rotate(-25deg)',
                                    borderRadius: '1px'
                                }}
                                animate={{
                                    scaleX: [0.8, 1.2, 0.8],
                                    opacity: [0.2, 0.5, 0.2]
                                }}
                                transition={{ duration: 10, repeat: Infinity, delay: 3.5 }}
                            />

                            {/* Costume-Themed Stations - Creative Examples */}
                            {[
                                { x: '25%', y: '25%', color: '#dc241f', name: 'Bond Street', theme: '💼 Suit & Tie', size: 'large' },
                                { x: '50%', y: '20%', color: '#000000', name: 'Angel', theme: '👼 Wings & Halo', size: 'large' },
                                { x: '75%', y: '25%', color: '#000000', name: 'King\'s Cross', theme: '👑 Crown & Cross', size: 'large' },
                                { x: '20%', y: '50%', color: '#00782a', name: 'Liverpool Street', theme: '⚽ Football Jersey', size: 'medium' },
                                { x: '80%', y: '50%', color: '#0098d4', name: 'Victoria', theme: '👑 Victorian Dress', size: 'medium' },
                                { x: '50%', y: '75%', color: '#9b0056', name: 'Baker Street', theme: '🔍 Detective Look', size: 'medium' },
                                { x: '30%', y: '70%', color: '#f3a9bb', name: 'Elephant & Castle', theme: '🐘 Elephant Ears', size: 'small' },
                                { x: '70%', y: '30%', color: '#ffce00', name: 'Canary Wharf', theme: '🐤 Yellow Outfit', size: 'small' },
                                { x: '40%', y: '60%', color: '#003688', name: 'Heathrow', theme: '✈️ Pilot/Cabin Crew', size: 'small' },
                                { x: '60%', y: '40%', color: '#a0a5aa', name: 'Seven Sisters', theme: '👭 Group Costume', size: 'small' }
                            ].map((station, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full border-2 border-white flex items-center justify-center"
                                    style={{
                                        left: station.x,
                                        top: station.y,
                                        backgroundColor: station.color,
                                        transform: 'translate(-50%, -50%)',
                                        width: station.size === 'large' ? '16px' : station.size === 'medium' ? '12px' : '8px',
                                        height: station.size === 'large' ? '16px' : station.size === 'medium' ? '12px' : '8px',
                                        borderWidth: station.size === 'large' ? '3px' : '2px'
                                    }}
                                    animate={{
                                        scale: [0.8, 1.4, 0.8],
                                        opacity: [0.4, 0.8, 0.4],
                                        boxShadow: [
                                            `0 0 5px ${station.color}`,
                                            `0 0 20px ${station.color}`,
                                            `0 0 5px ${station.color}`
                                        ]
                                    }}
                                    transition={{ 
                                        duration: 3 + (i % 2), 
                                        repeat: Infinity, 
                                        delay: i * 0.4 
                                    }}
                                    title={`${station.name}: ${station.theme}`}
                                />
                            ))}

                            {/* Zone Boundaries - Costume Zone Indicators */}
                            <motion.div
                                className="absolute inset-0 border-2 border-dashed border-purple-500 rounded-xl opacity-20"
                                animate={{
                                    opacity: [0.1, 0.3, 0.1],
                                    borderColor: ['#a855f7', '#c084fc', '#a855f7']
                                }}
                                transition={{ duration: 6, repeat: Infinity }}
                            />
                            
                            {/* Creative Zone Indicator */}
                            <motion.div
                                className="absolute inset-8 border border-dashed border-pink-400 rounded-2xl opacity-15"
                                animate={{
                                    opacity: [0.1, 0.25, 0.1]
                                }}
                                transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                            />

                            {/* Thames - Costume Parade Route */}
                            <motion.div
                                className="absolute bottom-1/4 left-0 w-full h-1"
                                style={{
                                    background: `linear-gradient(90deg, transparent 20%, #8b5cf6 30%, #8b5cf6 70%, transparent 80%)`,
                                    borderRadius: '2px',
                                    transform: 'rotate(-2deg)'
                                }}
                                animate={{
                                    opacity: [0.2, 0.4, 0.2],
                                    scaleX: [0.9, 1.1, 0.9]
                                }}
                                transition={{ duration: 8, repeat: Infinity, delay: 4 }}
                            />
                        </div>
                        {/* Enhanced Tube-style header for dress code */}
                        <motion.div 
                            className="bg-black border-2 border-purple-500 rounded-2xl p-8 shadow-2xl max-w-3xl w-full relative overflow-hidden"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        >
                            {/* Animated background pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <motion.div 
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: `
                                            radial-gradient(circle at 25% 25%, #8b5cf6 0%, transparent 50%),
                                            radial-gradient(circle at 75% 75%, #a855f7 0%, transparent 50%),
                                            radial-gradient(circle at 75% 25%, #c084fc 0%, transparent 50%),
                                            radial-gradient(circle at 25% 75%, #ddd6fe 0%, transparent 50%)
                                        `,
                                        backgroundSize: '50px 50px'
                                    }}
                                    animate={{ 
                                        backgroundPosition: [
                                            '0% 0%', 
                                            '100% 100%', 
                                            '0% 0%'
                                        ]
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />
                            </div>

                            {/* Header with animated LEDs */}
                            <div className="flex items-center justify-center space-x-3 mb-6 relative z-10">
                                <motion.div 
                                    className="w-3 h-3 bg-purple-400 rounded-full"
                                    animate={{ 
                                        opacity: [0.3, 1, 0.3],
                                        scale: [0.8, 1.2, 0.8]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.h2 
                                    className="text-2xl text-white font-mono font-bold tracking-widest uppercase"
                                    animate={{ 
                                        textShadow: [
                                            "0 0 10px #a855f7",
                                            "0 0 25px #a855f7", 
                                            "0 0 10px #a855f7"
                                        ]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    🎭 Dress Code Alert 🎭
                                </motion.h2>
                                <motion.div 
                                    className="w-3 h-3 bg-purple-400 rounded-full"
                                    animate={{ 
                                        opacity: [0.3, 1, 0.3],
                                        scale: [0.8, 1.2, 0.8]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                />
                            </div>
                            
                            {/* Main theme announcement with typewriter effect */}
                            <motion.div 
                                className="mb-6 relative z-10"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
                            >
                                <motion.p 
                                    className="text-4xl sm:text-5xl text-white font-mono font-bold mb-4 tracking-wide"
                                    animate={{ 
                                        textShadow: [
                                            "0 0 15px #ffffff",
                                            "0 0 30px #ffffff", 
                                            "0 0 15px #ffffff"
                                        ]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <TypewriterText 
                                        text="London Underground"
                                        delay={300}
                                        speed={30}
                                    />
                                </motion.p>
                                <motion.p 
                                    className="text-2xl sm:text-3xl text-purple-300 font-mono font-bold tracking-wide"
                                    animate={{ 
                                        textShadow: [
                                            "0 0 10px #c084fc",
                                            "0 0 20px #c084fc", 
                                            "0 0 10px #c084fc"
                                        ]
                                    }}
                                    transition={{ duration: 3.5, repeat: Infinity }}
                                >
                                    <TypewriterText 
                                        text="Station Costume Theme"
                                        delay={900}
                                        speed={25}
                                    />
                                </motion.p>
                            </motion.div>
                            
                            {/* Detailed instructions with typewriter effects */}
                            <motion.div 
                                className="space-y-4 relative z-10"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9, type: "spring", stiffness: 150 }}
                            >
                                <motion.p 
                                    className="text-lg text-gray-300 font-mono tracking-wide"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <TypewriterText 
                                        text="🚇 Dress as your chosen London Underground Station"
                                        delay={1500}
                                        speed={20}
                                    />
                                </motion.p>
                                
                                <motion.div 
                                    className="bg-purple-900/30 border border-purple-400 rounded-xl p-4"
                                    animate={{ 
                                        borderColor: ["#a855f7", "#c084fc", "#a855f7"],
                                        backgroundColor: ["rgba(88, 28, 135, 0.3)", "rgba(107, 33, 168, 0.3)", "rgba(88, 28, 135, 0.3)"]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <motion.p 
                                        className="text-sm text-purple-200 font-mono font-bold tracking-wide uppercase mb-2"
                                        animate={{ opacity: [0.8, 1, 0.8] }}
                                        transition={{ duration: 2.5, repeat: Infinity }}
                                    >
                                        Creative Examples:
                                    </motion.p>
                                    <motion.p 
                                        className="text-sm text-purple-100 font-mono leading-relaxed"
                                        animate={{ opacity: [0.9, 1, 0.9] }}
                                        transition={{ duration: 3.5, repeat: Infinity }}
                                    >
                                        King's Cross → Crown & Cross accessories<br/>
                                        Angel → Angel wings & halo<br/>
                                        Liverpool Street → Liverpool FC jersey<br/>
                                        Bond Street → Formal suit & tie
                                    </motion.p>
                                </motion.div>
                                
                                {/* RSVP REQUIREMENT MESSAGE */}
                                <motion.div 
                                    className="bg-red-900/60 border-2 border-red-500 rounded-xl p-4 backdrop-blur-sm"
                                    animate={{ 
                                        borderColor: ['#ef4444', '#f97316', '#ef4444'],
                                        backgroundColor: ['rgba(127, 29, 29, 0.6)', 'rgba(154, 52, 18, 0.6)', 'rgba(127, 29, 29, 0.6)']
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <motion.div 
                                        className="flex items-center justify-center space-x-2 mb-2"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <span className="text-2xl">🚨</span>
                                        <motion.p 
                                            className="text-lg text-white font-mono font-bold tracking-wide uppercase"
                                            animate={{ 
                                                textShadow: [
                                                    "0 0 10px #ffffff",
                                                    "0 0 20px #ffffff", 
                                                    "0 0 10px #ffffff"
                                                ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            RSVP MANDATORY
                                        </motion.p>
                                        <span className="text-2xl">🎫</span>
                                    </motion.div>
                                    <motion.p 
                                        className="text-sm text-red-100 font-mono text-center"
                                        animate={{ opacity: [0.8, 1, 0.8] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        Registration required before party attendance
                                    </motion.p>
                                    <motion.p 
                                        className="text-xs text-orange-200 font-mono text-center mt-1"
                                        animate={{ opacity: [0.7, 1, 0.7] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    >
                                        Limited capacity • No walk-ins • Secure your spot now!
                                    </motion.p>
                                </motion.div>
                                
                                <motion.p 
                                    className="text-base text-yellow-300 font-mono font-bold tracking-wide uppercase"
                                    animate={{ 
                                        textShadow: [
                                            "0 0 8px #fbbf24",
                                            "0 0 16px #fbbf24", 
                                            "0 0 8px #fbbf24"
                                        ],
                                        opacity: [0.8, 1, 0.8]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    🎪 Be Creative & Have Fun! 🎪
                                </motion.p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Splash;