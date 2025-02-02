import React from 'react';
import { Link } from 'react-router-dom';
import { Car, History, MessageSquare, User } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl 
                          group-hover:shadow-lg transition-all duration-200">
              <Car className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 
                           text-transparent bg-clip-text">
              Yobûma
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/history" className="nav-link">
              <History className="w-5 h-5" />
              <span className="font-medium">Historique</span>
            </Link>
            <Link to="/support" className="nav-link">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Support</span>
            </Link>
            <Link to="/profile" className="nav-link">
              <User className="w-5 h-5" />
              <span className="font-medium">Profil</span>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 md:hidden">
            <div className="flex justify-around py-3">
              <Link to="/" className="nav-link-mobile">
                <Car className="w-6 h-6 mb-1" />
                <span>Accueil</span>
              </Link>
              <Link to="/history" className="nav-link-mobile">
                <History className="w-6 h-6 mb-1" />
                <span>Historique</span>
              </Link>
              <Link to="/support" className="nav-link-mobile">
                <MessageSquare className="w-6 h-6 mb-1" />
                <span>Support</span>
              </Link>
              <Link to="/profile" className="nav-link-mobile">
                <User className="w-6 h-6 mb-1" />
                <span>Profil</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};