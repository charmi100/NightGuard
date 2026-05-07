import React, { useEffect, useState } from "react";
<<<<<<< HEAD

import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
=======
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContactsScreen() {
<<<<<<< HEAD

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

=======
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  const [contacts, setContacts] = useState<any[]>([]);

  // Load contacts
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
<<<<<<< HEAD

    const data =
      await AsyncStorage.getItem(
        "trusted_contacts"
      );
=======
    const data = await AsyncStorage.getItem("trusted_contacts");
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e

    if (data) {
      setContacts(JSON.parse(data));
    }
  };

<<<<<<< HEAD
  // Add contact
  const addContact = async () => {

    if (!name || !phone) return;

    const updated = [
      ...contacts,
      { name, phone },
    ];

    setContacts(updated);

    await AsyncStorage.setItem(
      "trusted_contacts",
      JSON.stringify(updated)
    );
=======
  const saveContacts = async (newContacts: any[]) => {
    setContacts(newContacts);

    await AsyncStorage.setItem(
      "trusted_contacts",
      JSON.stringify(newContacts)
    );
  };

  // Add contact
  const addContact = async () => {
    if (!name || !phone) return;

    const newContact = {
      id: Date.now().toString(),
      name,
      phone,
    };

    const updated = [...contacts, newContact];

    await saveContacts(updated);
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e

    setName("");
    setPhone("");
  };

<<<<<<< HEAD
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Trusted Contacts
      </Text>

      <TextInput
        placeholder="Contact Name"
        placeholderTextColor="#9CA3AF"
=======
  // Delete contact
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
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Phone Number"
<<<<<<< HEAD
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={addContact}
      >
        <Text style={styles.buttonText}>
          Add Contact
        </Text>
=======
        placeholderTextColor="#888"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={addContact}>
        <Text style={styles.buttonText}>Add Contact</Text>
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
      </TouchableOpacity>

      <FlatList
        data={contacts}
<<<<<<< HEAD
        keyExtractor={(_, index) =>
          index.toString()
        }

        renderItem={({ item }) => (

          <View style={styles.contactCard}>

            <Text style={styles.contactName}>
              {item.name}
            </Text>

            <Text style={styles.contactPhone}>
              {item.phone}
            </Text>

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

=======
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <View>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>

            <TouchableOpacity
              onPress={() => deleteContact(item.id)}
            >
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  container: {
    flex: 1,
    backgroundColor: "#050816",
    padding: 20,
<<<<<<< HEAD
    paddingTop: 70,
=======
    paddingTop: 60,
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },

  title: {
    color: "white",
<<<<<<< HEAD
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
=======
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },

  input: {
    backgroundColor: "#111827",
    color: "white",
    padding: 16,
<<<<<<< HEAD
    borderRadius: 16,
=======
    borderRadius: 14,
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#7C3AED",
<<<<<<< HEAD
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 30,
=======
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 25,
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
<<<<<<< HEAD
    fontSize: 16,
=======
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },

  contactCard: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 16,
<<<<<<< HEAD
    marginBottom: 15,
=======
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },

  contactName: {
    color: "white",
<<<<<<< HEAD
    fontSize: 18,
    fontWeight: "bold",
=======
    fontSize: 16,
    fontWeight: "600",
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },

  contactPhone: {
    color: "#9CA3AF",
<<<<<<< HEAD
    marginTop: 5,
=======
    marginTop: 4,
  },

  delete: {
    color: "#EF4444",
    fontWeight: "bold",
>>>>>>> 9934efeb7d49e2dd820077d9eca4cb94479fd15e
  },
});