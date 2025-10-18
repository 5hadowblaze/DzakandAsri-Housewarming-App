// Fix: Provide full implementation for AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { RSVP, Booking, Session, Station, AppContextType, TubeLine } from '../types';
import { STATIONS, SESSIONS, TUBE_LINE_COLORS } from '../constants';

// Load state from localStorage or use initial demo data
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage`, error);
    return defaultValue;
  }
};

const initialRsvps: RSVP[] = [
  { id: 'user-0', name: 'Alex', stationId: 'baker-street', friendGroup: 'Work' },
  { id: 'user-1', name: 'Ben', stationId: 'waterloo', friendGroup: 'Uni' },
  { id: 'user-2', name: 'Charlie', stationId: 'london-bridge', friendGroup: 'Neighbors' },
  { id: 'user-3', name: 'Diana', stationId: 'kings-cross', friendGroup: 'Gym' },
  { id: 'user-4', name: 'Ethan', stationId: 'victoria', friendGroup: 'Childhood friends' },
];

const initialBookings: Booking[] = [
  { rsvpId: 'user-1', sessionId: 's1' },
  { rsvpId: 'user-2', sessionId: 's1' },
  { rsvpId: 'user-3', sessionId: 's2' },
  { rsvpId: 'user-4', sessionId: 's3' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allRsvps, setAllRsvps] = useState<RSVP[]>(() => loadFromStorage('allRsvps', initialRsvps));
  const [allBookings, setAllBookings] = useState<Booking[]>(() => loadFromStorage('allBookings', initialBookings));
  // Fix: Add state for the current user's RSVP, persisted to localStorage
  const [userRsvp, setUserRsvp] = useState<RSVP | undefined>(() => loadFromStorage('userRsvp', undefined));

  useEffect(() => {
    localStorage.setItem('allRsvps', JSON.stringify(allRsvps));
  }, [allRsvps]);

  useEffect(() => {
    localStorage.setItem('allBookings', JSON.stringify(allBookings));
  }, [allBookings]);
  
  // Fix: Persist userRsvp to localStorage
  useEffect(() => {
    if (userRsvp) {
      localStorage.setItem('userRsvp', JSON.stringify(userRsvp));
    } else {
      localStorage.removeItem('userRsvp');
    }
  }, [userRsvp]);

  const addRsvp = async (rsvpData: Omit<RSVP, 'id'>) => {
    const newRsvp: RSVP = { ...rsvpData, id: crypto.randomUUID() };
    setAllRsvps(prev => [...prev, newRsvp]);
    // Fix: Set the new RSVP as the current user's RSVP to support the user-facing RSVP flow
    setUserRsvp(newRsvp);
  };

  const updateRsvp = async (updatedRsvp: RSVP) => {
    setAllRsvps(prev => prev.map(rsvp => rsvp.id === updatedRsvp.id ? updatedRsvp : rsvp));
    // Fix: If the updated RSVP is the user's, update the userRsvp state too
    if (userRsvp && userRsvp.id === updatedRsvp.id) {
      setUserRsvp(updatedRsvp);
    }
  };
  
  const deleteRsvp = async (rsvpId: string) => {
    setAllRsvps(prev => prev.filter(rsvp => rsvp.id !== rsvpId));
    // Also remove any bookings associated with this RSVP
    setAllBookings(prev => prev.filter(booking => booking.rsvpId !== rsvpId));
    // Fix: If the deleted RSVP was the user's, clear the userRsvp state
    if (userRsvp && userRsvp.id === rsvpId) {
      setUserRsvp(undefined);
    }
  };

  const addBooking = async (booking: Booking) => {
    // A user can only have one booking. Remove old one if it exists.
    setAllBookings(prev => {
      const otherBookings = prev.filter(b => b.rsvpId !== booking.rsvpId);
      return [...otherBookings, booking];
    });
  };

  const unassignRsvp = async (rsvpId: string) => {
    setAllBookings(prev => prev.filter(b => b.rsvpId !== rsvpId));
  };

  // Fix: Derive the current user's booking from their RSVP
  const userBooking = useMemo(() => {
    if (!userRsvp) return undefined;
    return allBookings.find(b => b.rsvpId === userRsvp.id);
  }, [userRsvp, allBookings]);


  const getStationById = useCallback((id: string): Station | undefined => {
    return STATIONS.find(s => s.id === id);
  }, []);

  const getLineColor = useCallback((line: TubeLine): string => {
    return TUBE_LINE_COLORS[line] || '#000000';
  }, []);

  const value: AppContextType = {
    addRsvp,
    updateRsvp,
    deleteRsvp,
    addBooking,
    unassignRsvp,
    sessions: SESSIONS,
    allRsvps,
    allBookings,
    stations: STATIONS,
    getStationById,
    getLineColor,
    // Fix: Provide userRsvp and userBooking in the context value
    userRsvp,
    userBooking,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
