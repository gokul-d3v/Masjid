import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { userService } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react-native';

export default function UserDetailScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [joinDate, setJoinDate] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            // In a real app, this would fetch user data by ID
            const userId = route.params?.userId;
            if (userId) {
                // Sample data for demo purposes
                setName('John Doe');
                setEmail('john.doe@example.com');
                setPhone('+1 (555) 123-4567');
                setJoinDate('2023-01-15');
                setAddress('123 Main St, City, Country');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigation.navigate('EditProfile', { userId: route.params?.userId });
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
        profileCard: {
            padding: 20,
            marginBottom: 20,
        },
        avatarContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#10b981',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginBottom: 16,
        },
        avatarText: {
            fontSize: 32,
            color: 'white',
            fontWeight: 'bold',
        },
        profileInfo: {
            marginBottom: 16,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
        },
        iconContainer: {
            marginRight: 12,
        },
        infoText: {
            fontSize: 16,
            color: '#4b5563',
        },
        label: {
            fontSize: 14,
            color: '#6b7280',
            marginBottom: 4,
        },
        value: {
            fontSize: 16,
            color: '#1f2937',
        },
        buttonContainer: {
            marginTop: 20,
        },
    });

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#10b981" />
                <Text style={{ marginTop: 10, color: '#6b7280' }}>Loading user details...</Text>
            </View>
        );
    }

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
                    <Text style={styles.title}>User Details</Text>
                </View>

                <PaperCard style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{name?.charAt(0) || 'U'}</Text>
                    </View>

                    <View style={styles.profileInfo}>
                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <User size={20} color="#6b7280" />
                            </View>
                            <View>
                                <Text style={styles.label}>Name</Text>
                                <Text style={styles.value}>{name}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Mail size={20} color="#6b7280" />
                            </View>
                            <View>
                                <Text style={styles.label}>Email</Text>
                                <Text style={styles.value}>{email}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Phone size={20} color="#6b7280" />
                            </View>
                            <View>
                                <Text style={styles.label}>Phone</Text>
                                <Text style={styles.value}>{phone}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Calendar size={20} color="#6b7280" />
                            </View>
                            <View>
                                <Text style={styles.label}>Join Date</Text>
                                <Text style={styles.value}>{joinDate}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <MapPin size={20} color="#6b7280" />
                            </View>
                            <View>
                                <Text style={styles.label}>Address</Text>
                                <Text style={styles.value}>{address}</Text>
                            </View>
                        </View>
                    </View>

                    <PaperButton
                        style={styles.buttonContainer}
                        onPress={handleEdit}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            Edit Profile
                        </Text>
                    </PaperButton>
                </PaperCard>
            </ScrollView>
        </View>
    );
}