import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Booking, RSVP, Session, Station } from '../types';
import { FRIEND_GROUPS, FRIEND_GROUP_COLORS, STATIONS } from '../constants';
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './common/Confetti';

// --- Reusable Components ---

const StationPill: React.FC<{ rsvp: RSVP }> = ({ rsvp }) => {
    const { getStationById, getLineColor } = useAppContext();
    const station = getStationById(rsvp.stationId);
    if (!station) return null;
    return (
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getLineColor(station.line) }}></div>
            <p className="text-xs text-gray-400 truncate">{station.name}</p>
        </div>
    );
};

const Chip: React.FC<{ rsvp: RSVP, isDragging?: boolean }> = ({ rsvp, isDragging }) => (
    <motion.div
        layoutId={`chip-${rsvp.id}`}
        className={`flex items-center space-x-3 p-2 bg-gray-700 rounded-lg shadow-md w-full ${isDragging ? 'opacity-50' : ''}`}
    >
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center font-bold text-blue-300 text-lg flex-shrink-0">
            {rsvp.name.charAt(0).toUpperCase()}
        </div>
        <div className="overflow-hidden flex-1">
            <p className="font-bold text-gray-200 truncate">{rsvp.name}</p>
            <div className="flex items-center space-x-2">
                <StationPill rsvp={rsvp} />
                <span className="text-gray-400 text-xs">|</span>
                <p className="text-xs text-gray-400 truncate">{rsvp.friendGroup}</p>
            </div>
        </div>
    </motion.div>
);

const DraggableChip: React.FC<{ rsvp: RSVP, onClick: () => void }> = ({ rsvp, onClick }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: rsvp.id });

    return (
        <div ref={setNodeRef} style={{ opacity: isDragging ? 0.3 : 1 }} className="cursor-grab active:cursor-grabbing w-full">
            <div {...listeners} {...attributes} onClick={onClick}>
                 <Chip rsvp={rsvp} />
            </div>
        </div>
    );
};

