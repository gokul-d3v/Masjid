import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Alert, RefreshControl, Modal } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { memberService } from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Heart, Trash2, Pencil, DollarSign, User, Mail, Phone, Calendar, MapPin, X } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';

export default function MembersListScreen() {
    const insets = useSafeAreaInsets();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb',
            paddingTop: insets.top + 10,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: 'white',
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1f2937',
        },
        addButton: {
            backgroundColor: '#10b981',
            padding: 10,
            borderRadius: 20,
        },
        addButtonText: {
            color: 'white',
            fontWeight: 'bold',
        },
        content: {
            flex: 1,
            paddingHorizontal: 16,
        },
        centerContent: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingText: {
            marginTop: 10,
            color: '#6b7280',
        },
        memberCard: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 16,
            marginVertical: 4,
            borderRadius: 8,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        memberInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        avatarContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#10b981',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        avatarText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
        },
        memberDetails: {
            flex: 1,
        },
        memberName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1f2937',
        },
        memberPhone: {
            fontSize: 14,
            color: '#6b7280',
            marginTop: 2,
        },
        memberId: {
            fontSize: 12,
            color: '#9ca3af',
            marginTop: 2,
        },
        memberInfoContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        memberStats: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        familyMembersCount: {
            fontSize: 14,
            color: '#6b7280',
            marginRight: 8,
        },
        actionButtons: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
        },
        actionButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 8,
        },
        editButton: {
            backgroundColor: '#3b82f6',
        },
        deleteButton: {
            backgroundColor: '#ef4444',
        },
        swipeableAction: {
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginVertical: 4,
        },
        deleteAction: {
            backgroundColor: '#ef4444',
            width: 80,
            margin: 4,
            borderRadius: 8,
            marginLeft: 4,
        },
        mayyathuAction: {
            backgroundColor: '#10b981',
            width: 100,
            margin: 4,
            borderRadius: 8,
            marginRight: 4,
        },
        removeMayyathuAction: {
            backgroundColor: '#f59e0b', // amber color for removal
            width: 100,
            margin: 4,
            borderRadius: 8,
            marginRight: 4,
        },
        actionText: {
            color: 'white',
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: 4,
        },
        mayyathuBadge: {
            backgroundColor: '#d1fae5', // light green background
            borderRadius: 12,
            padding: 4,
            alignItems: 'center',
        },
        mayyathuText: {
            fontSize: 10,
            color: '#065f46', // dark green
            fontWeight: 'bold',
            marginTop: 2,
        },
        regularText: {
            fontSize: 10,
            color: '#7f1d1d', // dark red
            fontWeight: 'bold',
            marginTop: 2,
        },
        regularBadge: {
            backgroundColor: '#fee2e2', // light red background
            borderRadius: 12,
            padding: 4,
            alignItems: 'center',
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: 12,
            width: '100%',
            maxWidth: 500,
            maxHeight: '80%',
            overflow: 'hidden',
        },
        modalLoadingContainer: {
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1f2937',
        },
        closeButton: {
            padding: 4,
        },
        modalBody: {
            padding: 16,
            flex: 1,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
        },
        detailTextContainer: {
            marginLeft: 12,
            flex: 1,
        },
        detailLabel: {
            fontSize: 14,
            color: '#6b7280',
            fontWeight: '500',
        },
        detailValue: {
            fontSize: 16,
            color: '#1f2937',
            marginTop: 2,
        },
        mayyathuStatusText: {
            color: '#065f46', // dark green
            fontWeight: 'bold',
        },
        regularStatusText: {
            color: '#7f1d1d', // dark red
            fontWeight: 'bold',
        },
        modalActions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
        },
        modalCloseButton: {
            marginLeft: 8,
        },
        editButton: {
            flex: 1,
            backgroundColor: '#3b82f6', // blue-500
        },
        deleteButton: {
            flex: 1,
            backgroundColor: '#ef4444', // red-500
            marginLeft: 8,
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold',
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 100,
        },
        emptyText: {
            fontSize: 16,
            color: '#6b7280',
            textAlign: 'center',
        },
        customAlert: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        },
        alertContent: {
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            width: '80%',
            alignItems: 'center',
        },
        alertTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
        },
        alertMessage: {
            fontSize: 16,
            color: '#6b7280',
            marginBottom: 20,
            textAlign: 'center',
        },
        alertButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        alertButton: {
            flex: 1,
            padding: 10,
            borderRadius: 4,
            marginHorizontal: 5,
            alignItems: 'center',
        },
        cancelButton: {
            backgroundColor: '#d1d5db',
        },
        confirmButton: {
            backgroundColor: '#10b981',
        },
        alertButtonText: {
            color: 'white',
            fontWeight: 'bold',
        },
    });

    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showCustomAlert, setShowCustomAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {},
        confirmText: 'Confirm',
        cancelText: 'Cancel'
    });
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [memberDetailLoading, setMemberDetailLoading] = useState(false);
    const navigation = useNavigation<any>();
    const swipeableRefs = useRef<Record<string, Swipeable | null>>({});

    useEffect(() => {
        return () => {
            // Cleanup swipeable refs on unmount
            Object.keys(swipeableRefs.current).forEach(key => {
                swipeableRefs.current[key] = null;
            });
        };
    }, []);

    const showMemberDetails = async (id: string) => {
        try {
            setMemberDetailLoading(true);
            // Fetch member details by ID
            const response = await memberService.getById(id);
            setSelectedMember(response.data);
            setShowMemberModal(true);
        } catch (error) {
            console.error('Error fetching member details:', error);
            // If API call fails, try to find member in the current list
            const member = members.find(m => m._id === id || m.id === id);
            if (member) {
                setSelectedMember(member);
                setShowMemberModal(true);
            } else {
                Alert.alert('Error', 'Failed to load member details');
            }
        } finally {
            setMemberDetailLoading(false);
        }
    };

    const closeSwipeable = (id: string) => {
        const swipeable = swipeableRefs.current[id];
        if (swipeable && typeof swipeable.close === 'function') {
            swipeable.close();
        }
    };

    const deleteMember = async (id: string) => {
        try {
            await memberService.delete(id);
            fetchMembers(); // Refresh the list
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete member');
        }
    };

    const toggleMayyathuFund = async (id: string, name: string, isMayyathu: boolean) => {
        setAlertConfig({
            title: isMayyathu ? 'Remove from Mayyathu Fund' : 'Add to Mayyathu Fund',
            message: isMayyathu
                ? `Are you sure you want to remove ${name} from the Mayyathu Fund?`
                : `Are you sure you want to add ${name} to the Mayyathu Fund?`,
            onConfirm: () => updateMayyathuStatus(id, name, !isMayyathu),
            onCancel: () => {},
            confirmText: isMayyathu ? 'Remove' : 'Add',
            cancelText: 'Cancel'
        });
        setShowCustomAlert(true);
    };

    const updateMayyathuStatus = async (id: string, name: string, status: boolean) => {
        try {
            await memberService.updateMayyathuStatus(id, status);

            // Update the specific member in the state directly for immediate UI feedback
            setMembers(prevMembers =>
                prevMembers.map(member =>
                    member._id === id || member.id === id
                        ? { ...member, mayyathuStatus: status }
                        : member
                )
            );

            Alert.alert('Success', status
                ? `${name} has been added to Mayyathu Fund!`
                : `${name} has been removed from Mayyathu Fund!`);

            // Optionally, fetch all members again after a brief delay to ensure consistency
            setTimeout(() => {
                fetchMembers();
            }, 1000); // Refresh after 1 second to ensure backend consistency
        } catch (error) {
            console.error(error);
            Alert.alert('Error', status
                ? 'Failed to add member to Mayyathu Fund'
                : 'Failed to remove member from Mayyathu Fund');
            // If update fails, refresh the list to revert any optimistic updates
            fetchMembers();
        }
    };

    const confirmDelete = (id: string, name: string) => {
        setAlertConfig({
            title: 'Delete Member',
            message: `Are you sure you want to delete ${name}?`,
            onConfirm: () => deleteMember(id),
            onCancel: () => {},
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });
        setShowCustomAlert(true);
    };

    const renderLeftSwipeActions = (id: string, name: string) => (
        <TouchableOpacity
            style={[styles.swipeableAction, styles.deleteAction]}
            onPress={() => {
                confirmDelete(id, name);
                closeSwipeable(id);
            }}
        >
            <Trash2 size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
    );

    const renderRightSwipeActions = (id: string, name: string, isMayyathu: boolean) => (
        <TouchableOpacity
            style={[styles.swipeableAction, isMayyathu ? styles.removeMayyathuAction : styles.mayyathuAction]}
            onPress={() => {
                toggleMayyathuFund(id, name, isMayyathu);
                closeSwipeable(id);
            }}
        >
            <DollarSign size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>{isMayyathu ? "Remove" : "Add"}</Text>
        </TouchableOpacity>
    );

    const fetchMembers = async () => {
        try {
            const response = await memberService.getAll();
            let membersData = [];

            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    membersData = response.data;
                } else if (response.data.members && Array.isArray(response.data.members)) {
                    membersData = response.data.members;
                }
            }

            setMembers(membersData);
        } catch (error) {
            console.error('Error fetching members:', error);
            Alert.alert('Error', 'Failed to load members');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchMembers();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchMembers();
    };



    const renderMemberItem = ({ item }: { item: any }) => {
        const leftActions = (progress: any, dragX: any) => renderLeftSwipeActions(item._id || item.id, item.fullName);
        const rightActions = (progress: any, dragX: any) => renderRightSwipeActions(item._id || item.id, item.fullName, item.mayyathuStatus === true || item.mayyathuStatus === 1);

        return (
            <Swipeable
                ref={(ref) => (swipeableRefs.current[item._id || item.id] = ref)}
                renderLeftActions={leftActions}
                renderRightActions={rightActions}
                overshootLeft={false}
                overshootRight={false}
            >
                <TouchableOpacity
                    style={styles.memberCard}
                    onPress={() => showMemberDetails(item._id || item.id)}
                >
                    <View style={styles.memberInfo}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>
                                {item.fullName?.charAt(0) || 'U'}
                            </Text>
                        </View>
                        <View style={styles.memberDetails}>
                            <Text style={styles.memberName}>{item.fullName || 'No Name'}</Text>
                            <Text style={styles.memberPhone}>{item.phone || 'No phone'}</Text>
                            <Text style={styles.memberId}>ID: {item.registrationNumber || item._id || item.id || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.memberStats}>
                        <Text style={styles.familyMembersCount}>
                            {typeof item.familyMembersCount !== 'undefined' && item.familyMembersCount !== null ? item.familyMembersCount : 0} family members
                        </Text>
                        {item.mayyathuStatus === true || item.mayyathuStatus === 1 ? (
                            <View style={styles.mayyathuBadge}>
                                <DollarSign size={14} color="#10b981" />
                                <Text style={styles.mayyathuText}>Mayyathu</Text>
                            </View>
                        ) : (
                            <View style={styles.regularBadge}>
                                <Text style={styles.regularText}>Regular</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#10b981" />
                <Text style={styles.loadingText}>Loading members...</Text>
            </View>
        );
    }

    const renderMemberDetailModal = () => {
        if (!selectedMember) return null;

        return (
            <Modal
                visible={showMemberModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowMemberModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {memberDetailLoading ? (
                            <View style={styles.modalLoadingContainer}>
                                <ActivityIndicator size="large" color="#10b981" />
                                <Text style={styles.loadingText}>Loading details...</Text>
                            </View>
                        ) : (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Member Details</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowMemberModal(false)}
                                        style={styles.closeButton}
                                    >
                                        <X size={24} color="#6b7280" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.modalBody}>
                                    <View style={styles.avatarContainer}>
                                        <Text style={styles.avatarText}>
                                            {selectedMember.fullName?.charAt(0) || 'U'}
                                        </Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <User size={20} color="#6b7280" />
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Name</Text>
                                            <Text style={styles.detailValue}>{selectedMember.fullName || 'N/A'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Mail size={20} color="#6b7280" />
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Email</Text>
                                            <Text style={styles.detailValue}>{selectedMember.email || 'N/A'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Phone size={20} color="#6b7280" />
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Phone</Text>
                                            <Text style={styles.detailValue}>{selectedMember.phone || 'N/A'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Calendar size={20} color="#6b7280" />
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Age</Text>
                                            <Text style={styles.detailValue}>{selectedMember.age || 'N/A'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <MapPin size={20} color="#6b7280" />
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Registration</Text>
                                            <Text style={styles.detailValue}>{selectedMember.registrationNumber || 'N/A'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Heart size={16} color="#6b7280" />
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Family Members</Text>
                                            <Text style={styles.detailValue}>
                                                {typeof selectedMember.familyMembersCount !== 'undefined' && selectedMember.familyMembersCount !== null
                                                    ? selectedMember.familyMembersCount
                                                    : (selectedMember.familyMembers ? selectedMember.familyMembers.length : 0)}
                                                members
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <DollarSign size={16} color={selectedMember.mayyathuStatus ? "#10b981" : "#6b7280"} />
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Mayyathu Fund</Text>
                                            <Text style={[styles.detailValue, selectedMember.mayyathuStatus ? styles.mayyathuStatusText : styles.regularStatusText]}>
                                                {selectedMember.mayyathuStatus ? 'Yes' : 'No'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.modalActions}>
                                    <PaperButton
                                        style={styles.editButton}
                                        onPress={() => {
                                            setShowMemberModal(false);
                                            navigation.navigate('AddMember', { mode: 'edit', item: { ...selectedMember } });
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </PaperButton>
                                    <PaperButton
                                        style={[styles.deleteButton, styles.modalCloseButton]}
                                        onPress={() => setShowMemberModal(false)}
                                    >
                                        <Text style={styles.buttonText}>Close</Text>
                                    </PaperButton>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Members</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddMember', { mode: 'create' })}
                >
                    <Plus size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={members}
                    renderItem={renderMemberItem}
                    keyExtractor={(item) => item._id || item.id}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No members found. Add your first member!</Text>
                            <TouchableOpacity
                                style={[styles.addButton, { marginTop: 16 }]}
                                onPress={() => navigation.navigate('AddMember', { mode: 'create' })}
                            >
                                <Text style={styles.addButtonText}>Add Member</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>

            {showCustomAlert && (
                <View style={styles.customAlert}>
                    <View style={styles.alertContent}>
                        <Text style={styles.alertTitle}>{alertConfig.title}</Text>
                        <Text style={styles.alertMessage}>{alertConfig.message}</Text>
                        <View style={styles.alertButtonContainer}>
                            <TouchableOpacity
                                style={[styles.alertButton, styles.cancelButton]}
                                onPress={() => {
                                    alertConfig.onCancel();
                                    setShowCustomAlert(false);
                                }}
                            >
                                <Text style={styles.alertButtonText}>{alertConfig.cancelText}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.alertButton, styles.confirmButton]}
                                onPress={() => {
                                    alertConfig.onConfirm();
                                    setShowCustomAlert(false);
                                }}
                            >
                                <Text style={styles.alertButtonText}>{alertConfig.confirmText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {renderMemberDetailModal()}
        </View>
    );
}