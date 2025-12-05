import React from 'react';
import { Box, Button, ButtonText, VStack, Heading, Avatar, AvatarFallbackText, Text, Center } from '@gluestack-ui/themed';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
    const { signOut } = useAuth();

    return (
        <Box flex={1} backgroundColor="$white" pt="$10" p="$4">
            <Center mt="$10">
                <Avatar bgColor="$primary500" size="xl" borderRadius="$full">
                    <AvatarFallbackText>Admin</AvatarFallbackText>
                </Avatar>
                <Heading size="xl" mt="$4">Admin User</Heading>
                <Text color="$coolGray500">admin@example.com</Text>
            </Center>

            <VStack space="md" mt="$10">
                <Button action="negative" onPress={signOut}>
                    <ButtonText>Logout</ButtonText>
                </Button>
            </VStack>
        </Box>
    );
}
