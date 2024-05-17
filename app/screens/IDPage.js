import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";

export default function IDPage({ route, navigation }) {
  const { details, fromLoginPage } = route.params;
  const [aadhar, setAadhar] = useState("");
  const [voterId, setVoterId] = useState("");

  const handleNext = async () => {
    try {
      const response = await fetch(
        "http://192.168.68.104:3000/checkUniqueness",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ aadhar, voterId }),
        }
      );
      const data = await response.json();
      if (data.isUnique) {
        navigation.navigate("Details", {
          details,
          fromLoginPage,
          aadhar,
          voterId,
        });
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Aadhar"
        value={aadhar}
        onChangeText={setAadhar}
        style={styles.input}
      />
      <TextInput
        label="Voter ID"
        value={voterId}
        onChangeText={setVoterId}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleNext}
        style={styles.button}
        disabled={!aadhar || !voterId}
      >
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(33, 0, 93, 0.3)",
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});
