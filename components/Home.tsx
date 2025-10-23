import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface HomeProps {
  onNavigate: (tab: 'plan' | 'info' | 'photos' | 'home') => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Event details
  const eventDate = new Date('2025-10-25T11:00:00');
  const eventLocation = "Flat 21, Sporle Court, London, SW11 2EP";
  const eventTitle = "Flat PPR Asri & Dzak's Housewarming Party";

  // Station costume examples
  const stationExamples = [
    { station: "Angel", costume: "Dress as an angel", description: "Wings, halo, white flowing robes", emoji: "👼" },
    { station: "Bank", costume: "Business banker", description: "Suit, briefcase, tie, calculator", emoji: "💼" },
    { station: "King's Cross", costume: "Medieval king", description: "Crown, cape, royal scepter", emoji: "👑" },
    { station: "Arsenal", costume: "Football fan", description: "Arsenal jersey, scarf, football boots", emoji: "⚽" },
    { station: "Tower Hill", costume: "Castle guard", description: "Medieval armor, shield, tower hat", emoji: "🏰" },
    { station: "Shepherd's Bush", costume: "Shepherd or bush", description: "Staff, sheep costume, or leafy outfit", emoji: "🐑" },
    { station: "Oxford Circus", costume: "Circus performer", description: "Colorful outfit, juggling balls, top hat", emoji: "🎪" },
    { station: "Piccadilly Circus", costume: "Ringmaster", description: "Red coat, top hat, circus whip", emoji: "🎩" },
    { station: "Temple", costume: "Ancient priest", description: "Robes, ceremonial items, wisdom", emoji: "⛩️" },
    { station: "Baker Street", costume: "Detective", description: "Deerstalker hat, magnifying glass, pipe", emoji: "🔍" }
  ];

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventTime = eventDate.getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const previewCards = [
    {
      id: 'plan',
      title: 'RSVP',
      description: 'Book your spot at the party',
      icon: '🎫',
      color: 'from-blue-600 to-purple-600',
      borderColor: 'border-blue-500',
      ledColor: '#3b82f6',
      details: 'Choose your preferred time slot'
    },
    {
      id: 'info',
      title: 'Event Details',
      description: 'Location, timing, and essentials',
      icon: 'ℹ️',
      color: 'from-green-600 to-teal-600',
      borderColor: 'border-green-500',
      ledColor: '#10b981',
      details: 'Address, schedule, and what to bring'
    },
    {
      id: 'photos',
      title: 'Photo Archive',
      description: 'Share and view party memories',
      icon: '📸',
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500',
      ledColor: '#8b5cf6',
      details: 'Upload and browse station memories'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-white tracking-wider uppercase mb-4"
          animate={{ 
            textShadow: [
              "0 0 10px #ffffff",
              "0 0 20px #ffffff", 
              "0 0 10px #ffffff"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          You're Invited!
        </motion.h1>
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-gray-300 font-mono tracking-wide px-4"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          FLAT PPR HOUSEWARMING PARTY
        </motion.p>
      </motion.div>

      {/* Papercut Style Animated Host Faces */}
      <motion.div 
        className="flex justify-center items-center space-x-12 mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {/* Amir's Papercut Portrait */}
        <motion.div 
          className="relative"
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 1, 0, -1, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Drop Shadow for Papercut Effect */}
          <motion.div 
            className="absolute inset-0 bg-black/30 rounded-full blur-sm transform translate-x-2 translate-y-2 w-32 h-32 sm:w-40 sm:h-40"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          {/* Circular Container for Image */}
          <div className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-300 shadow-lg">
            {/* Main Portrait Image */}
            <motion.img 
              src="/amir-papercut.png"
              alt="Amir Dzakwan - Papercut Portrait"
              className="w-full h-full object-cover object-center scale-110"
              animate={{ 
                scale: [1.1, 1.15, 1.1],
                filter: [
                  "brightness(1) contrast(1.1)",
                  "brightness(1.05) contrast(1.15)",
                  "brightness(1) contrast(1.1)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                imageRendering: "crisp-edges"
              }}
            />
          </div>
          
          {/* Layered Paper Effect Rings */}
          <motion.div 
            className="absolute inset-0 border-2 border-blue-400/50 rounded-full w-32 h-32 sm:w-40 sm:h-40"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              scale: { duration: 5, repeat: Infinity },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
          />
          
          <motion.div 
            className="absolute inset-2 border border-blue-300/30 rounded-full"
            animate={{ 
              scale: [1.05, 1, 1.05],
              rotate: [0, -360]
            }}
            transition={{ 
              scale: { duration: 4, repeat: Infinity, delay: 1 },
              rotate: { duration: 25, repeat: Infinity, ease: "linear" }
            }}
          />
          
          {/* Floating Papercut Elements */}
          <motion.div
            className="absolute -top-4 -right-3 text-2xl z-20"
            animate={{ 
              rotate: [0, 360],
              y: [0, -5, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              y: { duration: 3, repeat: Infinity },
              scale: { duration: 2, repeat: Infinity, delay: 1 }
            }}
            style={{
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"
            }}
          >
            🎉
          </motion.div>
          
          <motion.div
            className="absolute -bottom-2 -left-3 text-lg z-20"
            animate={{ 
              x: [0, 3, 0],
              rotate: [0, 10, 0],
              y: [0, -2, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              delay: 1,
              ease: "easeInOut"
            }}
            style={{
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"
            }}
          >
            🚇
          </motion.div>
          
          {/* Papercut Name Tag */}
          <motion.div 
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-mono font-bold shadow-lg z-20"
            animate={{ 
              y: [0, -3, 0],
              boxShadow: [
                "0 4px 8px rgba(0,0,0,0.3)",
                "0 6px 12px rgba(0,0,0,0.4)",
                "0 4px 8px rgba(0,0,0,0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            }}
          >
            AMIR DZAKWAN
          </motion.div>
        </motion.div>

        {/* Connector Symbol with Papercut Style */}
        <motion.div
          className="text-4xl font-bold text-yellow-400 font-mono z-10"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0, -5, 0],
            textShadow: [
              "0 0 10px rgba(255, 193, 7, 0.5)",
              "0 0 20px rgba(255, 193, 7, 0.8)",
              "0 0 10px rgba(255, 193, 7, 0.5)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"
          }}
        >
          &
        </motion.div>

        {/* Asri's Papercut Portrait */}
        <motion.div 
          className="relative"
          animate={{ 
            y: [0, -6, 0],
            rotate: [0, -1, 0, 1, 0]
          }}
          transition={{ 
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        >
          {/* Drop Shadow for Papercut Effect */}
          <motion.div 
            className="absolute inset-0 bg-black/30 rounded-full blur-sm transform translate-x-2 translate-y-2 w-32 h-32 sm:w-40 sm:h-40"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
          />
          
          {/* Circular Container for Image */}
          <div className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 border-4 border-purple-300 shadow-lg">
            {/* Main Portrait Image */}
            <motion.img 
              src="/asri-papercut.png"
              alt="Asri - Papercut Portrait"
              className="w-full h-full object-cover object-center scale-110"
              animate={{ 
                scale: [1.1, 1.15, 1.1],
                filter: [
                  "brightness(1) contrast(1.1)",
                  "brightness(1.05) contrast(1.15)",
                  "brightness(1) contrast(1.1)"
                ]
              }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
              style={{
                imageRendering: "crisp-edges"
              }}
            />
          </div>
          
          {/* Layered Paper Effect Rings */}
          <motion.div 
            className="absolute inset-0 border-2 border-purple-400/50 rounded-full w-32 h-32 sm:w-40 sm:h-40"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -360]
            }}
            transition={{ 
              scale: { duration: 5.5, repeat: Infinity },
              rotate: { duration: 22, repeat: Infinity, ease: "linear" }
            }}
          />
          
          <motion.div 
            className="absolute inset-2 border border-purple-300/30 rounded-full"
            animate={{ 
              scale: [1.05, 1, 1.05],
              rotate: [0, 360]
            }}
            transition={{ 
              scale: { duration: 4.5, repeat: Infinity, delay: 0.5 },
              rotate: { duration: 27, repeat: Infinity, ease: "linear" }
            }}
          />
          
          {/* Floating Papercut Elements */}
          <motion.div
            className="absolute -top-4 -left-3 text-2xl z-20"
            animate={{ 
              y: [0, -8, 0],
              x: [0, 2, 0],
              rotate: [0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"
            }}
          >
            🏠
          </motion.div>
          
          <motion.div
            className="absolute -bottom-2 -right-3 text-lg z-20"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              y: [0, -3, 0]
            }}
            transition={{ 
              rotate: { duration: 6, repeat: Infinity, ease: "linear", delay: 2 },
              scale: { duration: 3, repeat: Infinity },
              y: { duration: 2.5, repeat: Infinity, delay: 1 }
            }}
            style={{
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"
            }}
          >
            🎈
          </motion.div>
          
          {/* Papercut Name Tag */}
          <motion.div 
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-mono font-bold shadow-lg z-20"
            animate={{ 
              y: [0, -3, 0],
              boxShadow: [
                "0 4px 8px rgba(0,0,0,0.3)",
                "0 6px 12px rgba(0,0,0,0.4)",
                "0 4px 8px rgba(0,0,0,0.3)"
              ]
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            }}
          >
            ASRI
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Event Information - Separate Big Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Date & Time Box */}
        <motion.div 
          className="bg-gradient-to-b from-green-900 to-green-800 border-2 border-green-500 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="bg-green-600 border-b border-green-400 p-4">
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-3 h-3 bg-green-300 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white font-mono text-lg font-bold tracking-wider">DATE & TIME</span>
            </div>
          </div>
          <div className="p-6 text-center flex-grow flex flex-col">
            <div className="flex-grow">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-2xl sm:text-3xl font-mono font-bold text-white mb-2">
                Saturday
              </h3>
              <p className="text-xl sm:text-2xl font-mono font-bold text-green-300 mb-2">
                25th October 2025
              </p>
              <div className="bg-black/40 rounded-xl p-3 mt-4">
                <p className="text-lg font-mono font-bold text-white">11:00 AM - 9:00 PM</p>
                <p className="text-sm font-mono text-green-300">All-day celebration</p>
              </div>
            </div>
            <div className="mt-4">
              <motion.button
                onClick={() => window.open('https://calendar.app.google/EAMNUyW4zugvZ6Wt8', '_blank')}
                className="bg-green-600 hover:bg-green-500 text-white font-mono font-bold py-2 px-4 rounded-lg border border-green-400 transition-all duration-300 flex items-center justify-center space-x-2 w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm">📆</span>
                <span className="text-xs uppercase tracking-wide">Add to Calendar</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Location Box */}
        <motion.div 
          className="bg-gradient-to-b from-blue-900 to-blue-800 border-2 border-blue-500 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="bg-blue-600 border-b border-blue-400 p-4">
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-3 h-3 bg-blue-300 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white font-mono text-lg font-bold tracking-wider">LOCATION</span>
            </div>
          </div>
          <div className="p-6 text-center flex-grow flex flex-col">
            <div className="flex-grow">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl sm:text-2xl font-mono font-bold text-white mb-2">
                Flat 21, Sporle Court
              </h3>
              <p className="text-lg font-mono text-blue-300 mb-2">
                London, SW11 2EP
              </p>
              <div className="bg-black/40 rounded-xl p-3 mt-4">
                <p className="text-sm font-mono font-bold text-white">Clapham Junction Station</p>
                <p className="text-xs font-mono text-blue-300">Mildmay & Windrush Lines</p>
                <p className="text-xs font-mono text-blue-300">National Rail - Buses</p>
              </div>
            </div>
            <div className="mt-4">
              <motion.button
                onClick={() => window.open('https://maps.app.goo.gl/anbzqejGhtsVEA1cA', '_blank')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold py-2 px-4 rounded-lg border border-blue-400 transition-all duration-300 flex items-center justify-center space-x-2 w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm">🗺️</span>
                <span className="text-xs uppercase tracking-wide">Open Maps</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Theme Box */}
        <motion.div 
          className="bg-gradient-to-b from-yellow-900 to-yellow-800 border-2 border-yellow-500 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="bg-yellow-600 border-b border-yellow-400 p-4">
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-3 h-3 bg-yellow-300 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white font-mono text-lg font-bold tracking-wider">DRESS CODE</span>
            </div>
          </div>
          <div className="p-6 text-center flex-grow flex flex-col">
            <div className="flex-grow">
              <div className="text-5xl mb-4">🚇</div>
              <h3 className="text-xl sm:text-2xl font-mono font-bold text-white mb-2">
                London Underground
              </h3>
              <p className="text-lg font-mono text-yellow-300 mb-2">
                Station Theme Party
              </p>
              <div className="bg-black/40 rounded-xl p-3 mt-4">
                <p className="text-sm font-mono font-bold text-white">Choose Your Station</p>
                <p className="text-xs font-mono text-yellow-300">Dress as the station name!</p>
                <div className="mt-2 text-xs font-mono text-gray-300">
                  <p>👼 Angel → Dress as an angel</p>
                  <p>💼 Bank → Business banker</p>
                  <p>👑 King's Cross → Medieval king</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <motion.button
                onClick={() => setShowThemeModal(true)}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-mono font-bold py-2 px-4 rounded-lg border border-yellow-400 transition-all duration-300 flex items-center justify-center space-x-2 w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm">🎭</span>
                <span className="text-xs uppercase tracking-wide">More Examples</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Countdown Timer - Separate Section */}
      <motion.div 
        className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-black border-b border-gray-600 p-4">
          <div className="flex items-center justify-center space-x-2">
            <motion.div 
              className="w-3 h-3 bg-red-400 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white font-mono text-xl font-bold tracking-wider">COUNTDOWN</span>
            <motion.div 
              className="w-3 h-3 bg-red-400 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl font-mono font-bold text-center text-white mb-6 uppercase tracking-wider">
            Time Until Party
          </h3>
          <div className="grid grid-cols-4 gap-4 sm:gap-6 max-w-lg mx-auto">
            {[
              { value: timeLeft.days, label: 'DAYS' },
              { value: timeLeft.hours, label: 'HRS' },
              { value: timeLeft.minutes, label: 'MIN' },
              { value: timeLeft.seconds, label: 'SEC' }
            ].map((item, index) => (
              <motion.div 
                key={item.label}
                className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
              >
                <motion.div 
                  className="text-2xl sm:text-3xl font-mono font-bold text-white"
                  key={item.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.value.toString().padStart(2, '0')}
                </motion.div>
                <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mt-2">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Navigation Preview Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {previewCards.map((card, index) => (
          <motion.div
            key={card.id}
            className={`bg-gradient-to-b from-gray-900 to-gray-800 border-2 ${card.borderColor} rounded-2xl shadow-lg overflow-hidden cursor-pointer group`}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => onNavigate(card.id as 'plan' | 'info' | 'photos')}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${card.color} p-4`}>
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: card.ledColor }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
                <span className="text-white font-mono text-lg font-bold tracking-wider uppercase">
                  {card.title}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl">{card.icon}</div>
                <div>
                  <h3 className="text-white font-mono font-bold text-lg">{card.description}</h3>
                  <p className="text-gray-400 font-mono text-sm mt-1">{card.details}</p>
                </div>
              </div>

              <motion.div 
                className="flex items-center space-x-2 text-gray-300 group-hover:text-white transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <span className="font-mono text-sm uppercase tracking-wide">Access Platform</span>
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-black border-b border-gray-600 p-4">
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-3 h-3 bg-yellow-400 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white font-mono text-xl font-bold tracking-wider">QUICK ACCESS</span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              onClick={() => onNavigate('plan')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-mono font-bold py-4 px-6 rounded-xl border border-blue-500 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">🎫</span>
                <span>RSVP Now</span>
              </div>
            </motion.button>

            <motion.button
              onClick={() => onNavigate('info')}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-mono font-bold py-4 px-6 rounded-xl border border-green-500 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">📋</span>
                <span>View Details</span>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Theme Modal */}
      {showThemeModal && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowThemeModal(false)}
        >
          <motion.div
            className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-yellow-500 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-yellow-600 border-b border-yellow-400 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-4 h-4 bg-yellow-300 rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <h2 className="text-white font-mono text-2xl font-bold tracking-wider">STATION COSTUME GUIDE</h2>
                </div>
                <button
                  onClick={() => setShowThemeModal(false)}
                  className="text-white hover:text-yellow-200 text-3xl font-bold"
                >
                  ×
                </button>
              </div>
              <p className="text-yellow-100 font-mono mt-2">
                Choose any London Underground station and dress as what that station name represents!
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stationExamples.map((example, index) => (
                  <motion.div
                    key={example.station}
                    className="bg-gray-800 border border-gray-600 rounded-xl p-4 hover:border-yellow-500 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{example.emoji}</div>
                      <div className="flex-1">
                        <h3 className="text-white font-mono font-bold text-lg mb-1">
                          {example.station} Station
                        </h3>
                        <p className="text-yellow-300 font-mono text-sm mb-2">
                          {example.costume}
                        </p>
                        <p className="text-gray-400 font-mono text-xs">
                          {example.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-8 bg-black/40 rounded-xl p-4 border border-gray-600">
                <div className="text-center">
                  <p className="text-white font-mono font-bold mb-2">
                    🎨 Be Creative!
                  </p>
                  <p className="text-gray-300 font-mono text-sm">
                    These are just examples - you can choose ANY station on the London Underground network! 
                    Think creatively about what your chosen station name could represent.
                  </p>
                  <p className="text-yellow-300 font-mono text-xs mt-2">
                    💡 Tip: Check the official TfL map for inspiration!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;