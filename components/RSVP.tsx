import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { STATIONS, FRIEND_GROUPS } from '../constants';
import { motion } from 'framer-motion';
import Confetti from './common/Confetti';

const RsvpForm: React.FC = () => {
    const { addRsvp } = useAppContext();
    const [name, setName] = useState('');
    const [stationId, setStationId] = useState('');
    const [friendGroup, setFriendGroup] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && stationId && friendGroup) {
            await addRsvp({ name, stationId, friendGroup });
            setName('');
            setStationId('');
            setFriendGroup('');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Confetti fire={showConfetti} />
            <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-2xl shadow-lg space-y-4">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-blue-300">Add a Guest</h3>
                </div>
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="mt-1 block w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#003688] focus:border-[#003688]" 
                        placeholder="e.g., Jane Doe" 
                    />
                </div>
                <div>
                    <label htmlFor="station" className="text-sm font-medium text-gray-300">Nearest Station</label>
                    <select 
                        id="station" 
                        value={stationId} 
                        onChange={(e) => setStationId(e.target.value)} 
                        required 
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#003688] focus:border-[#003688]"
                    >
                        <option value="" disabled>Select a station</option>
                        {STATIONS.map(station => (
                            <option key={station.id} value={station.id}>{station.name} ({station.line})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="friend-group" className="text-sm font-medium text-gray-300">Friend Group</label>
                    <select 
                        id="friend-group" 
                        value={friendGroup} 
                        onChange={(e) => setFriendGroup(e.target.value)} 
                        required 
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#003688] focus:border-[#003688]"
                    >
                        <option value="" disabled>Select a group</option>
                        {FRIEND_GROUPS.map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>
                <button 
                    type="submit" 
                    className="w-full py-2 px-4 bg-[#DC241F] text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
                >
                    Add to Guest List
                </button>
            </form>
        </motion.div>
    );
};

export default RsvpForm;
