import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

type Contact = {
  id: string;
  name: string;
  phone: string;
};

export default function ContactsScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  // ✅ FIX: upgrade old saved data safely
  const loadContacts = async () => {
    const data = await AsyncStorage.getItem("trusted_contacts");

    if (data) {
      try {
        const parsed = JSON.parse(data);

        const fixedData: Contact[] = parsed.map((item: any, index: number) => ({
          id: item.id ?? `${Date.now()}-${index}`,
          name: item.name ?? "",
          phone: item.phone ?? "",
        }));

        setContacts(fixedData);
      } catch (e) {
        console.log("Error parsing contacts", e);
        setContacts([]);
      }
    }
  };

  const saveContacts = async (newContacts: Contact[]) => {
    setContacts(newContacts);
    await AsyncStorage.setItem(
      "trusted_contacts",
      JSON.stringify(newContacts)
    );
  };

  const addContact = async () => {
    if (!name || !phone) return;

    const newContact: Contact = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      phone,
    };

    const updated = [...contacts, newContact];

    await saveContacts(updated);

    setName("");
    setPhone("");
  };

  const deleteContact = async (id: string) => {
    const updated = contacts.filter((item) => item.id !== id);
    await saveContacts(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trusted Contacts</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#888"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#888"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={addContact}>
        <Text style={styles.buttonText}>Add Contact</Text>
      </TouchableOpacity>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <View>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>

            <TouchableOpacity onPress={() => deleteContact(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
    padding: 20,
    paddingTop: 60,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#111827",
    color: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#7C3AED",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 25,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  contactCard: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  contactName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  contactPhone: {
    color: "#9CA3AF",
    marginTop: 4,
  },

  delete: {
    color: "#EF4444",
    fontWeight: "bold",
  },
});