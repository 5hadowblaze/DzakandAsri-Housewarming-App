
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ref, onValue, set, push, child, remove } from 'firebase/database';
import { database } from '../services/firebase';
import { RSVP, Booking, Session, Station, AppContextType, TubeLine } from '../types';
import { STATIONS, SESSIONS, TUBE_LINE_COLORS } from '../constants';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allRsvps, setAllRsvps] = useState<Record<string, RSVP>>({});
  const [allBookings, setAllBookings] = useState<Record<string, Booking>>({});
  const [userRsvp, setUserRsvp] = useState<RSVP | undefined>(undefined);

  useEffect(() => {
    const rsvpsRef = ref(database, 'rsvps');
    const bookingsRef = ref(database, 'bookings');

    const rsvpListener = onValue(rsvpsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAllRsvps(data);
      }
    });

    const bookingListener = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAllBookings(data);
      }
    });

    return () => {
      rsvpListener();
      bookingListener();
    };
  }, []);

  const addRsvp = async (rsvpData: Omit<RSVP, 'id'>) => {
    const newRsvpRef = push(ref(database, 'rsvps'));
    const newRsvp = { ...rsvpData, id: newRsvpRef.key! };
    await set(newRsvpRef, newRsvp);
    setUserRsvp(newRsvp);
  };

  const updateRsvp = async (updatedRsvp: RSVP) => {
    const rsvpRef = child(ref(database, 'rsvps'), updatedRsvp.id);
    await set(rsvpRef, updatedRsvp);
  };

  const deleteRsvp = async (rsvpId: string) => {
    const rsvpRef = child(ref(database, 'rsvps'), rsvpId);
    await remove(rsvpRef);
    // Also remove any bookings associated with this RSVP
    const bookingToDelete = Object.values(allBookings).find(b => b.rsvpId === rsvpId);
    if (bookingToDelete) {
      const bookingRef = child(ref(database, 'bookings'), (bookingToDelete as any).id);
      await remove(bookingRef);
    }
  };

  const addBooking = async (booking: Booking) => {
    // A user can only have one booking. Remove old one if it exists.
    const existingBooking = Object.values(allBookings).find(b => b.rsvpId === booking.rsvpId);
    if (existingBooking) {
      const bookingRef = child(ref(database, 'bookings'), (existingBooking as any).id);
      await remove(bookingRef);
    }

    const newBookingRef = push(ref(database, 'bookings'));
    await set(newBookingRef, booking);
  };

  const unassignRsvp = async (rsvpId: string) => {
    const bookingToUnassign = Object.values(allBookings).find(b => b.rsvpId === rsvpId);
    if (bookingToUnassign) {
      const bookingRef = child(ref(database, 'bookings'), (bookingToUnassign as any).id);
      await remove(bookingRef);
    }
  };
  
  const userBooking = React.useMemo(() => {
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
