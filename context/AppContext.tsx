import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
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

// Helper functions for localStorage
const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getFromLocalStorage = (key: string, defaultValue: any = {}) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId] = useState(getUserId());
  const [allRsvps, setAllRsvps] = useState<Record<string, RSVP>>(() => 
    getFromLocalStorage('rsvps', {})
  );
  const [allBookings, setAllBookings] = useState<Record<string, Booking>>(() => 
    getFromLocalStorage('bookings', {})
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage('rsvps', allRsvps);
  }, [allRsvps]);

  useEffect(() => {
    saveToLocalStorage('bookings', allBookings);
  }, [allBookings]);

  const addRsvp = async (rsvpData: Omit<RSVP, 'id'>) => {
    const newRsvp = { ...rsvpData, id: userId };
    setAllRsvps(prev => ({ ...prev, [userId]: newRsvp }));
  };

  const updateRsvp = async (updatedRsvp: RSVP) => {
    setAllRsvps(prev => ({ ...prev, [updatedRsvp.id]: updatedRsvp }));
  };

  const deleteRsvp = async (rsvpId: string) => {
    setAllRsvps(prev => {
      const newRsvps = { ...prev };
      delete newRsvps[rsvpId];
      return newRsvps;
    });
    
    // Also remove associated booking
    setAllBookings(prev => {
      const newBookings = { ...prev };
      const bookingKey = Object.keys(newBookings).find(key => newBookings[key].rsvpId === rsvpId);
      if (bookingKey) {
        delete newBookings[bookingKey];
      }
      return newBookings;
    });
  };

  const addBooking = async (booking: Booking) => {
    setAllBookings(prev => {
      const newBookings = { ...prev };
      
      // Remove existing booking for this RSVP
      const existingBookingKey = Object.keys(newBookings).find(key => newBookings[key].rsvpId === booking.rsvpId);
      if (existingBookingKey) {
        delete newBookings[existingBookingKey];
      }
      
      // Add new booking with unique key
      const bookingKey = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      newBookings[bookingKey] = booking;
      
      return newBookings;
    });
  };

  const unassignRsvp = async (rsvpId: string) => {
    setAllBookings(prev => {
      const newBookings = { ...prev };
      const bookingKey = Object.keys(newBookings).find(key => newBookings[key].rsvpId === rsvpId);
      if (bookingKey) {
        delete newBookings[bookingKey];
      }
      return newBookings;
    });
  };

  const getStationById = useCallback((id: string): Station | undefined => STATIONS.find(s => s.id === id), []);
  const getLineColor = useCallback((line: TubeLine): string => TUBE_LINE_COLORS[line] || '#000000', []);

  const { userRsvp, userBooking } = useMemo(() => {
    const rsvps = Object.values(allRsvps) as RSVP[];
    const currentUserRsvp = rsvps.find(r => r.id === userId);
    const bookings = Object.values(allBookings) as Booking[];
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
    allRsvps: Object.values(allRsvps) as RSVP[],
    allBookings: Object.values(allBookings) as Booking[],
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
