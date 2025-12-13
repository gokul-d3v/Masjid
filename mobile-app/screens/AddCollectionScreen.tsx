import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Text as RNText,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableOpacity,
    Modal
} from 'react-native';
import {
    Button as PaperButton,
    TextInput as PaperInput,
    HelperText,
    Card as PaperCard,
    Appbar,
    Menu,
    Divider,
    ActivityIndicator
} from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dashboardService } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, IndianRupee, Calendar, Hash, Info } from 'lucide-react-native';
import AlertBox from '../components/AlertBox';
import Header from '../components/Header';

export default function AddCollectionScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(() => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = today.getFullYear();
        return `${day}-${month}-${year}`;
    });
    const [receiptNumber, setReceiptNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState({
        title: '',
        message: '',
        type: 'info' as 'success' | 'error' | 'warning' | 'info',
        buttons: [{ text: 'OK' } as { text: string, onPress?: () => void, style?: 'default' | 'cancel' | 'destructive' }]
    });


    const validate = () => {
        const newErrors: any = {};
        const errorMessages: string[] = [];

        // Validate amount
        if (!amount) {
            newErrors.amount = 'Amount is required';
            errorMessages.push('Please enter the amount');
        } else {
            const amountNum = parseFloat(amount);
            if (isNaN(amountNum) || amountNum <= 0) {
                newErrors.amount = 'Amount must be a positive number';
                errorMessages.push('Amount must be a positive number');
            }
        }

        // Validate category
        if (!category) {
            newErrors.category = 'Category is required';
            errorMessages.push('Please select a category');
        }

        // Show errors as snackbar if there are any
        if (errorMessages.length > 0) {
            setSnackbarMessage(errorMessages.join('\n'));
            setSnackbarVisible(true);
            setErrors(newErrors);
            return false;
        } else {
            setErrors({});
            return true;
        }
    };

    const categoryDisplayMap: { [key: string]: string } = {
        'monthly_donation': 'Monthly Fund',
        'mayyathu': 'Mayyathu Fund',
        'general': 'General',
    };

    // Function to show custom alert
    const showAlert = (
        title: string,
        message: string,
        type: 'success' | 'error' | 'warning' | 'info' = 'info',
        buttons: Array<{ text: string, onPress?: () => void, style?: 'default' | 'cancel' | 'destructive' }> = [{ text: 'OK' }]
    ) => {
        setAlertProps({ title, message, type, buttons });
        setAlertVisible(true);
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            // Convert date from DD-MM-YYYY to YYYY-MM-DD format for ISO date
            let formattedDate = date;
            if (date && date.includes('-')) {
                const parts = date.split('-');
                if (parts.length === 3) {
                    // Check if date is in DD-MM-YYYY format
                    if (parseInt(parts[0]) <= 31 && parseInt(parts[1]) <= 12) {
                        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
                    }
                }
            }

            const isoDate = formattedDate ? new Date(formattedDate).toISOString() : new Date().toISOString();

            await dashboardService.addMoneyCollection({
                amount: parseFloat(amount),
                description: description || `${category} collection`,
                category,
                date: isoDate,
                receiptNumber: receiptNumber || `REC${Date.now()}`
            });

            showAlert('Success', 'Collection added successfully!', 'success', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            console.error("Collection operation error:", error);
            let errorMessage = 'Operation failed';

            if (error.response) {
                // Backend validation error
                errorMessage = error.response.data?.error || error.response.data?.message || 'Server error occurred';
            } else if (error.request) {
                // Network error
                errorMessage = 'Network error, please check your connection';
            } else {
                // Other error
                errorMessage = error.message || 'Unknown error occurred';
            }

            showAlert('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb', // coolGray50 equivalent
            paddingTop: 0,
        },
        content: {
            padding: 20,
            paddingTop: 0,
            paddingBottom: 20,
        },
        card: {
            marginVertical: 16,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e5e7eb', // coolGray200
            backgroundColor: 'white', // Ensure the card has a white background
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#2563eb', // primary700
            marginBottom: 8,
        },
        sectionSubtitle: {
            fontSize: 12,
            color: '#9ca3af', // coolGray500
        },
        inputContainer: {
            marginBottom: 16,
        },
        inputRow: {
            flexDirection: 'row',
            gap: 12,
        },
        halfInput: {
            flex: 1,
        },
        buttonContainer: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 16,
            paddingTop: 8,
        },
        button: {
            flex: 1,
        },
        errorText: {
            color: '#ef4444', // error600
            fontSize: 12,
            marginTop: 4,
        },
        dropdownContainer: {
            width: '100%',
            marginTop: 12,
        },
        dropdownButton: {
            width: '100%',
            justifyContent: 'flex-start',
            borderWidth: 1,
            borderColor: '#d1d5db',
            backgroundColor: 'transparent',
            borderRadius: 4,
            minHeight: 50,
            alignItems: 'center',
            paddingHorizontal: 12,
        },
        dropdownButtonError: {
            borderColor: '#ef4444', // red-500
        },
        dropdownButtonText: {
            textAlign: 'left',
            color: '#374151',
            fontSize: 16,
        },
        snackbarContainer: {
            position: 'absolute',
            top: 10,
            left: 20,
            right: 20,
            zIndex: 9999,
        },
        topSnackbar: {
            position: 'absolute',
            top: 10,
            left: 20,
            right: 20,
            zIndex: 9999,
        },
        customToast: {
            position: 'absolute',
            bottom: 30,
            left: 20,
            right: 20,
            zIndex: 9999,
            elevation: 5,
        },
        toastContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#dc2626', // red-600
            padding: 16,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        toastText: {
            color: 'white',
            flex: 1,
            fontSize: 14,
            textAlign: 'left',
        },
        toastButton: {
            padding: 4,
            marginLeft: 8,
        },
        toastButtonText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
        },
        alertOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
        },
        alertContainer: {
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 20,
            width: '80%',
            maxWidth: 400,
            maxHeight: '80%',
        },
        alertHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
        },
        alertIcon: {
            marginRight: 10,
        },
        alertTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#374151',
        },
        alertMessage: {
            fontSize: 14,
            color: '#4b5563',
            marginBottom: 20,
            lineHeight: 20,
        },
        alertButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10,
        },
        alertButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 4,
        },
        alertButtonPrimary: {
            backgroundColor: '#059669', // emerald-600
        },
        alertButtonSecondary: {
            backgroundColor: '#d1d5db', // gray-300
        },
        alertButtonText: {
            color: 'white',
            fontWeight: 'bold',
        },
        alertButtonSecondaryText: {
            color: '#374151',
        },
        categoryLabel: {
            marginBottom: 8,
            fontSize: 16,
            fontWeight: '500',
            color: '#374151',
        },
        categoryValue: {
            fontSize: 16,
            color: '#374151',
        },
        categoryInput: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#d1d5db',
            backgroundColor: 'transparent',
            borderRadius: 4,
            minHeight: 50,
            paddingHorizontal: 12,
            marginTop: 4,
        },
        modalBackdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainer: {
            width: '80%',
            maxWidth: 300,
            backgroundColor: 'transparent',
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 8,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        modalItem: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 4,
        },
        selectedFilter: {
            backgroundColor: '#f0f9ff',
        },
        modalItemText: {
            fontSize: 16,
            color: '#1f2937',
        }
    });

    return (
        <View style={{ flex: 1 }}>
            {/* Custom Toast at the bottom */}
            {snackbarVisible && (
                <View style={styles.customToast}>
                    <View style={styles.toastContent}>
                        <RNText style={styles.toastText}>{snackbarMessage}</RNText>
                        <TouchableOpacity
                            onPress={() => setSnackbarVisible(false)}
                            style={styles.toastButton}
                        >
                            <RNText style={styles.toastButtonText}>×</RNText>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.container, { paddingTop: insets.top }]}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                    <View style={styles.content}>
                        <Header
                            title="Add New Collection"
                            subtitle="Enter collection details below"
                            onBackPress={() => navigation.goBack()}
                        />

                        <PaperCard style={styles.card}>
                            <View>
                                <RNText style={styles.sectionTitle}>Collection Information</RNText>
                                <RNText style={styles.sectionSubtitle}>Enter the details for this collection</RNText>
                            </View>

                            <PaperInput
                                label="Amount *"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="decimal-pad"
                                error={!!errors.amount}
                                style={styles.inputContainer}
                                mode="outlined"
                                theme={{ colors: { primary: '#025937', background: 'transparent' } }}
                                textColor="#000000"
                                activeOutlineColor="#025937"
                                left={<PaperInput.Icon icon={() => <IndianRupee size={20} color="#6b7280" />} />}
                            />
                            {errors.amount && (
                                <RNText style={styles.errorText}>{errors.amount}</RNText>
                            )}

                            <PaperInput
                                label="Description"
                                value={description}
                                onChangeText={setDescription}
                                style={styles.inputContainer}
                                mode="outlined"
                                theme={{ colors: { primary: '#025937', background: 'transparent' } }}
                                textColor="#000000"
                                activeOutlineColor="#025937"
                                left={<PaperInput.Icon icon={() => <Info size={20} color="#6b7280" />} />}
                            />

                            <TouchableOpacity
                                style={[
                                    styles.categoryInput,
                                    {
                                        marginBottom: 16,
                                        borderColor: errors.category ? '#ef4444' : category ? '#000000' : '#d1d5db' // red for error, black when selected, gray when empty
                                    }
                                ]}
                                onPress={() => setCategoryMenuVisible(true)}
                            >
                                <Info size={20} color="#6b7280" style={{ marginRight: 8 }} />
                                <RNText style={[
                                    styles.dropdownButtonText,
                                    {
                                        color: category ? '#374151' : '#000000', // Black for placeholder
                                        paddingVertical: 12,
                                        flex: 1
                                    }
                                ]}>
                                    {category ? categoryDisplayMap[category] || category : 'Select Category'}
                                </RNText>
                            </TouchableOpacity>
                            {errors.category && (
                                <RNText style={styles.errorText}>{errors.category}</RNText>
                            )}


                            <PaperInput
                                label="Date"
                                value={date}
                                onChangeText={setDate}
                                style={styles.inputContainer}
                                mode="outlined"
                                theme={{ colors: { primary: '#025937', background: 'transparent' } }}
                                textColor="#000000"
                                activeOutlineColor="#025937"
                                left={<PaperInput.Icon icon={() => <Calendar size={20} color="#6b7280" />} />}
                                placeholder="DD-MM-YYYY"
                                keyboardType="numbers-and-punctuation" // More appropriate keyboard for date input
                            />

                            <PaperInput
                                label="Receipt Number"
                                value={receiptNumber}
                                onChangeText={setReceiptNumber}
                                style={styles.inputContainer}
                                mode="outlined"
                                theme={{ colors: { primary: '#025937', background: 'transparent' } }}
                                textColor="#000000"
                                activeOutlineColor="#025937"
                                left={<PaperInput.Icon icon={() => <Hash size={20} color="#6b7280" />} />}
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
                        </PaperCard>
                    </View>
                </ScrollView>

                {/* Modal for category options - using native Modal */}
                <Modal
                    visible={categoryMenuVisible}
                    transparent={true}
                    animationType="none"
                    onRequestClose={() => setCategoryMenuVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        onPress={() => setCategoryMenuVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    style={[styles.modalItem, category === 'monthly_donation' ? styles.selectedFilter : {}]}
                                    onPress={() => {
                                        setCategory('monthly_donation');
                                        setCategoryMenuVisible(false);
                                    }}
                                >
                                    <RNText style={styles.modalItemText}>Monthly Fund</RNText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalItem, category === 'mayyathu' ? styles.selectedFilter : {}]}
                                    onPress={() => {
                                        setCategory('mayyathu');
                                        setCategoryMenuVisible(false);
                                    }}
                                >
                                    <RNText style={styles.modalItemText}>Mayyathu Fund</RNText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalItem, category === 'general' ? styles.selectedFilter : {}]}
                                    onPress={() => {
                                        setCategory('general');
                                        setCategoryMenuVisible(false);
                                    }}
                                >
                                    <RNText style={styles.modalItemText}>General</RNText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <AlertBox
                    visible={alertVisible}
                    title={alertProps.title}
                    message={alertProps.message}
                    type={alertProps.type}
                    buttons={alertProps.buttons}
                    onClose={() => setAlertVisible(false)}
                />
            </KeyboardAvoidingView>
        </View>
    );
}