import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface Coords {
  lat: number;
  lng: number;
}

export interface LocationPermission {
  status: 'granted' | 'denied' | 'undetermined';
  coords: Coords | null;
}

const DEFAULT_LOCATION: Coords = { lat: 6.2442, lng: -75.5898 }; // Medellín

export function useLocation(): LocationPermission {
  const [permission, setPermission] = useState<LocationPermission>({
    status: 'undetermined',
    coords: null,
  });

  useEffect(() => {
    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setPermission({ status: 'denied', coords: DEFAULT_LOCATION });
          return;
        }

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setPermission({
          status: 'granted',
          coords: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
        });
      } catch {
        setPermission({ status: 'denied', coords: DEFAULT_LOCATION });
      }
    }

    getLocation();
  }, []);

  return permission;
}

export function snapToGrid(coords: Coords): Coords {
  return {
    lat: Math.round(coords.lat * 100) / 100, // ~1km
    lng: Math.round(coords.lng * 100) / 100,
  };
}
