import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnnouncementPayload } from "../types";

const MessageItem = ({ message, numbers }: AnnouncementPayload) => (
  <View style={styles.message}>
    <Text>{message}</Text>
    <Text style={styles.numbers}>{numbers.join(", ")}</Text>
  </View>
);

const styles = StyleSheet.create({
  message: {
    padding: 10,
    backgroundColor: "white",
    marginBottom: 5,
    borderRadius: 5,
  },
  numbers: {
    marginTop: 5,
    color: "gray",
    fontSize: 14,
  },
});

export default MessageItem;
