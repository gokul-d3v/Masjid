import React from 'react';
import { View, Text as RNText, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertBoxProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  buttons?: AlertButton[];
  onClose: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({ 
  visible, 
  title, 
  message, 
  type = 'info', 
  buttons = [{ text: 'OK' }], 
  onClose 
}) => {
  if (!visible) return null;

  const getAlertIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} color="#10B981" />;
      case 'error':
        return <XCircle size={24} color="#EF4444" />;
      case 'warning':
        return <AlertTriangle size={24} color="#F59E0B" />;
      default:
        return <Info size={24} color="#3B82F6" />;
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  return (
    <View style={styles.alertOverlay}>
      <View style={styles.alertContainer}>
        <View style={styles.alertHeader}>
          {getAlertIcon()}
          <RNText style={styles.alertTitle}>{title}</RNText>
        </View>
        <RNText style={styles.alertMessage}>{message}</RNText>
        <View style={styles.alertButtonContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.alertButton,
                button.style === 'destructive' || button.style === 'cancel'
                  ? styles.alertButtonSecondary
                  : styles.alertButtonPrimary
              ]}
              onPress={() => handleButtonPress(button)}
            >
              <RNText
                style={[
                  styles.alertButtonText,
                  (button.style === 'destructive' || button.style === 'cancel')
                    ? styles.alertButtonSecondaryText
                    : {}
                ]}
              >
                {button.text}
              </RNText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 10,
  },
  alertMessage: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 20,
    lineHeight: 20,
  },
  alertButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  alertButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  alertButtonPrimary: {
    backgroundColor: '#059669', // emerald-600
  },
  alertButtonSecondary: {
    backgroundColor: '#d1d5db', // gray-300
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  alertButtonSecondaryText: {
    color: '#374151',
  },
});

export default AlertBox;