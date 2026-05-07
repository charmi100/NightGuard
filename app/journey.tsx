<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";

export default function JourneyScreen() {
  const mapRef = useRef<MapView>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const lastMoveTime = useRef(Date.now());
  const lastPosition = useRef<{ lat: number; lng: number } | null>(null);

  // =========================
  // FAST INITIAL REGION (NO LOADING DELAY)
  // =========================
  const [region, setRegion] = useState<Region>({
    latitude: 21.1702,
    longitude: 72.8311,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [location, setLocation] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [journeyStarted, setJourneyStarted] = useState(false);

  // =========================
  // REAL DISTANCE (ACCURATE)
  // =========================
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

  // =========================
  // LOCATION START (NON-BLOCKING)
  // =========================
  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission denied", "Location required");
        return;
      }

      // ⚡ QUICK FIRST LOCATION (LOW ACCURACY = FAST)
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      }).then((loc) => {
        const coords = loc.coords;

        const newRegion = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setLocation(coords);
        setRegion(newRegion);
      });

      startTracking();
    })();

    return () => {
      if (watchRef.current) watchRef.current.remove();
    };
  }, []);

  // =========================
  // LIVE TRACKING (OPTIMIZED)
  // =========================
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

        // 🚀 Smooth camera follow (important upgrade)
        mapRef.current?.animateToRegion(newRegion, 500);

        // =========================
        // MOVEMENT TRACKING
        // =========================
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

        // =========================
        // STOP DETECTION
        // =========================
        if (journeyStarted) {
          const stoppedFor = Date.now() - lastMoveTime.current;

          if (stoppedFor > 60000) {
            Alert.alert("🚨 Alert", "No movement detected!");
            lastMoveTime.current = Date.now();
          }
        }
      }
    );
  };

  // =========================
  // START JOURNEY
  // =========================
  const startJourney = () => {
    if (!destination) {
      Alert.alert("Select Destination", "Tap on map first");
=======
import React, { useEffect, useState } from "react";
import {
  View,
 Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function JourneyScreen() {
  const [previousDistance, setPreviousDistance] =
  useState<number | null>(null);

const [wrongDirectionCount, setWrongDirectionCount] =
  useState(0);

  const [location, setLocation] = useState<any>(null);

  const [destination, setDestination] = useState<any>(null);

  const [journeyStarted, setJourneyStarted] =
    useState(false);

  // Get live location
  useEffect(() => {
    (async () => {
      let { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Location permission denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync(
        {}
      );

      setLocation(loc.coords);

      // Live updates
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (updatedLocation) => {
const currentCoords = updatedLocation.coords;

setLocation(currentCoords);

if (destination && journeyStarted) {

  const currentDistance = calculateDistance(
    currentCoords.latitude,
    currentCoords.longitude,
    destination.latitude,
    destination.longitude
  );

  // Compare with previous distance
  if (
    previousDistance !== null &&
    currentDistance > previousDistance
  ) {
    const newCount = wrongDirectionCount + 1;

    setWrongDirectionCount(newCount);

    // Suspicious movement
    if (newCount >= 3) {
      Alert.alert(
        "Warning",
        "You seem to be moving away from your destination."
      );
    }
  } else {
    setWrongDirectionCount(0);
  }

  setPreviousDistance(currentDistance);
}        }
      );
    })();
  }, []);

  // Start journey
  const startJourney = () => {
    if (!destination) {
      alert("Tap destination on map first");
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
      return;
    }

    setJourneyStarted(true);
<<<<<<< HEAD
    Alert.alert("Journey Started", "Live tracking active 🚀");
  };

  // =========================
  // UI
  // =========================
  return (
    <View style={styles.container}>

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        region={region}
        showsUserLocation
        followsUserLocation
        loadingEnabled
        loadingIndicatorColor="#7C3AED"
        onPress={(e) => setDestination(e.nativeEvent.coordinate)}
      >

        {/* USER */}
        <Marker coordinate={location || region}>
          <View style={styles.userDot} />
        </Marker>

        {/* DESTINATION */}
        {destination && (
          <Marker coordinate={destination} pinColor="blue" />
        )}

=======

    Alert.alert(
      "Journey Started",
      "NightGuard is now monitoring your route."
    );
  };

  // Loading
  if (!location) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: "white" }}>
          Loading Map...
        </Text>
      </View>
    );
  }

  const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const dx = lat2 - lat1;
  const dy = lon2 - lon1;

  return Math.sqrt(dx * dx + dy * dy);
};

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}

        // TAP TO SELECT DESTINATION
        onPress={(e) => {
          setDestination(
            e.nativeEvent.coordinate
          );
        }}
      >
        {/* USER MARKER */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You"
        />

        {/* DESTINATION MARKER */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="purple"
          />
        )}
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
      </MapView>

      {/* TOP CARD */}
      <View style={styles.topCard}>
<<<<<<< HEAD
        <Text style={styles.title}>Safe Journey</Text>
        <Text style={styles.subtitle}>Tap map to set destination</Text>

        <Text style={styles.liveText}>
          Lat: {location?.latitude?.toFixed(4) || "loading..."}
        </Text>

        <Text style={styles.liveText}>
          Lng: {location?.longitude?.toFixed(4) || "loading..."}
        </Text>
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={startJourney}>
        <Text style={styles.buttonText}>
          {journeyStarted ? "Journey Active" : "Start Journey"}
        </Text>
      </TouchableOpacity>

=======
        <Text style={styles.title}>
          Safe Journey Mode
        </Text>

        <Text style={styles.subtitle}>
          Tap anywhere on map to set destination
        </Text>
      </View>

      {/* JOURNEY BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={startJourney}
      >
        <Text style={styles.buttonText}>
          {journeyStarted
            ? "Journey Active"
            : "Start Journey"}
        </Text>
      </TouchableOpacity>
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
    </View>
  );
}

<<<<<<< HEAD
/* ===================== STYLES ===================== */

=======
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },

<<<<<<< HEAD
=======
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050816",
  },

>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  topCard: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
<<<<<<< HEAD
    backgroundColor: "rgba(17,24,39,0.95)",
    padding: 16,
=======
    backgroundColor: "#111827",
    padding: 18,
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
    borderRadius: 18,
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
<<<<<<< HEAD
=======
    marginBottom: 6,
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },

  subtitle: {
    color: "#9CA3AF",
<<<<<<< HEAD
    marginTop: 4,
  },

  liveText: {
    color: "#22C55E",
    marginTop: 4,
=======
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },

  button: {
    position: "absolute",
<<<<<<< HEAD
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#7C3AED",
    paddingVertical: 16,
=======
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "#7C3AED",
    paddingVertical: 18,
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
    paddingHorizontal: 40,
    borderRadius: 40,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
<<<<<<< HEAD
  },

  userDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 3,
    borderColor: "white",
=======
    fontSize: 16,
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },
});