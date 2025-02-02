export type ServiceType = 'COURSE_CLASSIQUE' | 'COURSE_PREMIUM' | 'COVOITURAGE' | 'TIAK_TIAK';

export type PaymentMethod = 'WAVE' | 'ORANGE_MONEY' | 'CARD' | 'CASH';

export type BookingStatus = 'SEARCHING' | 'DRIVER_FOUND' | 'NO_DRIVER' | 'CANCELLED';

export interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  phone?: string;
  photo?: string;
  vehicle: {
    model: string;
    color: string;
    plate: string;
  };
  location?: {
    lat: number;
    lng: number;
  };
  estimatedArrival?: number; // en minutes
}

export interface Trip {
  id: string;
  service: ServiceType;
  pickup: Location;
  destination: Location;
  distance?: number;
  estimatedPrice?: number;
  estimatedDuration: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED';
  date: Date;
  driver?: {
    id: string;
    name: string;
    rating: number;
    vehicle: {
      model: string;
      plate: string;
    };
  };
}