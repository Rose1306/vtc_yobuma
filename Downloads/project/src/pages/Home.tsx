import React, { useState } from 'react';
import { MapPin, Navigation2, Car, Users, Package, Crown, Clock, ArrowRight, Info, X, Shield, Receipt, Star, Leaf, CreditCard } from 'lucide-react';
import type { ServiceType, Location } from '../types';
import { LocationSelector } from '../components/LocationSelector';
import { BookingStatus } from '../components/BookingStatus';
import { ScheduleRide } from '../components/ScheduleRide';
import { MapView } from '../components/Map';

export const Home: React.FC = () => {
  const [service, setService] = useState<ServiceType>('COURSE_CLASSIQUE');
  const [pickup, setPickup] = useState<Location>({ address: '' });
  const [destination, setDestination] = useState<Location>({ address: '' });
  const [distance, setDistance] = useState<number | null>(null);
  const [showTiakTiakInfo, setShowTiakTiakInfo] = useState(false);
  const [showPremiumInfo, setShowPremiumInfo] = useState(false);
  const [showCovoiturageInfo, setShowCovoiturageInfo] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showAddressError, setShowAddressError] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const services = [
    { 
      id: 'COURSE_CLASSIQUE', 
      icon: Car, 
      label: 'Classique', 
      description: 'Course standard' 
    },
    { 
      id: 'COURSE_PREMIUM', 
      icon: Crown, 
      label: 'Premium', 
      description: 'Service haut de gamme',
      showInfo: true
    },
    { 
      id: 'COVOITURAGE', 
      icon: Users, 
      label: 'Covoiturage', 
      description: 'Écologique et économique',
      showInfo: true
    },
    { 
      id: 'TIAK_TIAK', 
      icon: Package, 
      label: 'Tiak-Tiak', 
      description: 'Livraison rapide',
      showInfo: true
    }
  ];

  const calculateDistance = async () => {
    if (!pickup.lat || !pickup.lng || !destination.lat || !destination.lng) {
      setError('Coordonnées invalides. Veuillez réessayer.');
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const service = new google.maps.DistanceMatrixService();
      const result = await service.getDistanceMatrix({
        origins: [{ lat: pickup.lat, lng: pickup.lng }],
        destinations: [{ lat: destination.lat, lng: destination.lng }],
        travelMode: google.maps.TravelMode.DRIVING,
        region: 'SN',
        unitSystem: google.maps.UnitSystem.METRIC
      });

      if (result.rows[0]?.elements[0]?.status === "OK") {
        const distanceInMeters = result.rows[0].elements[0].distance.value;
        const distanceInKm = distanceInMeters / 1000;
        setDistance(Number(distanceInKm.toFixed(1)));
      } else {
        setError('Impossible de calculer la distance. Veuillez vérifier les adresses.');
      }
    } catch (error) {
      console.error('Erreur lors du calcul de la distance:', error);
      setError('Une erreur est survenue lors du calcul de la distance. Veuillez réessayer.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleBooking = () => {
    if (distance) {
      const price = calculatePrice(distance, service);
      setIsBooking(true);
    }
  };

  const calculatePrice = (km: number, serviceType: ServiceType) => {
    const BASE_PRICE = 700;
    let price = km * BASE_PRICE;

    switch (serviceType) {
      case 'COURSE_PREMIUM':
        price *= 1.5;
        break;
      case 'TIAK_TIAK':
        price *= 0.7;
        break;
      case 'COVOITURAGE':
        price *= 0.8;
        break;
      default:
        break;
    }

    return Math.round(price);
  };

  const handleScheduleClick = () => {
    if (!pickup.address || !destination.address) {
      setShowAddressError(true);
      return;
    }
    setShowAddressError(false);
    setShowScheduler(true);
  };

  const handleScheduleConfirm = (data: { service: ServiceType; date: string; time: string }) => {
    const price = distance ? calculatePrice(distance, data.service) : 0;
    console.log('Course planifiée:', {
      ...data,
      pickup,
      destination,
      distance,
      price
    });
    setShowScheduler(false);
  };

  if (isBooking && distance) {
    return (
      <BookingStatus
        pickup={pickup}
        destination={destination}
        service={service}
        distance={distance}
        price={calculatePrice(distance, service)}
        onCancel={() => setIsBooking(false)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-6">
          Demal foula Neex
        </h1>
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          Voyagez en toute sérénité à travers la ville, quand vous voulez, où vous voulez
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
        {/* Map - Now visible on all screen sizes */}
        <div className="lg:sticky lg:top-24 h-[300px] lg:h-[calc(100vh-6rem)] order-1 lg:order-none">
          <MapView
            pickup={pickup}
            destination={destination}
            className="h-full rounded-3xl shadow-xl"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Réserver votre trajet</h2>
          
          <div className="space-y-6 mb-8">
            <div>
              <LocationSelector
                placeholder="Point de départ"
                value={pickup.address}
                onChange={(address, location) => {
                  setPickup({ address, ...location });
                  setDistance(null);
                  setError(null);
                  setShowAddressError(false);
                }}
                icon={<MapPin />}
              />
            </div>
            
            <div>
              <LocationSelector
                placeholder="Destination"
                value={destination.address}
                onChange={(address, location) => {
                  setDestination({ address, ...location });
                  setDistance(null);
                  setError(null);
                  setShowAddressError(false);
                }}
                icon={<Navigation2 />}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {showAddressError && (
              <div className="text-red-600 text-sm font-medium px-4">
                Veuillez saisir un point de départ et une destination avant de planifier votre course
              </div>
            )}

            {pickup.address && destination.address && !distance && (
              <button
                onClick={calculateDistance}
                disabled={isCalculating}
                className={`w-full py-3 px-4 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors ${
                  isCalculating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isCalculating ? 'Calcul en cours...' : 'Calculer le trajet'}
              </button>
            )}
          </div>

          {distance && (
            <div className="mb-8 p-4 bg-blue-50 rounded-xl">
              <p className="text-gray-600 mb-2">Distance estimée: <span className="font-semibold">{distance} km</span></p>
              <div className="grid grid-cols-2 gap-4">
                {services.map(({ id, icon: Icon, label, description, showInfo }) => {
                  const price = calculatePrice(distance, id as ServiceType);
                  return (
                    <div
                      key={id}
                      className={`service-card relative ${service === id ? 'active' : ''}`}
                    >
                      <div 
                        className="w-full h-full cursor-pointer"
                        onClick={() => setService(id as ServiceType)}
                      >
                        {showInfo && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (id === 'TIAK_TIAK') setShowTiakTiakInfo(true);
                              if (id === 'COURSE_PREMIUM') setShowPremiumInfo(true);
                              if (id === 'COVOITURAGE') setShowCovoiturageInfo(true);
                            }}
                            className="absolute top-2 right-2 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                          >
                            <Info className="w-5 h-5 text-blue-600" />
                          </button>
                        )}
                        <Icon className={`w-8 h-8 mb-3 ${service === id ? 'text-blue-600' : 'text-gray-600'}`} />
                        <div className="text-sm font-semibold mb-1">{label}</div>
                        <div className="text-xs text-gray-500 mb-2">{description}</div>
                        <div className="text-xs font-medium text-blue-600">{price} FCFA</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Planifier pour plus tard</h3>
                  <p className="text-sm text-gray-600">Réservez à l'avance</p>
                </div>
              </div>
              <button 
                onClick={handleScheduleClick}
                className="flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                <span>Choisir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={!distance}
            className={`primary-button ${!distance ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Réserver maintenant
          </button>
        </div>
      </div>

      {/* Premium Info Modal */}
      {showPremiumInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Service Premium</h3>
              <button
                onClick={() => setShowPremiumInfo(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Voyagez avec style et confort dans nos véhicules haut de gamme conduits par nos meilleurs chauffeurs.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Service d'excellence</h4>
                  <p className="text-sm text-gray-600">Chauffeurs expérimentés et professionnels</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Crown className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Véhicules luxueux</h4>
                  <p className="text-sm text-gray-600">Berlines et SUV haut de gamme climatisés</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Avantages exclusifs</h4>
                  <p className="text-sm text-gray-600">Wifi gratuit, bouteilles d'eau et service prioritaire</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPremiumInfo(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {/* Covoiturage Info Modal */}
      {showCovoiturageInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Service Covoiturage</h3>
              <button
                onClick={() => setShowCovoiturageInfo(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Partagez votre trajet avec d'autres voyageurs pour réduire les coûts et l'impact environnemental.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Leaf className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Écologique</h4>
                  <p className="text-sm text-gray-600">Réduisez votre empreinte carbone en partageant votre trajet</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Communauté</h4>
                  <p className="text-sm text-gray-600">Rencontrez des personnes qui partagent votre itinéraire</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Receipt className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Économique</h4>
                  <p className="text-sm text-gray-600">Jusqu'à 40% d'économie sur vos trajets</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCovoiturageInfo(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {/* Tiak-Tiak Info Modal */}
      {showTiakTiakInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Service Tiak-Tiak</h3>
              <button
                onClick={() => setShowTiakTiakInfo(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Vous avez besoin d'un service de livraison fiable, rapide et accessible pour vos colis, repas ou documents ?
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Livraison express</h4>
                  <p className="text-sm text-gray-600">Livraison rapide en moins de 45 minutes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Sécurisé</h4>
                  <p className="text-sm text-gray-600">Suivi en temps réel et assurance incluse</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Receipt className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Tarifs transparents</h4>
                  <p className="text-sm text-gray-600">Prix fixe basé sur la distance</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowTiakTiakInfo(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {/* Schedule Ride Modal */}
      <ScheduleRide
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
        onConfirm={handleScheduleConfirm}
        pickup={pickup}
        destination={destination}
        initialService={service}
        services={services}
      />
    </div>
  );
};