import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card as PaperCard, Button as PaperButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { User, Mail, Phone, Briefcase, Calendar, Edit3, LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
    const [profileData, setProfileData] = useState<any>(null);
    const { signOut } = useAuth(); // Get signOut from AuthContext
    const navigation = useNavigation<any>();

    useEffect(() => {
        // In a real app, this would fetch user profile data
        // For now, we'll use sample data
        setProfileData({
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            role: 'Administrator',
            joinDate: '2023-01-15',
            profileImage: null, // In a real app, this would be an image URL
        });
    }, []);

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleLogout = async () => {
        try {
            await signOut(); // Call the signOut function from AuthContext
            // The App component will automatically redirect to Auth navigator since token is now removed
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb',
            paddingTop: 40,
        },
        profileCard: {
            marginHorizontal: 16,
            marginTop: 20,
            marginBottom: 20,
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 12,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        profileHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#10b981',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        avatarText: {
            fontSize: 32,
            color: 'white',
            fontWeight: 'bold',
        },
        profileInfo: {
            flex: 1,
        },
        name: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1f2937',
        },
        role: {
            fontSize: 14,
            color: '#6b7280',
            marginTop: 4,
        },
        joinDate: {
            fontSize: 12,
            color: '#9ca3af',
            marginTop: 2,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
        },
        detailIcon: {
            marginRight: 12,
        },
        detailText: {
            fontSize: 16,
            color: '#4b5563',
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 10,
        },
        editButton: {
            flex: 0.48,
            backgroundColor: '#10b981',
        },
        logoutButton: {
            flex: 0.48,
            backgroundColor: '#ef4444',
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold',
        },
    });

    if (!profileData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <PaperCard style={styles.profileCard}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {profileData.fullName?.charAt(0) || 'U'}
                        </Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{profileData.fullName}</Text>
                        <Text style={styles.role}>{profileData.role}</Text>
                        <Text style={styles.joinDate}>Joined: {profileData.joinDate}</Text>
                    </View>
                </View>

                <View>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Mail size={20} color="#6b7280" />
                        </View>
                        <Text style={styles.detailText}>{profileData.email}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Phone size={20} color="#6b7280" />
                        </View>
                        <Text style={styles.detailText}>{profileData.phone}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Briefcase size={20} color="#6b7280" />
                        </View>
                        <Text style={styles.detailText}>{profileData.role}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Calendar size={20} color="#6b7280" />
                        </View>
                        <Text style={styles.detailText}>Joined: {profileData.joinDate}</Text>
                    </View>
                </View>
            </PaperCard>

            <View style={styles.buttonContainer}>
                <PaperButton
                    style={styles.editButton}
                    onPress={handleEditProfile}
                    mode="contained"
                >
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </PaperButton>
                <PaperButton
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    mode="contained"
                >
                    <Text style={styles.buttonText}>Logout</Text>
                </PaperButton>
            </View>
        </ScrollView>
    );
}