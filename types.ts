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
  email: string;
  stationId: string;
  friendGroup: string;
  createdAt?: any; // Firebase timestamp
}

export interface Booking {
  id: string; // Firebase document ID
  rsvpId: string;
  sessionId: string;
  createdAt?: any; // Firebase timestamp
}

export type AppTab = 'home' | 'plan' | 'info' | 'photos';

export interface AppContextType {
  addRsvp: (rsvp: Omit<RSVP, 'id'>) => Promise<void>;
  updateRsvp: (rsvp: RSVP) => Promise<void>;
  deleteRsvp: (rsvpId: string) => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  unassignRsvp: (rsvpId: string) => Promise<void>;
  sessions: Session[];
  allRsvps: RSVP[];
  allBookings: Booking[];
  stations: Station[];
  getStationById: (id: string) => Station | undefined;
  getLineColor: (line: TubeLine) => string;
  userRsvp: RSVP | undefined;
  userBooking: Booking | undefined;
}
