import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { RSVP, Session } from '../types';
import { FRIEND_GROUPS, STATIONS } from '../constants';
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import RsvpForm from './RSVP';
import ConfirmationModal from './common/ConfirmationModal';

// --- Reusable Components ---

const TubeStyledChip: React.FC<{ rsvp: RSVP; onEditClick: () => void; isDragging?: boolean; dragHandleProps?: any }> = ({ rsvp, onEditClick, isDragging, dragHandleProps }) => {
    const { getStationById, getLineColor } = useAppContext();
    const station = getStationById(rsvp.stationId);
    
    return (
        <motion.div
            layoutId={`tube-chip-${rsvp.id}`}
            className={`relative flex items-center space-x-3 p-3 pr-12 bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600 rounded-2xl shadow-lg w-full transition-all duration-200 ${isDragging ? 'opacity-50' : 'hover:from-gray-700 hover:to-gray-600 hover:scale-[1.02] hover:shadow-xl'}`}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div 
                {...dragHandleProps}
                className="flex items-center space-x-3 flex-1 cursor-grab active:cursor-grabbing min-w-0 overflow-hidden"
            >
                {/* Tube line indicator */}
                <div className="w-1.5 h-8 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: station ? getLineColor(station.line) : '#666' }}></div>
                
                {/* Passenger info styled like tube announcements */}
                <div className="overflow-hidden flex-1 min-w-0">
                    <p className="font-mono text-white text-sm font-semibold truncate w-full">{rsvp.name}</p>
                    <div className="flex items-center space-x-1 text-xs overflow-hidden w-full">
                        <span className="text-gray-300 font-mono truncate max-w-[100px] flex-shrink-0">{rsvp.friendGroup}</span>
                        <span className="text-gray-500 flex-shrink-0">•</span>
                        <span className="text-gray-400 font-mono truncate flex-1 min-w-0">{station?.name || 'Unknown'}</span>
                    </div>
                </div>
            </div>
            
            {!isDragging && (
                <motion.button 
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onEditClick();
                    }}
                    className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-blue-600/80 hover:bg-blue-600 text-white z-10 transition-all hover:scale-110 shadow-lg"
                    aria-label="Edit passenger details"
                    style={{ touchAction: 'manipulation' }}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </motion.button>
            )}
        </motion.div>
    );
};

const TubeDraggableChip: React.FC<{ rsvp: RSVP; onEditClick: () => void }> = ({ rsvp, onEditClick }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: rsvp.id });

    return (
        <div ref={setNodeRef} style={{ visibility: isDragging ? 'hidden' : 'visible' }} className="w-full">
            <TubeStyledChip 
                rsvp={rsvp} 
                onEditClick={onEditClick} 
                isDragging={isDragging}
                dragHandleProps={{ ...listeners, ...attributes }}
            />
        </div>
    );
};

