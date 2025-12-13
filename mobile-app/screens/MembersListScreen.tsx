import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, RefreshControl, Modal, ScrollView } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator, TextInput as PaperInput } from 'react-native-paper';
import { memberService, dashboardService } from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, DollarSign, Calendar, CheckCircle, XCircle, AlertTriangle, Info, PlusCircle, IndianRupee, Filter, Search } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';
import AlertBox from '../components/AlertBox';
import Header from '../components/Header';


export default function MembersListScreen() {
    const insets = useSafeAreaInsets();

    // State for search and filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'paid', 'due', 'overdue'


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb',
            paddingTop: 0, // Safe area will be handled by the wrapper View
        },
        content: {
            flex: 1,
            padding: 15,
            paddingTop: 8, // Keep some padding below the header
        },
        addButton: {
            padding: 4,
            borderRadius: 20,
        },
        searchContainer: {
            marginHorizontal: 16,
            marginBottom: 10,
        },
        modalBackdrop: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
        },
        modalContainer: {
            marginTop: 100, // Position below the search bar
            marginRight: 16,
            width: 150,
        },
        filterModalContent: {
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
            marginHorizontal: 16,
            borderRadius: 8,
            elevation: 2,
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
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
            backgroundColor: '#025937',
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
            marginBottom: 4,
        },
        memberStatus: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 4,
        },
        fundStatusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
        },
        mayyathuBadge: {
            backgroundColor: '#d1fae5', // light green
        },
        regularBadge: {
            backgroundColor: '#dbeafe', // light blue
        },
        fundStatusText: {
            fontSize: 12,
            fontWeight: '500',
        },
        mayyathuTextColor: {
            color: '#065f46', // dark green
        },
        regularTextColor: {
            color: '#1e40af', // dark blue
        },
        mayyathuText: {
            color: '#065f46', // dark green
        },
        regularText: {
            color: '#1e40af', // dark blue
        },
        paymentStatus: {
            fontSize: 12,
            fontWeight: '500',
        },
        paymentDue: {
            color: '#d97706', // yellow-600
        },
        paymentPaid: {
            color: '#065f46', // green-700
        },
        paymentOverdue: {
            color: '#dc2626', // red-600
        },
        addCollectionButton: {
            marginLeft: 8,
            padding: 4,
            alignSelf: 'center',
        },
        statusContainer: {
            flexDirection: 'row',
            gap: 8,
        },
        statusContainerVertical: {
            flexDirection: 'column',
            gap: 8,
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
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        alertModalContent: {
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
        modalLoadingText: {
            marginTop: 10,
            color: '#6b7280',
        },
        swipeableAction: {
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginVertical: 4,
        },
        deleteAction: {
            width: 80,
            margin: 4,
            marginLeft: 4,
        },
        removeMayyathuAction: {
            width: 100,
            margin: 4,
            marginRight: 4,
        },
        mayyathuAction: {
            width: 100,
            margin: 4,
            marginRight: 4,
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
        memberDetailModal: {
            backgroundColor: 'white',
            margin: 20,
            borderRadius: 12,
            maxHeight: '80%',
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
        },
        memberDetailHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6',
        },
        memberDetailTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: '#000000',
        },
        memberDetailCloseButton: {
            padding: 8,
            borderRadius: 20,
            backgroundColor: '#f9fafb',
        },
        memberDetailContent: {
            padding: 20,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 16,
            paddingVertical: 8,
        },
        detailLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: '#6b7280',
            minWidth: 120,
            paddingRight: 12,
        },
        detailValue: {
            fontSize: 14,
            color: '#1f2937',
            flex: 1,
            lineHeight: 20,
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 12,
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: '#f3f4f6',
        },
        modalButton: {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
            minWidth: 90,
            alignItems: 'center',
        },
        memberAvatar: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#025937',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        memberHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            paddingVertical: 8,
        },
        memberPhone: {
            fontSize: 14,
            color: '#6b7280',
            marginTop: 4,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#000000',
            marginBottom: 12,
            marginTop: 16,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6',
        },
        familyMemberRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 16,
            marginBottom: 8,
            marginHorizontal: 8,
        },
        actionButton: {
            padding: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        tabsContainer: {
            flexDirection: 'row',
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 4,
            marginHorizontal: 16,
            marginTop: 12, // Adding margin as requested
            marginBottom: 12,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
        },
        tab: {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 8,
            alignItems: 'center',
            borderRadius: 6,
        },
        activeTab: {
            backgroundColor: '#025937',
        },
        tabText: {
            fontSize: 12,
            fontWeight: '500',
            color: '#1f2937',
        },
        activeTabText: {
            color: 'white',
            fontWeight: '600',
        },
    });

    const [allMembers, setAllMembers] = useState<any[]>([]); // Store all members
    const [filteredMembers, setFilteredMembers] = useState<any[]>([]); // Store filtered/searched members
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [perPage] = useState(20); // Number of items per page
    const [showCustomAlert, setShowCustomAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { },
        confirmText: 'Confirm',
        cancelText: 'Cancel'
    });
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<{
        title: string;
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
        buttons: { text: string, onPress?: () => void, style?: 'default' | 'cancel' | 'destructive' }[];
    }>({
        title: '',
        message: '',
        type: 'info',
        buttons: [{ text: 'OK' }]
    });
    const [memberDetailModalVisible, setMemberDetailModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

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

    const fetchMembers = async (pageNum = 1) => {
        try {
            // For initial load (page 1), reset collections
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await memberService.getAll();
            let membersData = [];

            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    membersData = response.data;
                } else if (response.data.members && Array.isArray(response.data.members)) {
                    membersData = response.data.members;
                }
            }

            // For pagination, we'll slice the data based on page and perPage
            const startIndex = (pageNum - 1) * perPage;
            const endIndex = startIndex + perPage;
            const pageData = membersData.slice(startIndex, endIndex);

            // Check if there are more items
            const hasMoreItems = endIndex < membersData.length;

            // For each member, determine their payment status based on collections
            const membersWithPaymentStatus = await Promise.all(
                pageData.map(async (member: any) => {
                    const paymentStatus = await calculatePaymentStatus(member);
                    return {
                        ...member,
                        paymentStatus
                    };
                })
            );

            if (pageNum === 1) {
                // For first page: replace all members
                setAllMembers(membersWithPaymentStatus);
                setHasMore(hasMoreItems);
            } else {
                // For additional pages: append to existing members
                setAllMembers(prev => [...prev, ...membersWithPaymentStatus]);
                setHasMore(hasMoreItems);
            }

            // Apply filters to the appropriate dataset
            if (pageNum === 1) {
                applyFilters(membersWithPaymentStatus); // Apply current filters to the fetched data
            } else {
                // When loading more, reapply filters to all members
                applyFilters([...allMembers, ...membersWithPaymentStatus]);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
            showAlert('Error', 'Failed to load members', 'error');
        } finally {
            if (pageNum === 1) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
            if (pageNum === 1) {
                setRefreshing(false);
            }
        }
    };

    const loadMoreMembers = async () => {
        if (!hasMore || loadingMore) return; // Prevent multiple simultaneous requests
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchMembers(nextPage);
    };

    // Handle search query change
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1); // Reset to first page
        fetchMembers(1);
    };

    // Apply search and filter to the members list
    const applyFilters = (membersList = allMembers) => {
        let filtered = [...membersList];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(member =>
                member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.phone.includes(searchQuery) ||
                (member.adharNumber && member.adharNumber.includes(searchQuery)) ||
                (member.registrationNumber && member.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Apply payment status filter
        if (selectedFilter !== 'all') {
            if (selectedFilter === 'paid') {
                filtered = filtered.filter(member => member.paymentStatus === 'paid');
            } else if (selectedFilter === 'due') {
                filtered = filtered.filter(member => member.paymentStatus === 'due');
            } else if (selectedFilter === 'overdue') {
                filtered = filtered.filter(member => member.paymentStatus === 'overdue');
            }
        }

        setFilteredMembers(filtered);
    };

    // Handle filter selection
    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
    };

    // Debounce search and filter changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchMembers(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedFilter]);


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


    // Function to calculate payment status based on collection data
    const calculatePaymentStatus = async (member: any) => {
        try {
            // Fetch all collections to determine payment status
            const collectionsResponse = await dashboardService.getMoneyCollections();
            let collections = [];

            if (collectionsResponse && collectionsResponse.data) {
                if (Array.isArray(collectionsResponse.data)) {
                    collections = collectionsResponse.data;
                } else if (collectionsResponse.data.moneyCollections && Array.isArray(collectionsResponse.data.moneyCollections)) {
                    collections = collectionsResponse.data.moneyCollections;
                } else if (collectionsResponse.data.collections && Array.isArray(collectionsResponse.data.collections)) {
                    collections = collectionsResponse.data.collections;
                }
            }

            // Filter collections for this specific member (based on name or collectedBy)
            const memberCollections = collections.filter((collection: any) =>
                collection.collectedBy?.toLowerCase().includes(member.fullName?.toLowerCase() || '') ||
                collection.description?.toLowerCase().includes(member.fullName?.toLowerCase() || '')
            );

            if (memberCollections.length === 0) {
                return 'due'; // No collections for this member
            }

            // Get the most recent collection date
            const sortedCollections = memberCollections.sort((a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            const latestCollection = sortedCollections[0];
            const latestCollectionDate = new Date(latestCollection.date);

            // Calculate time difference in days
            const today = new Date();
            const timeDiff = today.getTime() - latestCollectionDate.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

            // Determine status based on days since last payment
            if (daysDiff > 30) {
                return 'overdue';
            } else {
                return 'paid';
            }
        } catch (error) {
            console.error('Error calculating payment status for member:', error);
            return 'due'; // Default to due if there's an error
        }
    };

    // Effect to apply filters when searchQuery or selectedFilter changes
    useEffect(() => {
        applyFilters(allMembers);
    }, [searchQuery, selectedFilter, allMembers]);

    useFocusEffect(
        React.useCallback(() => {
            setPage(1); // Reset to first page
            fetchMembers(1);
        }, [])
    );

    const deleteMember = async (id: string) => {
        try {
            await memberService.delete(id);
            const updatedMembers = allMembers.filter(member =>
                member._id !== id && member.id !== id
            );
            setAllMembers(updatedMembers);
            applyFilters(updatedMembers); // Reapply filters with updated data
        } catch (error) {
            console.error(error);
            showAlert('Error', 'Failed to delete member', 'error');
        }
    };

    const toggleMayyathuFund = async (id: string, name: string, isMayyathu: boolean) => {
        showAlert(
            isMayyathu ? 'Remove from Mayyathu Fund' : 'Add to Mayyathu Fund',
            isMayyathu
                ? `Are you sure you want to remove ${name} from the Mayyathu Fund?`
                : `Are you sure you want to add ${name} to the Mayyathu Fund?`,
            'info',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: isMayyathu ? 'Remove' : 'Add',
                    style: 'default',
                    onPress: () => updateMayyathuStatus(id, name, !isMayyathu)
                }
            ]
        );
    };

    // Function to update payment status for a single member
    const updateMemberPaymentStatus = async (member: any) => {
        const paymentStatus = await calculatePaymentStatus(member);
        return {
            ...member,
            paymentStatus
        };
    };

    const updateMayyathuStatus = async (id: string, name: string, status: boolean) => {
        try {
            await memberService.updateMayyathuStatus(id, status);

            // Update the specific member in the state directly for immediate UI feedback
            const updatedMembers = allMembers.map(member =>
                member._id === id || member.id === id
                    ? { ...member, mayyathuStatus: status }
                    : member
            );

            setAllMembers(updatedMembers);
            applyFilters(updatedMembers); // Reapply filters with updated data

            showAlert('Success', status
                ? `${name} has been added to Mayyathu Fund!`
                : `${name} has been removed from Mayyathu Fund!`, 'success');
        } catch (error) {
            console.error(error);
            showAlert('Error', status
                ? 'Failed to add member to Mayyathu Fund'
                : 'Failed to remove member from Mayyathu Fund', 'error');
            // If update fails, refresh the list to revert any optimistic updates
            fetchMembers();
        }
    };

    const confirmDelete = (id: string, name: string) => {
        showAlert('Delete Member', `Are you sure you want to delete ${name}?`, 'warning', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMember(id) }
        ]);
    };

    const renderLeftSwipeActions = (id: string, name: string) => (
        <TouchableOpacity
            style={[styles.swipeableAction, styles.deleteAction]}
            onPress={() => {
                confirmDelete(id, name);
                closeSwipeable(id);
            }}
        >
            <XCircle size={24} color="#EF4444" />
        </TouchableOpacity>
    );

    const renderRightSwipeActions = (id: string, name: string, isMayyathu: boolean) => (progress: any, dragX: any) => (
        <TouchableOpacity
            style={[styles.swipeableAction, isMayyathu ? styles.removeMayyathuAction : styles.mayyathuAction]}
            onPress={() => {
                toggleMayyathuFund(id, name, isMayyathu);
                closeSwipeable(id);
            }}
        >
            <DollarSign size={24}
                color={isMayyathu ? "#F59E0B" : "#025937"} // Amber for remove, green for add
            />
        </TouchableOpacity>
    );

    const closeSwipeable = (id: string) => {
        const swipeable = swipeableRefs.current[id];
        if (swipeable && typeof swipeable.close === 'function') {
            swipeable.close();
        }
    };

    const showMemberDetails = async (id: string) => {
        const member = allMembers.find((m: { _id: string; id: string; }) => m._id === id || m.id === id);
        if (member) {
            setSelectedMember(member);
            setMemberDetailModalVisible(true);
        }
    };

    const addCollectionForMember = (member: any) => {
        // Navigate to the AddCollection screen and pre-fill with member info
        navigation.navigate('AddCollection', {
            prefillData: {
                collectedBy: member.fullName || 'Member',
                description: `Collection from ${member.fullName || 'member'}`
            }
        });
    };

    const renderMemberItem = ({ item, index }: { item: any, index: number }) => {
        const leftActions = (progress: any, dragX: any) => renderLeftSwipeActions(item._id || item.id, item.fullName);
        const rightActions = renderRightSwipeActions(item._id || item.id, item.fullName, item.mayyathuStatus === true || item.mayyathuStatus === 1);

        return (
            <View>
                <Swipeable
                    ref={(ref) => { swipeableRefs.current[item._id || item.id] = ref; }}
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

                                {/* Status indicators - Fund status and payment status stacked vertically */}
                                <View style={styles.statusContainerVertical}>
                                    {/* Fund Status - Changed to text color only, no background */}
                                    <Text style={[
                                        styles.fundStatusText,
                                        (item.mayyathuStatus === true || item.mayyathuStatus === 1)
                                            ? styles.mayyathuTextColor
                                            : styles.regularTextColor
                                    ]}>
                                        {item.mayyathuStatus === true || item.mayyathuStatus === 1 ? 'Mayyathu Fund' : 'Regular'}
                                    </Text>

                                    {/* Payment Status - Below the fund status with text color only */}
                                    {item.paymentStatus === 'overdue' ? (
                                        <Text style={[styles.paymentStatus, styles.paymentOverdue]}>Over Due</Text>
                                    ) : item.paymentStatus === 'paid' ? (
                                        <Text style={[styles.paymentStatus, styles.paymentPaid]}>Paid</Text>
                                    ) : (
                                        <Text style={[styles.paymentStatus, styles.paymentDue]}>Due</Text>
                                    )}
                                </View>
                            </View>

                            {/* New Collection Icon - Placed on the right side */}
                        </View>
                    </TouchableOpacity>
                </Swipeable >
            </View >
        );
    };



    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                title="Members"
                subtitle={`${filteredMembers.length} ${filteredMembers.length === 1 ? 'member' : 'members'}`}
                rightComponent={
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddMember', { mode: 'create' })}
                        style={{ padding: 8, marginRight: 6 }}  // Reduced margin to move 2px more right
                    >
                        <User size={20} color="#025937" />
                    </TouchableOpacity>
                }
            />

            <View style={{ marginHorizontal: 16, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <PaperInput
                        placeholder="Search members..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        mode="outlined"
                        theme={{ colors: { primary: '#025937', background: 'transparent' } }}
                        textColor="#000000"
                        activeOutlineColor="#025937"
                        style={{ flex: 1, height: 45, backgroundColor: 'white' }}
                        outlineStyle={{ borderRadius: 4 }}
                        contentStyle={{ paddingVertical: 0 }}
                        left={<PaperInput.Icon icon={() => <Search size={20} color="#9ca3af" />} />}
                    />
                </View>

                {/* Filter Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, selectedFilter === 'all' && styles.activeTab]}
                        onPress={() => handleFilterSelect('all')}
                    >
                        <Text style={[styles.tabText, selectedFilter === 'all' && styles.activeTabText]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedFilter === 'paid' && styles.activeTab]}
                        onPress={() => handleFilterSelect('paid')}
                    >
                        <Text style={[styles.tabText, selectedFilter === 'paid' && styles.activeTabText]}>Paid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedFilter === 'due' && styles.activeTab]}
                        onPress={() => handleFilterSelect('due')}
                    >
                        <Text style={[styles.tabText, selectedFilter === 'due' && styles.activeTabText]}>Due</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedFilter === 'overdue' && styles.activeTab]}
                        onPress={() => handleFilterSelect('overdue')}
                    >
                        <Text style={[styles.tabText, selectedFilter === 'overdue' && styles.activeTabText]}>Overdue</Text>
                    </TouchableOpacity>
                </View>
            </View>



            <View style={styles.content}>
                {loading && !refreshing ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#025937" />
                        <Text style={styles.loadingText}>Loading members...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredMembers}
                        renderItem={renderMemberItem}
                        keyExtractor={(item) => item._id || item.id}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        onEndReached={loadMoreMembers}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={
                            loadingMore ? (
                                <View style={{ padding: 20, alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color="#025937" />
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    {searchQuery || selectedFilter !== 'all'
                                        ? 'No members found matching your criteria'
                                        : 'No members found. Add your first member!'}
                                </Text>
                                {!(searchQuery || selectedFilter !== 'all') && (
                                    <TouchableOpacity
                                        style={[styles.addButton, { marginTop: 16 }]}
                                        onPress={() => navigation.navigate('AddMember', { mode: 'create' })}
                                    >
                                        <Text style={{ color: '#025937', fontWeight: 'bold' }}>Add Member</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        }
                    />
                )}
            </View>

            {showCustomAlert && (
                <View style={styles.modalOverlay}>
                    <View style={styles.alertModalContent}>
                        <View style={{ padding: 20 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{alertConfig.title}</Text>
                            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>{alertConfig.message}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                                <PaperButton
                                    onPress={() => {
                                        alertConfig.onCancel();
                                        setShowCustomAlert(false);
                                    }}
                                >
                                    <Text>{alertConfig.cancelText}</Text>
                                </PaperButton>
                                <PaperButton
                                    onPress={() => {
                                        alertConfig.onConfirm();
                                        setShowCustomAlert(false);
                                    }}
                                    mode="contained"
                                >
                                    <Text style={{ color: '#fff' }}>{alertConfig.confirmText}</Text>
                                </PaperButton>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            <AlertBox
                visible={alertVisible}
                title={alertProps.title}
                message={alertProps.message}
                type={alertProps.type}
                buttons={alertProps.buttons}
                onClose={() => setAlertVisible(false)}
            />

            {/* Member Detail Modal */}
            <Modal
                visible={memberDetailModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setMemberDetailModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    {selectedMember && (
                        <View style={styles.memberDetailModal}>
                            <View style={styles.memberDetailHeader}>
                                <Text style={styles.memberDetailTitle}>Member Details</Text>
                                <TouchableOpacity
                                    style={styles.memberDetailCloseButton}
                                    onPress={() => setMemberDetailModalVisible(false)}
                                >
                                    <XCircle size={20} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.memberDetailContent}>
                                {/* Member Header */}
                                <View style={styles.memberHeader}>
                                    <View style={styles.memberAvatar}>
                                        <Text style={styles.avatarText}>
                                            {selectedMember.fullName?.charAt(0) || 'U'}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.memberName}>{selectedMember.fullName || 'N/A'}</Text>
                                        <Text style={styles.memberPhone}>Phone: {selectedMember.phone || 'N/A'}</Text>
                                    </View>
                                </View>

                                <Text style={styles.sectionTitle}>Personal Information</Text>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Age:</Text>
                                    <Text style={styles.detailValue}>{selectedMember.age || 'N/A'}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Aadhaar:</Text>
                                    <Text style={styles.detailValue}>{selectedMember.adharNumber || 'N/A'}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Occupation:</Text>
                                    <Text style={styles.detailValue}>{selectedMember.occupation || 'N/A'}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>House Type:</Text>
                                    <Text style={styles.detailValue}>{selectedMember.houseType || 'N/A'}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Registration:</Text>
                                    <Text style={styles.detailValue}>{selectedMember.registrationNumber || 'N/A'}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Mayyathu Fund:</Text>
                                    <Text style={styles.detailValue}>
                                        {selectedMember.mayyathuStatus ? 'Yes' : 'No'}
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Family Members:</Text>
                                    <Text style={styles.detailValue}>
                                        {selectedMember.familyMembersCount || 0}
                                    </Text>
                                </View>

                                {selectedMember.familyMembers && selectedMember.familyMembers.length > 0 && (
                                    <>
                                        <Text style={styles.sectionTitle}>Family Members</Text>
                                        {selectedMember.familyMembers.map((member: any, index: number) => (
                                            <View key={index} style={styles.familyMemberRow}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontWeight: '600', color: '#1f2937', fontSize: 15 }}>{member.name}</Text>
                                                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                                                        {member.relation || member.relationship || member.relationType || member.rel || 'Relation N/A'}
                                                    </Text>
                                                </View>
                                                <View style={{ alignItems: 'flex-end' }}>
                                                    <Text style={{ color: '#1f2937', fontWeight: '500', fontSize: 14 }}>Age: {member.age}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </>
                                )}
                            </ScrollView>

                            <View style={styles.modalButtons}>
                                <PaperButton
                                    mode="outlined"
                                    onPress={() => {
                                        setMemberDetailModalVisible(false);
                                        // Navigate to edit mode
                                        navigation.navigate('AddMember', { mode: 'edit', item: selectedMember });
                                    }}
                                    style={styles.modalButton}
                                >
                                    <Text style={{ color: '#059669' }}>Edit</Text>
                                </PaperButton>
                                <PaperButton
                                    mode="contained"
                                    onPress={() => {
                                        setMemberDetailModalVisible(false);
                                        // Add collection for this member
                                        navigation.navigate('AddCollection', {
                                            prefillData: {
                                                collectedBy: selectedMember.fullName || 'Member',
                                                description: `Collection from ${selectedMember.fullName || 'member'}`
                                            }
                                        });
                                    }}
                                    style={[styles.modalButton, { backgroundColor: '#059669' }]}
                                >
                                    <Text style={{ color: 'white' }}>Add Collection</Text>
                                </PaperButton>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>


        </View>
    );
}