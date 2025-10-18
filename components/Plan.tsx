import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { RSVP, Session, Station } from '../types';
import { FRIEND_GROUPS, STATIONS } from '../constants';
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import RsvpForm from './RSVP';
import ConfirmationModal from './common/ConfirmationModal';

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

const Chip: React.FC<{ rsvp: RSVP; onEdit: () => void; isDragging?: boolean }> = ({ rsvp, onEdit, isDragging }) => (
    <motion.div
        layoutId={`chip-${rsvp.id}`}
        className={`relative flex items-center space-x-3 p-2 pr-4 bg-gray-700 rounded-lg shadow-md w-full ${isDragging ? 'opacity-50' : ''}`}
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
        {!isDragging && (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                }}
                className="absolute top-1/2 right-1 -translate-y-1/2 p-1.5 rounded-full bg-blue-600/70 hover:bg-blue-600 text-white z-10 transition-colors"
                aria-label="Edit RSVP"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
            </button>
        )}
    </motion.div>
);

const DraggableChip: React.FC<{ rsvp: RSVP; onEditClick: () => void }> = ({ rsvp, onEditClick }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: rsvp.id });

    return (
        <div ref={setNodeRef} style={{ visibility: isDragging ? 'hidden' : 'visible' }} className="cursor-grab active:cursor-grabbing w-full">
            <div {...listeners} {...attributes}>
                 <Chip rsvp={rsvp} onEdit={onEditClick} />
            </div>
        </div>
    );
};

const SessionBox: React.FC<{ session: Session; attendees: RSVP[]; onChipClick: (rsvp: RSVP) => void; }> = ({ session, attendees, onChipClick }) => {
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
                        >
                            <DraggableChip rsvp={rsvp} onEditClick={() => onChipClick(rsvp)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// --- Main Plan Component ---

const Plan: React.FC = () => {
    const { sessions, allRsvps, allBookings, addBooking, unassignRsvp, updateRsvp, deleteRsvp } = useAppContext();
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
                    <p className="text-lg text-gray-300 mt-2 max-w-2xl mx-auto">Add new guests, drag them to a slot, or click the edit icon to update their details.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <RsvpForm />
                        <UnassignedGuests unassignedRsvps={unassignedRsvps} onChipClick={handleEditClick} />
                    </div>

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
                                onChipClick={handleEditClick}
                            />
                        ))}
                    </motion.div>
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
                        <Chip rsvp={activeDragRsvp} onEdit={() => {}} isDragging />
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
        </DndContext>
    );
};

// --- Sub-components ---

const UnassignedGuests: React.FC<{ unassignedRsvps: RSVP[], onChipClick: (rsvp: RSVP) => void }> = ({ unassignedRsvps, onChipClick }) => {
    const { setNodeRef, isOver } = useDroppable({ id: 'unassigned' });
    return (
        <div className="p-4 bg-gray-800/50 rounded-2xl shadow-inner">
            <h3 className="text-lg font-bold text-center text-gray-200 mb-4">Lounge ({unassignedRsvps.length})</h3>
            <div ref={setNodeRef} className={`min-h-[8rem] p-2 rounded-lg space-y-3 transition-colors ${isOver ? 'bg-green-900/50' : ''}`}>
                {unassignedRsvps.map(rsvp => (
                    <DraggableChip key={rsvp.id} rsvp={rsvp} onEditClick={() => onChipClick(rsvp)} />
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
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
    
    const handleDeleteConfirm = () => {
        onDelete(rsvp.id);
        setDeleteConfirmOpen(false);
        onClose();
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
                         <button onClick={() => setDeleteConfirmOpen(true)} className="px-4 py-2 text-sm font-semibold text-red-400 bg-red-900/50 rounded-lg hover:bg-red-900">Remove Guest</button>
                         <div className="space-x-2">
                             <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-200 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
                             <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-[#003688] rounded-lg hover:bg-blue-800">Save Changes</button>
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

export default Plan;