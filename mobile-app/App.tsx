import React from 'react';
import { View, Text } from 'react-native';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import AuthNavigator from './navigation/AuthNavigator';
// Main App Navigator
import MainNavigator from './navigation/MainNavigator';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserDetailScreen from './screens/UserDetailScreen';
import AddCollectionScreen from './screens/AddCollectionScreen';
import AddMemberScreen from './screens/AddMemberScreen';

const toastConfig = {
  success: ({ text1, text2, props }: { text1?: string; text2?: string; props?: any }) => (
    <View style={{ backgroundColor: '#025937', padding: 15, borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginRight: 10 }} />
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{text1}</Text>
          <Text style={{ fontSize: 14, color: '#fff', opacity: 0.9 }}>{text2}</Text>
        </View>
      </View>
    </View>
  ),
  error: ({ text1, text2, props }: { text1?: string; text2?: string; props?: any }) => (
    <View style={{ backgroundColor: '#ef4444', padding: 15, borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginRight: 10 }} />
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{text1}</Text>
          <Text style={{ fontSize: 14, color: '#fff', opacity: 0.9 }}>{text2}</Text>
        </View>
      </View>
    </View>
  ),
  info: ({ text1, text2, props }: { text1?: string; text2?: string; props?: any }) => (
    <View style={{ backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginRight: 10 }} />
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{text1}</Text>
          <Text style={{ fontSize: 14, color: '#fff', opacity: 0.9 }}>{text2}</Text>
        </View>
      </View>
    </View>
  ),
};

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
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {userToken == null ? (
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{ animation: 'fade' }}
            />
          ) : (
            <>
              <Stack.Screen name="Main" component={MainNavigator} />
              <Stack.Screen
                name="UserDetail"
                component={UserDetailScreen}
                options={{
                  headerShown: true,
                  title: 'User Details',
                  headerStyle: { backgroundColor: '#025937' },
                  headerTintColor: '#fff',
                  animation: 'slide_from_right'
                }}
              />
              <Stack.Screen
                name="AddCollection"
                component={AddCollectionScreen}
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom'
                }}
              />
              <Stack.Screen
                name="AddMember"
                component={AddMemberScreen}
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom'
                }}
              />
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
            <Toast config={toastConfig} topOffset={60} />
          </AuthProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
