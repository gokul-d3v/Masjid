import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { Plus } from 'lucide-react-native';

interface FloatingActionButtonProps {
    onPress: () => void;
    icon?: React.ReactNode;
}

export default function FloatingActionButton({ onPress, icon }: FloatingActionButtonProps) {
    const styles = StyleSheet.create({
        fab: {
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#059669', // green600
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },
        fabIcon: {
            color: 'white',
        },
    });

    const IconComponent = icon || <Plus size={24} color="white" />;

    return (
        <Portal>
            <TouchableOpacity
                style={styles.fab}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {React.isValidElement(IconComponent) ? 
                    IconComponent : 
                    <Plus size={24} color="white" />
                }
            </TouchableOpacity>
        </Portal>
    );
}