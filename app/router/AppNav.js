import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginPage from "../screens/LoginPage";
import IDPage from "../screens/IDPage";
import DetailsPage from "../screens/DetailsPage";

const Stack = createStackNavigator();

export default function AppNav() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: "#21005D" },
        headerTintColor: "white",
        headerShown: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="IDPage" component={IDPage} />
      <Stack.Screen name="Details" component={DetailsPage} />
    </Stack.Navigator>
  );
}
