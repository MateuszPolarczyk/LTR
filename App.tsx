import React, { useState } from "react";
import { StyleSheet, Alert, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import { loginUser, getCurrentUser, logoutUser } from "./services/api";
import { connectToSocket } from "./services/socket";
import { AnnouncementPayload } from "./types";

const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<AnnouncementPayload[]>([]);
  const [socketState, setSocketState] = useState({
    socket: null as any,
    channel: null as any,
    isConnected: false,
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      if (!email?.trim() || !password?.trim()) {
        Alert.alert("Validation Error", "Email and password are required");
        return;
      }

      let res;
      try {
        res = await loginUser(email, password);
      } catch (axiosError) {
        const error = axiosError as {
          response?: {
            status: number;
            data?: {
              success?: boolean;
              error?: { message?: string };
            };
          };
          message?: string;
        };

        if (error.response?.status === 401) {
          Alert.alert(
            "Login Failed",
            error.response?.data?.error?.message || "Invalid email or password"
          );
        } else {
          Alert.alert(
            "Login Error",
            error.response?.data?.error?.message ||
              error.message ||
              "Login failed"
          );
        }
        return;
      }

      if (!res?.success) {
        Alert.alert(
          "Login Failed",
          res?.error?.message || "Authentication failed"
        );
        return;
      }

      if (!res.data?.token) {
        Alert.alert("Login Error", "No authentication token received");
        return;
      }

      const userToken = res.data.token;
      setToken(userToken);

      let meRes;
      try {
        meRes = await getCurrentUser(userToken);
      } catch (meError) {
        const error = meError as {
          response?: {
            data?: {
              error?: { message?: string };
            };
          };
          message?: string;
        };

        Alert.alert(
          "Session Error",
          error.response?.data?.error?.message || "Failed to verify session"
        );
        setToken(null);
        return;
      }

      if (!meRes?.success) {
        Alert.alert(
          "Session Error",
          meRes?.error?.message || "Failed to verify session"
        );
        setToken(null);
        return;
      }

      console.log("Authenticated user:", meRes.data?.user);

      try {
        const { socket, channel } = connectToSocket(
          userToken,
          (payload) => setMessages((prev) => [...prev, payload]),
          () => {
            console.log("Socket connected");
            setSocketState((prev) => ({ ...prev, isConnected: true }));
          },
          (err) => {
            console.error("Socket error:", err);
            setSocketState((prev) => ({ ...prev, isConnected: false }));
            Alert.alert("Connection Error", "Realtime updates unavailable");
          },
          () => {
            console.warn("Socket disconnected");
            setSocketState((prev) => ({ ...prev, isConnected: false }));
          }
        );

        setSocketState({ socket, channel, isConnected: true });
      } catch (socketError) {
        console.error("Socket connection failed:", socketError);
        Alert.alert("Connection Warning", "Realtime features may not work");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      Alert.alert(
        "Error",
        "An unexpected error occurred during login. Please try again."
      );
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        const res = await logoutUser(token);
        if (!res.success) {
          console.warn("Logout failed:", res.error?.message);
        }
      }
    } catch (err: any) {
      console.warn("Logout error:", err.message);
    } finally {
      socketState.channel?.leave?.();
      socketState.socket?.disconnect?.();

      setToken(null);
      setMessages([]);
      setSocketState({ socket: null, channel: null, isConnected: false });
    }
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
