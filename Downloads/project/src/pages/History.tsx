import React, { useState } from 'react';
import { Car, MapPin, Navigation2, Calendar, Clock, Receipt, X, HelpCircle } from 'lucide-react';
import type { Trip } from '../types';
import { TripHelpModal } from '../components/TripHelpModal';

export const History: React.FC = () => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [helpModalTrip, setHelpModalTrip] = useState<Trip | null>(null);

  // Simulation de données d'historique (à remplacer par des données réelles)
  const trips: Trip[] = [
    {
      id: '1',
      service: 'VTC',
      pickup: { address: 'Médina, Dakar' },
      destination: { address: 'Almadies, Dakar' },
      distance: 8.5,
      estimatedPrice: 5950,
      estimatedDuration: 25,
      status: 'COMPLETED',
      date: new Date('2024-03-15T14:30:00'),
      driver: {
        id: 'driver1',
        name: 'Moussa Diop',
        rating: 4.8,
        vehicle: {
          model: 'Toyota Corolla',
          plate: 'DK-2023-AA'
        }
      }
    },
    {
      id: '2',
      service: 'TIAK_TIAK',
      pickup: { address: 'Ouakam, Dakar' },
      destination: { address: 'Plateau, Dakar' },
      distance: 6.2,
      estimatedPrice: 3038,
      estimatedDuration: 20,
      status: 'COMPLETED',
      date: new Date('2024-03-14T09:15:00'),
      driver: {
        id: 'driver2',
        name: 'Abdou Sow',
        rating: 4.9,
        vehicle: {
          model: 'Renault Logan',
          plate: 'DK-2021-BB'
        }
      }
    }
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Trip['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'Terminé';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'CONFIRMED':
        return 'Confirmé';
      default:
        return 'En attente';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Historique des trajets</h1>
      
      <div className="space-y-6">
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun trajet</h3>
            <p className="text-gray-600">
              Vous n'avez pas encore effectué de trajet avec Yobûma
            </p>
          </div>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{trip.service}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(trip.date)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                  {getStatusText(trip.status)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Départ</p>
                    <p className="text-sm text-gray-600">{trip.pickup.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Navigation2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Destination</p>
                    <p className="text-sm text-gray-600">{trip.destination.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {trip.estimatedDuration} min
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {trip.distance} km
                  </span>
                </div>
                <div className="flex items-center justify-end">
                  <span className="text-sm font-medium text-gray-900">
                    {trip.estimatedPrice} FCFA
                  </span>
                </div>
              </div>

              {trip.driver && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {trip.driver.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {trip.driver.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {trip.driver.vehicle.model} • {trip.driver.vehicle.plate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-gray-900">
                          {trip.driver.rating}
                        </span>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedTrip(trip)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Receipt className="w-4 h-4" />
                          <span className="text-sm font-medium">Reçu</span>
                        </button>
                        <button
                          onClick={() => setHelpModalTrip(trip)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Aide</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal du reçu */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative">
            <button
              onClick={() => setSelectedTrip(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reçu de trajet</h2>
              <p className="text-gray-600">{formatDate(selectedTrip.date)}</p>
            </div>

            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Détails du trajet</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">{selectedTrip.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance</span>
                    <span className="font-medium">{selectedTrip.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-medium">{selectedTrip.estimatedDuration} min</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Itinéraire</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Départ</span>
                    <span className="font-medium">{selectedTrip.pickup.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destination</span>
                    <span className="font-medium">{selectedTrip.destination.address}</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Chauffeur</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom</span>
                    <span className="font-medium">{selectedTrip.driver?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Véhicule</span>
                    <span className="font-medium">{selectedTrip.driver?.vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Immatriculation</span>
                    <span className="font-medium">{selectedTrip.driver?.vehicle.plate}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>{selectedTrip.estimatedPrice} FCFA</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                Imprimer le reçu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'aide */}
      <TripHelpModal
        isOpen={helpModalTrip !== null}
        onClose={() => setHelpModalTrip(null)}
        tripId={helpModalTrip?.id || ''}
        driverName={helpModalTrip?.driver?.name || ''}
      />
    </div>
  );
};