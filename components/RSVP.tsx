// Fix: Provide full implementation for RSVP.tsx and integrate Gemini API
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { STATIONS, FRIEND_GROUPS } from '../constants';
import { motion } from 'framer-motion';
import Confetti from './common/Confetti';
import LoadingAnimation from './common/LoadingAnimation';
import { GoogleGenAI, Type } from "@google/genai";

const RSVP: React.FC = () => {
    const { userRsvp, addRsvp, getStationById, getLineColor } = useAppContext();
    const [name, setName] = useState('');
    const [stationId, setStationId] = useState('');
    const [friendGroup, setFriendGroup] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<string | null>(null);

    useEffect(() => {
        if (userRsvp) {
            setName(userRsvp.name);
            setStationId(userRsvp.stationId);
            setFriendGroup(userRsvp.friendGroup);
            setIsSubmitted(true);
        }
    }, [userRsvp]);

    const getCostumeSuggestion = async () => {
        if (!name || !stationId) return;
        setIsLoading(true);
        setSuggestion(null);

        const station = getStationById(stationId);
        if (!station) {
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    costume: {
                        type: Type.STRING,
                        description: "A creative costume idea that puns on the station name and the tube line color/name."
                    },
                    pun: {
                        type: Type.STRING,
                        description: "A short, witty pun related to the costume idea."
                    }
                },
                required: ["costume", "pun"]
            };

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `The theme is London Underground stations. My name is ${name}, my station is ${station.name} on the ${station.line} line. Give me a funny and creative costume suggestion based on this.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                },
            });
            const text = result.text.trim();
            const parsed = JSON.parse(text);
            setSuggestion(`**${parsed.costume}.** ${parsed.pun}`);

        } catch (error) {
            console.error("Error generating costume suggestion:", error);
            setSuggestion("Could not generate a suggestion right now. But I'm sure you'll look great!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && stationId && friendGroup) {
            setIsLoading(true);
            await addRsvp({ name, stationId, friendGroup });
            setTimeout(() => {
                setIsLoading(false);
                setIsSubmitted(true);
            }, 1500); // Simulate network delay
        }
    };
    
    if (isLoading) {
        return <LoadingAnimation />;
    }

    if (isSubmitted && userRsvp) {
        const station = getStationById(userRsvp.stationId);
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-lg mx-auto relative">
                <Confetti fire={isSubmitted} />
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">You're on the list, {userRsvp.name}!</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">We've got you arriving from:</p>
                <div className="inline-flex items-center space-x-3 mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: station ? getLineColor(station.line) : '#ccc' }}></div>
                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{station?.name}</span>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">See you at the party!</p>
                
                 <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-[#003688] dark:text-blue-300">Stuck for a costume idea?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Let our AI assistant help you out.</p>
                    <button onClick={getCostumeSuggestion} disabled={isLoading} className="px-5 py-2 bg-[#DC241F] text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Thinking...' : 'Generate Idea'}
                    </button>
                    {suggestion && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-left">
                           <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{suggestion}</p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#003688] dark:text-blue-300">Party Arrival Manifest</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Let us know you're coming!</p>
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#003688] focus:border-[#003688] sm:text-sm"
                        placeholder="e.g., Jane Doe"
                    />
                </div>
                <div>
                    <label htmlFor="station" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nearest Station</label>
                     <select
                        id="station"
                        value={stationId}
                        onChange={(e) => setStationId(e.target.value)}
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-[#003688] focus:border-[#003688] sm:text-sm rounded-md"
                    >
                        <option value="" disabled>Select your station</option>
                        {STATIONS.map(station => (
                            <option key={station.id} value={station.id}>{station.name} ({station.line})</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="friend-group" className="block text-sm font-medium text-gray-700 dark:text-gray-300">How do we know you?</label>
                     <select
                        id="friend-group"
                        value={friendGroup}
                        onChange={(e) => setFriendGroup(e.target.value)}
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-[#003688] focus:border-[#003688] sm:text-sm rounded-md"
                    >
                        <option value="" disabled>Select a group</option>
                        {FRIEND_GROUPS.map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="w-full py-3 px-4 bg-[#DC241F] text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105">
                    Confirm Attendance
                </button>
            </form>
        </motion.div>
    );
};

export default RSVP;
