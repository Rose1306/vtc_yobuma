import React, { useState } from 'react';
import { User, CreditCard, MapPin, Bell, Shield, History, ChevronRight } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'WAVE' | 'ORANGE_MONEY' | 'CARD';
  label: string;
  lastDigits?: string;
  expiryDate?: string;
}

export const Profile: React.FC = () => {
  const [user] = useState({
    name: 'Abdoulaye Diallo',
    email: 'abdoulaye.diallo@example.com',
    phone: '+221 77 123 45 67',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    address: 'Médina, Dakar'
  });

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'WAVE',
      label: 'Wave',
      lastDigits: '4567'
    },
    {
      id: '2',
      type: 'ORANGE_MONEY',
      label: 'Orange Money',
      lastDigits: '8901'
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* En-tête du profil */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center space-x-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
          </div>
        </div>
      </div>

      {/* Section principale */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Colonne de gauche */}
        <div className="md:col-span-2 space-y-8">
          {/* Informations personnelles */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Modifier
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium text-gray-900">{user.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Moyens de paiement */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Moyens de paiement</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{method.label}</p>
                      <p className="text-sm text-gray-500">
                        Se terminant par {method.lastDigits}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="space-y-8">
          {/* Paramètres rapides */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres rapides</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Notifications</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Sécurité</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <History className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Historique</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Version de l'application */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos</h2>
            <div className="text-gray-600">
              <p>Version 1.0.0</p>
              <p className="mt-2">© 2024 Yobûma</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};