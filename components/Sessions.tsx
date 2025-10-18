import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Booking, RSVP, Session } from '../types';
import { FRIEND_GROUPS, FRIEND_GROUP_COLORS } from '../constants';
// Fix: Import DragStartEvent to correctly type the drag start event handler.
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';

const StationPill: React.FC<{ rsvp: RSVP }> = ({ rsvp }) => {
    const { getStationById, getLineColor } = useAppContext();
    const station = getStationById(rsvp.stationId);
    if (!station) return null;
    return (
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getLineColor(station.line) }}></div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{station.name}</p>
        </div>
    );
};

const Chip: React.FC<{ rsvp: RSVP, isDragging?: boolean }> = ({ rsvp, isDragging }) => {
    return (
        <motion.div
            layoutId={`chip-${rsvp.id}`}
            className={`flex items-center space-x-3 p-2 bg-white dark:bg-gray-700 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-500 w-64 ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center font-bold text-[#003688] dark:text-blue-300 text-lg flex-shrink-0">
                {rsvp.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
                <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{rsvp.name}</p>
                <div className="flex items-center space-x-2">
                    <StationPill rsvp={rsvp} />
                    <span className="text-gray-400 text-xs">|</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{rsvp.friendGroup}</p>
                </div>
            </div>
        </motion.div>
    );
};

const DraggableChip: React.FC<{ rsvp: RSVP; }> = ({ rsvp }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: rsvp.id,
        data: rsvp,
    });

    return (
        <div ref={setNodeRef} style={{ opacity: isDragging ? 0 : 1 }} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
            <Chip rsvp={rsvp} />
        </div>
    );
};

const SessionBox: React.FC<{ session: Session; attendees: RSVP[]; assignedGroup: string | undefined; onAssignGroup: (sessionId: string, group: string) => void; }> = ({ session, attendees, assignedGroup, onAssignGroup }) => {
    const { setNodeRef, isOver } = useDroppable({ id: session.id, data: { session } });
    const isFull = attendees.length >= session.capacity;

    const groupColorClasses = assignedGroup ? FRIEND_GROUP_COLORS[assignedGroup] : null;
    const baseClasses = 'backdrop-blur-sm rounded-2xl p-4 shadow-md transition-all duration-300 min-h-[16rem] flex flex-col relative border-2';
    const colorClasses = groupColorClasses
      ? `${groupColorClasses.light} ${groupColorClasses.dark}`
      : 'bg-white/80 dark:bg-gray-800/80 border-transparent';
    const pulseClass = isOver && !isFull ? 'ring-4 ring-offset-2 ring-[#0098D4] ring-offset-gray-100 dark:ring-offset-gray-900 animate-pulse' : '';

    return (
        <motion.div
            ref={setNodeRef}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ scale: 1.03 }}
            className={`${baseClasses} ${colorClasses} ${pulseClass}`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 tracking-tight">{session.time}</h3>
                  <div className="mt-1">
                      <select
                          value={assignedGroup || ""}
                          onChange={(e) => onAssignGroup(session.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs rounded bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-none focus:ring-1 focus:ring-blue-500"
                      >
                          <option value="">All Groups</option>
                          {FRIEND_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                      </select>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${isFull ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {attendees.length} / {session.capacity}
                </span>
            </div>
            <div className="flex-grow bg-gray-200/50 dark:bg-gray-700/50 rounded-lg p-2 space-y-2 overflow-y-auto">
                <AnimatePresence>
                    {attendees.map(rsvp => (
                        <motion.div
                            key={rsvp.id}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center space-x-2 bg-white/70 dark:bg-gray-900/50 p-1.5 rounded-lg shadow-sm"
                        >
                             <div className="w-5 h-5 rounded-full flex-shrink-0" style={{backgroundColor: useAppContext().getLineColor(useAppContext().getStationById(rsvp.stationId)!.line)}}></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{rsvp.name}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};


const Sessions: React.FC = () => {
    const { userRsvp, userBooking, addBooking, sessions, allRsvps, allBookings } = useAppContext();
    const [sessionAssignments, setSessionAssignments] = useState<Record<string, string>>({});
    const [activeDragRsvp, setActiveDragRsvp] = useState<RSVP | null>(null);

    const sensors = useSensors(useSensor(PointerSensor));

    const bookingsBySession = useMemo(() => {
        return sessions.reduce((acc, session) => {
            acc[session.id] = allBookings
                .filter(b => b.sessionId === session.id)
                .map(b => allRsvps.find(r => r.id === b.rsvpId))
                .filter((r): r is RSVP => !!r);
            return acc;
        }, {} as Record<string, RSVP[]>);
    }, [allBookings, allRsvps, sessions]);

    // Fix: Use the correct DragStartEvent type and cast the data.current to RSVP.
    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current) {
            setActiveDragRsvp(event.active.data.current as RSVP);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveDragRsvp(null);
        const { active, over } = event;
        const rsvp = active.data.current as RSVP;

        if (over && rsvp) {
            const session = over.data.current?.session as Session;
            const attendees = bookingsBySession[session.id] || [];
            if (attendees.length >= session.capacity) {
                alert('This session is full!');
                return;
            }
            const assignedGroup = sessionAssignments[session.id];
            if (assignedGroup && rsvp.friendGroup !== assignedGroup) {
                alert(`This slot is reserved for the ${assignedGroup} group.`);
                return;
            }
            const newBooking: Booking = { rsvpId: rsvp.id, sessionId: session.id };
            await addBooking(newBooking);
        }
    };

    if (!userRsvp) {
        return (
            <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-[#DC241F]">Mind the Gap!</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">You need to RSVP before you can book a session. Please head to the RSVP tab first.</p>
                <div className="mt-4 text-5xl">🔒</div>
            </motion.div>
        );
    }
    
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="container mx-auto px-4 py-8">
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#003688] dark:text-blue-300 tracking-tight">Pick Your Arrival Slot</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">Drag your chip to a time slot. You can always move it later if you change your mind.</p>
                </motion.div>

                {!userBooking && (
                     <motion.div layout className="mb-8 p-4 rounded-2xl bg-gray-200/50 dark:bg-gray-700/50">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-center">Your Chip</h3>
                        <div className="flex justify-center">
                            <DraggableChip rsvp={userRsvp} />
                        </div>
                    </motion.div>
                )}
                
                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.05,
                            },
                        },
                    }}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                >
                    {sessions.map(session => (
                        <SessionBox
                            key={session.id}
                            session={session}
                            attendees={bookingsBySession[session.id] || []}
                            assignedGroup={sessionAssignments[session.id]}
                            onAssignGroup={(sessionId, group) => setSessionAssignments(p => ({...p, [sessionId]: group}))}
                        />
                    ))}
                </motion.div>
                 
                {userBooking && (
                    <div className="fixed bottom-5 right-5 sm:bottom-10 sm:right-10 z-50">
                        <DraggableChip rsvp={userRsvp} />
                    </div>
                )}
            </div>
            <DragOverlay>
                {activeDragRsvp ? <Chip rsvp={activeDragRsvp} isDragging /> : null}
            </DragOverlay>
        </DndContext>
    );
};

export default Sessions;