<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Accelerometer } from "expo-sensors";
import * as Sharing from "expo-sharing";

const FS =
  FileSystem as typeof FileSystem & {
    cacheDirectory: string;
    documentDirectory: string;
  };

type Contact = {
  name?: string;
  phone: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const lastShakeTime = useRef(0);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  /* ================= ANIMATION ================= */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  /* ================= SHAKE SOS ================= */
  useEffect(() => {
    const sub = Accelerometer.addListener((data) => {
      const acc = Math.sqrt(
        data.x * data.x + data.y * data.y + data.z * data.z
      );

      if (acc > 1.8) {
        const now = Date.now();

        if (now - lastShakeTime.current > 2000) {
          lastShakeTime.current = now;
          sendSOS();
=======
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [location, setLocation] = useState<any>(null);
  const [lastShake, setLastShake] = useState(0);

  // 📍 LIVE TRACKING
  useEffect(() => {
    let subscriber: any;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Permission denied");
        return;
      }

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc.coords);
        }
      );
    })();

    return () => {
      if (subscriber) subscriber.remove();
    };
  }, []);

  // 🚨 SOS FUNCTION
  const sendSOS = async () => {
  try {
    const data = await AsyncStorage.getItem("trusted_contacts");

    if (!data) {
      alert("No trusted contacts added");
      return;
    }

    const contacts = JSON.parse(data);

    if (contacts.length === 0) {
      alert("No contacts found");
      return;
    }

    // Get current location
    let loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;

    // Create message
    const message =
      `🚨 EMERGENCY! I need help.\n\n` +
      `My live location:\n` +
      `https://maps.google.com/?q=${latitude},${longitude}`;

    // Get all phone numbers
    const phoneNumbers = contacts
      .map((c: any) => c.phone)
      .join(",");

    // SMS link
    const smsUrl =
      `sms:${phoneNumbers}?body=` +
      encodeURIComponent(message);

    Linking.openURL(smsUrl);

  } catch (error) {
    console.log(error);
    alert("Failed to send SOS");
  }
};

  // 📳 SHAKE DETECTION (EXPO SAFE)
  useEffect(() => {
  let subscription: any;

  let lastShakeTime = 0;
  let shakeCount = 0;

  const subscribe = () => {
    subscription = Accelerometer.addListener((data) => {
      const { x, y, z } = data;

      // Better force calculation
      const force = Math.sqrt(x * x + y * y + z * z);

      const now = Date.now();

      // Detect strong shake
      if (force > 2.3) {
        // Ignore repeated shakes too quickly
        if (now - lastShakeTime > 700) {
          shakeCount += 1;
          lastShakeTime = now;

          console.log("Shake detected:", shakeCount);

          // Require DOUBLE shake
          if (shakeCount >= 2) {
            shakeCount = 0;

            console.log("🚨 SMART SOS TRIGGERED");

            sendSOS();

            // 5 sec cooldown
            setTimeout(() => {
              shakeCount = 0;
            }, 5000);
          }
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
        }
      }
    });

<<<<<<< HEAD
    Accelerometer.setUpdateInterval(200);

    return () => sub.remove();
  }, []);

  /* ================= SOS ================= */
  const sendSOS = async () => {
    try {
      const data = await AsyncStorage.getItem("trusted_contacts");

      if (!data) {
        Alert.alert("No Contacts", "Please add trusted contacts first.");
        return;
      }

      const contacts: Contact[] = JSON.parse(data);

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const message =
        `🚨 EMERGENCY!\n\nLive Location:\nhttps://maps.google.com/?q=${latitude},${longitude}`;

      const phoneNumbers = contacts.map((c) => c.phone).join(",");

      Linking.openURL(
        `sms:${phoneNumbers}?body=${encodeURIComponent(message)}`
      );
    } catch {
      Alert.alert("Error", "SOS failed");
    }
  };

  /* ================= NAVIGATION ================= */
  const startJourney = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      router.push({
        pathname: "/journey",
        params: {
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        },
      });
    } catch {
      router.push("/journey");
    }
  };

  /* ================= RECORDING ================= */
  const startRecording = async () => {
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();

    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    await recording.startAsync();
    recordingRef.current = recording;

    Alert.alert("Recording Started 🎙️");
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    await recordingRef.current.stopAndUnloadAsync();

    const uri = recordingRef.current.getURI();
    recordingRef.current = null;

    if (uri) setRecordingUri(uri);

    Alert.alert("Recording Saved 📁");
  };

  /* ================= SHARE FIXED ================= */
  const shareRecording = async () => {
  try {
    if (!recordingUri) {
      Alert.alert("No recording found");
      return;
    }

    const baseDir =
      FS.cacheDirectory ?? FS.documentDirectory ?? "";

    const newPath = baseDir + "sos-recording.m4a";

    await FileSystem.copyAsync({
      from: recordingUri,
      to: newPath,
    });

    const available = await Sharing.isAvailableAsync();

    if (!available) {
      Alert.alert("Sharing not available");
      return;
    }

    await Sharing.shareAsync(newPath, {
      mimeType: "audio/m4a",
      dialogTitle: "Share SOS Recording",
    });

  } catch (e) {
    console.log(e);
    Alert.alert("Sharing failed");
  }
};
  return (
    <LinearGradient
      colors={["#050816", "#111827", "#1E1B4B"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>NightGuard</Text>
          <Text style={styles.subtitle}>Smart Safety System</Text>
        </View>

        {/* STATUS */}
        <View style={styles.statusCard}>
          <Ionicons name="shield-checkmark" size={22} color="#22C55E" />
          <Text style={styles.statusText}>Protection Active</Text>
        </View>

        {/* SOS */}
        <View style={styles.sosWrapper}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
              <LinearGradient
                colors={["#EF4444", "#DC2626"]}
                style={styles.sosGradient}
              >
                <Text style={styles.sosText}>SOS</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* QUICK FEATURES (RESTORED) */}
        <View style={styles.quickContainer}>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/contacts")}
          >
            <Ionicons name="people" size={26} color="#A78BFA" />
            <Text style={styles.cardText}>Trusted Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={startJourney}
          >
            <Ionicons name="location" size={26} color="#22C55E" />
            <Text style={styles.cardText}>Safe Journey</Text>
          </TouchableOpacity>

        </View>

        {/* AUDIO CONTROLS */}
        <TouchableOpacity style={styles.btnGreen} onPress={startRecording}>
          <Text style={styles.btnText}>Start Recording</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnRed} onPress={stopRecording}>
          <Text style={styles.btnText}>Stop Recording</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnPurple} onPress={shareRecording}>
          <Text style={styles.btnText}>Share Recording</Text>
        </TouchableOpacity>

      </ScrollView>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 22,
    paddingTop: 80,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#9CA3AF",
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 16,
    borderRadius: 18,
    marginBottom: 25,
  },

  statusText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "600",
  },

  sosWrapper: {
    alignItems: "center",
    marginBottom: 25,
  },

  sosButton: {
    borderRadius: 100,
    elevation: 10,
  },

  sosGradient: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
  },

  sosText: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
  },

  quickContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  card: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  cardText: {
    color: "white",
    marginTop: 10,
    fontWeight: "600",
  },

  btnGreen: {
    backgroundColor: "#22C55E",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },

  btnRed: {
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },

  btnPurple: {
    backgroundColor: "#7C3AED",
    padding: 16,
    borderRadius: 16,
  },

  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