const SessionBox: React.FC<{ session: Session; attendees: RSVP[]; onChipClick: (rsvp: RSVP) => void; }> = ({ session, attendees, onChipClick }) => {
    const { setNodeRef, isOver } = useDroppable({ id: session.id });
    const attendeeCount = attendees.length;
    const displayedLimit = 20; // Show 20 as the limit, but allow up to 25
    const actualCapacity = session.capacity; // 25
    
    const isFull = attendeeCount >= actualCapacity;
    const pulseClass = isOver && !isFull ? 'ring-4 ring-offset-2 ring-[#0098D4] ring-offset-gray-900 animate-pulse' : '';
    
    // Tube-style capacity indicator
    const getCapacityLevel = (count: number) => {
        if (count >= 20) return 4; // Red - Full
        if (count >= 15) return 3; // Orange - Very busy
        if (count >= 10) return 2; // Yellow - Busy
        return 1; // Green - Quiet
    };
    
    const capacityLevel = getCapacityLevel(attendeeCount);
    const capacityLabels = ['', 'Quiet', 'Busy', 'Very Busy', 'Full'];
    const capacityColors = ['', 'text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400'];

    return (
        <motion.div
            ref={setNodeRef}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ scale: 1.02 }}
            className={`bg-gray-900 border-2 border-gray-700 rounded-2xl p-4 shadow-lg transition-all duration-300 h-[24rem] flex flex-col ${pulseClass}`}
            style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                borderColor: isOver ? '#0098D4' : '#374151'
            }}
        >
            {/* Tube-style header with LED indicators */}
            <div className="flex flex-col mb-3 bg-black rounded-xl p-3 border border-gray-600">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                        <motion.div 
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-white font-mono text-base sm:text-lg font-bold tracking-wider">{session.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                            <motion.div
                                key={level}
                                className={`w-2 h-2 rounded-full ${
                                    level <= capacityLevel
                                        ? level === 1 ? 'bg-green-400' 
                                          : level === 2 ? 'bg-yellow-400'
                                          : level === 3 ? 'bg-orange-400'
                                          : 'bg-red-400'
                                        : 'bg-gray-600'
                                }`}
                                animate={level <= capacityLevel ? { opacity: [0.8, 1, 0.8] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity, delay: level * 0.2 }}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Digital display style capacity info */}
                <div className="flex justify-between items-center">
                    <motion.span 
                        className={`text-xs font-mono font-bold ${capacityColors[capacityLevel]}`}
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {capacityLabels[capacityLevel].toUpperCase()}
                    </motion.span>
                    <span className="text-white text-xs font-mono bg-gray-800 px-2 py-1 rounded-lg">
                        {attendeeCount}/{displayedLimit}{attendeeCount > displayedLimit ? '+' : ''}
                    </span>
                </div>
            </div>

            {/* Passenger list styled like a train car */}
            <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-3 overflow-y-auto border border-gray-600 min-h-0">
                <div className="space-y-2">
                    <AnimatePresence>
                        {attendees.map((rsvp, index) => (
                            <motion.div
                                key={rsvp.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <TubeDraggableChip rsvp={rsvp} onEditClick={() => onChipClick(rsvp)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {attendees.length === 0 && (
                        <div className="text-center text-gray-400 py-8 font-mono text-sm">
                            <motion.div 
                                className="text-lg mb-2"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                NO GUESTS YET
                            </motion.div>
                            <div className="text-xs">Drag guests here</div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// --- Sub-components ---

const UnassignedGuests: React.FC<{ unassignedRsvps: RSVP[], onChipClick: (rsvp: RSVP) => void }> = ({ unassignedRsvps, onChipClick }) => {
    const { setNodeRef, isOver } = useDroppable({ id: 'unassigned' });
    
    // Calculate dynamic height based on number of guests
    const getLoungeDynamicHeight = (guestCount: number) => {
        if (guestCount === 0) return 'min-h-[8rem]'; // Empty state
        if (guestCount <= 3) return 'min-h-[12rem]'; // 1-3 guests
        if (guestCount <= 6) return 'min-h-[18rem]'; // 4-6 guests
        if (guestCount <= 10) return 'min-h-[24rem]'; // 7-10 guests
        return 'min-h-[30rem] max-h-[35rem]'; // 10+ guests with scroll
    };
    
    const dynamicHeight = getLoungeDynamicHeight(unassignedRsvps.length);
    const shouldScroll = unassignedRsvps.length > 10;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-lg overflow-hidden"
        >
            {/* Tube-style station header */}
            <div className="bg-black border-b border-gray-600 p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <motion.div 
                            className="w-2 h-2 bg-green-400 rounded-full"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-white font-mono text-lg font-bold tracking-wider">WAITING LOUNGE</span>
                    </div>
                    <div className="bg-gray-800 px-2 py-1 rounded-lg">
                        <span className="text-white text-xs font-mono">{unassignedRsvps.length} GUESTS</span>
                    </div>
                </div>
                <motion.div 
                    className="mt-2 text-xs font-mono text-gray-400 uppercase tracking-wide"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    Please stand clear of the closing doors
                </motion.div>
            </div>
            
            {/* Passenger waiting area */}
            <div className="p-4">
                <div 
                    ref={setNodeRef} 
                    className={`${dynamicHeight} ${shouldScroll ? 'overflow-y-auto' : ''} p-3 rounded-xl space-y-2 transition-all duration-300 ease-in-out bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 ${isOver ? 'ring-2 ring-green-400 ring-opacity-50 bg-green-900/20' : ''}`}
                >
                    {unassignedRsvps.map(rsvp => (
                        <TubeDraggableChip key={rsvp.id} rsvp={rsvp} onEditClick={() => onChipClick(rsvp)} />
                    ))}
                    {unassignedRsvps.length === 0 && (
                        <div className="text-center text-gray-400 py-6 font-mono text-sm">
                            <motion.div 
                                className="text-lg mb-2"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                PLATFORM CLEAR
                            </motion.div>
                            <div className="text-xs">Drag new guests here</div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const EditModal: React.FC<{ isOpen: boolean; onClose: () => void; rsvp: RSVP | null; onSave: (rsvp: RSVP) => void; onDelete: (rsvpId: string) => void; }> = ({ isOpen, onClose, rsvp, onSave, onDelete }) => {
    const [formState, setFormState] = useState<Omit<RSVP, 'id'>>({ name: '', email: '', stationId: '', friendGroup: '' });
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        if (rsvp) {
            setFormState({ name: rsvp.name, email: rsvp.email || '', stationId: rsvp.stationId, friendGroup: rsvp.friendGroup });
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
    
    const handleDeleteConfirm = () => {
        onDelete(rsvp.id);
        setDeleteConfirmOpen(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                    {/* Tube-style header */}
                    <div className="bg-black border-b border-gray-600 p-4">
                        <div className="flex items-center space-x-2">
                            <motion.div 
                                className="w-2 h-2 bg-blue-400 rounded-full"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-white font-mono text-lg font-bold tracking-wider">YOUR DETAILS</span>
                        </div>
                        <motion.div 
                            className="mt-1 text-xs font-mono text-gray-400 uppercase tracking-wide truncate"
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            Editing: {rsvp.name}
                        </motion.div>
                    </div>

                    {/* Form content */}
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-mono font-medium text-gray-300 mb-2 uppercase tracking-wide">Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formState.name} 
                                onChange={handleChange} 
                                className="w-full px-3 py-2 text-sm bg-black border border-gray-600 rounded-xl shadow-sm placeholder-gray-500 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                                placeholder="Enter your name..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-mono font-medium text-gray-300 mb-2 uppercase tracking-wide">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formState.email} 
                                onChange={handleChange} 
                                className="w-full px-3 py-2 text-sm bg-black border border-gray-600 rounded-xl shadow-sm placeholder-gray-500 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-mono font-medium text-gray-300 mb-2 uppercase tracking-wide">Station</label>
                            <select 
                                name="stationId" 
                                value={formState.stationId} 
                                onChange={handleChange} 
                                className="w-full px-3 py-2 text-sm bg-black border border-gray-600 rounded-xl shadow-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                            >
                                {STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-mono font-medium text-gray-300 mb-2 uppercase tracking-wide">Friend Group</label>
                            <select 
                                name="friendGroup" 
                                value={formState.friendGroup} 
                                onChange={handleChange} 
                                className="w-full px-3 py-2 text-sm bg-black border border-gray-600 rounded-xl shadow-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                            >
                                {FRIEND_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="bg-gray-900 border-t border-gray-600 p-4">
                        <div className="flex justify-between items-center">
                            <motion.button 
                                onClick={() => setDeleteConfirmOpen(true)} 
                                className="px-4 py-2 text-sm font-mono font-semibold text-red-300 bg-red-900/50 border border-red-700 rounded-xl hover:bg-red-900 hover:text-red-100 transition-colors uppercase tracking-wide"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Remove Guest
                            </motion.button>
                            <div className="space-x-2">
                                <motion.button 
                                    onClick={onClose} 
                                    className="px-4 py-2 text-sm font-mono font-semibold text-gray-300 bg-gray-700 border border-gray-600 rounded-xl hover:bg-gray-600 hover:text-white transition-colors uppercase tracking-wide"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button 
                                    onClick={handleSave} 
                                    className="px-4 py-2 text-sm font-mono font-semibold text-white bg-blue-600 border border-blue-500 rounded-xl hover:bg-blue-500 transition-colors uppercase tracking-wide"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Save Changes
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <ConfirmationModal
                    isOpen={isDeleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Confirm Deletion"
                    message={`Are you sure you want to remove ${rsvp.name} from the guest list? This action cannot be undone.`}
                />
            </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Main Plan Component ---

const Plan: React.FC = () => {
    const { sessions, allRsvps, allBookings, addBooking, unassignRsvp, updateRsvp, deleteRsvp } = useAppContext();
    const [activeDragRsvp, setActiveDragRsvp] = useState<RSVP | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRsvp, setEditingRsvp] = useState<RSVP | null>(null);
    
    // Move confirmation modal state
    const [isMoveConfirmOpen, setMoveConfirmOpen] = useState(false);
    const [pendingMove, setPendingMove] = useState<{
        rsvpId: string;
        fromSessionId?: string;
        toSessionId: string;
        rsvpName: string;
        fromTime?: string;
        toTime: string;
    } | null>(null);

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
        const rsvp = allRsvps.find(r => r.id === rsvpId);
        
        if (!rsvp) return;
        
        if (over.id === 'unassigned') {
            // Find current session to show confirmation
            const currentBooking = allBookings.find(b => b.rsvpId === rsvpId);
            const currentSession = currentBooking ? sessions.find(s => s.id === currentBooking.sessionId) : null;
            
            setPendingMove({
                rsvpId,
                fromSessionId: currentSession?.id,
                toSessionId: 'unassigned',
                rsvpName: rsvp.name,
                fromTime: currentSession?.time,
                toTime: 'Unassigned'
            });
            setMoveConfirmOpen(true);
            return;
        }

        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            const attendees = bookingsBySession[session.id] || [];
            if (attendees.length >= session.capacity) {
                // Tube-style announcement for full carriage
                const announcement = `🚇 ANNOUNCEMENT: This time slot (${session.time}) is now full. Please try another time slot!`;
                alert(announcement);
                return;
            }
            
            // Find current session to show confirmation
            const currentBooking = allBookings.find(b => b.rsvpId === rsvpId);
            const currentSession = currentBooking ? sessions.find(s => s.id === currentBooking.sessionId) : null;
            
            // If it's the same session, no need to confirm
            if (currentSession?.id === sessionId) {
                return;
            }
            
            setPendingMove({
                rsvpId,
                fromSessionId: currentSession?.id,
                toSessionId: sessionId,
                rsvpName: rsvp.name,
                fromTime: currentSession?.time,
                toTime: session.time
            });
            setMoveConfirmOpen(true);
        }
    };

    const handleMoveConfirm = async () => {
        if (!pendingMove) return;
        
        if (pendingMove.toSessionId === 'unassigned') {
            await unassignRsvp(pendingMove.rsvpId);
        } else {
            await addBooking({ rsvpId: pendingMove.rsvpId, sessionId: pendingMove.toSessionId });
        }
        
        setMoveConfirmOpen(false);
        setPendingMove(null);
    };

    const handleMoveCancel = () => {
        setMoveConfirmOpen(false);
        setPendingMove(null);
    };
    
    const handleEditClick = (rsvp: RSVP) => {
        setEditingRsvp(rsvp);
        setIsModalOpen(true);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* Tube-style main container */}
            <div className="min-h-screen bg-gray-900">
                {/* Transport for London style header */}
                <div className="bg-gray-800 border-b-2 border-gray-700 shadow-2xl rounded-b-3xl">
                    <div className="container mx-auto px-6 py-8">
                        <motion.div 
                            initial={{opacity: 0, y: -30}} 
                            animate={{opacity: 1, y: 0}} 
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center"
                        >
                            {/* Custom Flat PPR Logo */}
                            <div className="flex items-center justify-center mb-6">
                                <motion.div 
                                    className="relative"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                                >
                                    <motion.div
                                        className="w-48 h-48 flex items-center justify-center cursor-pointer p-8 relative"
                                        initial={{ scale: 1, rotate: 0 }}
                                        whileHover={{ 
                                            scale: 1.15,
                                            rotate: [0, -5, 5, -5, 5, 0],
                                            filter: "brightness(1.2)"
                                        }}
                                        whileTap={{
                                            scale: [1, 0.8, 1.3, 1],
                                            rotate: [0, 180, 360],
                                            filter: [
                                                "brightness(1) hue-rotate(0deg)",
                                                "brightness(1.5) hue-rotate(90deg)",
                                                "brightness(1.8) hue-rotate(180deg)",
                                                "brightness(1.2) hue-rotate(0deg)"
                                            ]
                                        }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 400, 
                                            damping: 20,
                                            rotate: {
                                                duration: 0.6,
                                                ease: "easeInOut"
                                            },
                                            scale: {
                                                duration: 0.8,
                                                ease: "easeInOut"
                                            },
                                            filter: {
                                                duration: 0.8,
                                                ease: "easeInOut"
                                            }
                                        }}
                                    >
                                        {/* Invisible clickable overlay to ensure entire area is clickable */}
                                        <div className="absolute inset-0 z-10" />
                                        
                                        <img 
                                            src="/flat-ppr-logo.svg" 
                                            alt="Flat PPR Asri & Dzak" 
                                            className="w-32 h-32 object-contain filter drop-shadow-xl pointer-events-none relative z-0"
                                        />
                                    </motion.div>
                                    
                                    {/* Subtle glow effect around the logo */}
                                    <motion.div
                                        className="absolute top-8 left-8 w-32 h-32 rounded-full"
                                        animate={{
                                            boxShadow: [
                                                "0 0 0px rgba(59, 130, 246, 0)",
                                                "0 0 30px rgba(59, 130, 246, 0.3)",
                                                "0 0 0px rgba(59, 130, 246, 0)"
                                            ]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    
                                    {/* Dynamic red pulse effect on hover */}
                                    <motion.div
                                        className="absolute top-8 left-8 w-32 h-32 rounded-full pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        whileHover={{
                                            opacity: [0, 1, 0],
                                            scale: [1, 1.3, 1],
                                            boxShadow: [
                                                "0 0 0px rgba(239, 68, 68, 0)",
                                                "0 0 40px rgba(239, 68, 68, 0.6)",
                                                "0 0 0px rgba(239, 68, 68, 0)"
                                            ]
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    
                                    {/* London Underground themed click effects */}
                                    <motion.div
                                        className="absolute top-8 left-8 w-32 h-32 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        whileTap={{
                                            opacity: [0, 1, 0.8, 0]
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {/* Central District line circle */}
                                        <motion.div
                                            className="absolute inset-0 border-4 border-red-600 rounded-full"
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileTap={{
                                                scale: [0, 1.2, 1.8],
                                                opacity: [0, 1, 0],
                                                borderColor: ["#dc2626", "#1d4ed8", "#059669", "#dc2626"]
                                            }}
                                            transition={{
                                                duration: 1,
                                                ease: "easeOut"
                                            }}
                                        />
                                        
                                        {/* Piccadilly line outer ring */}
                                        <motion.div
                                            className="absolute inset-0 border-2 border-blue-600 rounded-full"
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileTap={{
                                                scale: [0, 1.5, 2.2],
                                                opacity: [0, 0.8, 0],
                                                borderColor: ["#1d4ed8", "#7c3aed", "#059669", "#1d4ed8"]
                                            }}
                                            transition={{
                                                duration: 1.2,
                                                ease: "easeOut",
                                                delay: 0.1
                                            }}
                                        />
                                        
                                        {/* Metropolitan line flash */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"
                                            initial={{ opacity: 0, rotate: 0 }}
                                            whileTap={{
                                                opacity: [0, 0.6, 0],
                                                rotate: [0, 360],
                                                background: [
                                                    "linear-gradient(0deg, transparent, rgba(168, 85, 247, 0.6), transparent)",
                                                    "linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.6), transparent)",
                                                    "linear-gradient(180deg, transparent, rgba(239, 68, 68, 0.6), transparent)",
                                                    "linear-gradient(270deg, transparent, rgba(29, 78, 216, 0.6), transparent)"
                                                ]
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Main title with enhanced animations */}
                            <motion.div 
                                className="mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white tracking-wider uppercase mb-2 text-center">
                                    <motion.span
                                        animate={{ 
                                            textShadow: [
                                                "0 0 10px #3b82f6",
                                                "0 0 20px #3b82f6",
                                                "0 0 10px #3b82f6"
                                            ]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        RSVP & Book Your Spot
                                    </motion.span>
                                </h1>
                                <motion.p 
                                    className="text-sm sm:text-base lg:text-lg text-gray-300 font-mono tracking-wide text-center px-4"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    CHOOSE YOUR TIME SLOT FOR THE PARTY
                                </motion.p>
                            </motion.div>
                            
                            {/* Enhanced service information panel */}
                            <motion.div 
                                className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-6 max-w-5xl mx-auto shadow-xl"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                {/* Scrolling LED text */}
                                <div className="overflow-hidden mb-4">
                                    <motion.div
                                        className="flex space-x-8 text-yellow-300 font-mono font-semibold text-lg"
                                        animate={{ x: [0, -100] }}
                                        transition={{ 
                                            duration: 8, 
                                            repeat: Infinity, 
                                            ease: "linear" 
                                        }}
                                    >
                                        <span className="whitespace-nowrap">► LIVE SERVICE UPDATES</span>
                                        <span className="whitespace-nowrap">► REAL-TIME GUEST TRACKING</span>
                                        <span className="whitespace-nowrap">► AUTOMATED TIME SLOT BOOKING</span>
                                        <span className="whitespace-nowrap">► CROSS-DEVICE SYNCHRONIZATION</span>
                                    </motion.div>
                                </div>
                                
                                {/* Instructions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm font-mono">
                                    <div className="bg-black/40 rounded-xl p-4 border border-gray-600">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-green-300 font-bold">STEP 1</span>
                                        </div>
                                        <p className="text-gray-300">Fill in your name and details below</p>
                                    </div>
                                    
                                    <div className="bg-black/40 rounded-xl p-4 border border-gray-600">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="text-blue-300 font-bold">STEP 2</span>
                                        </div>
                                        <p className="text-gray-300">Drag your name to pick a time slot</p>
                                    </div>
                                    
                                    <div className="bg-black/40 rounded-xl p-4 border border-gray-600">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                            <span className="text-yellow-300 font-bold">STEP 3</span>
                                        </div>
                                        <p className="text-gray-300">Click the edit icon to change details anytime</p>
                                    </div>
                                </div>

                                {/* Important warning */}
                                <motion.div 
                                    className="mt-6 bg-red-900/30 border-2 border-red-500 rounded-2xl p-4"
                                    animate={{ 
                                        borderColor: ["#ef4444", "#dc2626", "#ef4444"],
                                        boxShadow: [
                                            "0 0 0 rgba(239, 68, 68, 0)",
                                            "0 0 20px rgba(239, 68, 68, 0.3)",
                                            "0 0 0 rgba(239, 68, 68, 0)"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <motion.div 
                                            className="text-2xl"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        >
                                            ⚠️
                                        </motion.div>
                                        <div>
                                            <p className="text-red-300 font-mono font-bold text-sm mb-1">
                                                SHARED NETWORK - HANDLE WITH CARE
                                            </p>
                                            <p className="text-red-200 font-mono text-xs">
                                                All changes sync instantly across devices. Please be mindful when moving other passengers to avoid disrupting their arrangements.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                {/* Status indicators */}
                                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mt-4 text-xs text-gray-400 font-mono">
                                    <motion.div 
                                        className="flex items-center space-x-2"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-center sm:text-left">Good service on all lines</span>
                                    </motion.div>
                                    <span className="hidden sm:block">•</span>
                                    <motion.div 
                                        className="flex items-center space-x-2"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                    >
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-center sm:text-left">Real-time updates every 30 seconds</span>
                                    </motion.div>
                                    <span className="hidden sm:block">•</span>
                                    <motion.div 
                                        className="flex items-center space-x-2"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                                    >
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                        <span className="text-center sm:text-left">Network operational</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Main content area */}
                <div className="container mx-auto px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 max-w-full lg:items-start">
                        {/* Left sidebar - Station entrance */}
                        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                            <RsvpForm />
                            <UnassignedGuests unassignedRsvps={unassignedRsvps} onChipClick={handleEditClick} />
                        </div>

                        {/* Right side - Time slots */}
                        <motion.div
                            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                        >
                            {sessions.map(session => (
                                <SessionBox
                                    key={session.id}
                                    session={session}
                                    attendees={bookingsBySession[session.id] || []}
                                    onChipClick={handleEditClick}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeDragRsvp ? (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0.8 }}
                        animate={{ scale: 1.05, opacity: 1, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)' }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="rounded-lg"
                    >
                        <TubeStyledChip rsvp={activeDragRsvp} onEditClick={() => {}} isDragging dragHandleProps={{}} />
                    </motion.div>
                ) : null}
            </DragOverlay>

            <EditModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                rsvp={editingRsvp}
                onSave={updateRsvp}
                onDelete={deleteRsvp}
            />

            {/* Move Confirmation Modal */}
            <ConfirmationModal
                isOpen={isMoveConfirmOpen}
                onClose={handleMoveCancel}
                onConfirm={handleMoveConfirm}
                title="🚇 Confirm Passenger Transfer"
                message={
                    pendingMove ? (
                        pendingMove.fromTime && pendingMove.toTime !== 'Unassigned' ? (
                            `Are you sure you want to move ${pendingMove.rsvpName} from ${pendingMove.fromTime} to ${pendingMove.toTime}?\n\nThis transfer cannot be undone. Please ensure the passenger is available at the new time slot.`
                        ) : pendingMove.toTime === 'Unassigned' ? (
                            `Are you sure you want to remove ${pendingMove.rsvpName} from ${pendingMove.fromTime} and move them to the unassigned list?\n\nThey will need to be reassigned to a time slot later.`
                        ) : (
                            `Are you sure you want to assign ${pendingMove.rsvpName} to ${pendingMove.toTime}?\n\nPlease confirm the passenger is available at this time.`
                        )
                    ) : ''
                }
                confirmText="Confirm Transfer"
                confirmColor="blue"
            />
        </DndContext>
    );
};

export default Plan;
