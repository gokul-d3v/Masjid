import React, { useState } from 'react';
import { Box, Text, Input, InputField, Button, ButtonText, VStack, Heading, FormControl, FormControlLabel, FormControlLabelText, Toast, ToastTitle, useToast } from '@gluestack-ui/themed';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const toast = useToast();

    const handleLogin = async () => {
        if (!email || !password) {
            toast.show({
                placement: 'top',
                render: ({ id }: { id: string }) => {
                    return (
                        <Toast nativeID={'toast-' + id} action="error" variant="accent">
                            <ToastTitle>Please fill in all fields</ToastTitle>
                        </Toast>
                    )
                },
            });
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            const { token, user } = response.data;

            // Use AuthContext to sign in - this will automatically trigger navigation
            await signIn(token, user);

            // Show success message
            toast.show({
                placement: 'top',
                render: ({ id }: { id: string }) => {
                    return (
                        <Toast nativeID={'toast-' + id} action="success" variant="accent">
                            <ToastTitle>Login successful!</ToastTitle>
                        </Toast>
                    )
                },
            });

        } catch (error: any) {
            console.error(error);
            toast.show({
                placement: 'top',
                render: ({ id }: { id: string }) => {
                    return (
                        <Toast nativeID={'toast-' + id} action="error" variant="accent">
                            <ToastTitle>{error.response?.data?.error || error.response?.data?.message || 'Login failed'}</ToastTitle>
                        </Toast>
                    )
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box flex={1} justifyContent="center" p="$4" backgroundColor="$white">
            <VStack space="xl">
                <Heading size="xl" textAlign="center">Welcome Back</Heading>

                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>Email</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                        <InputField
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </Input>
                </FormControl>

                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>Password</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                        <InputField
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            type="password"
                            secureTextEntry
                        />
                    </Input>
                </FormControl>

                <Button onPress={handleLogin} isDisabled={loading}>
                    <ButtonText>{loading ? 'Logging in...' : 'Login'}</ButtonText>
                </Button>
            </VStack>
        </Box>
    );
}
