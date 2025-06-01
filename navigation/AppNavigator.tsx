import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginForm from "../components/LoginForm";
import FeedScreen from "../screens/FeedScreen";

export type RootStackParamList = {
  Login: undefined;
  Feed: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = ({
  token,
  onLogin,
  onLogout,
  messages,
  isConnected,
}: {
  token: string | null;
  onLogin: (email: string, password: string) => void;
  onLogout: () => void;
  messages: any[];
  isConnected: boolean;
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Login">
            {() => <LoginForm onLogin={onLogin} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Feed">
            {() => (
              <FeedScreen
                messages={messages}
                onLogout={onLogout}
                isConnected={isConnected}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
