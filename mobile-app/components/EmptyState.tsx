import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface EmptyStateProps {
    message: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    message,
    icon,
    actionLabel,
    onAction
}: EmptyStateProps) {
    const styles = StyleSheet.create({
        container: {
            padding: 32,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconContainer: {
            marginBottom: 16,
        },
        message: {
            color: '#9ca3af',
            textAlign: 'center',
            fontSize: 16,
            marginBottom: 16,
        },
        button: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            backgroundColor: '#025937',
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 14,
        },
    });

    return (
        <View style={styles.container}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.message}>{message}</Text>
            {actionLabel && onAction && (
                <TouchableOpacity style={styles.button} onPress={onAction}>
                    <Text style={styles.buttonText}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
