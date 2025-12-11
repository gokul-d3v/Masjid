import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Text as RNText } from 'react-native';
import { Button as PaperButton, TextInput as PaperInput, HelperText, Appbar, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { ArrowLeft } from 'lucide-react-native';
import { dashboardService } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

export default function AddCollectionScreen() {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [collectedBy, setCollectedBy] = useState('');
    const [date, setDate] = useState('');
    const [receiptNumber, setReceiptNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation();

    const validate = () => {
        const newErrors: any = {};

        if (!amount) newErrors.amount = 'Amount is required';
        else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) newErrors.amount = 'Amount must be a positive number';

        if (!category) newErrors.category = 'Category is required';
        if (!collectedBy) newErrors.collectedBy = 'Collected by is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await dashboardService.addMoneyCollection({
                amount: parseFloat(amount),
                description: description || `${category} collection`,
                category,
                collectedBy,
                date: date || new Date().toISOString(),
                receiptNumber: receiptNumber || `REC${Date.now()}`
            });

            // Show success message using Alert or other mechanism
            alert('Collection added successfully!');

            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || 'Failed to add collection');
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb', // coolGray100 equivalent
        },
        content: {
            padding: 16,
            paddingTop: 40,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginLeft: 8,
        },
        input: {
            marginBottom: 16,
        },
        buttonContainer: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 16,
        },
        button: {
            flex: 1,
        },
        errorText: {
            color: '#ef4444', // error600
            fontSize: 12,
            marginTop: 4,
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <PaperButton
                        mode="text"
                        onPress={() => navigation.goBack()}
                        style={{ padding: 4 }}
                    >
                        <ArrowLeft size={24} color="#059669" />
                    </PaperButton>
                    <RNText style={styles.title}>Add New Collection</RNText>
                </View>

                <PaperInput
                    label="Amount *"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    error={!!errors.amount}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { primary: '#059669' } }}
                />
                {errors.amount && (
                    <RNText style={styles.errorText}>{errors.amount}</RNText>
                )}

                <PaperInput
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { primary: '#059669' } }}
                />

                <PaperInput
                    label="Category *"
                    value={category}
                    onChangeText={setCategory}
                    style={styles.input}
                    mode="outlined"
                    error={!!errors.category}
                    theme={{ colors: { primary: '#059669' } }}
                />
                {errors.category && (
                    <RNText style={styles.errorText}>{errors.category}</RNText>
                )}

                <PaperInput
                    label="Collected By *"
                    value={collectedBy}
                    onChangeText={setCollectedBy}
                    style={styles.input}
                    mode="outlined"
                    error={!!errors.collectedBy}
                    theme={{ colors: { primary: '#059669' } }}
                />
                {errors.collectedBy && (
                    <RNText style={styles.errorText}>{errors.collectedBy}</RNText>
                )}

                <PaperInput
                    label="Date"
                    value={date}
                    onChangeText={setDate}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { primary: '#059669' } }}
                />

                <PaperInput
                    label="Receipt Number"
                    value={receiptNumber}
                    onChangeText={setReceiptNumber}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { primary: '#059669' } }}
                />

                <View style={styles.buttonContainer}>
                    <PaperButton
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.button}
                        textColor="#059669"
                    >
                        Cancel
                    </PaperButton>
                    <PaperButton
                        mode="contained"
                        onPress={handleSubmit}
                        style={[styles.button, { backgroundColor: '#059669' }]}
                        disabled={loading}
                        labelStyle={{ color: '#fff' }}
                    >
                        {loading ? 'Adding...' : 'Add Collection'}
                    </PaperButton>
                </View>
            </ScrollView>
        </View>
    );
}