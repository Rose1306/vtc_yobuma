import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import type { Location, ServiceType } from '../types';

interface ScheduleRideProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { service: ServiceType; date: string; time: string }) => void;
  pickup: Location;
  destination: Location;
  initialService: ServiceType;
  services: Array<{
    id: string;
    icon: React.ElementType;
    label: string;
    description: string;
  }>;
}

export const ScheduleRide: React.FC<ScheduleRideProps> = ({
  isOpen,
  onClose,
  onConfirm,
  pickup,
  destination,
  initialService,
  services
}) => {
  const [service, setService] = useState<ServiceType>(initialService);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  if (!isOpen) return null;

  const getMinDateTime = () => {
    const now = new Date();
    const minDate = now.toISOString().split('T')[0];
    now.setHours(now.getHours() + 1);
    const minTime = now.toTimeString().slice(0, 5);
    return { minDate, minTime };
  };

  const { minDate, minTime } = getMinDateTime();

  const handleConfirm = () => {
    let hasError = false;

    if (!date) {
      setDateError(true);
      hasError = true;
    }

    if (!time) {
      setTimeError(true);
      hasError = true;
    }

    if (!hasError) {
      onConfirm({ service, date, time });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Planifier votre course</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">De {pickup.address} à {destination.address}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de service
            </label>
            <div className="grid grid-cols-2 gap-3">
              {services.map(({ id, icon: Icon, label, description }) => (
                <button
                  key={id}
                  onClick={() => setService(id as ServiceType)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    service === id 
                      ? 'border-blue-500 bg-blue-50 shadow-blue-100' 
                      : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${service === id ? 'text-blue-600' : 'text-gray-600'}`} />
                  <div className="text-sm font-medium text-gray-900">{label}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date de départ
            </label>
            <input
              type="date"
              id="date"
              min={minDate}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setDateError(false);
              }}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                dateError ? 'border-red-300' : 'border-gray-200'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            />
            {dateError && (
              <p className="mt-2 text-sm text-red-600">
                Veuillez sélectionner une date de départ
              </p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Heure de départ
            </label>
            <input
              type="time"
              id="time"
              min={date === minDate ? minTime : undefined}
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setTimeError(false);
              }}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                timeError ? 'border-red-300' : 'border-gray-200'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            />
            {timeError && (
              <p className="mt-2 text-sm text-red-600">
                Veuillez sélectionner une heure de départ
              </p>
            )}
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Vous pouvez planifier une course jusqu'à 7 jours à l'avance. 
              Un chauffeur sera automatiquement assigné 15 minutes avant l'heure prévue.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};