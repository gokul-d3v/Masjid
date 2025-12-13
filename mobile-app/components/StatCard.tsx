import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
    icon: React.ComponentType<any>;
    iconColor: string;
    label: string;
    value: string | number;
    dateText?: string;
}

export default function StatCard({
    icon: Icon,
    iconColor,
    label,
    value,
    dateText
}: StatCardProps) {
    const styles = StyleSheet.create({
        container: {
            width: '48%',
            marginBottom: 12,
        },
        content: {
            padding: 16,
            backgroundColor: 'white',
            borderRadius: 12,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        iconContainer: {
            backgroundColor: iconColor + '10',
            padding: 8,
            borderRadius: 999,
        },
        dateText: {
            fontSize: 12,
            color: '#9ca3af',
        },
        label: {
            fontSize: 14,
            color: '#9ca3af',
            fontWeight: '500',
            marginBottom: 4,
        },
        value: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#374151',
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: iconColor + '10' }]}>
                        <Icon size={16} color={iconColor} />
                    </View>
                    {dateText && <Text style={styles.dateText}>{dateText}</Text>}
                </View>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
}
