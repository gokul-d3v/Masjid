import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Input,
    InputField,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlError,
    FormControlErrorText,
    Toast,
    ToastTitle,
    useToast,
    ScrollView,
    Select,
    SelectTrigger,
    SelectInput,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectItem,
    Card,
    Divider,
} from '@gluestack-ui/themed';
import { memberService } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Trash2 } from 'lucide-react-native';

interface FamilyMember {
    name: string;
    relation: string;
    age: string;
}

export default function AddMemberScreen() {
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [adharNumber, setAdharNumber] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [houseType, setHouseType] = useState('');
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const toast = useToast();
    const navigation = useNavigation();

    const validate = () => {
        const newErrors: any = {};

        if (!fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!age) newErrors.age = 'Age is required';
        else if (parseInt(age) < 1 || parseInt(age) > 120) newErrors.age = 'Age must be between 1 and 120';

        if (!phone) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits';

        if (!adharNumber) newErrors.adharNumber = 'Aadhaar number is required';
        else if (!/^\d{12}$/.test(adharNumber)) newErrors.adharNumber = 'Aadhaar must be 12 digits';

        if (!registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
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

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await memberService.create({
                fullName,
                age: parseInt(age),
                phone,
                adharNumber,
                registrationNumber,
                houseType,
                familyMembersCount: familyMembers.length,
                familyMembers: familyMembers.map(m => ({
                    name: m.name,
                    relation: m.relation,
                    age: parseInt(m.age),
                })),
            });

            toast.show({
                placement: 'top',
                render: ({ id }: { id: string }) => (
                    <Toast nativeID={'toast-' + id} action="success" variant="accent">
                        <ToastTitle>Member added successfully!</ToastTitle>
                    </Toast>
                ),
            });

            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            toast.show({
                placement: 'top',
                render: ({ id }: { id: string }) => (
                    <Toast nativeID={'toast-' + id} action="error" variant="accent">
                        <ToastTitle>{error.response?.data?.error || 'Failed to add member'}</ToastTitle>
                    </Toast>
                ),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box flex={1} backgroundColor="$coolGray100">
            <ScrollView>
                <VStack space="md" p="$4" pt="$10">
                    <Heading size="xl">Add New Member</Heading>

                    <Card size="md" variant="elevated">
                        <VStack space="md">
                            <Heading size="md">Personal Information</Heading>

                            <FormControl isInvalid={!!errors.fullName}>
                                <FormControlLabel>
                                    <FormControlLabelText>Full Name *</FormControlLabelText>
                                </FormControlLabel>
                                <Input>
                                    <InputField
                                        placeholder="Enter full name"
                                        value={fullName}
                                        onChangeText={setFullName}
                                    />
                                </Input>
                                {errors.fullName && (
                                    <FormControlError>
                                        <FormControlErrorText>{errors.fullName}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.age}>
                                <FormControlLabel>
                                    <FormControlLabelText>Age *</FormControlLabelText>
                                </FormControlLabel>
                                <Input>
                                    <InputField
                                        placeholder="Enter age"
                                        value={age}
                                        onChangeText={setAge}
                                        keyboardType="number-pad"
                                    />
                                </Input>
                                {errors.age && (
                                    <FormControlError>
                                        <FormControlErrorText>{errors.age}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.phone}>
                                <FormControlLabel>
                                    <FormControlLabelText>Phone *</FormControlLabelText>
                                </FormControlLabel>
                                <Input>
                                    <InputField
                                        placeholder="10-digit phone number"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                    />
                                </Input>
                                {errors.phone && (
                                    <FormControlError>
                                        <FormControlErrorText>{errors.phone}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.adharNumber}>
                                <FormControlLabel>
                                    <FormControlLabelText>Aadhaar Number *</FormControlLabelText>
                                </FormControlLabel>
                                <Input>
                                    <InputField
                                        placeholder="12-digit Aadhaar number"
                                        value={adharNumber}
                                        onChangeText={setAdharNumber}
                                        keyboardType="number-pad"
                                        maxLength={12}
                                    />
                                </Input>
                                {errors.adharNumber && (
                                    <FormControlError>
                                        <FormControlErrorText>{errors.adharNumber}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.registrationNumber}>
                                <FormControlLabel>
                                    <FormControlLabelText>Registration Number *</FormControlLabelText>
                                </FormControlLabel>
                                <Input>
                                    <InputField
                                        placeholder="Enter registration number"
                                        value={registrationNumber}
                                        onChangeText={setRegistrationNumber}
                                    />
                                </Input>
                                {errors.registrationNumber && (
                                    <FormControlError>
                                        <FormControlErrorText>{errors.registrationNumber}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>

                            <FormControl isInvalid={!!errors.houseType}>
                                <FormControlLabel>
                                    <FormControlLabelText>House Type *</FormControlLabelText>
                                </FormControlLabel>
                                <Select selectedValue={houseType} onValueChange={setHouseType}>
                                    <SelectTrigger>
                                        <SelectInput placeholder="Select house type" />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectItem label="Owned" value="owned" />
                                            <SelectItem label="Rented" value="rented" />
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                                {errors.houseType && (
                                    <FormControlError>
                                        <FormControlErrorText>{errors.houseType}</FormControlErrorText>
                                    </FormControlError>
                                )}
                            </FormControl>
                        </VStack>
                    </Card>

                    <Card size="md" variant="elevated">
                        <VStack space="md">
                            <HStack justifyContent="space-between" alignItems="center">
                                <Heading size="md">Family Members</Heading>
                                <Button size="sm" onPress={handleAddFamilyMember}>
                                    <ButtonText>+ Add</ButtonText>
                                </Button>
                            </HStack>

                            {familyMembers.length === 0 && (
                                <Text color="$coolGray500" textAlign="center">
                                    No family members added yet
                                </Text>
                            )}

                            {familyMembers.map((member, index) => (
                                <Card key={index} size="sm" variant="outline">
                                    <VStack space="sm">
                                        <HStack justifyContent="space-between" alignItems="center">
                                            <Text bold>Family Member {index + 1}</Text>
                                            <Button
                                                size="xs"
                                                variant="link"
                                                onPress={() => handleRemoveFamilyMember(index)}
                                            >
                                                <Trash2 size={16} color="red" />
                                            </Button>
                                        </HStack>

                                        <FormControl isInvalid={!!errors[`familyMember${index}Name`]}>
                                            <FormControlLabel>
                                                <FormControlLabelText>Name</FormControlLabelText>
                                            </FormControlLabel>
                                            <Input size="sm">
                                                <InputField
                                                    placeholder="Name"
                                                    value={member.name}
                                                    onChangeText={(value) => handleFamilyMemberChange(index, 'name', value)}
                                                />
                                            </Input>
                                            {errors[`familyMember${index}Name`] && (
                                                <FormControlError>
                                                    <FormControlErrorText>
                                                        {errors[`familyMember${index}Name`]}
                                                    </FormControlErrorText>
                                                </FormControlError>
                                            )}
                                        </FormControl>

                                        <FormControl isInvalid={!!errors[`familyMember${index}Relation`]}>
                                            <FormControlLabel>
                                                <FormControlLabelText>Relation</FormControlLabelText>
                                            </FormControlLabel>
                                            <Input size="sm">
                                                <InputField
                                                    placeholder="e.g., Spouse, Child"
                                                    value={member.relation}
                                                    onChangeText={(value) => handleFamilyMemberChange(index, 'relation', value)}
                                                />
                                            </Input>
                                            {errors[`familyMember${index}Relation`] && (
                                                <FormControlError>
                                                    <FormControlErrorText>
                                                        {errors[`familyMember${index}Relation`]}
                                                    </FormControlErrorText>
                                                </FormControlError>
                                            )}
                                        </FormControl>

                                        <FormControl isInvalid={!!errors[`familyMember${index}Age`]}>
                                            <FormControlLabel>
                                                <FormControlLabelText>Age</FormControlLabelText>
                                            </FormControlLabel>
                                            <Input size="sm">
                                                <InputField
                                                    placeholder="Age"
                                                    value={member.age}
                                                    onChangeText={(value) => handleFamilyMemberChange(index, 'age', value)}
                                                    keyboardType="number-pad"
                                                />
                                            </Input>
                                            {errors[`familyMember${index}Age`] && (
                                                <FormControlError>
                                                    <FormControlErrorText>
                                                        {errors[`familyMember${index}Age`]}
                                                    </FormControlErrorText>
                                                </FormControlError>
                                            )}
                                        </FormControl>
                                    </VStack>
                                </Card>
                            ))}
                        </VStack>
                    </Card>

                    <HStack space="md" mt="$4">
                        <Button flex={1} variant="outline" onPress={() => navigation.goBack()}>
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button flex={1} onPress={handleSubmit} isDisabled={loading}>
                            <ButtonText>{loading ? 'Adding...' : 'Add Member'}</ButtonText>
                        </Button>
                    </HStack>
                </VStack>
            </ScrollView>
        </Box>
    );
}
