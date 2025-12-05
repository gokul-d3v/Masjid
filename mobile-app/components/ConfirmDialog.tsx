import React from 'react';
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Button,
    ButtonText,
    Heading,
    Text,
} from '@gluestack-ui/themed';

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
    return (
        <AlertDialog isOpen={isOpen} onClose={onClose}>
            <AlertDialogBackdrop />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <Heading size="lg">{title}</Heading>
                </AlertDialogHeader>
                <AlertDialogBody>
                    <Text>{message}</Text>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button variant="outline" onPress={onClose} mr="$2">
                        <ButtonText>{cancelText}</ButtonText>
                    </Button>
                    <Button
                        bg={isDestructive ? '$error600' : '$primary600'}
                        onPress={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        <ButtonText>{confirmText}</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
