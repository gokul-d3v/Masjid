import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { dataService } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function DataDetailScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        // Load data if in edit mode
        if (route.params && route.params.dataId) {
            loadExistingData(route.params.dataId);
        }
    }, []);

    const loadExistingData = async (id: string) => {
        try {
            // In a real app, this would fetch existing data
            setName('Sample Data');
            setDescription('Sample description');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load data');
        }
    };

    const validate = () => {
        const newErrors: any = {};
        
        if (!name.trim()) newErrors.name = 'Name is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            // In a real app, this would submit to API
            console.log('Submitting data:', { name, description });
            
            Alert.alert('Success', 'Data saved successfully!');
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', 'Failed to save data');
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
        },
        button: {
            flex: 1,
            marginHorizontal: 5,
        },
        cancelButton: {
            backgroundColor: '#d1d5db',
        },
        saveButton: {
            backgroundColor: '#10b981',
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        textArea: {
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            backgroundColor: 'white',
            height: 120,
            textAlignVertical: 'top',
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
                    <Text style={styles.title}>{route.params?.dataId ? 'Edit Data' : 'Add Data'}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter name"
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.textArea}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <PaperButton
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </PaperButton>
                    <PaperButton
                        style={[styles.button, styles.saveButton]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {loading ? 'Saving...' : (route.params?.dataId ? 'Update' : 'Save')}
                            </Text>
                        )}
                    </PaperButton>
                </View>
            </ScrollView>
        </View>
    );
}