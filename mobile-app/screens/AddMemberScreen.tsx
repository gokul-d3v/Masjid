import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Text as RNText,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import {
    Button as PaperButton,
    TextInput as PaperInput,
    HelperText,
    Card as PaperCard,
    Appbar,
    Menu,
    Divider
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { memberService } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Trash2, UserPlus, Home, Phone, Hash, Calendar, Users } from 'lucide-react-native';

interface FamilyMember {
    name: string;
    relation: string;
    age: string;
}

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
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create');
    const [currentItem, setCurrentItem] = useState<any>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const params = routeParams || {};
        const { mode: routeMode, item } = params;

        setMode(routeMode || 'create');

        if (routeMode === 'edit' || routeMode === 'view') {
            if (item) {
                setCurrentItem(item);
                setFullName(item.fullName || '');
                setAge(item.age?.toString() || '');
                setPhone(item.phone || '');
                setAdharNumber(item.adharNumber || '');
                setRegistrationNumber(item?.registrationNumber || '');
                setHouseType(item.houseType || '');
                setFamilyMembers(item.familyMembers || []);
            }
        }
    }, [routeParams]);

    const validate = () => {
        const newErrors: any = {};

        if (!fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!age) newErrors.age = 'Age is required';
        else if (parseInt(age) < 1 || parseInt(age) > 120) newErrors.age = 'Age must be between 1 and 120';

        if (!phone) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits';

        if (!adharNumber) newErrors.adharNumber = 'Aadhaar number is required';
        else if (!/^\d{12}$/.test(adharNumber)) newErrors.adharNumber = 'Aadhaar must be 12 digits';

        if (isCreateMode && !registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
        if (!houseType) newErrors.houseType = 'House type is required';

        // Validate family members
        familyMembers.forEach((member, index) => {
            if (!member.name.trim()) newErrors[`familyMember${index}Name`] = 'Name is required';
            if (!member.relation.trim()) newErrors[`familyMember${index}Relation`] = 'Relation is required';
            if (!member.age) newErrors[`familyMember${index}Age`] = 'Age is required';
            else if (parseInt(member.age) < 0 || parseInt(member.age) > 120) {
                newErrors[`familyMember${index}Age`] = 'Age must be between 0 and 120';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                houseType: string;
                familyMembersCount: number;
                familyMembers: { name: string; relation: string; age: number; }[];
                registrationNumber?: string;
            } = {
                fullName: fullName.trim(),
                age: parseInt(age) || 0,
                phone: phone.trim(),
                adharNumber: adharNumber.trim(),
                houseType: houseType,
                familyMembersCount: familyMembers.length,
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
                houseType: string;
                familyMembersCount: number;
                familyMembers: { name: string; relation: string; age: number; }[];
                registrationNumber?: string;
            };

            // Only include registration number for create operations
            if (mode === 'create') {
                memberData.registrationNumber = registrationNumber.trim();
            }

            if (mode === 'create') {
                await memberService.create(memberData);
                Alert.alert('Success', 'Member added successfully!');
            } else if (mode === 'edit') {
                const memberId = currentItem?.id || currentItem?._id;
                console.log("Current item:", currentItem); // For debugging
                console.log("Member ID:", memberId); // For debugging
                if (!memberId) {
                    Alert.alert('Error', `Member ID is required for update. Current item ID: ${JSON.stringify(currentItem?.id || currentItem?._id || 'undefined')}`);
                    return;
                }
                await memberService.update(memberId, memberData);
                Alert.alert('Success', 'Member updated successfully!');
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

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb', // coolGray50 equivalent
        },
        content: {
            padding: 20,
            paddingTop: 40,
            paddingBottom: 20,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        headerTitle: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2563eb', // primary800 equivalent
            marginLeft: 8,
        },
        subtitle: {
            fontSize: 14,
            color: '#9ca3af', // coolGray500
            marginLeft: 32, // ml="$8" equivalent
        },
        card: {
            marginVertical: 16,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e5e7eb', // coolGray200
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
        familyMemberCard: {
            marginVertical: 12,
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e5e7eb', // coolGray200
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
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <PaperButton
                            mode="text"
                            onPress={() => navigation.goBack()}
                            style={{ padding: 4 }}
                        >
                            <ArrowLeft size={24} color="#059669" />
                        </PaperButton>
                        <View style={styles.headerTitle}>
                            <UserPlus size={24} color="#059669" />
                            <RNText style={styles.title}>Add New Member</RNText>
                        </View>
                    </View>
                    <RNText style={styles.subtitle}>Enter member details below</RNText>

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
                            theme={{ colors: { primary: '#059669' } }}
                            disabled={isViewMode}
                        />
                        {errors.fullName && (
                            <RNText style={styles.errorText}>{errors.fullName}</RNText>
                        )}

                        <View style={styles.inputRow}>
                            <PaperInput
                                label="Age"
                                value={age}
                                onChangeText={(value) => !isViewMode && setAge(value)}
                                keyboardType="number-pad"
                                error={!!errors.age}
                                style={styles.halfInput}
                                mode="outlined"
                                theme={{ colors: { primary: '#059669' } }}
                                disabled={isViewMode}
                            />
                            {errors.age && (
                                <RNText style={styles.errorText}>{errors.age}</RNText>
                            )}

                            <PaperInput
                                label="Phone"
                                value={phone}
                                onChangeText={(value) => !isViewMode && setPhone(value)}
                                keyboardType="phone-pad"
                                maxLength={10}
                                error={!!errors.phone}
                                style={styles.halfInput}
                                mode="outlined"
                                theme={{ colors: { primary: '#059669' } }}
                                disabled={isViewMode}
                            />
                            {errors.phone && (
                                <RNText style={styles.errorText}>{errors.phone}</RNText>
                            )}
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
                                theme={{ colors: { primary: '#059669' } }}
                                disabled={isViewMode}
                            />
                            {errors.adharNumber && (
                                <RNText style={styles.errorText}>{errors.adharNumber}</RNText>
                            )}

                            <PaperInput
                                label="Registration"
                                value={registrationNumber}
                                onChangeText={(value) => !isViewMode && setRegistrationNumber(value)}
                                error={!!errors.registrationNumber}
                                style={styles.halfInput}
                                mode="outlined"
                                theme={{ colors: { primary: '#059669' } }}
                                disabled={isViewMode || isEditMode}
                            />
                            {errors.registrationNumber && (
                                <RNText style={styles.errorText}>{errors.registrationNumber}</RNText>
                            )}
                        </View>

                        <PaperInput
                            label="House Type"
                            value={houseType}
                            onChangeText={!isViewMode ? setHouseType : undefined}
                            error={!!errors.houseType}
                            style={styles.inputContainer}
                            mode="outlined"
                            theme={{ colors: { primary: '#059669' } }}
                            disabled={isViewMode}
                        />
                        {errors.houseType && (
                            <RNText style={styles.errorText}>{errors.houseType}</RNText>
                        )}
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
                                                theme={{ colors: { primary: '#059669' } }}
                                                disabled={isViewMode}
                                            />
                                            {errors[`familyMember${index}Name`] && (
                                                <RNText style={styles.errorText}>{errors[`familyMember${index}Name`]}</RNText>
                                            )}

                                            <PaperInput
                                                label="Relation"
                                                value={member.relation}
                                                onChangeText={(value) => !isViewMode && handleFamilyMemberChange(index, 'relation', value)}
                                                style={styles.familyMemberInput2}
                                                mode="outlined"
                                                theme={{ colors: { primary: '#059669' } }}
                                                disabled={isViewMode}
                                            />
                                            {errors[`familyMember${index}Relation`] && (
                                                <RNText style={styles.errorText}>{errors[`familyMember${index}Relation`]}</RNText>
                                            )}

                                            <PaperInput
                                                label="Age"
                                                value={member.age}
                                                onChangeText={(value) => !isViewMode && handleFamilyMemberChange(index, 'age', value)}
                                                keyboardType="number-pad"
                                                style={styles.familyMemberInput3}
                                                mode="outlined"
                                                theme={{ colors: { primary: '#059669' } }}
                                                disabled={isViewMode}
                                            />
                                            {errors[`familyMember${index}Age`] && (
                                                <RNText style={styles.errorText}>{errors[`familyMember${index}Age`]}</RNText>
                                            )}
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
        </KeyboardAvoidingView>
    );
}
