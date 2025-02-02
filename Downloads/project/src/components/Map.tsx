import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import type { Location } from '../types';

const libraries: ("places" | "geometry" | "drawing" | "localContext" | "visualization")[] = ["places", "geometry"];

const defaultCenter = { lat: 14.7167, lng: -17.4677 }; // Centre de Dakar

const senegalBounds = {
  north: 16.6919,
  south: 12.3078,
  west: -17.5352,
  east: -11.3559,
};

const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#E3F2FD" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#F5F5F5" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#FFFFFF" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [{ color: "#E8EAF6" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#C5CAE9" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9E9E9E" }],
  },
];

interface MapViewProps {
  pickup?: Location;
  destination?: Location;
  driverLocation?: { lat: number; lng: number };
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  pickup,
  destination,
  driverLocation,
  className = "h-[300px]"
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBDGfFd7t_1IunFQpxZete1sIMW4z6InEo',
    libraries,
    region: 'SN'
  });

  useEffect(() => {
    if (!isLoaded || !pickup?.lat || !destination?.lat) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: pickup.lat, lng: pickup.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        }
      }
    );
  }, [isLoaded, pickup, destination]);

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    
    if (pickup?.lat && pickup?.lng) {
      bounds.extend({ lat: pickup.lat, lng: pickup.lng });
    }
    if (destination?.lat && destination?.lng) {
      bounds.extend({ lat: destination.lat, lng: destination.lng });
    }
    if (driverLocation) {
      bounds.extend(driverLocation);
    }

    // Si aucun point n'est défini, centrer sur Dakar
    if (bounds.isEmpty()) {
      bounds.extend(defaultCenter);
      bounds.extend({ lat: defaultCenter.lat + 0.02, lng: defaultCenter.lng + 0.02 });
    }

    map.fitBounds(bounds, { padding: { top: 50, right: 50, bottom: 50, left: 50 } });
    
    setTimeout(() => {
      map.setZoom(Math.min(map.getZoom() || 14, 15));
    }, 100);

    setMap(map);
  }, [pickup, destination, driverLocation]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className={`${className} bg-gray-100 animate-pulse rounded-xl`} />;

  return (
    <div className={`w-full ${className}`}>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%',
          borderRadius: '12px'
        }}
        center={pickup?.lat ? { lat: pickup.lat, lng: pickup.lng } : defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: mapStyles,
          restriction: {
            latLngBounds: senegalBounds,
            strictBounds: false
          },
          gestureHandling: "greedy",
          minZoom: 10,
          maxZoom: 20,
          disableDefaultUI: false,
          clickableIcons: false,
          backgroundColor: '#f8fafc'
        }}
      >
        {!directions && pickup?.lat && (
          <Marker
            position={{ lat: pickup.lat, lng: pickup.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#3B82F6",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 12,
            }}
          />
        )}

        {!directions && destination?.lat && (
          <Marker
            position={{ lat: destination.lat, lng: destination.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#EF4444",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 12,
            }}
          />
        )}

        {driverLocation && (
          <Marker
            position={driverLocation}
            icon={{
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              fillColor: "#10B981",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 8,
              rotation: 45
            }}
          />
        )}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#3B82F6",
                strokeWeight: 6,
                strokeOpacity: 0.8,
                geodesic: true
              }
            }}
          />
        )}

        {directions && pickup?.lat && (
          <Marker
            position={{ lat: pickup.lat, lng: pickup.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#3B82F6",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 12,
            }}
          />
        )}

        {directions && destination?.lat && (
          <Marker
            position={{ lat: destination.lat, lng: destination.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#EF4444",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 12,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};