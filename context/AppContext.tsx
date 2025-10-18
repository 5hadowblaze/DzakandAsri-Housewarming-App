import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { database } from '../services/firebase';
import { RSVP, Booking, Session, Station, AppContextType, TubeLine } from '../types';
import { STATIONS, SESSIONS, TUBE_LINE_COLORS } from '../constants';

const AppContext = createContext<AppContextType | undefined>(undefined);

const getUserId = () => {
  let userId = sessionStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}`;
    sessionStorage.setItem('userId', userId);
  }
  return userId;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId] = useState(getUserId());
  const [allRsvps, setAllRsvps] = useState<Record<string, RSVP>>({});
  const [allBookings, setAllBookings] = useState<Record<string, Booking>>({});

  useEffect(() => {
    const rsvpsRef = ref(database, 'rsvps');
    const bookingsRef = ref(database, 'bookings');

    const rsvpListener = onValue(rsvpsRef, (snapshot) => setAllRsvps(snapshot.val() || {}));
    const bookingListener = onValue(bookingsRef, (snapshot) => setAllBookings(snapshot.val() || {}));

    return () => {
      rsvpListener();
      bookingListener();
    };
  }, []);

  const addRsvp = async (rsvpData: Omit<RSVP, 'id'>) => {
    const newRsvp = { ...rsvpData, id: userId };
    await set(ref(database, `rsvps/${userId}`), newRsvp);
  };

  const updateRsvp = async (updatedRsvp: RSVP) => {
    await set(ref(database, `rsvps/${updatedRsvp.id}`), updatedRsvp);
  };

  const deleteRsvp = async (rsvpId: string) => {
    await remove(ref(database, `rsvps/${rsvpId}`));
    const bookingKey = Object.keys(allBookings).find(key => allBookings[key].rsvpId === rsvpId);
    if (bookingKey) {
        await remove(ref(database, `bookings/${bookingKey}`));
    }
  };

  const addBooking = async (booking: Booking) => {
    const existingBookingKey = Object.keys(allBookings).find(key => allBookings[key].rsvpId === booking.rsvpId);
    if (existingBookingKey) {
        await remove(ref(database, `bookings/${existingBookingKey}`));
    }
    const newBookingRef = push(ref(database, 'bookings'));
    await set(newBookingRef, booking);
  };

  const unassignRsvp = async (rsvpId: string) => {
    const bookingKey = Object.keys(allBookings).find(key => allBookings[key].rsvpId === rsvpId);
    if (bookingKey) {
      await remove(ref(database, `bookings/${bookingKey}`));
    }
  };

  const getStationById = useCallback((id: string): Station | undefined => STATIONS.find(s => s.id === id), []);
  const getLineColor = useCallback((line: TubeLine): string => TUBE_LINE_COLORS[line] || '#000000', []);

  const { userRsvp, userBooking } = useMemo(() => {
    const rsvps = Object.values(allRsvps);
    const currentUserRsvp = rsvps.find(r => r.id === userId);
    const bookings = Object.values(allBookings);
    const currentUserBooking = bookings.find(b => b.rsvpId === userId);
    return { userRsvp: currentUserRsvp, userBooking: currentUserBooking };
  }, [allRsvps, allBookings, userId]);

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
