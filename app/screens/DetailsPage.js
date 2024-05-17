import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

export default function DetailsPage({ route, navigation }) {
  const { details, fromLoginPage, aadhar, voterId } = route.params;
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(details ? details.name : "");
  const [age, setAge] = useState(details ? details.age?.toString() : "");
  const [place, setPlace] = useState(details ? details.place : "");
  const [district, setDistrict] = useState(details ? details.district : "");

  const [userRefNo, setUserRefNo] = useState(details ? details._id : "");

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setSaved(false);
    }
  }, [isFocused]);

  const handleRefNo = async () => {
    try {
      const response = await fetch(
        `http://192.168.68.104:3000/idInfo/${window.mobileNo}`
      );
      const data = await response.json();
      if (data && Object.keys(data).length !== 1) {
        setUserRefNo(data._id);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = () => {
    fetch("http://192.168.68.104:3000/idInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refNo: window.refNo,
        aadhar,
        voterId,
        mobileNo: window.mobileNo,
        name,
        age,
        place,
        district,
      }),
    })
      .then(async (response) => {
        const responseData = await response.json();
        if (!response.ok) {
          if (
            responseData.message &&
            responseData.message.includes("duplicate key")
          ) {
            const errorMessage =
              "Duplicate key - Mobile Number should be unique";
            alert(errorMessage);
          } else {
            const errorMessage = responseData.message || "Failed to send data";
            alert(errorMessage);
          }
          return;
        }
        handleRefNo();
        if (Platform.OS === "android") {
          ToastAndroid.showWithGravity(
            "Data sent successfully",
            ToastAndroid.LONG,
            ToastAndroid.TOP
          );
        } else if (Platform.OS === "ios") {
          alert("Data sent successfully");
        }
        setSaved(true);
      })
      .catch((error) => {
        alert("Network error: " + error.message);
      });
  };

  const handleSignOut = () => {
    navigation.popToTop();
  };

  const handleCopyToClipboard = () => {
    Clipboard.setStringAsync(userRefNo);
    alert("Copied to clipboard!");
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 15,
          alignSelf: "center",
          color: "#333",
          textTransform: "uppercase",
        }}
      >
        User Info
      </Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        editable={!fromLoginPage && !saved}
        maxLength={50}
      />
      <TextInput
        label="Age"
        value={age}
        onChangeText={(text) => {
          if (/^\d*$/.test(text)) {
            setAge(text);
          }
        }}
        keyboardType="numeric"
        style={styles.input}
        editable={!fromLoginPage && !saved}
        maxLength={3}
      />
      <TextInput
        label="Place"
        value={place}
        onChangeText={setPlace}
        style={styles.input}
        editable={!fromLoginPage && !saved}
        maxLength={30}
      />
      <TextInput
        label="District"
        value={district}
        onChangeText={setDistrict}
        style={styles.input}
        editable={!fromLoginPage && !saved}
        maxLength={30}
      />
      {!fromLoginPage && !saved ? (
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Submit
        </Button>
      ) : (
        <>
          <Button
            mode="contained"
            onPress={handleSignOut}
            style={styles.button}
          >
            Sign Out
          </Button>
          <TouchableOpacity onPress={handleCopyToClipboard}>
            <Text style={styles.clickableText}>Click here to copy:</Text>
            <Text style={[styles.clickableText, { marginTop: 0 }]}>
              User Ref.No. : {userRefNo}
            </Text>
          </TouchableOpacity>
        </>
      )}
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
  clickableText: {
    marginTop: 20,
    color: "blue",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
