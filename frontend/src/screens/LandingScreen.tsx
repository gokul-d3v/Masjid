import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

type LandingScreenNavigationProp = {
  replace: (screenName: string) => void;
};

const LandingScreen = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/Splash.png')}
          style={styles.banner}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D6D3F" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  banner: ImageStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
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
    width: '100%',
    paddingHorizontal: 20,
  },
  banner: {
    width: width * 0.7, // Responsive to screen width
    height: width * 0.7, // Keep it circular
    borderRadius: (width * 0.7) / 2, // Perfect circle
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
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0D6D3F',
    fontWeight: '600',
  },
});

export default LandingScreen;