import React from 'react';
import { Fab, FabIcon } from '@gluestack-ui/themed';
import { Plus } from 'lucide-react-native';

interface FloatingActionButtonProps {
    onPress: () => void;
    icon?: React.ReactNode;
}

export default function FloatingActionButton({ onPress, icon }: FloatingActionButtonProps) {
    return (
        <Fab
            size="lg"
            placement="bottom right"
            onPress={onPress}
            bg="$primary600"
            $hover-bg="$primary700"
        >
            <FabIcon as={icon || Plus} color="$white" />
        </Fab>
    );
}
