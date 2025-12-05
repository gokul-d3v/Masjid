import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Splash Screen</Text>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;