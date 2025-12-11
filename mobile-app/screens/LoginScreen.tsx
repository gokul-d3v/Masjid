import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import {
    Button as PaperButton,
    TextInput as PaperTextInput,
    Checkbox,
} from 'react-native-paper';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    const { signIn } = useAuth();
    const navigation = useNavigation<any>();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Error', 'Email and password are required');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            const { token, user } = response.data;

            await signIn(token, user);
            // The App component will automatically redirect to Main navigator since token is now set
            // We can optionally show the success message and let the context change handle navigation
            Alert.alert('Success', 'Login successful!', [
                {
                    text: 'OK',
                }
            ]);

        } catch (error: any) {
            console.error(error);
            Alert.alert('Login Failed', error.response?.data?.error || 'Check your credentials and try again');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        Alert.alert('Forgot Password', 'Password reset functionality would be implemented here');
    };

    const handleSocialLogin = (platform: string) => {
        Alert.alert(`${platform} Login`, `${platform} login functionality would be implemented here`);
    };

    const handleCreateAccount = () => {
        navigation.navigate('Register');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                {/* Logo Area */}
                <View style={styles.logoContainer}>
                    <Image source={require('../assets/Splash.png')} style={styles.appLogo} />
                    <Text style={styles.appName}>KUTHIYATHODE MUSLIM JAMAHTH MAHALLU</Text>
                </View>

                <Text style={styles.title}>Sign in</Text>


                {/* Email Input */}
                <PaperTextInput
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    style={[styles.input, { backgroundColor: '#ffffff' }]}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    activeOutlineColor="#10b981"
                    outlineColor="#10b981"
                    textColor="#000000"
                    left={<PaperTextInput.Icon icon={() => <Mail size={20} color="#6b7280" />} />}
                />

                {/* Password Input */}
                <PaperTextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={[styles.input, { backgroundColor: '#ffffff' }]}
                    mode="outlined"
                    secureTextEntry={!passwordVisible}
                    activeOutlineColor="#10b981"
                    outlineColor="#10b981"
                    textColor="#000000"
                    left={<PaperTextInput.Icon icon={() => <Lock size={20} color="#6b7280" />} />}
                    right={<PaperTextInput.Icon
                        icon={passwordVisible ? 'eye-off' : 'eye'}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    />}
                />

                {/* Forgot Password Link */}
                <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                {/* Remember Me Checkbox */}
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={rememberMe ? 'checked' : 'unchecked'}
                        onPress={() => setRememberMe(!rememberMe)}
                        uncheckedColor="#6b7280"
                        color="#143D30"
                    />
                    <Text style={styles.checkboxText}>
                        I agree to the {' '}
                        <Text style={styles.accentText}>User Agreement</Text>
                        {' '} and {' '}
                        <Text style={styles.accentText}>Privacy Policy</Text>
                    </Text>
                </View>

                {/* Sign In Button */}
                <PaperButton
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    style={styles.signInButton}
                    labelStyle={styles.buttonLabel}
                >
                    {loading ? null : 'Sign in'}
                </PaperButton>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>other way to sign in</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Login Options */}
                <View style={styles.socialLoginContainer}>
                    <TouchableOpacity
                        style={[styles.socialButton, styles.googleButton]}
                        onPress={() => handleSocialLogin('Google')}
                    >
                        <Text style={styles.socialButtonText}>G</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.socialButton, styles.facebookButton]}
                        onPress={() => handleSocialLogin('Facebook')}
                    >
                        <Text style={styles.socialButtonText}>f</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Text */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        Don't have an account? {' '}
                    </Text>
                    <TouchableOpacity onPress={handleCreateAccount}>
                        <Text style={styles.createAccountText}>
                            Create Account
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff', // Pure white background
    },
    formContainer: {
        flex: 1,
        maxWidth: 1400,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    appLogo: {
        width: 240,
        height: 240,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    appName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 24,
        textAlign: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b', // Dark gray
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#143D30', // Forest green
        fontWeight: '500',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxText: {
        fontSize: 14,
        color: '#64748b', // Light gray
        flex: 1,
        marginLeft: 8,
    },
    accentText: {
        color: '#143D30', // Forest green
        fontWeight: '600',
    },
    signInButton: {
        backgroundColor: '#143D30', // Deep forest green
        borderRadius: 8,
        paddingVertical: 8,
        marginBottom: 24,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0', // Light gray
    },
    dividerText: {
        fontSize: 14,
        color: '#64748b', // Light gray
        marginHorizontal: 16,
    },
    socialLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        borderWidth: 1,
    },
    googleButton: {
        backgroundColor: 'transparent',
        borderColor: '#e2e8f0',
    },
    facebookButton: {
        backgroundColor: 'transparent',
        borderColor: '#e2e8f0',
    },
    socialButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#64748b', // Light gray
    },
    createAccountText: {
        fontSize: 14,
        color: '#143D30', // Forest green
        fontWeight: '600',
    },
});