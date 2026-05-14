import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

export default function JourneyScreen() {
  const mapRef = useRef<MapView>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const lastMoveTime = useRef(Date.now());
  const lastPosition = useRef<{ lat: number; lng: number } | null>(null);

  const [location, setLocation] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [journeyStarted, setJourneyStarted] = useState(false);

  const [region, setRegion] = useState<Region>({
    latitude: 21.1702,
    longitude: 72.8311,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Distance helper (real world approx)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Init location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission denied", "Location is required");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });

      setLocation(loc.coords);

      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      startTracking();
    })();

    return () => {
      if (watchRef.current) watchRef.current.remove();
    };
  }, []);

  // Live tracking
  const startTracking = async () => {
    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 2000,
        distanceInterval: 2,
      },
      (pos) => {
        const coords = pos.coords;

        setLocation(coords);

        const newRegion = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 500);

        // movement tracking
        if (lastPosition.current) {
          const moved = getDistance(
            coords.latitude,
            coords.longitude,
            lastPosition.current.lat,
            lastPosition.current.lng
          );

          if (moved > 0.01) {
            lastMoveTime.current = Date.now();
          }
        }

        lastPosition.current = {
          lat: coords.latitude,
          lng: coords.longitude,
        };

        // stop detection
        if (journeyStarted) {
          const stopped = Date.now() - lastMoveTime.current;

          if (stopped > 60000) {
            Alert.alert("⚠️ Alert", "No movement detected!");
            lastMoveTime.current = Date.now();
          }
        }
      }
    );
  };

  // Start journey
  const startJourney = () => {
    if (!destination) {
      Alert.alert("Select Destination", "Tap on map first");
      return;
    }

    setJourneyStarted(true);
    Alert.alert("Journey Started 🚀", "Live tracking active");
  };

  return (
    <View style={styles.container}>

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        region={region}
        showsUserLocation
        onPress={(e) => setDestination(e.nativeEvent.coordinate)}
      >
        {location && (
          <Marker coordinate={location}>
            <View style={styles.userDot} />
          </Marker>
        )}

        {destination && (
          <Marker coordinate={destination} pinColor="blue" />
        )}
      </MapView>

      {/* UI CARD */}
      <View style={styles.topCard}>
        <Text style={styles.title}>Safe Journey</Text>
        <Text style={styles.subtitle}>Tap map to set destination</Text>
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={startJourney}>
        <Text style={styles.buttonText}>
          {journeyStarted ? "Journey Active" : "Start Journey"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },

  topCard: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 18,
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#9CA3AF",
    marginTop: 5,
  },

  button: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "#7C3AED",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 40,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  userDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 3,
    borderColor: "white",
  },
});