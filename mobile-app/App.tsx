import React from 'react';
import { View } from 'react-native';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';

import AuthNavigator from './navigation/AuthNavigator';
// Main App Navigator
import MainNavigator from './navigation/MainNavigator';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserDetailScreen from './screens/UserDetailScreen';
import AddCollectionScreen from './screens/AddCollectionScreen';
import AddMemberScreen from './screens/AddMemberScreen';
import EditProfileScreen from './screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { userToken, isLoading } = useAuth();
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userToken == null ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <>
              <Stack.Screen name="Main" component={MainNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ headerShown: true, title: 'User Details', headerStyle: { backgroundColor: '#10b981' }, headerTintColor: '#fff' }} />
              <Stack.Screen name="AddCollection" component={AddCollectionScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AddMember" component={AddMemberScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true, title: 'Edit Profile', headerStyle: { backgroundColor: '#10b981' }, headerTintColor: '#fff' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
