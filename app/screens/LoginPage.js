import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
// import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage({ navigation }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [refNo, setRefNo] = useState("");
  const [isRef, setIsRef] = useState(false);

  useEffect(() => {
    const getStoredRefNo = async () => {
      try {
        const storedRefNo = await AsyncStorage.getItem("refNo");
        const storedMobileNo = await AsyncStorage.getItem("mobileNo");
        if (storedRefNo !== null) {
          setRefNo(storedRefNo);
          setIsRef(true);
        }
        if (storedMobileNo !== null) {
          setMobileNumber(storedMobileNo);
        }
      } catch (error) {
        console.error("Error retrieving refNo from AsyncStorage:", error);
        setRefNo("");
        setIsRef(false);
      }
    };

    getStoredRefNo();
  }, []);

  const handleRefNo = async () => {
    try {
      const response = await fetch(
        `http://192.168.68.104:3000/idInfoID/${refNo}`
      );
      const data = await response.json();
      if (data && Object.keys(data).length === 1) {
        alert("Invalid Ref No");
        setIsRef(false);
      } else {
        await AsyncStorage.setItem("refNo", refNo);
        setIsRef(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `http://192.168.68.104:3000/idInfo/${mobileNumber}`
      );
      const data = await response.json();
      await AsyncStorage.setItem("mobileNo", mobileNumber);
      if (data && Object.keys(data).length === 1) {
        navigation.navigate("IDPage", {
          details: data,
          fromLoginPage: false,
        });
      } else {
        navigation.navigate("Details", {
          details: data,
          fromLoginPage: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const isFocused = useIsFocused();
  // useEffect(() => {
  //   if (isFocused) {
  //     setMobileNumber("");
  //   }
  // }, [isFocused]);

  window.refNo = refNo;
  window.mobileNo = mobileNumber;
  return (
    <View style={styles.container}>
      {isRef && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            top: -180,
            marginRight: -10,
          }}
        >
          <Button
            mode="contained"
            onPress={() => {
              setIsRef(false);
            }}
            style={styles.button}
          >
            Reset Ref.No.
          </Button>
        </View>
      )}
      {isRef ? (
        <>
          <TextInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setMobileNumber(text);
              }
            }}
            keyboardType="numeric"
            style={styles.input}
            maxLength={10}
          />
          <Button
            mode="contained"
            onPress={() => {
              if (mobileNumber.length === 10) {
                handleLogin();
              } else alert("Please Fill Mobile Number!!");
            }}
            style={styles.button}
          >
            Login
          </Button>
        </>
      ) : (
        <>
          <TextInput
            label="Ref Number"
            value={refNo}
            onChangeText={setRefNo}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={() => {
              if (refNo) {
                handleRefNo();
              }
            }}
            style={styles.button}
          >
            Check Ref Number
          </Button>
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
});

// {
//   "_id": { "$oid": "65d0763f088de7d4d989a580" },
//   "refNo": "65d03c9506da71540a1411f9",
//   "aadhar": "1231242",
//   "voterId": "1231242",
//   "mobileNo": { "$numberInt": "1231242" },
//   "name": "1231242",
//   "age": { "$numberInt": "1231242" },
//   "place": "1231242",
//   "district": "1231242",
//   "createdAt": { "$date": { "$numberLong": "1708160575930" } },
//   "updatedAt": { "$date": { "$numberLong": "1708160575930" } },
//   "__v": { "$numberInt": "0" }
// }
