import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Switch,
} from 'react-native';
import MapView, { Marker, Circle, Region, UrlTile } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';

// Points of Interest (Cebu landmarks)
const pointsOfInterest = [
  {
    id: 1,
    title: 'Magellan\'s Cross',
    description: 'Historic landmark',
    coordinate: { latitude: 10.2936, longitude: 123.9015 },
    radius: 100,
  },
  {
    id: 2,
    title: 'Fort San Pedro',
    description: 'Spanish fortress',
    coordinate: { latitude: 10.2923, longitude: 123.9021 },
    radius: 100,
  },
  {
    id: 3,
    title: 'Basilica del Santo Niño',
    description: 'Religious site',
    coordinate: { latitude: 10.2947, longitude: 123.9019 },
    radius: 100,
  },
];

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const MapScreen = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const watchIdRef = useRef<number | null>(null);

  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [geofencingEnabled, setGeofencingEnabled] = useState(false);
  const [insideGeofence, setInsideGeofence] = useState<number[]>([]);

  // Request location permissions
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for map features.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Check geofencing
  const checkGeofencing = (currentLocation: LocationCoords) => {
    const currentlyInside: number[] = [];

    pointsOfInterest.forEach((poi) => {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        poi.coordinate.latitude,
        poi.coordinate.longitude
      );

      const isInside = distance <= poi.radius;
      const wasInside = insideGeofence.includes(poi.id);

      if (isInside && !wasInside) {
        // Entered geofence
        Alert.alert(
          '📍 Entered Geofence',
          `You are now near ${poi.title}!`,
          [{ text: 'OK' }]
        );
        currentlyInside.push(poi.id);
      } else if (!isInside && wasInside) {
        // Left geofence
        Alert.alert(
          '🚶 Left Geofence',
          `You have left ${poi.title} area.`,
          [{ text: 'OK' }]
        );
      } else if (isInside) {
        currentlyInside.push(poi.id);
      }
    });

    setInsideGeofence(currentlyInside);
  };

  // Get current location
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required.');
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        setLocation(newLocation);
        setLoading(false);

        // Animate to user location
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      (error) => {
        console.log(error);
        // Set default location to Cebu City center instead of showing error
        const defaultLocation = { latitude: 10.3157, longitude: 123.8854 };
        setLocation(defaultLocation);
        setLoading(false);

        // Show friendly message instead of error
        Alert.alert(
          'Location Not Available',
          'Using default location (Cebu City). You can still explore the map and test geofencing!',
          [{ text: 'OK' }]
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Start watching location
  const startWatchingLocation = () => {
    watchIdRef.current = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        setLocation(newLocation);

        if (geofencingEnabled) {
          checkGeofencing(newLocation);
        }
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 }
    );
  };

  // Stop watching location
  const stopWatchingLocation = () => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  useEffect(() => {
    getCurrentLocation();

    return () => {
      stopWatchingLocation();
    };
  }, []);

  useEffect(() => {
    if (geofencingEnabled) {
      startWatchingLocation();
    } else {
      stopWatchingLocation();
    }

    return () => {
      stopWatchingLocation();
    };
  }, [geofencingEnabled]);

  // Zoom controls
  const zoomIn = () => {
    mapRef.current?.getCamera().then((cam) => {
      if (cam.zoom !== undefined) {
        mapRef.current?.animateCamera({ zoom: cam.zoom + 1 });
      }
    });
  };

  const zoomOut = () => {
    mapRef.current?.getCamera().then((cam) => {
      if (cam.zoom !== undefined) {
        mapRef.current?.animateCamera({ zoom: cam.zoom - 1 });
      }
    });
  };

  const centerOnUser = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interactive Map</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 10.3157,
          longitude: location?.longitude || 123.8854,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {/* OpenStreetMap Tiles - Works without API key! */}
        {darkMode ? (
          <UrlTile
            urlTemplate="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
        ) : (
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
        )}

        {/* Points of Interest */}
        {pointsOfInterest.map((poi) => (
          <React.Fragment key={poi.id}>
            <Marker
              coordinate={poi.coordinate}
              title={poi.title}
              description={poi.description}
              pinColor={insideGeofence.includes(poi.id) ? '#4CAF50' : '#FF6B6B'}
            />
            {geofencingEnabled && (
              <Circle
                center={poi.coordinate}
                radius={poi.radius}
                fillColor="rgba(76, 175, 80, 0.2)"
                strokeColor="rgba(76, 175, 80, 0.8)"
                strokeWidth={2}
              />
            )}
          </React.Fragment>
        ))}
      </MapView>

      {/* Controls Panel */}
      <View style={styles.controlsPanel}>
        {/* Theme Toggle */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>🌙 Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
            thumbColor={darkMode ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Geofencing Toggle */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>📍 Geofencing</Text>
          <Switch
            value={geofencingEnabled}
            onValueChange={setGeofencingEnabled}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
            thumbColor={geofencingEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Status */}
        {geofencingEnabled && insideGeofence.length > 0 && (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>
              ✅ Inside {insideGeofence.length} geofence(s)
            </Text>
          </View>
        )}

        <View style={styles.mapInfo}>
          <Text style={styles.mapInfoText}>🗺️ OpenStreetMap (Free)</Text>
        </View>
      </View>

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Text style={styles.zoomButtonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={centerOnUser}>
          <Text style={styles.zoomButtonText}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Points of Interest:</Text>
        {pointsOfInterest.map((poi) => (
          <Text key={poi.id} style={styles.legendItem}>
            • {poi.title}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  map: {
    flex: 1,
  },
  controlsPanel: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 200,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  mapInfo: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
  },
  mapInfoText: {
    fontSize: 11,
    color: '#1976D2',
    textAlign: 'center',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 150,
    right: 20,
  },
  zoomButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  legendItem: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
});