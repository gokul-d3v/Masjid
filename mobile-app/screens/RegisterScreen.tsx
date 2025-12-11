import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Linking } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { authService } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const navigation = useNavigation<any>();

    const validate = () => {
        const newErrors: any = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
        if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits';

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
                phone,
            });

            Alert.alert(
                'Success', 
                'Registration successful! Please check your email to verify your account.', 
                [
                    { text: 'OK', onPress: () => navigation.navigate('Login') }
                ]
            );
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb',
            paddingTop: 80,
        },
        content: {
            flex: 1,
            paddingHorizontal: 20,
        },
        header: {
            marginBottom: 30,
            alignItems: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 16,
            color: '#6b7280',
            textAlign: 'center',
        },
        inputContainer: {
            marginBottom: 16,
        },
        label: {
            fontSize: 16,
            fontWeight: '500',
            color: '#374151',
            marginBottom: 8,
        },
        input: {
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            backgroundColor: 'white',
        },
        errorText: {
            color: '#ef4444',
            fontSize: 12,
            marginTop: 4,
        },
        buttonContainer: {
            marginTop: 20,
        },
        loginContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
        },
        loginText: {
            fontSize: 14,
            color: '#6b7280',
        },
        loginLink: {
            fontSize: 14,
            color: '#10b981',
            fontWeight: '500',
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Register to get started</Text>
                </View>

                <PaperCard style={{ padding: 20 }}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your full name"
                            autoCapitalize="words"
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone"
                            keyboardType="phone-pad"
                        />
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm your password"
                            secureTextEntry
                        />
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    <PaperButton
                        style={styles.buttonContainer}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                Sign Up
                            </Text>
                        )}
                    </PaperButton>
                </PaperCard>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}