const SessionBox: React.FC<{ session: Session; attendees: RSVP[]; }> = ({ session, attendees }) => {
    const { setNodeRef, isOver } = useDroppable({ id: session.id });
    const isFull = attendees.length >= session.capacity;
    const pulseClass = isOver && !isFull ? 'ring-4 ring-offset-2 ring-[#0098D4] ring-offset-gray-900 animate-pulse' : '';

    return (
        <motion.div
            ref={setNodeRef}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ scale: 1.02 }}
            className={`bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-md transition-all duration-300 min-h-[16rem] flex flex-col border-2 border-transparent ${pulseClass}`}
        >
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-gray-200 tracking-tight">{session.time}</h3>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${isFull ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {attendees.length} / {session.capacity}
                </span>
            </div>
            <div className="flex-grow bg-gray-700/50 rounded-lg p-2 space-y-2 overflow-y-auto">
                <AnimatePresence>
                    {attendees.map(rsvp => (
                        <motion.div
                            key={rsvp.id}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center space-x-2 bg-gray-900/50 p-1.5 rounded-lg shadow-sm"
                        >
                            <div className="w-5 h-5 rounded-full flex-shrink-0" style={{backgroundColor: useAppContext().getLineColor(useAppContext().getStationById(rsvp.stationId)!.line)}}></div>
                            <span className="text-sm font-medium text-gray-300 truncate">{rsvp.name}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// --- Main Plan Component ---

const Plan: React.FC = () => {
    const { sessions, allRsvps, allBookings, addRsvp, updateRsvp, deleteRsvp, addBooking, unassignRsvp } = useAppContext();
    const [activeDragRsvp, setActiveDragRsvp] = useState<RSVP | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRsvp, setEditingRsvp] = useState<RSVP | null>(null);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const { unassignedRsvps, bookingsBySession } = useMemo(() => {
        const bookedRsvpIds = new Set(allBookings.map(b => b.rsvpId));
        const unassigned = allRsvps.filter(r => !bookedRsvpIds.has(r.id));
        const bySession = sessions.reduce((acc, session) => {
            acc[session.id] = allBookings
                .filter(b => b.sessionId === session.id)
                .map(b => allRsvps.find(r => r.id === b.rsvpId))
                .filter((r): r is RSVP => !!r);
            return acc;
        }, {} as Record<string, RSVP[]>);
        return { unassignedRsvps: unassigned, bookingsBySession: bySession };
    }, [allRsvps, allBookings, sessions]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const rsvp = allRsvps.find(r => r.id === active.id);
        if (rsvp) setActiveDragRsvp(rsvp);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveDragRsvp(null);
        const { active, over } = event;
        if (!over) return;

        const rsvpId = active.id as string;
        const sessionId = over.id as string;
        
        if (over.id === 'unassigned') {
            await unassignRsvp(rsvpId);
            return;
        }

        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            const attendees = bookingsBySession[session.id] || [];
            if (attendees.length >= session.capacity) {
                alert('This session is full!');
                return;
            }
            await addBooking({ rsvpId, sessionId });
        }
    };
    
    const handleEditClick = (rsvp: RSVP) => {
        setEditingRsvp(rsvp);
        setIsModalOpen(true);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="container mx-auto px-4 py-8">
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-blue-300 tracking-tight">Party Planning Board</h2>
                    <p className="text-lg text-gray-300 mt-2 max-w-2xl mx-auto">Add guests and drag them to an arrival slot. Click a guest's chip to edit their details.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left Column: Form & Unassigned --- */}
                    <div className="lg:col-span-1 space-y-8">
                        <RsvpForm />
                        <UnassignedGuests unassignedRsvps={unassignedRsvps} onChipClick={handleEditClick} />
                    </div>

                    {/* --- Right Column: Sessions --- */}
                    <motion.div
                        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                    >
                        {sessions.map(session => (
                            <SessionBox
                                key={session.id}
                                session={session}
                                attendees={bookingsBySession[session.id] || []}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            <DragOverlay>
                {activeDragRsvp ? <Chip rsvp={activeDragRsvp} isDragging /> : null}
            </DragOverlay>

            <EditModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                rsvp={editingRsvp}
                onSave={updateRsvp}
                onDelete={deleteRsvp}
            />
        </DndContext>
    );
};

// --- Sub-components for Plan ---

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
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#003688] focus:border-[#003688]" placeholder="e.g., Jane Doe" />
                </div>
                <div>
                    <label htmlFor="station" className="text-sm font-medium text-gray-300">Nearest Station</label>
                     <select id="station" value={stationId} onChange={(e) => setStationId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#003688] focus:border-[#003688]">
                        <option value="" disabled>Select a station</option>
                        {STATIONS.map(station => (
                            <option key={station.id} value={station.id}>{station.name} ({station.line})</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="friend-group" className="text-sm font-medium text-gray-300">Friend Group</label>
                     <select id="friend-group" value={friendGroup} onChange={(e) => setFriendGroup(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#003688] focus:border-[#003688]">
                        <option value="" disabled>Select a group</option>
                        {FRIEND_GROUPS.map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-[#DC241F] text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-transform transform hover:scale-105">
                    Add to Guest List
                </button>
            </form>
        </motion.div>
    );
};

const UnassignedGuests: React.FC<{ unassignedRsvps: RSVP[], onChipClick: (rsvp: RSVP) => void }> = ({ unassignedRsvps, onChipClick }) => {
    const { setNodeRef, isOver } = useDroppable({ id: 'unassigned' });
    return (
        <div className="p-4 bg-gray-800/50 rounded-2xl shadow-inner">
            <h3 className="text-lg font-bold text-center text-gray-200 mb-4">Unassigned Guests ({unassignedRsvps.length})</h3>
            <div ref={setNodeRef} className={`min-h-[8rem] p-2 rounded-lg space-y-3 transition-colors ${isOver ? 'bg-green-900/50' : ''}`}>
                {unassignedRsvps.map(rsvp => (
                    <DraggableChip key={rsvp.id} rsvp={rsvp} onClick={() => onChipClick(rsvp)} />
                ))}
                {unassignedRsvps.length === 0 && (
                    <div className="text-center text-gray-400 py-4">All guests assigned!</div>
                )}
            </div>
        </div>
    )
};


const EditModal: React.FC<{ isOpen: boolean; onClose: () => void; rsvp: RSVP | null; onSave: (rsvp: RSVP) => void; onDelete: (rsvpId: string) => void; }> = ({ isOpen, onClose, rsvp, onSave, onDelete }) => {
    const [formState, setFormState] = useState<Omit<RSVP, 'id'>>({ name: '', stationId: '', friendGroup: '' });

    useEffect(() => {
        if (rsvp) {
            setFormState({ name: rsvp.name, stationId: rsvp.stationId, friendGroup: rsvp.friendGroup });
        }
    }, [rsvp]);

    if (!isOpen || !rsvp) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        onSave({ ...rsvp, ...formState });
        onClose();
    };
    
    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to remove ${rsvp.name}?`)) {
            onDelete(rsvp.id);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-800 rounded-2xl p-6 shadow-xl w-full max-w-md space-y-4">
                     <h2 className="text-xl font-bold text-gray-200">Edit Guest: {rsvp.name}</h2>
                     <div>
                        <label className="text-sm font-medium text-gray-300">Name</label>
                        <input type="text" name="name" value={formState.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#003688] focus:border-[#003688]" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Station</label>
                        <select name="stationId" value={formState.stationId} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#003688] focus:border-[#003688]">
                            {STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Friend Group</label>
                        <select name="friendGroup" value={formState.friendGroup} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#003688] focus:border-[#003688]">
                            {FRIEND_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                         <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold text-red-400 bg-red-900/50 rounded-lg hover:bg-red-900">Cancel RSVP</button>
                         <div className="space-x-2">
                             <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-200 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
                             <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-[#003688] rounded-lg hover:bg-blue-800">Save Changes</button>
                         </div>
                    </div>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Plan;