import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Card as PaperCard, Button as PaperButton } from 'react-native-paper';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
}: ConfirmDialogProps) {
    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalView: {
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 20,
            width: '80%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: '#1f2937',
        },
        message: {
            fontSize: 16,
            color: '#6b7280',
            marginBottom: 20,
            textAlign: 'center',
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        button: {
            flex: 1,
            marginHorizontal: 5,
        },
        destructiveButton: {
            backgroundColor: '#ef4444',
        },
        cancelButton: {
            backgroundColor: '#d1d5db',
        },
        confirmButton: {
            backgroundColor: '#025937',
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <PaperCard style={styles.modalView}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        <PaperButton
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>{cancelText}</Text>
                        </PaperButton>
                        <PaperButton
                            style={[
                                styles.button,
                                isDestructive ? styles.destructiveButton : styles.confirmButton
                            ]}
                            onPress={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            <Text style={styles.buttonText}>{confirmText}</Text>
                        </PaperButton>
                    </View>
                </PaperCard>
            </View>
        </Modal>
    );
}