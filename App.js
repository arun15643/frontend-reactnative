import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNav from "./app/router/AppNav";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <AppNav />
      </NavigationContainer>
    </>
  );
}
