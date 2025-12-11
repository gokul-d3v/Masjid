import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const { user, updateUser } = useAuth();
    const navigation = useNavigation<any>();

    useEffect(() => {
        // Load existing profile data
        if (user) {
            setName(user.fullName || user.name || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const validate = () => {
        const newErrors: any = {};
        
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            // In a real app, this would update the profile
            const updatedUserData = { ...user, fullName: name, phone };
            await profileService.updateProfile(updatedUserData);
            
            // Update auth context
            updateUser(updatedUserData);
            
            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb',
            paddingTop: 40,
        },
        content: {
            padding: 16,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        backButton: {
            marginRight: 10,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1f2937',
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
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{ fontSize: 20, color: '#059669' }}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit Profile</Text>
                </View>

                <PaperCard style={{ padding: 16, marginBottom: 16 }}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter full name"
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone *</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter phone number"
                            keyboardType="phone-pad"
                        />
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                    </View>

                    <PaperButton
                        style={styles.buttonContainer}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                Save Changes
                            </Text>
                        )}
                    </PaperButton>
                </PaperCard>
            </ScrollView>
        </View>
    );
}