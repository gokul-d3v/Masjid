import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';

type StatusType = 'paid' | 'due' | 'overdue' | 'mayyathu' | 'regular';
type VariantType = 'filled' | 'text';

interface StatusBadgeProps {
    status: StatusType;
    label?: string;
    variant?: VariantType;
    style?: ViewStyle;
}

export default function StatusBadge({
    status,
    label,
    variant = 'text',
    style
}: StatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'paid':
                return {
                    label: label || 'Paid',
                    color: '#025937',
                    backgroundColor: '#d1fae5'
                };
            case 'due':
                return {
                    label: label || 'Due',
                    color: '#f59e0b',
                    backgroundColor: '#fef3c7'
                };
            case 'overdue':
                return {
                    label: label || 'Over Due',
                    color: '#ef4444',
                    backgroundColor: '#fee2e2'
                };
            case 'mayyathu':
                return {
                    label: label || 'Mayyathu Fund',
                    color: '#8b5cf6',
                    backgroundColor: '#ede9fe'
                };
            case 'regular':
                return {
                    label: label || 'Regular',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6'
                };
            default:
                return {
                    label: label || 'Unknown',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6'
                };
        }
    };

    const config = getStatusConfig();

    const styles = StyleSheet.create({
        badge: {
            paddingHorizontal: variant === 'filled' ? 8 : 0,
            paddingVertical: variant === 'filled' ? 4 : 0,
            borderRadius: variant === 'filled' ? 12 : 0,
            backgroundColor: variant === 'filled' ? config.backgroundColor : 'transparent',
        },
        text: {
            fontSize: 12,
            fontWeight: '600',
            color: config.color,
        },
    });

    return (
        <Text style={[styles.badge, styles.text, style]}>
            {config.label}
        </Text>
    );
}
