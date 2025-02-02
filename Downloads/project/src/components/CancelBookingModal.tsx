import React, { useState } from 'react';
import { X, Clock, Car, MapPin, AlertCircle, ThumbsDown, DollarSign } from 'lucide-react';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  hasDriver: boolean;
}

const cancelReasons = [
  {
    id: 'WAIT_TOO_LONG',
    icon: Clock,
    label: "L'attente est trop longue",
    description: "Le temps d'attente est plus long que prévu"
  },
  {
    id: 'WRONG_ADDRESS',
    icon: MapPin,
    label: "L'adresse est incorrecte",
    description: "Je dois modifier l'adresse de départ ou d'arrivée"
  },
  {
    id: 'CHANGE_MIND',
    icon: AlertCircle,
    label: "J'ai changé d'avis",
    description: "Je ne souhaite plus faire ce trajet"
  },
  {
    id: 'PRICE_TOO_HIGH',
    icon: DollarSign,
    label: "Le prix est trop élevé",
    description: "Je trouve le tarif trop cher"
  },
  {
    id: 'OTHER',
    icon: ThumbsDown,
    label: "Autre raison",
    description: "Une autre raison non listée"
  }
];

// Raisons supplémentaires si un chauffeur est assigné
const driverAssignedReasons = [
  {
    id: 'DRIVER_LOCATION',
    icon: Car,
    label: "Le chauffeur ne se déplace pas",
    description: "La position du chauffeur ne change pas"
  },
  {
    id: 'DRIVER_CONTACT',
    icon: AlertCircle,
    label: "Impossible de contacter le chauffeur",
    description: "Le chauffeur ne répond pas au téléphone"
  }
];

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  hasDriver
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedReason) {
      setShowConfirmation(true);
      return;
    }
    onConfirm(selectedReason);
  };

  const allReasons = hasDriver 
    ? [...cancelReasons, ...driverAssignedReasons]
    : cancelReasons;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Annuler la course</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Veuillez sélectionner la raison de l'annulation :
          </p>

          <div className="space-y-3">
            {allReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full flex items-start space-x-4 p-4 rounded-xl border-2 transition-colors ${
                    selectedReason === reason.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-blue-100 hover:bg-blue-50'
                  }`}
                >
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{reason.label}</p>
                    <p className="text-sm text-gray-500">{reason.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {showConfirmation && !selectedReason && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl">
              <p className="text-red-600 text-sm">
                Veuillez sélectionner une raison avant de confirmer l'annulation
              </p>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Retour
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Confirmer l'annulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};