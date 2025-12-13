import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterMenuProps {
    visible: boolean;
    onClose: () => void;
    options: FilterOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

export default function FilterMenu({
    visible,
    onClose,
    options,
    selectedValue,
    onSelect
}: FilterMenuProps) {
    const handleSelect = (value: string) => {
        onSelect(value);
        onClose();
    };

    const styles = StyleSheet.create({
        modalBackdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 8,
            minWidth: 150,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        modalItem: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 4,
        },
        selectedFilter: {
            backgroundColor: '#f0f9ff',
        },
        modalItemText: {
            fontSize: 16,
            color: '#1f2937',
        },
    });

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalBackdrop}
                onPress={onClose}
                activeOpacity={1}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.modalItem,
                                    selectedValue === option.value ? styles.selectedFilter : {}
                                ]}
                                onPress={() => handleSelect(option.value)}
                            >
                                <Text style={styles.modalItemText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}
