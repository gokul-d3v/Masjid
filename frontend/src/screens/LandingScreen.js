import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LandingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={styles.content}>
        <Image
          source={require('../assets/Splash.png')} // Update this path to your splash image
          style={styles.banner}
        />
        <View style={styles.loadingIndicator}>
          <View style={styles.spinner} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  banner: {
    width: 250,
    height: 250,
    borderRadius: 125, // Makes it circular
    marginBottom: 30,
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20.0,
    elevation: 24,
  },
  loadingIndicator: {
    marginTop: 30,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderTopColor: '#0D6D3F',
    alignSelf: 'center',
    transform: [{ rotate: '0deg' }],
    ...Platform.select({
      ios: {
        // Animation would be handled differently in actual implementation
      },
      android: {
        // Animation would be handled differently in actual implementation
      }
    })
  },
});

export default LandingScreen;