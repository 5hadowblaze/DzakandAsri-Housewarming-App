import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { RSVP, Booking, Session, Station, AppContextType, TubeLine } from '../types';
import { STATIONS, SESSIONS, TUBE_LINE_COLORS } from '../constants';
import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';

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
  const [allRsvps, setAllRsvps] = useState<RSVP[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Firebase listeners
  useEffect(() => {
    // Listen to RSVPs
    const rsvpsQuery = query(
      collection(db, 'rsvps'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeRsvps = onSnapshot(rsvpsQuery, (snapshot) => {
      const rsvpsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RSVP[];
      setAllRsvps(rsvpsData);
    }, (error) => {
      console.error('Error loading RSVPs:', error);
    });

    // Listen to Bookings
    const bookingsQuery = query(
      collection(db, 'bookings'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setAllBookings(bookingsData);
    }, (error) => {
      console.error('Error loading bookings:', error);
    });

    return () => {
      unsubscribeRsvps();
      unsubscribeBookings();
    };
  }, []);

  const addRsvp = async (rsvpData: Omit<RSVP, 'id'>) => {
    try {
      await addDoc(collection(db, 'rsvps'), {
        ...rsvpData,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding RSVP:', error);
    }
  };

  const updateRsvp = async (rsvp: RSVP) => {
    try {
      const rsvpRef = doc(db, 'rsvps', rsvp.id);
      await updateDoc(rsvpRef, {
        name: rsvp.name,
        stationId: rsvp.stationId,
        friendGroup: rsvp.friendGroup
      });
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  const deleteRsvp = async (rsvpId: string) => {
    try {
      // Delete RSVP
      await deleteDoc(doc(db, 'rsvps', rsvpId));
      
      // Delete associated bookings
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('rsvpId', '==', rsvpId)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      const deletePromises = bookingsSnapshot.docs.map(booking => 
        deleteDoc(doc(db, 'bookings', booking.id))
      );
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting RSVP:', error);
    }
  };

  const addBooking = async (bookingData: { rsvpId: string; sessionId: string }) => {
    try {
      // Check for existing booking
      const existingBookingsQuery = query(
        collection(db, 'bookings'),
        where('rsvpId', '==', bookingData.rsvpId)
      );
      const existingBookingsSnapshot = await getDocs(existingBookingsQuery);
      
      const batch = writeBatch(db);
      
      // Delete existing bookings in the batch
      existingBookingsSnapshot.docs.forEach(booking => {
        batch.delete(doc(db, 'bookings', booking.id));
      });
      
      // Add new booking in the same batch
      const newBookingRef = doc(collection(db, 'bookings'));
      batch.set(newBookingRef, {
        ...bookingData,
        createdAt: serverTimestamp()
      });
      
      // Commit all changes at once
      await batch.commit();
    } catch (error) {
      console.error('Error adding booking:', error);
    }
  };

  const unassignRsvp = async (rsvpId: string) => {
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('rsvpId', '==', rsvpId)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      const deletePromises = bookingsSnapshot.docs.map(booking => 
        deleteDoc(doc(db, 'bookings', booking.id))
      );
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error unassigning RSVP:', error);
    }
  };

  const getStationById = useCallback((id: string): Station | undefined => STATIONS.find(s => s.id === id), []);
  const getLineColor = useCallback((line: TubeLine): string => TUBE_LINE_COLORS[line] || '#000000', []);

  const { userRsvp, userBooking } = useMemo(() => {
    const currentUserRsvp = allRsvps.find(r => r.id === userId);
    const currentUserBooking = allBookings.find(b => b.rsvpId === userId);
    return { userRsvp: currentUserRsvp, userBooking: currentUserBooking };
  }, [allRsvps, allBookings, userId]);

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
