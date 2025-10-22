import React from 'react';
import { motion } from 'framer-motion';
import { TUBE_LINE_COLORS } from '../constants';
import { TubeLine } from '../types';

const InfoPill: React.FC<{ text: string; color: string; textColor?: string; icon?: React.ReactNode }> = ({ text, color, textColor = 'white', icon }) => (
    <motion.span 
        className="flex items-center space-x-2 text-sm font-mono font-semibold px-3 py-1 rounded-full shadow-lg border border-gray-300" 
        style={{ backgroundColor: color, color: textColor }}
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ type: "spring", stiffness: 400 }}
    >
        {icon}
        <span>{text}</span>
    </motion.span>
);

const RuleItem: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
    <motion.div 
        className="flex items-start space-x-4 p-4 bg-black/40 rounded-xl border border-gray-600"
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className="text-3xl flex-shrink-0">{icon}</div>
        <div>
            <h4 className="font-mono font-bold text-white uppercase tracking-wide text-sm">{title}</h4>
            <p className="text-gray-300 font-mono text-sm mt-1 leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

const Info: React.FC = () => {

    const generateICS = () => {
        const event = {
            title: "Flat PPR Asri and Dzak's Housewarming Party!",
            description: "Join us for our housewarming party! Food, drinks, and good times.",
            location: "Flat 21, Sporle Court, London, SW11 2EP",
            startTime: "2025-10-25T11:00:00",
            endTime: "2025-10-25T21:00:00",
        };
        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MyHousewarming//EN
BEGIN:VEVENT
UID:${crypto.randomUUID()}@myhousewarming.party
DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}Z
DTSTART;TZID=Europe/London:${event.startTime.replace(/[-:]/g, '')}
DTEND;TZID=Europe/London:${event.endTime.replace(/[-:]/g, '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR
        `.trim();

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'housewarming.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
            {/* Header Section */}
            <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h1 
                    className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white tracking-wider uppercase mb-4"
                    animate={{ 
                        textShadow: [
                            "0 0 10px #3b82f6",
                            "0 0 20px #3b82f6", 
                            "0 0 10px #3b82f6"
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    Service Information
                </motion.h1>
                <motion.p 
                    className="text-sm sm:text-base lg:text-lg text-gray-300 font-mono tracking-wide px-4"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    PASSENGER TRAVEL GUIDE & STATION PROTOCOLS
                </motion.p>
            </motion.div>

            <div className="space-y-8">
                {/* Getting There Section */}
            <motion.div 
                className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {/* Tube-style header */}
                <div className="bg-black border-b border-gray-600 p-4">
                    <div className="flex items-center space-x-2">
                        <motion.div 
                            className="w-2 h-2 bg-green-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-white font-mono text-xl font-bold tracking-wider">NAVIGATION SERVICES</span>
                    </div>
                    <motion.div 
                        className="mt-1 text-xs font-mono text-gray-400 uppercase tracking-wide"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        Route planning and station information
                    </motion.div>
                </div>

                <div className="p-6">
                    <div className="flex items-start space-x-4">
                        <motion.div 
                            className="w-48 h-32 bg-gray-700 rounded-xl flex-shrink-0 relative overflow-hidden border border-gray-600 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <img 
                                src="/sporle-court-photo.jpg" 
                                alt="Dzak and Asri outside Sporle Court - our new home!" 
                                className="w-full h-full object-cover"
                            />
                            {/* Tube-style overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            <motion.div 
                                className="absolute bottom-2 left-2 right-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <span className="text-white font-mono text-xs font-bold tracking-wide uppercase">
                                        Sporle Court
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                        <div>
                            <p className="text-gray-200 font-mono font-medium">Our new place is at <a href="https://maps.app.goo.gl/UiDLcZmz8z5Yyjzt6" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-400 hover:text-blue-300 underline hover:no-underline transition-colors duration-200">Flat 21, Sporle Court, London, SW11 2EP</a>.</p>
                            <p className="mt-2 text-gray-300 font-mono">The nearest major station is:</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <InfoPill text="Clapham Junction" color={TUBE_LINE_COLORS[TubeLine.OVERGROUND]} />
                            </div>
                            <p className="mt-3 text-gray-400 font-mono text-sm italic">
                                Come find the red doors and join us for our housewarming! 🏠🎉
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Platform Services - Redesigned */}
            <motion.div 
                className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="bg-black border-b border-gray-600 p-4">
                    <div className="flex items-center space-x-2">
                        <motion.div 
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-white font-mono text-xl font-bold tracking-wider">PASSENGER INFORMATION</span>
                    </div>
                    <motion.div 
                        className="mt-1 text-xs font-mono text-gray-400 uppercase tracking-wide"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        Essential party details and contact services
                    </motion.div>
                </div>
                
                <div className="p-6">
                    <div className="space-y-4 text-gray-300 font-mono">
                        <p><strong className="text-green-300">What to Bring:</strong></p>
                        <div className="space-y-2 text-gray-300 font-mono text-sm mt-2">
                            <p className="flex items-center space-x-2">
                                <span className="text-green-400">✓</span>
                                <span><strong>Yourself!</strong> That's the most important thing</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <span className="text-green-400">✓</span>
                                <span><strong>Optional:</strong> Food to share or a housewarming gift</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <span className="text-green-400">✓</span>
                                <span><strong>Your Station Costume</strong> - see theme guide below!</span>
                            </p>
                        </div>
                        
                        {/* Theme Section */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/40 to-purple-800/40 border border-purple-600 rounded-xl">
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="text-2xl">🎭</span>
                                <h3 className="text-purple-300 font-mono font-bold text-lg uppercase tracking-wide">Dress Code Theme</h3>
                            </div>
                            <div className="space-y-3">
                                <p className="text-gray-300 font-mono text-sm">
                                    <strong className="text-purple-300">London Underground Station Costume!</strong>
                                </p>
                                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                                    Choose any London Underground station name and dress as what that station represents. Get creative!
                                </p>
                                
                                {/* Example Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                    {[
                                        { station: "Angel", costume: "Angel costume", emoji: "👼" },
                                        { station: "Bank", costume: "Business banker", emoji: "💼" },
                                        { station: "King's Cross", costume: "Medieval king", emoji: "👑" },
                                        { station: "Arsenal", costume: "Football fan", emoji: "⚽" }
                                    ].map((example, i) => (
                                        <motion.div
                                            key={example.station}
                                            className="bg-black/40 border border-purple-500/50 rounded-lg p-3 text-center"
                                            whileHover={{ scale: 1.02, borderColor: "#a855f7" }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <div className="text-xl mb-1">{example.emoji}</div>
                                            <div className="text-purple-200 font-mono font-bold text-xs">{example.station}</div>
                                            <div className="text-gray-400 font-mono text-xs">{example.costume}</div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                <div className="text-center mt-4">
                                    <motion.button
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-mono font-bold rounded-lg text-sm transition-colors duration-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            // Scroll to home page or show more examples
                                            window.open('/', '_blank');
                                        }}
                                    >
                                        See More Examples
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <p><strong className="text-blue-300">Contact & Support:</strong> Need anything?</p>
                            <div className="mt-3 space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-gray-300">Amir Dzakwan:</span>
                                    <motion.a 
                                        href="https://wa.me/60178461844" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors duration-200 text-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>💬</span>
                                        <span>WhatsApp +6017 846 1844</span>
                                    </motion.a>
                                    <span className="text-gray-400">|</span>
                                    <a href="tel:+447570478826" className="text-blue-400 font-bold hover:underline">📞 +44 7570 478826</a>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-gray-300">Asri:</span>
                                    <motion.a 
                                        href="https://wa.me/447551943933" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors duration-200 text-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>�</span>
                                        <span>WhatsApp +44 7551 943933</span>
                                    </motion.a>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border border-yellow-600 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="text-2xl">📶</span>
                                <h3 className="text-yellow-300 font-mono font-bold text-lg uppercase tracking-wide">Onboard Wi-Fi</h3>
                            </div>
                            <div className="space-y-2 text-gray-300 font-mono text-sm">
                                <p><strong className="text-yellow-300">Network:</strong></p>
                                <p className="text-white font-semibold bg-black/40 px-2 py-1 rounded">Flat PPR Housewarming Wifi</p>
                                <p><strong className="text-yellow-300">Password:</strong></p>
                                <p className="text-white font-semibold bg-black/40 px-2 py-1 rounded">mindthegap</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <motion.a 
                            href="https://calendar.app.google/k3RTqCBAzGzg8qxk8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-[#00782A] text-white font-mono font-bold rounded-xl shadow-lg border-2 border-green-600 hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400 uppercase tracking-wide"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Add to Calendar
                        </motion.a>
                    </div>
                </div>
            </motion.div>

            {/* Station Regulations */}
            <motion.div 
                className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                {/* Tube-style header */}
                <div className="bg-black border-b border-gray-600 p-4">
                    <div className="flex items-center space-x-2">
                        <motion.div 
                            className="w-2 h-2 bg-yellow-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-white font-mono text-xl font-bold tracking-wider">STATION REGULATIONS</span>
                    </div>
                    <motion.div 
                        className="mt-1 text-xs font-mono text-gray-400 uppercase tracking-wide"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        Platform safety and passenger conduct guidelines
                    </motion.div>
                </div>

                <div className="p-6">
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        variants={{ 
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                    <RuleItem icon="🚇" title="Mind the Gap (and the Furniture)" description="Have fun, move around, but let’s keep the chairs, tables, and floors in service for the next passenger." />
                    <RuleItem icon="🍰" title="Open Kitchen Policy" description="Feel free to bring anything you want — if you’d like to cook something up or make a dessert, we’re all for it. The more the merrier (and tastier)." />
                    <RuleItem icon="🥂" title="Refill, Recycle, Repeat" description="Top up your drink, label your cup with your name, and chuck empties into the right bin. Sustainability never goes off-peak." />
                    <RuleItem icon="🕺" title="Stay on Track" description="Dance, mingle, vibe — but keep it classy. If the floor starts shaking, that’s your signal to mind the moves." />
                    <RuleItem icon="👟" title="Shoes & Coats" description="Shoes off at the door, please. Coats can go on the coat rack — not on the sofa." />
                    <RuleItem icon="🎶" title="Volume Control" description="Tunes up, drama down. Keep the vibes groovy till 10:30, then we switch to the chill line." />
                    <RuleItem icon="🚭" title="Smoking & Vaping" description="Only on the balcony or outside — this isn’t the steam train era." />
                    <RuleItem icon="🍕" title="Food Service" description="Help yourself, share the snacks, and please don’t treat the sofa like a dining car. Let us know of any dietary needs before digging in." />
                    <RuleItem icon="📸" title="Photo Etiquette" description="Keep in mind that photos will be taken throughout the event. Flash only with consent — not everyone's ready for the front page of the Evening Standard. Also, be mindful of camera equipment and devices around the house — they're not lost property." />
                    <RuleItem icon="🧃" title="Spill Station" description="Try not to spill, but if you do — no worries! Just shout 'spill!' and we'll sort it." />
                    <RuleItem icon="🛋️" title="Restricted Zones" description="Bedrooms and desks are first-class only (for coats, charging phones, and storage)." />
                    <RuleItem icon="🧻" title="Bathroom Bureau" description="Flush properly, keep it dry, and if you finish the roll — restock before your next stop." />
                  </motion.div>
                </div>
              </motion.div>

            {/* House Facts */}
            <motion.div 
                className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                {/* Tube-style header */}
                <div className="bg-black border-b border-gray-600 p-4">
                    <div className="flex items-center space-x-2">
                        <motion.div 
                            className="w-2 h-2 bg-green-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-white font-mono text-xl font-bold tracking-wider">STATION FACTS</span>
                    </div>
                    <motion.div 
                        className="mt-1 text-xs font-mono text-gray-400 uppercase tracking-wide"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        Historical information about our platform
                    </motion.div>
                </div>

                <div className="p-6">
                    <motion.div 
                        className="bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600 rounded-xl p-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="text-3xl">🏠</span>
                            <h3 className="text-green-300 font-mono font-bold text-xl uppercase tracking-wide">The Origin of "Flat PPR"</h3>
                        </div>
                        
                        <div className="space-y-4 text-gray-300 font-mono">
                            <p className="text-lg leading-relaxed">
                                <strong className="text-green-300">Ever wondered why we call this place "Flat PPR"?</strong>
                            </p>
                            
                            <div className="bg-black/40 border-l-4 border-green-500 pl-4 py-3 rounded-r-lg">
                                <p className="text-sm leading-relaxed">
                                    In Malaysia, <strong className="text-white">Flat PPR</strong> refers to a public low-cost housing project called 
                                    <strong className="text-green-300"> Program Perumahan Rakyat</strong> (People's Housing Program). 
                                    It is a government initiative to provide affordable housing, often in the form of flats, 
                                    for low-income earners.
                                </p>
                            </div>
                            
                            <div className="flex items-start space-x-3 bg-gray-800/50 rounded-lg p-4">
                                <span className="text-2xl mt-1">🇲🇾</span>
                                <div>
                                    <p className="text-sm leading-relaxed">
                                        <strong className="text-green-300">Our Connection:</strong> 
                                        While we're far from Malaysia now, the name "Flat PPR" carries a piece of home with us here in London. 
                                        It's a playful nod to our roots and a reminder that home is what you make of it, 
                                        whether it's affordable housing in KL or a cozy flat in Zone 2!
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-center mt-6">
                                <motion.div
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600/20 border border-green-500 rounded-full"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <span className="text-green-400">💡</span>
                                    <span className="text-green-300 font-mono text-sm font-semibold">
                                        From Malaysian Housing Program to London Housewarming!
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            </div>
        </div>
    );
};

export default Info;
