import React, { useState, useEffect } from 'react';
import { Car, MapPin, Navigation2, Phone, Star, X, Clock, Shield, MessageSquare } from 'lucide-react';
import type { Location, Driver } from '../types';
import { MapView } from './Map';

interface DriverStatusProps {
  pickup: Location;
  destination: Location;
  onCancel: () => void;
}

export const DriverStatus: React.FC<DriverStatusProps> = ({
  pickup,
  destination,
  onCancel
}) => {
  const [driver, setDriver] = useState<Driver>({
    id: 'driver-1',
    name: 'Moussa Diop',
    rating: 4.8,
    vehicle: {
      model: 'Toyota Corolla',
      color: 'Blanc',
      plate: 'DK-2023-AA'
    },
    location: {
      lat: 14.7167,
      lng: -17.4677
    },
    estimatedArrival: 5
  });

  // Simuler le mouvement du chauffeur
  useEffect(() => {
    const interval = setInterval(() => {
      setDriver(prev => ({
        ...prev,
        estimatedArrival: Math.max(0, (prev.estimatedArrival || 5) - 1),
        location: {
          lat: prev.location?.lat || 14.7167,
          lng: (prev.location?.lng || -17.4677) + 0.0001
        }
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Votre chauffeur arrive
            </h1>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            pickup={pickup}
            destination={destination}
            driverLocation={driver.location}
            className="h-full"
          />
        </div>

        {/* Driver Info Panel */}
        <div className="bg-white border-t border-gray-100 p-4 space-y-4">
          {/* Driver and Vehicle Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-600">
                  {driver.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{driver.rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">{driver.vehicle.model}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">{driver.vehicle.plate}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                <Phone className="w-6 h-6 text-blue-600" />
              </button>
              <button className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </button>
            </div>
          </div>

          {/* ETA and Safety Tips */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Arrivée estimée</p>
                <p className="text-lg font-semibold text-blue-600">
                  {driver.estimatedArrival} min
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Code de sécurité</p>
                <p className="text-lg font-semibold text-gray-900">2580</p>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Point de départ</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};