import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator, TextInput as PaperTextInput } from 'react-native-paper';
import { authService } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const insets = useSafeAreaInsets();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
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
            paddingTop: 0,
        },
        content: {
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
        },
        inputContainer: {
            marginBottom: 16,
        },
        input: {
            backgroundColor: 'white',
        },
        errorText: {
            color: '#ef4444',
            fontSize: 12,
            marginTop: 4,
            marginLeft: 4,
        },
        buttonContainer: {
            marginTop: 20,
            backgroundColor: '#025937',
            paddingVertical: 6,
        },
        loginContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 20,
        },
        loginText: {
            fontSize: 14,
            color: '#6b7280',
        },
        loginLink: {
            fontSize: 14,
            color: '#025937',
            fontWeight: '600',
        },
        card: {
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 12,
            elevation: 2,
        }
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                title="Create Account"
                subtitle="Register to get started"
            />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>

                    <View style={styles.inputContainer}>
                        <PaperTextInput
                            mode="outlined"
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            activeOutlineColor="#025937"
                            outlineColor="#025937"
                            textColor="#000000"
                            left={<PaperTextInput.Icon icon={() => <User size={20} color="#6b7280" />} />}
                            error={!!errors.name}
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <PaperTextInput
                            mode="outlined"
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            activeOutlineColor="#025937"
                            outlineColor="#025937"
                            textColor="#000000"
                            left={<PaperTextInput.Icon icon={() => <Mail size={20} color="#6b7280" />} />}
                            error={!!errors.email}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <PaperTextInput
                            mode="outlined"
                            label="Phone"
                            value={phone}
                            onChangeText={setPhone}
                            style={styles.input}
                            keyboardType="phone-pad"
                            activeOutlineColor="#025937"
                            outlineColor="#025937"
                            textColor="#000000"
                            left={<PaperTextInput.Icon icon={() => <Phone size={20} color="#6b7280" />} />}
                            error={!!errors.phone}
                        />
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <PaperTextInput
                            mode="outlined"
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            secureTextEntry={!passwordVisible}
                            activeOutlineColor="#025937"
                            outlineColor="#025937"
                            textColor="#000000"
                            left={<PaperTextInput.Icon icon={() => <Lock size={20} color="#6b7280" />} />}
                            right={<PaperTextInput.Icon
                                icon={passwordVisible ? 'eye-off' : 'eye'}
                                onPress={() => setPasswordVisible(!passwordVisible)}
                            />}
                            error={!!errors.password}
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <PaperTextInput
                            mode="outlined"
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={styles.input}
                            secureTextEntry={!confirmPasswordVisible}
                            activeOutlineColor="#025937"
                            outlineColor="#025937"
                            textColor="#000000"
                            left={<PaperTextInput.Icon icon={() => <Lock size={20} color="#6b7280" />} />}
                            right={<PaperTextInput.Icon
                                icon={confirmPasswordVisible ? 'eye-off' : 'eye'}
                                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            />}
                            error={!!errors.confirmPassword}
                        />
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    <PaperButton
                        mode="contained"
                        style={styles.buttonContainer}
                        onPress={handleRegister}
                        disabled={loading}
                        labelStyle={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </PaperButton>
                </Animatable.View>

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