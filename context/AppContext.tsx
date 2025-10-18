
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { database } from '../services/firebase';
import { RSVP, Booking, Session, Station, AppContextType, TubeLine } from '../types';
import { STATIONS, SESSIONS, TUBE_LINE_COLORS } from '../constants';

// Helper to load a value from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage`, error);
    return defaultValue;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allRsvps, setAllRsvps] = useState<Record<string, RSVP>>({});
  const [allBookings, setAllBookings] = useState<Record<string, Booking>>({});
  const [userRsvp, setUserRsvp] = useState<RSVP | undefined>(() => loadFromStorage('userRsvp', undefined));

  // Effect to synchronize data from Firebase
  useEffect(() => {
    const rsvpsRef = ref(database, 'rsvps');
    const bookingsRef = ref(database, 'bookings');

    const rsvpListener = onValue(rsvpsRef, (snapshot) => {
      setAllRsvps(snapshot.val() || {});
    });

    const bookingListener = onValue(bookingsRef, (snapshot) => {
      setAllBookings(snapshot.val() || {});
    });

    return () => {
      rsvpListener();
      bookingListener();
    };
  }, []);

  // Effect to persist userRsvp to localStorage for session continuity
  useEffect(() => {
    if (userRsvp) {
      localStorage.setItem('userRsvp', JSON.stringify(userRsvp));
    } else {
      localStorage.removeItem('userRsvp');
    }
  }, [userRsvp]);

  // Effect to ensure userRsvp is valid against the master list from Firebase
  useEffect(() => {
    if (userRsvp && !allRsvps[userRsvp.id]) {
      setUserRsvp(undefined);
    }
  }, [allRsvps, userRsvp]);


  const addRsvp = async (rsvpData: Omit<RSVP, 'id'>) => {
    const newRsvpRef = push(ref(database, 'rsvps'));
    const newRsvp = { ...rsvpData, id: newRsvpRef.key! };
    await set(newRsvpRef, newRsvp);
    setUserRsvp(newRsvp);
  };

  const updateRsvp = async (updatedRsvp: RSVP) => {
    await set(ref(database, `rsvps/${updatedRsvp.id}`), updatedRsvp);
  };

  const deleteRsvp = async (rsvpId: string) => {
    await remove(ref(database, `rsvps/${rsvpId}`));
    
    const bookingEntry = Object.entries(allBookings).find(([, b]) => b.rsvpId === rsvpId);
    if (bookingEntry) {
      await remove(ref(database, `bookings/${bookingEntry[0]}`));
    }

    if (userRsvp && userRsvp.id === rsvpId) {
      setUserRsvp(undefined);
    }
  };

  const addBooking = async (booking: Booking) => {
    const existingBookingEntry = Object.entries(allBookings).find(([, b]) => b.rsvpId === booking.rsvpId);
    if (existingBookingEntry) {
      await remove(ref(database, `bookings/${existingBookingEntry[0]}`));
    }

    const newBookingRef = push(ref(database, 'bookings'));
    await set(newBookingRef, booking);
  };

  const unassignRsvp = async (rsvpId: string) => {
    const bookingEntry = Object.entries(allBookings).find(([, b]) => b.rsvpId === rsvpId);
    if (bookingEntry) {
      await remove(ref(database, `bookings/${bookingEntry[0]}`));
    }
  };
  
  const userBooking = useMemo(() => {
    if (!userRsvp) return undefined;
    return Object.values(allBookings).find(b => b.rsvpId === userRsvp.id);
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
    allRsvps: Object.values(allRsvps),
    allBookings: Object.values(allBookings),
    stations: STATIONS,
    getStationById,
    getLineColor,
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
