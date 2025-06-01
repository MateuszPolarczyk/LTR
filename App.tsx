import React, { useState } from "react";
import { StyleSheet, Alert, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import { loginUser } from "./services/api";
import { connectToSocket } from "./services/socket";
import { AnnouncementPayload } from "./types";

const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<AnnouncementPayload[]>([]);
  const [socketState, setSocketState] = useState<{
    socket: any | null;
    channel: any | null;
    isConnected: boolean;
  }>({ socket: null, channel: null, isConnected: false });

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await loginUser(email, password);
      if (res.success) {
        const userToken = res.data.token;
        setToken(userToken);

        const { socket, channel } = connectToSocket(
          userToken,
          (payload) => setMessages((prev) => [...prev, payload]),
          () => setSocketState((s) => ({ ...s, isConnected: true })),
          (err) => {
            console.log("Socket error", err);
            setSocketState((s) => ({ ...s, isConnected: false }));
          },
          () => setSocketState((s) => ({ ...s, isConnected: false }))
        );

        setSocketState({ socket, channel, isConnected: true });
      } else {
        Alert.alert("Login failed", res.error?.message || "Unknown error");
      }
    } catch (err: any) {
      Alert.alert("Login Error", err.message);
    }
  };

  const handleLogout = () => {
    socketState.channel?.leave?.();
    socketState.socket?.disconnect?.();

    setToken(null);
    setMessages([]);
    setSocketState({ socket: null, channel: null, isConnected: false });
  };

  return (
    <View style={styles.container}>
      <AppNavigator
        token={token}
        onLogin={handleLogin}
        onLogout={handleLogout}
        messages={messages}
        isConnected={socketState.isConnected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
