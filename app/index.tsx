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

type Contact = {
  name?: string;
  phone: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recordingRef = useRef<Audio.Recording | null>(null);
  const lastShakeTime = useRef(0);

  const [recordingUri, setRecordingUri] = useState<string | null>(null);

const baseDir = (FileSystem as any).cacheDirectory ?? "";
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
      const force = Math.sqrt(
        data.x * data.x + data.y * data.y + data.z * data.z
      );

      const now = Date.now();

      if (force > 1.8 && now - lastShakeTime.current > 2000) {
        lastShakeTime.current = now;
        sendSOS();
      }
    });

    Accelerometer.setUpdateInterval(200);

    return () => sub.remove();
  }, []);

  /* ================= SOS ================= */
  const sendSOS = async () => {
    try {
      const data = await AsyncStorage.getItem("trusted_contacts");

      if (!data) {
        Alert.alert("No Contacts", "Add trusted contacts first");
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
      Alert.alert("SOS Failed");
    }
  };

  /* ================= JOURNEY ================= */
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

  /* ================= SHARE ================= */
  const shareRecording = async () => {
    try {
      if (!recordingUri) {
        Alert.alert("No recording found");
        return;
      }

      const newPath = `${baseDir}sos-recording.m4a`;

      await FileSystem.copyAsync({
        from: recordingUri,
        to: newPath,
      });

      const available = await Sharing.isAvailableAsync();

      if (!available) {
        Alert.alert("Sharing not available on this device");
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
    <LinearGradient colors={["#050816", "#111827", "#1E1B4B"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>NightGuard</Text>
          <Text style={styles.subtitle}>Smart Safety System</Text>
        </View>

        {/* SOS BUTTON */}
        <View style={styles.sosWrapper}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
              <LinearGradient colors={["#EF4444", "#DC2626"]} style={styles.sosGradient}>
                <Text style={styles.sosText}>SOS</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickContainer}>

          <TouchableOpacity style={styles.card} onPress={() => router.push("/contacts")}>
            <Ionicons name="people" size={26} color="#A78BFA" />
            <Text style={styles.cardText}>Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={startJourney}>
            <Ionicons name="location" size={26} color="#22C55E" />
            <Text style={styles.cardText}>Journey</Text>
          </TouchableOpacity>

        </View>

        {/* RECORDING */}
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

  sosWrapper: {
    alignItems: "center",
    marginBottom: 25,
  },

  sosButton: {
    borderRadius: 100,
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
  },
});