=======
    Accelerometer.setUpdateInterval(300);
  };

  subscribe();

  return () => {
    subscription && subscription.remove();
  };
}, []);
  // ⏳ LOADING
  if (!location) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: "white" }}>Tracking location...</Text>
      </View>
    );
  }

  // 📱 UI
  return (

    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} />
      </MapView>

      {/* STATUS */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Shake Phone for SOS 🚨</Text>
      </View>

      {/* CONTACT BUTTON */}
    <TouchableOpacity
      style={styles.contactButton}
      onPress={() => router.push("/contacts")}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        Trusted Contacts
      </Text>
    </TouchableOpacity>
      {/* Navigation Buttons */}

      <TouchableOpacity
  style={styles.journeyButton}
  onPress={() => router.push("/journey")}
>
  <Text style={{ color: "white", fontWeight: "bold" }}>
    Safe Journey
  </Text>
</TouchableOpacity>

      {/* BUTTON */}
      <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
        <Text style={styles.sosText}>SEND SOS</Text>
      </TouchableOpacity>
    </View>
    
  );
}

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050816",
  },

  overlay: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 16,
  },

  title: {
    color: "#22C55E",
    fontSize: 18,
    fontWeight: "bold",
  },

  sosButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    shadowColor: "#FF3B3B",
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
contactButton: {
  position: "absolute",
  bottom: 120,
  alignSelf: "center",
  backgroundColor: "#7C3AED",
  paddingVertical: 14,
  paddingHorizontal: 28,
  borderRadius: 40,
},
journeyButton: {
  position: "absolute",
  bottom: 190,
  alignSelf: "center",
  backgroundColor: "#2563EB",
  paddingVertical: 14,
  paddingHorizontal: 28,
  borderRadius: 40,
},

  sosText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },
});