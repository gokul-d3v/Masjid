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
    Switch,
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
import { memberService } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Trash2, UserPlus, Home, Phone, Hash, Calendar, Users, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react-native';
import Header from '../components/Header';

interface FamilyMember {
    name: string;
    relation: string;
    age: string;
}

// Define house type options
const HOUSE_TYPE_OPTIONS = [
    { label: 'Own House', value: 'Own House' },
    { label: 'Rented', value: 'Rented' },
    { label: 'Apartment', value: 'Apartment' },
    { label: 'Villa', value: 'Villa' },
    { label: 'Independent House', value: 'Independent House' },
    { label: 'Condominium', value: 'Condominium' },
    { label: 'Townhouse', value: 'Townhouse' },
    { label: 'Studio', value: 'Studio' },
    { label: 'Duplex', value: 'Duplex' },
];

export default function AddMemberScreen() {
    const route = useRoute();
    const routeParams = route.params as { mode?: 'create' | 'edit' | 'view'; item?: any } | undefined;
    const insets = useSafeAreaInsets();
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [adharNumber, setAdharNumber] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [houseType, setHouseType] = useState('');
    const [occupation, setOccupation] = useState('');
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create');
    const [currentItem, setCurrentItem] = useState<any>(null);
    const [mayyathuStatus, setMayyathuStatus] = useState(false);
    const [houseTypeMenuVisible, setHouseTypeMenuVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
    const [alertButtons, setAlertButtons] = useState<Array<{ text: string, onPress?: () => void, style?: 'default' | 'cancel' | 'destructive' }>>([]);
    const navigation = useNavigation();

    useEffect(() => {
        const params = routeParams || {};
        const { mode: routeMode, item } = params;

        setMode(routeMode || 'create');

        // Reset all form fields first to avoid mixing data from previous sessions
        if (routeMode === 'edit' || routeMode === 'view') {
            if (item) {
                setCurrentItem(item);
                setFullName(item.fullName || '');
                setAge(item.age?.toString() || '');
                setPhone(item.phone || '');
                setAdharNumber(item.adharNumber || '');
                setRegistrationNumber(item?.registrationNumber || '');
                setHouseType(item.houseType || '');
                setOccupation(item.occupation || '');
                // Convert family member ages to strings for proper input display
                const familyMembersWithAgeStrings = (item.familyMembers || []).map(fm => ({
                    ...fm,
                    age: fm.age?.toString() || ''
                }));
                setFamilyMembers(familyMembersWithAgeStrings);
                setMayyathuStatus(item.mayyathuStatus || false);
            } else {
                // If no item is provided in edit/view mode, reset to empty values
                setFullName('');
                setAge('');
                setPhone('');
                setAdharNumber('');
                setRegistrationNumber('');
                setHouseType('');
                setOccupation('');
                setFamilyMembers([]);
                setMayyathuStatus(false);
            }
        } else if (routeMode === 'create') {
            // Reset all fields for create mode
            setFullName('');
            setAge('');
            setPhone('');
            setAdharNumber('');
            setRegistrationNumber('');
            setHouseType('');
            setOccupation('');
            setFamilyMembers([]);
            setMayyathuStatus(false);
        }
    }, [routeParams]);

    const validate = () => {
        const newErrors: any = {};
        const errorMessages: string[] = [];

        // Validate full name
        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required';
            errorMessages.push('Please enter the full name');
        } else if (fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
            errorMessages.push('Full name must be at least 2 characters');
        }

        // Validate age
        if (!age) {
            newErrors.age = 'Age is required';
            errorMessages.push('Please enter age');
        } else {
            const ageNum = parseInt(age);
            if (isNaN(ageNum)) {
                newErrors.age = 'Age must be a number';
                errorMessages.push('Age must be a number');
            } else if (ageNum < 1 || ageNum > 120) {
                newErrors.age = 'Age must be between 1 and 120';
                errorMessages.push('Age must be between 1 and 120 years');
            }
        }

        // Validate phone
        if (!phone) {
            newErrors.phone = 'Phone number is required';
            errorMessages.push('Please enter phone number');
        } else if (!/^\d+$/.test(phone)) {
            newErrors.phone = 'Phone number must contain only digits';
            errorMessages.push('Phone number must contain only digits (0-9)');
        } else if (phone.length !== 10) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
            errorMessages.push('Phone number must be exactly 10 digits');
        }

        // Validate Aadhaar number
        if (!adharNumber) {
            newErrors.adharNumber = 'Aadhaar number is required';
            errorMessages.push('Please enter Aadhaar number');
        } else if (!/^\d+$/.test(adharNumber)) {
            newErrors.adharNumber = 'Aadhaar number must contain only digits';
            errorMessages.push('Aadhaar number must contain only digits (0-9)');
        } else if (adharNumber.length !== 12) {
            newErrors.adharNumber = 'Aadhaar number must be exactly 12 digits';
            errorMessages.push('Aadhaar number must be exactly 12 digits');
        }

        // Validate registration number (only required for create mode)
        if (isCreateMode) {
            if (!registrationNumber.trim()) {
                newErrors.registrationNumber = 'Registration number is required';
                errorMessages.push('Please enter registration number');
            } else if (registrationNumber.trim().length < 3) {
                newErrors.registrationNumber = 'Registration number must be at least 3 characters';
                errorMessages.push('Registration number must be at least 3 characters');
            }
        }

        // Validate house type
        if (!houseType) {
            newErrors.houseType = 'House type is required';
            errorMessages.push('Please select house type');
        } else if (!HOUSE_TYPE_OPTIONS.some(option => option.value === houseType)) {
            newErrors.houseType = 'Please select a valid house type';
            errorMessages.push('Please select a valid house type from the dropdown');
        }

        // Validate occupation
        if (!occupation.trim()) {
            newErrors.occupation = 'Occupation is required';
            errorMessages.push('Please enter occupation');
        } else if (occupation.trim().length < 2) {
            newErrors.occupation = 'Occupation must be at least 2 characters';
            errorMessages.push('Occupation must be at least 2 characters');
        }

        // Validate family members
        if (familyMembers.length === 0) {
            // If there are no family members, that's fine - it's optional
        } else {
            familyMembers.forEach((member, index) => {
                // Validate family member name
                if (!member.name.trim()) {
                    newErrors[`familyMember${index}Name`] = 'Family member name is required';
                    errorMessages.push(`Family member ${index + 1} name is required`);
                } else if (member.name.trim().length < 2) {
                    newErrors[`familyMember${index}Name`] = 'Name must be at least 2 characters';
                    errorMessages.push(`Family member ${index + 1} name must be at least 2 characters`);
                }

                // Validate family member relation
                if (!member.relation.trim()) {
                    newErrors[`familyMember${index}Relation`] = 'Relation is required';
                    errorMessages.push(`Family member ${index + 1} relation is required`);
                } else if (member.relation.trim().length < 2) {
                    newErrors[`familyMember${index}Relation`] = 'Relation must be at least 2 characters';
                    errorMessages.push(`Family member ${index + 1} relation must be at least 2 characters`);
                }

                // Validate family member age
                if (!member.age) {
                    newErrors[`familyMember${index}Age`] = 'Age is required';
                    errorMessages.push(`Family member ${index + 1} age is required`);
                } else {
                    const memberAge = parseInt(member.age);
                    if (isNaN(memberAge)) {
                        newErrors[`familyMember${index}Age`] = 'Age must be a number';
                        errorMessages.push(`Family member ${index + 1} age must be a number`);
                    } else if (memberAge < 0 || memberAge > 120) {
                        newErrors[`familyMember${index}Age`] = 'Age must be between 0 and 120';
                        errorMessages.push(`Family member ${index + 1} age must be between 0 and 120 years`);
                    }
                }
            });
        }

        // Show errors as snackbar if there are any
        if (errorMessages.length > 0) {
            setSnackbarMessage(errorMessages.join('\n'));
            setSnackbarVisible(true);
            setErrors(newErrors); // Still maintain inline errors for programmatic access if needed
            return false;
        } else {
            setErrors({});
            return true;
        }
    };

    const handleAddFamilyMember = () => {
        setFamilyMembers([...familyMembers, { name: '', relation: '', age: '' }]);
    };

    const handleRemoveFamilyMember = (index: number) => {
        setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    };

    const handleFamilyMemberChange = (index: number, field: keyof FamilyMember, value: string) => {
        const updated = [...familyMembers];
        updated[index][field] = value;
        setFamilyMembers(updated);
    };

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';

    // Function to show custom alert
    const showAlert = (
        title: string,
        message: string,
        type: 'success' | 'error' | 'warning' | 'info' = 'info',
        buttons: Array<{ text: string, onPress?: () => void, style?: 'default' | 'cancel' | 'destructive' }> = [{ text: 'OK' }]
    ) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setAlertButtons(buttons);
        setAlertVisible(true);
    };

    const handleSubmit = async () => {
        // In view mode, just go back without saving
        if (isViewMode) {
            navigation.goBack();
            return;
        }

        if (!validate()) return;

        setLoading(true);
        try {
            // Prepare member data with proper formatting
            const memberData: {
                fullName: string;
                age: number;
                phone: string;
                adharNumber: string;
                occupation: string;
                houseType: string;
                familyMembersCount: number;
                familyMembers: { name: string; relation: string; age: number; }[];
                mayyathuStatus?: boolean;
                registrationNumber?: string;
            } = {
                fullName: fullName.trim(),
                age: parseInt(age) || 0,
                phone: phone.trim(),
                adharNumber: adharNumber.trim(),
                occupation: occupation.trim(),
                houseType: houseType,
                familyMembersCount: familyMembers.length,
                mayyathuStatus: mayyathuStatus,
                familyMembers: familyMembers.map(m => ({
                    name: m.name.trim(),
                    relation: m.relation.trim(),
                    age: parseInt(m.age) || 0,
                })).filter(fm => fm.name && fm.relation && !isNaN(fm.age)), // Filter out incomplete family members
            } as {
                fullName: string;
                age: number;
                phone: string;
                adharNumber: string;
                occupation: string;
                houseType: string;
                familyMembersCount: number;
                familyMembers: { name: string; relation: string; age: number; }[];
                mayyathuStatus?: boolean;
                registrationNumber?: string;
            };

            // Only include registration number for create operations
            if (mode === 'create') {
                memberData.registrationNumber = registrationNumber.trim();
            }

            if (mode === 'create') {
                await memberService.create(memberData);
                showAlert('Success', 'Member added successfully!', 'success');
            } else if (mode === 'edit') {
                const memberId = currentItem?.id || currentItem?._id;
                console.log("Current item:", currentItem); // For debugging
                console.log("Member ID:", memberId); // For debugging
                if (!memberId) {
                    showAlert('Error', `Member ID is required for update. Current item ID: ${JSON.stringify(currentItem?.id || currentItem?._id || 'undefined')}`, 'error');
                    return;
                }
                await memberService.update(memberId, memberData);
                showAlert('Success', 'Member updated successfully!', 'success');
            }

            navigation.goBack();
        } catch (error: any) {
            console.error("Member operation error:", error);
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
            marginBottom: 16,
        },
        halfInput: {
            flex: 1,
        },
        familyMemberCard: {
            marginVertical: 12,
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e5e7eb', // coolGray200
            backgroundColor: 'white', // Ensure the card has a white background
        },
        familyMemberHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        familyMemberTitle: {
            fontWeight: 'bold',
            color: '#374151', // coolGray700
        },
        removeButton: {
            padding: 4,
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
        familyMemberInputRow: {
            flexDirection: 'row',
            gap: 8,
        },
        familyMemberInput: {
            flex: 1,
        },
        familyMemberInput2: {
            flex: 1,
        },
        familyMemberInput3: {
            flex: 0.8,
        },
        noFamilyMembers: {
            padding: 16,
            backgroundColor: '#f3f4f6', // coolGray100
            borderRadius: 8,
            alignItems: 'center',
        },
        noFamilyMembersText: {
            color: '#9ca3af', // coolGray500
            textAlign: 'center',
        },
        toggleContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            marginBottom: 16,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
        },
        toggleLabelContainer: {
            flex: 1,
        },
        toggleLabel: {
            fontWeight: 'bold',
            color: '#374151', // coolGray700
        },
        toggleDescription: {
            fontSize: 12,
            color: '#6b7280', // coolGray500
        },
        toggleSwitchContainer: {
            paddingLeft: 16,
        },
        dropdownContainer: {
            width: '100%',
            marginBottom: 16,
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
        },
        dropdownButton: {
            width: '100%',
            justifyContent: 'flex-start',
            borderWidth: 1,
            borderColor: '#d1d5db',
            backgroundColor: 'transparent',
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
    });

    return (
        <View style={{ flex: 1 }}>
            {/* Custom Toast at the top */}
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
                            title={mode === 'create' ? "Add New Member" : mode === 'edit' ? "Edit Member" : "View Member"}
                            subtitle="Enter member details below"
                            onBackPress={() => navigation.goBack()}
                        />

                        <PaperCard style={styles.card}>
                            <View>
                                <RNText style={styles.sectionTitle}>Personal Information</RNText>
                            </View>

                            <PaperInput
                                label="Full Name"
                                value={fullName}
                                onChangeText={(value) => !isViewMode && setFullName(value)}
                                error={!!errors.fullName}
                                style={styles.inputContainer}
                                mode="outlined"
                                theme={{ colors: { primary: '#059669', background: 'transparent' } }}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                disabled={isViewMode}
                            />

                            <View style={styles.inputRow}>
                                <PaperInput
                                    label="Age"
                                    value={age}
                                    onChangeText={(value) => !isViewMode && setAge(value)}
                                    keyboardType="number-pad"
                                    error={!!errors.age}
                                    style={styles.halfInput}
                                    mode="outlined"
                                    theme={{ colors: { primary: '#059669', background: 'transparent' } }}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    disabled={isViewMode}
                                />

                                <PaperInput
                                    label="Phone"
                                    value={phone}
                                    onChangeText={(value) => !isViewMode && setPhone(value)}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    error={!!errors.phone}
                                    style={styles.halfInput}
                                    mode="outlined"
                                    theme={{ colors: { primary: '#059669', background: 'transparent' } }}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    disabled={isViewMode}
                                />
                            </View>

                            <View style={styles.inputRow}>
                                <PaperInput
                                    label="Aadhaar Number"
                                    value={adharNumber}
                                    onChangeText={(value) => !isViewMode && setAdharNumber(value)}
                                    keyboardType="number-pad"
                                    maxLength={12}
                                    error={!!errors.adharNumber}
                                    style={styles.halfInput}
                                    mode="outlined"
                                    theme={{ colors: { primary: '#059669', background: 'transparent' } }}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    disabled={isViewMode}
                                />

                                <PaperInput
                                    label="Registration"
                                    value={registrationNumber}
                                    onChangeText={(value) => !isViewMode && setRegistrationNumber(value)}
                                    error={!!errors.registrationNumber}
                                    style={styles.halfInput}
                                    mode="outlined"
                                    theme={{ colors: { primary: '#059669', background: 'transparent' } }}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    disabled={isViewMode}
                                />
                            </View>

                            <PaperInput
                                label="Occupation"
                                value={occupation}
                                onChangeText={(value) => !isViewMode && setOccupation(value)}
                                error={!!errors.occupation}
                                style={styles.inputContainer}
                                mode="outlined"
                                theme={{ colors: { primary: '#059669', background: 'transparent' } }}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                disabled={isViewMode}
                            />

                            <TouchableOpacity
                                style={[
                                    styles.categoryInput,
                                    {
                                        marginBottom: 16,
                                        borderColor: errors.houseType ? '#ef4444' : houseType ? '#000000' : '#d1d5db' // red for error, black when selected, gray when empty
                                    }
                                ]}
                                onPress={() => !isViewMode && setHouseTypeMenuVisible(true)}
                                disabled={isViewMode}
                            >
                                <Info size={20} color="#6b7280" style={{ marginRight: 8 }} />
                                <RNText style={[
                                    styles.dropdownButtonText,
                                    {
                                        color: houseType ? '#374151' : '#000000', // Black for placeholder
                                        paddingVertical: 12,
                                        flex: 1
                                    }
                                ]}>
                                    {houseType ? houseType : 'Select House Type'}
                                </RNText>
                            </TouchableOpacity>

                            {/* Mayyathu Status Toggle */}
                            <View style={styles.toggleContainer}>
                                <View style={styles.toggleLabelContainer}>
                                    <RNText style={styles.toggleLabel}>Mayyathu Fund Status</RNText>
                                    <RNText style={styles.toggleDescription}>
                                        {mayyathuStatus ? 'Enabled' : 'Disabled'}
                                    </RNText>
                                </View>
                                <View style={styles.toggleSwitchContainer}>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                                        thumbColor={mayyathuStatus ? '#059669' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={(value) => {
                                            if (!isViewMode) {
                                                setMayyathuStatus(value);
                                            }
                                        }}
                                        value={mayyathuStatus}
                                        disabled={isViewMode}
                                    />
                                </View>
                            </View>
                        </PaperCard>

                        <PaperCard style={styles.card}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Users size={18} color="#059669" />
                                        <RNText style={styles.sectionTitle}>Family Members</RNText>
                                    </View>
                                    <RNText style={styles.sectionSubtitle}>Add family members associated with this account</RNText>
                                </View>
                                {!isViewMode && (
                                    <PaperButton
                                        mode="outlined"
                                        onPress={handleAddFamilyMember}
                                        style={{ borderRadius: 20, paddingHorizontal: 12 }}
                                    >
                                        <RNText style={{ fontWeight: '500' }}>+ Add</RNText>
                                    </PaperButton>
                                )}
                            </View>

                            {familyMembers.length === 0 ? (
                                <View style={styles.noFamilyMembers}>
                                    <RNText style={styles.noFamilyMembersText}>
                                        No family members added yet. Tap "Add" to include family members.
                                    </RNText>
                                </View>
                            ) : (
                                <View>
                                    {familyMembers.map((member, index) => (
                                        <PaperCard key={index} style={styles.familyMemberCard}>
                                            <View style={styles.familyMemberHeader}>
                                                <RNText style={styles.familyMemberTitle}>
                                                    Family Member {index + 1}
                                                </RNText>
                                                {!isViewMode && (
                                                    <PaperButton
                                                        mode="text"
                                                        onPress={() => handleRemoveFamilyMember(index)}
                                                        style={styles.removeButton}
                                                    >
                                                        <Trash2 size={16} color="#dc2626" /> {/* error600 */}
                                                    </PaperButton>
                                                )}
                                            </View>

                                            <View style={styles.familyMemberInputRow}>
                                                <PaperInput
                                                    label="Name"
                                                    value={member.name}
                                                    onChangeText={(value) => !isViewMode && handleFamilyMemberChange(index, 'name', value)}
                                                    style={styles.familyMemberInput}
                                                    mode="outlined"
                                                    theme={{ colors: { primary: '#059669', background: 'transparent' } }}
                                                    underlineColor="transparent"
                                                    activeUnderlineColor="transparent"
                                                    disabled={isViewMode}
                                                />

                                                <PaperInput
                                                    label="Relation"
                                                    value={member.relation}
                                                    onChangeText={(value) => !isViewMode && handleFamilyMemberChange(index, 'relation', value)}
                                                    style={styles.familyMemberInput2}
                                                    mode="outlined"
                                                    theme={{ colors: { primary: '#059669', background: 'transparent' } }}
                                                    underlineColor="transparent"
                                                    activeUnderlineColor="transparent"
                                                    disabled={isViewMode}
                                                />

                                                <PaperInput
                                                    label="Age"
                                                    value={member.age}
                                                    onChangeText={(value) => !isViewMode && handleFamilyMemberChange(index, 'age', value)}
                                                    keyboardType="number-pad"
                                                    style={styles.familyMemberInput3}
                                                    mode="outlined"
                                                    theme={{ colors: { primary: '#059669', background: 'transparent' } }}
                                                    underlineColor="transparent"
                                                    activeUnderlineColor="transparent"
                                                    disabled={isViewMode}
                                                />
                                            </View>
                                        </PaperCard>
                                    ))}
                                </View>
                            )}
                        </PaperCard>

                        <View style={styles.buttonContainer}>
                            <PaperButton
                                mode="outlined"
                                onPress={() => navigation.goBack()}
                                style={styles.button}
                                textColor="#059669"
                            >
                                <RNText style={{ fontWeight: '500' }}>Cancel</RNText>
                            </PaperButton>
                            {!isViewMode && (
                                <PaperButton
                                    mode="contained"
                                    onPress={handleSubmit}
                                    style={[styles.button, { backgroundColor: '#059669' }]}
                                    disabled={loading}
                                    labelStyle={{ color: '#fff', fontWeight: '500' }}
                                >
                                    <RNText style={{ color: '#fff', fontWeight: '500' }}>
                                        {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Member' : 'Add Member')}
                                    </RNText>
                                </PaperButton>
                            )}
                            {isViewMode && (
                                <PaperButton
                                    mode="contained"
                                    onPress={() => navigation.goBack()}
                                    style={[styles.button, { backgroundColor: '#059669' }]}
                                    labelStyle={{ color: '#fff', fontWeight: '500' }}
                                >
                                    <RNText style={{ color: '#fff', fontWeight: '500' }}>Close</RNText>
                                </PaperButton>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* Modal for house type options - using native Modal */}
                <Modal
                    visible={houseTypeMenuVisible}
                    transparent={true}
                    animationType="none"
                    onRequestClose={() => setHouseTypeMenuVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        onPress={() => setHouseTypeMenuVisible(false)}
                    >
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                            onStartShouldSetResponder={() => true}
                            onResponderRelease={() => setHouseTypeMenuVisible(false)} />
                        <View style={styles.modalContent}>
                            {HOUSE_TYPE_OPTIONS.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.modalItem, houseType === option.value ? styles.selectedFilter : {}]}
                                    onPress={() => {
                                        setHouseType(option.value);
                                        setHouseTypeMenuVisible(false);
                                    }}
                                >
                                    <RNText style={styles.modalItemText}>{option.label}</RNText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </KeyboardAvoidingView>

            {/* Custom Alert */}
            {alertVisible && (
                <View style={styles.alertOverlay}>
                    <View style={styles.alertContainer}>
                        <View style={styles.alertHeader}>
                            {alertType === 'success' && <CheckCircle size={24} color="#10B981" style={styles.alertIcon} />}
                            {alertType === 'error' && <XCircle size={24} color="#EF4444" style={styles.alertIcon} />}
                            {alertType === 'warning' && <AlertTriangle size={24} color="#F59E0B" style={styles.alertIcon} />}
                            {alertType === 'info' && <Info size={24} color="#3B82F6" style={styles.alertIcon} />}
                            <RNText style={styles.alertTitle}>{alertTitle}</RNText>
                        </View>
                        <RNText style={styles.alertMessage}>{alertMessage}</RNText>
                        <View style={styles.alertButtonContainer}>
                            {alertButtons.map((button, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.alertButton,
                                        button.style === 'destructive' || button.style === 'cancel'
                                            ? styles.alertButtonSecondary
                                            : styles.alertButtonPrimary
                                    ]}
                                    onPress={() => {
                                        if (button.onPress) {
                                            button.onPress();
                                        }
                                        setAlertVisible(false);
                                    }}
                                >
                                    <RNText
                                        style={[
                                            styles.alertButtonText,
                                            (button.style === 'destructive' || button.style === 'cancel')
                                            && styles.alertButtonSecondaryText
                                        ]}
                                    >
                                        {button.text}
                                    </RNText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
