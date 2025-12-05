import React, { useState } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Input,
    InputField,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlError,
    FormControlErrorText,
    Toast,
    ToastTitle,
    useToast,
    ScrollView,
} from '@gluestack-ui/themed';
import { authService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const toast = useToast();
    const navigation = useNavigation();

    const validate = () => {
        const newErrors: any = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';

        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (phone && !/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await authService.register({
                name,
                email,
                password,
                phone: phone || undefined,
            });

            toast.show({
                placement: 'top',
                render: ({ id }: { id: string }) => (
                    <Toast nativeID={'toast-' + id} action="success" variant="accent">
                        <ToastTitle>Registration successful! Please login.</ToastTitle>
                    </Toast>
                ),
            });

            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            toast.show({
                placement: 'top',
                render: ({ id }: { id: string }) => (
                    <Toast nativeID={'toast-' + id} action="error" variant="accent">
                        <ToastTitle>{error.response?.data?.error || 'Registration failed'}</ToastTitle>
                    </Toast>
                ),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box flex={1} backgroundColor="$white">
            <ScrollView>
                <VStack space="lg" p="$6" pt="$16">
                    <VStack space="sm">
                        <Heading size="2xl">Create Account</Heading>
                        <Text color="$coolGray500">Sign up to get started</Text>
                    </VStack>

                    <FormControl isInvalid={!!errors.name}>
                        <FormControlLabel>
                            <FormControlLabelText>Full Name</FormControlLabelText>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="Enter your full name"
                                value={name}
                                onChangeText={setName}
                            />
                        </Input>
                        {errors.name && (
                            <FormControlError>
                                <FormControlErrorText>{errors.name}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.email}>
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
                        {errors.email && (
                            <FormControlError>
                                <FormControlErrorText>{errors.email}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.phone}>
                        <FormControlLabel>
                            <FormControlLabelText>Phone (Optional)</FormControlLabelText>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="10-digit phone number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </Input>
                        {errors.phone && (
                            <FormControlError>
                                <FormControlErrorText>{errors.phone}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                        <FormControlLabel>
                            <FormControlLabelText>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="At least 6 characters"
                                value={password}
                                onChangeText={setPassword}
                                type="password"
                                secureTextEntry
                            />
                        </Input>
                        {errors.password && (
                            <FormControlError>
                                <FormControlErrorText>{errors.password}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.confirmPassword}>
                        <FormControlLabel>
                            <FormControlLabelText>Confirm Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                type="password"
                                secureTextEntry
                            />
                        </Input>
                        {errors.confirmPassword && (
                            <FormControlError>
                                <FormControlErrorText>{errors.confirmPassword}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    <Button onPress={handleRegister} isDisabled={loading} mt="$4">
                        <ButtonText>{loading ? 'Creating Account...' : 'Sign Up'}</ButtonText>
                    </Button>

                    <Button variant="link" onPress={() => navigation.goBack()}>
                        <ButtonText>Already have an account? Login</ButtonText>
                    </Button>
                </VStack>
            </ScrollView>
        </Box>
    );
}
