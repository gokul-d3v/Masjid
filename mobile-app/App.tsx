import React from 'react';
import { GluestackUIProvider, Text, Box } from '@gluestack-ui/themed';
import { config as defaultConfig } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthNavigator from './navigation/AuthNavigator';
// Main App Navigator
import MainNavigator from './navigation/MainNavigator';
import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={defaultConfig}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
