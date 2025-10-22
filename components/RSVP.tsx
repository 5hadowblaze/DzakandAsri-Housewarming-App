import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { STATIONS, FRIEND_GROUPS } from '../constants';
import { motion } from 'framer-motion';
import Confetti from './common/Confetti';

const RsvpForm: React.FC = () => {
    const { addRsvp } = useAppContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [stationId, setStationId] = useState('');
    const [friendGroup, setFriendGroup] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email && stationId && friendGroup) {
            await addRsvp({ name, email, stationId, friendGroup });
            setName('');
            setEmail('');
            setStationId('');
            setFriendGroup('');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    return (
        <>
            <Confetti fire={showConfetti} />
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
            >
                {/* Tube-style header */}
                <div className="bg-black border-b border-gray-600 p-4">
                    <div className="flex items-center space-x-2">
                        <motion.div 
                            className="w-2 h-2 bg-green-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-white font-mono text-lg font-bold tracking-wider">TICKET OFFICE</span>
                    </div>
                    <motion.div 
                        className="mt-1 text-xs font-mono text-gray-400 uppercase tracking-wide"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        New passenger registration
                    </motion.div>
                </div>

                {/* Form content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-mono font-medium text-gray-300 mb-2 uppercase tracking-wide">Full Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            maxLength={15}
                            className="w-full px-3 py-2 text-sm bg-black border border-gray-600 rounded-xl shadow-sm placeholder-gray-500 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors" 
                            placeholder="Enter passenger name..." 
                        />
                        <div className="flex justify-between mt-1">
                            <span className="text-xs font-mono text-gray-500">Max 15 characters</span>
                            <span className={`text-xs font-mono ${name.length > 12 ? 'text-yellow-400' : 'text-gray-500'}`}>
                                {name.length}/15
                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-mono font-medium text-gray-300 mb-2 uppercase tracking-wide">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 text-sm bg-black border border-gray-600 rounded-xl shadow-sm placeholder-gray-500 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors" 
                            placeholder="passenger@london.gov.uk" 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="station" className="block text-sm font-mono font-medium text-gray-300 mb-2 uppercase tracking-wide">Your Station Costume</label>
                        <select 
                            id="station" 
                            value={stationId} 
                            onChange={(e) => setStationId(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 text-sm bg-black border border-gray-600 rounded-xl shadow-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        >
                            <option value="" disabled>Select station</option>
                            {STATIONS.map(station => (
                                <option key={station.id} value={station.id}>{station.name} ({station.line})</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="friend-group" className="block text-sm font-mono font-medium text-gray-300 mb-2 uppercase tracking-wide">Travel Group</label>
                        <select 
                            id="friend-group" 
                            value={friendGroup} 
                            onChange={(e) => setFriendGroup(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 text-sm bg-black border border-gray-600 rounded-xl shadow-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        >
                            <option value="" disabled>Select travel group</option>
                            {FRIEND_GROUPS.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                    
                    <motion.button 
                        type="submit" 
                        className="w-full py-3 px-4 bg-red-600 text-white font-mono font-semibold rounded-xl shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all transform uppercase tracking-wide border border-red-500"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                        🎫 Issue Travel Ticket
                    </motion.button>
                </form>
            </motion.div>
        </>
    );
};

export default RsvpForm;
