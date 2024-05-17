import { View, Text } from "react-native";
import React from "react";

//Reusable componet for api calls
export const FetchApiCall = (setData, url, body = "", isJson = true) => {
  return async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: body,
      });
      let json;
      if (isJson) {
        json = await response.json();
      } else {
        json = await response.text();
      }
      setData(json);
    } catch (error) {
      console.error(error, url);
      alert(error, url);
    }
  };
};
