import React, { useState } from 'react';
import { X, Search, Shield, MessageSquare, MapPin, Receipt } from 'lucide-react';

interface TripHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  driverName: string;
}

type HelpOption = {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
};

const helpOptions: HelpOption[] = [
  {
    id: 'lost-item',
    icon: Search,
    title: "J'ai oublié un objet",
    description: "Nous pouvons vous aider à contacter votre chauffeur."
  },
  {
    id: 'security',
    icon: Shield,
    title: "Signaler un problème de sécurité",
    description: "Contactez-nous si vous rencontrez un problème de sécurité."
  },
  {
    id: 'driver-feedback',
    icon: MessageSquare,
    title: "Commentaires sur le chauffeur",
    description: "Pour les problèmes non liés à la sécurité"
  },
  {
    id: 'general-help',
    icon: MapPin,
    title: "Obtenir de l'aide pour une course",
    description: "Besoin d'aide pour un autre problème ? Identifiez-le ici."
  }
];

export const TripHelpModal: React.FC<TripHelpModalProps> = ({
  isOpen,
  onClose,
  tripId,
  driverName
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous ajouteriez la logique pour envoyer le message au support
    console.log('Help request:', { tripId, option: selectedOption, message });
    // Réinitialiser et fermer
    setMessage('');
    setSelectedOption(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Aide pour votre course</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {!selectedOption ? (
            <div className="space-y-4">
              {helpOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className="w-full flex items-center space-x-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {helpOptions.find(o => o.id === selectedOption)?.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Course avec {driverName} • ID: {tripId}
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre problème en détail..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedOption(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Envoyer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};