import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete";
import { popularLocations } from '../data/locations';

interface LocationSelectorProps {
  placeholder: string;
  value: string;
  onChange: (address: string, location?: { lat: number; lng: number }) => void;
  icon?: React.ReactNode;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  placeholder,
  value,
  onChange,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'SN' },
      types: ['geocode'], // Utiliser uniquement 'geocode' pour éviter le mélange de types
      language: 'fr'
    },
    debounce: 300,
    cache: 24 * 60 * 60,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        clearSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSuggestions]);

  const handleLocationSelect = async (address: string, placeId?: string) => {
    try {
      let location;
      if (placeId) {
        const results = await getGeocode({ placeId });
        location = await getLatLng(results[0]);
      } else {
        const results = await getGeocode({ address });
        location = await getLatLng(results[0]);
      }
      
      onChange(address, location);
      setValue('', false);
      clearSuggestions();
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      onChange(address);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
    setIsOpen(true);
  };

  const popularPlaces = popularLocations.filter(location =>
    location.name.toLowerCase().includes(inputValue.toLowerCase()) ||
    location.area.toLowerCase().includes(inputValue.toLowerCase())
  );

  const showSuggestions = isOpen && (status === "OK" || popularPlaces.length > 0);

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3.5 text-blue-500">{icon}</div>}
        <input
          type="text"
          placeholder={placeholder}
          value={value || inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          disabled={!ready}
          className="input-with-icon"
        />
      </div>

      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-64 overflow-y-auto">
          <div className="p-2">
            {status === "OK" && data.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleLocationSelect(suggestion.description, suggestion.place_id)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-3"
              >
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">{suggestion.structured_formatting.main_text}</div>
                  <div className="text-sm text-gray-500">{suggestion.structured_formatting.secondary_text}</div>
                </div>
              </button>
            ))}

            {popularPlaces.length > 0 && (
              <>
                {status === "OK" && <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Lieux populaires</div>}
                {popularPlaces.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location.address)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-500">{location.area}</div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {status !== "OK" && popularPlaces.length === 0 && inputValue && (
              <div className="px-4 py-3 text-gray-500 text-center">
                Aucun lieu trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};