// Fix: Provide full implementation for types.ts
export enum TubeLine {
  BAKERLOO = 'Bakerloo',
  CENTRAL = 'Central',
  CIRCLE = 'Circle',
  DISTRICT = 'District',
  HAMMERSMITH_CITY = 'Hammersmith & City',
  JUBILEE = 'Jubilee',
  METROPOLITAN = 'Metropolitan',
  NORTHERN = 'Northern',
  PICCADILLY = 'Piccadilly',
  VICTORIA = 'Victoria',
  WATERLOO_CITY = 'Waterloo & City',
  DLR = 'DLR',
  OVERGROUND = 'Overground',
  ELIZABETH = 'Elizabeth',
}

export interface Station {
  id: string;
  name: string;
  line: TubeLine;
}

export interface Session {
  id: string;
  time: string;
  capacity: number;
}

export interface RSVP {
  id: string;
  name: string;
  stationId: string;
  friendGroup: string;
}

export interface Booking {
  rsvpId: string;
  sessionId: string;
}

export type AppTab = 'plan' | 'info' | 'photos';

export interface AppContextType {
  addRsvp: (rsvp: Omit<RSVP, 'id'>) => Promise<void>;
  updateRsvp: (rsvp: RSVP) => Promise<void>;
  deleteRsvp: (rsvpId: string) => Promise<void>;
  addBooking: (booking: Booking) => Promise<void>;
  unassignRsvp: (rsvpId: string) => Promise<void>;
  sessions: Session[];
  allRsvps: RSVP[];
  allBookings: Booking[];
  stations: Station[];
  getStationById: (id: string) => Station | undefined;
  getLineColor: (line: TubeLine) => string;
  // Fix: Add userRsvp and userBooking to the context type
  userRsvp: RSVP | undefined;
  userBooking: Booking | undefined;
}
