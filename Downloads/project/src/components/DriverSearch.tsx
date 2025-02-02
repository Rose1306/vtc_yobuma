import React, { useState, useEffect } from 'react';
import { Car, MapPin, Navigation2, X } from 'lucide-react';
import type { Location, ServiceType } from '../types';

interface DriverSearchProps {
  pickup: Location;
  destination: Location;
  service: ServiceType;
  onCancel: () => void;
}

const searchMessages = [
  "Recherche d'un chauffeur à proximité...",
  "Forte demande actuellement, temps d'attente estimé: 3-5 minutes",
  "Plusieurs chauffeurs sont en train de recevoir votre demande...",
  "Nous cherchons le meilleur chauffeur pour vous...",
  "Demande importante dans votre zone, veuillez patienter...",
  "Connexion avec les chauffeurs disponibles...",
  "Optimisation de votre demande en cours...",
  "Recherche en cours, merci de votre patience..."
];

export const DriverSearch: React.FC<DriverSearchProps> = ({
  pickup,
  destination,
  service,
  onCancel
}) => {
  const [currentMessage, setCurrentMessage] = useState<string>(searchMessages[0]);
  const [searchTime, setSearchTime] = useState(0);
  const [maxSearchTime] = useState(300); // 5 minutes

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = searchMessages.indexOf(prev);
        return searchMessages[(currentIndex + 1) % searchMessages.length];
      });
    }, 40000); // 40 secondes entre chaque message

    const searchInterval = setInterval(() => {
      setSearchTime(prev => {
        if (prev >= maxSearchTime) {
          clearInterval(searchInterval);
          clearInterval(messageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(searchInterval);
    };
  }, [maxSearchTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
              Recherche de chauffeur
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {formatTime(maxSearchTime - searchTime)}
          </div>
        </div>

        {/* Map */}
        <div className="h-[300px] relative bg-blue-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500"></div>
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-blue-200/20"></div>
              ))}
            </div>
          </div>
          
          {/* Pickup location marker */}
          <div className="absolute left-[30%] top-[40%]">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full absolute inset-0"></div>
          </div>
          
          {/* Destination marker */}
          <div className="absolute right-[30%] bottom-[40%]">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full absolute inset-0"></div>
          </div>
          
          {/* Route visualization */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <path
              d="M 30% 40% C 45% 40%, 55% 60%, 70% 60%"
              stroke="rgb(59 130 246)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          </svg>
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
            </div>
          </div>

          {/* Searching animation */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin"
                style={{ borderRightColor: 'transparent', animationDuration: '2s' }}
              ></div>
              <Car className="absolute inset-0 m-auto w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-600 mb-2">{currentMessage}</p>
            <p className="text-sm text-gray-500">
              Temps de recherche estimé: 3-5 minutes
            </p>
          </div>

          {/* Cancel button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
            <button
              onClick={onCancel}
              className="w-full px-6 py-4 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Annuler la recherche</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};