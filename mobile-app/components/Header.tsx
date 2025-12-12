import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  leftComponent,
  containerStyle,
  titleStyle,
  subtitleStyle,
  onBackPress
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
      width: '100%',
      backgroundColor: 'transparent',
    },
    headerContent: {
      flex: 1,
      marginRight: rightComponent ? 12 : 0,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000000',
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#9ca3af',
      marginTop: 4,
    },
    leftComponentContainer: {
      marginRight: 12,
    },
    rightComponentContainer: {
      marginLeft: 12,
      alignItems: 'flex-end',
      justifyContent: 'center',
      alignSelf: 'stretch',
    }
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {leftComponent ? (
        <View style={styles.leftComponentContainer}>
          {leftComponent}
        </View>
      ) : onBackPress ? (
        <View style={styles.leftComponentContainer}>
          <PaperButton onPress={onBackPress} mode="text">
            <Text style={{ fontSize: 16, color: theme.colors.primary }}>Back</Text>
          </PaperButton>
        </View>
      ) : null}
      
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.headerSubtitle, subtitleStyle]}>{subtitle}</Text>
        ) : null}
      </View>
      
      {rightComponent && (
        <View style={styles.rightComponentContainer}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

export default Header;