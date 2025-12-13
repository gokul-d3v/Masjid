import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingIndicatorProps {
    message?: string;
    fullScreen?: boolean;
    color?: string;
}

export default function LoadingIndicator({
    message = 'Loading...',
    fullScreen = true,
    color = '#025937'
}: LoadingIndicatorProps) {
    const styles = StyleSheet.create({
        container: {
            flex: fullScreen ? 1 : undefined,
            justifyContent: 'center',
            alignItems: 'center',
            padding: fullScreen ? 0 : 20,
            backgroundColor: fullScreen ? '#f9fafb' : 'transparent',
        },
        message: {
            marginTop: 12,
            fontSize: 16,
            color: '#6b7280',
        },
    });

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={color} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
}
