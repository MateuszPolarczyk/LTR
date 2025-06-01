import React from "react";
import { View, Button, ScrollView, Text, StyleSheet } from "react-native";
import MessageItem from "../components/MessageItem";
import { AnnouncementPayload } from "../types";

interface FeedScreenProps {
  messages: AnnouncementPayload[];
  onLogout: () => void;
  isConnected: boolean;
}

const FeedScreen = ({ messages, onLogout, isConnected }: FeedScreenProps) => (
  <View style={styles.container}>
    <Text style={styles.status}>
      Status: {isConnected ? "Connected" : "Disconnected"}
    </Text>
    <Button title="Logout" onPress={onLogout} />
    <ScrollView style={styles.messagesContainer}>
      {messages.map((msg, index) => (
        <MessageItem key={index} {...msg} />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  status: { fontSize: 16, marginBottom: 10, textAlign: "center" },
  messagesContainer: { flex: 1, marginTop: 20 },
});

export default FeedScreen;
