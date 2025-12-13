import React from 'react';
import { View, Text, Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { XCircle } from 'lucide-react-native';

interface DetailModalAction {
    label: string;
    onPress: () => void;
    variant?: 'outlined' | 'contained';
    color?: string;
}

interface DetailModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    actions?: DetailModalAction[];
}

export default function DetailModal({
    visible,
    onClose,
    title,
    children,
    actions = []
}: DetailModalProps) {
    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainer: {
            backgroundColor: 'white',
            borderRadius: 12,
            width: '90%',
            maxHeight: '80%',
            overflow: 'hidden',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1f2937',
            flex: 1,
        },
        closeButton: {
            padding: 4,
        },
        content: {
            flex: 1,
            padding: 16,
        },
        actionsContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10,
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
        },
        actionButton: {
            flex: 1,
            maxWidth: 150,
        },
    });

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <XCircle size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {children}
                    </ScrollView>

                    {actions.length > 0 && (
                        <View style={styles.actionsContainer}>
                            {actions.map((action, index) => (
                                <PaperButton
                                    key={index}
                                    mode={action.variant || 'outlined'}
                                    onPress={action.onPress}
                                    style={[
                                        styles.actionButton,
                                        action.variant === 'contained' && action.color
                                            ? { backgroundColor: action.color }
                                            : {}
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color: action.variant === 'contained'
                                                ? 'white'
                                                : action.color || '#059669'
                                        }}
                                    >
                                        {action.label}
                                    </Text>
                                </PaperButton>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}
