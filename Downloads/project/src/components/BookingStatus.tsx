import React, { useState, useEffect } from 'react';
import { Car, MapPin, Navigation2, Phone, Star, X, Clock, AlertTriangle } from 'lucide-react';
import type { Location, ServiceType, BookingStatus as BookingStatusType } from '../types';
import { MapView } from './Map';
import { CancelBookingModal } from './CancelBookingModal';
import { DriverStatus } from './DriverStatus';

interface BookingStatusProps {
  pickup: Location;
  destination: Location;
  service: ServiceType;
  distance: number;
  price: number;
  onCancel: () => void;
}

export const BookingStatus: React.FC<BookingStatusProps> = ({
  pickup,
  destination,
  service,
  distance,
  price,
  onCancel
}) => {
  const [status, setStatus] = useState<BookingStatusType>('SEARCHING');
  const [searchTime, setSearchTime] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSearchTime(prev => {
        if (prev >= 5) { // Réduit à 5 secondes pour la démo
          setStatus('DRIVER_FOUND');
          clearInterval(interval);
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCancelConfirm = (reason: string) => {
    console.log('Annulation avec raison:', reason);
    setShowCancelModal(false);
    onCancel();
  };

  if (status === 'DRIVER_FOUND') {
    return (
      <DriverStatus
        pickup={pickup}
        destination={destination}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCancelModal(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Recherche de chauffeur
            </h1>
          </div>
        </div>

        {/* Map */}
        <div className="h-[300px] relative">
          <MapView
            pickup={pickup}
            destination={destination}
            className="h-[300px]"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Trip details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Départ</p>
                  <p className="text-sm text-gray-600">{pickup.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Navigation2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Destination</p>
                  <p className="text-sm text-gray-600">{destination.address}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-medium text-gray-900">{distance} km</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Prix</span>
                  <span className="font-medium text-gray-900">{price} FCFA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status content */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin"
                style={{ borderRightColor: 'transparent', animationDuration: '2s' }}
              ></div>
              <Car className="absolute inset-0 m-auto w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-600">Recherche d'un chauffeur à proximité...</p>
          </div>
        </div>

        {/* Cancel button */}
        <div className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full px-6 py-4 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors"
          >
            Annuler la recherche
          </button>
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        hasDriver={false}
      />
    </div>
  );
};