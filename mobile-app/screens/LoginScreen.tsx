import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import {
    Button as PaperButton,
    TextInput as PaperTextInput,
    Checkbox,
} from 'react-native-paper';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { signIn } = useAuth();
    const navigation = useNavigation<any>();

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Email and password are required',
            });
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            const { token, user } = response.data;

            await signIn(token, user);
            Toast.show({
                type: 'success',
                text1: 'Welcome to KMJM',
                text2: 'Successfully signed in',
            });

        } catch (error: any) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.response?.data?.error || 'Invalid credentials',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = () => {
        navigation.navigate('Register');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.backgroundHeader} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animatable.View
                    animation="fadeInUp"
                    duration={800}
                    style={styles.cardContainer}
                >
                    {/* Logo Section */}
                    <View style={styles.logoWrapper}>
                        <View style={styles.logoBackground}>
                            <Image
                                source={require('../assets/Splash2.png')}
                                style={styles.logo}
                            />
                        </View>
                        <Text style={styles.brandTitle}>KMJM</Text>
                        <Text style={styles.brandSubtitle}>KUTHIYATHODE MUSLIM JAMAHTH MAHALLU</Text>
                    </View>

                    <Text style={styles.welcomeText}>Welcome Back</Text>
                    <Text style={styles.instructionText}>Sign in to continue to your dashboard</Text>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <PaperTextInput
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            outlineColor="#e2e8f0"
                            activeOutlineColor="#025937"
                            textColor="#1e293b"
                            theme={{ roundness: 12 }}
                            left={<PaperTextInput.Icon icon={() => <Mail size={18} color="#64748b" />} />}
                        />

                        <PaperTextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            mode="outlined"
                            secureTextEntry={!passwordVisible}
                            outlineColor="#e2e8f0"
                            activeOutlineColor="#025937"
                            textColor="#1e293b"
                            theme={{ roundness: 12 }}
                            left={<PaperTextInput.Icon icon={() => <Lock size={18} color="#64748b" />} />}
                            right={
                                <PaperTextInput.Icon
                                    icon={() => passwordVisible ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                />
                            }
                        />

                        <View style={styles.optionsRow}>
                            <View style={styles.rememberMeContainer}>
                                <Checkbox.Android
                                    status={rememberMe ? 'checked' : 'unchecked'}
                                    onPress={() => setRememberMe(!rememberMe)}
                                    color="#025937"
                                    uncheckedColor="#cbd5e1"
                                />
                                <Text style={styles.rememberText}>Remember me</Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <PaperButton
                            mode="contained"
                            onPress={handleLogin}
                            loading={loading}
                            disabled={loading}
                            style={styles.loginButton}
                            labelStyle={styles.loginButtonLabel}
                            contentStyle={{ height: 50 }}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </PaperButton>

                        {/* Social Login Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.divider} />
                        </View>

                        {/* Register Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={handleCreateAccount}>
                                <Text style={styles.signupText}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animatable.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc', // Slate-50 - Very light cool gray
    },
    backgroundHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.35,
        backgroundColor: '#025937', // Dark green brand color
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    cardContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    logoWrapper: {
        alignItems: 'center',
        marginTop: -100,
        marginBottom: 20,
    },
    logoBackground: {
        width: 170,
        height: 170,
        backgroundColor: '#ffffff',
        borderRadius: 42, // Squircle
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 16,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    brandTitle: {
        fontSize: 28,
        fontWeight: '800', // ExtraBold
        color: '#0f172a', // Slate-900
        letterSpacing: 2,
        marginBottom: 4,
    },
    brandSubtitle: {
        fontSize: 10,
        fontWeight: '600',
        color: '#64748b', // Slate-500
        textAlign: 'center',
        letterSpacing: 1,
        maxWidth: 240,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1e293b',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 4,
    },
    instructionText: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 30,
    },
    formSection: {
        width: '100%',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#f8fafc',
        fontSize: 15,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -4, // Offset native checkbox padding
    },
    rememberText: {
        fontSize: 13,
        color: '#64748b',
    },
    forgotText: {
        fontSize: 13,
        color: '#025937',
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#025937',
        borderRadius: 12,
        marginBottom: 20,
        elevation: 4,
        shadowColor: "#025937",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    loginButtonLabel: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#64748b',
    },
    signupText: {
        fontSize: 14,
        color: '#025937',
        fontWeight: '700',
    },
});