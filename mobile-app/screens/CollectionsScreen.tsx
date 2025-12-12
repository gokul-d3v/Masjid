import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { dashboardService } from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, DollarSign, Calendar, CheckCircle, XCircle, AlertTriangle, Info, PlusCircle, IndianRupee, Filter, Search } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler'; // TODO: Replace with reanimated version when available
import Header from '../components/Header';

export default function CollectionsScreen() {
    const insets = useSafeAreaInsets();

    // State for search and filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMenuVisible, setFilterMenuVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'paid', 'overdue', 'monthly_donation', 'mayyathu', 'general'
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const [allCollections, setAllCollections] = useState<any[]>([]); // Store all collections
    const [filteredCollections, setFilteredCollections] = useState<any[]>([]); // Store filtered/searched collections
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

    // For collections, we'll use a simplified approach since collections are individual transactions
    // Each collection's status is based on its date relative to current date
    const calculatePaymentStatusForCollection = (collection: any) => {
        try {
            // Calculate time difference in days between collection date and today
            const collectionDate = new Date(collection.date);
            const today = new Date();
            const timeDiff = today.getTime() - collectionDate.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

            // Determine status based on days since collection
            if (daysDiff > 30) {
                return 'overdue'; // Collection is older than 30 days
            } else {
                return 'paid'; // Collection is recent (within 30 days)
            }
        } catch (error) {
            console.error('Error calculating payment status for collection:', error);
            return 'paid'; // Default to paid for collections since they are already collected
        }
    };

    const fetchCollections = async (pageNum = 1) => {
        try {
            // For initial load (page 1), reset collections
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            // In a real implementation, the API should support pagination parameters
            // For now, simulating pagination by getting more data
            const response = await dashboardService.getMoneyCollections();
            let collectionsData = [];

            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    collectionsData = response.data;
                } else if (response.data.collections && Array.isArray(response.data.collections)) {
                    collectionsData = response.data.collections;
                } else if (response.data.moneyCollections && Array.isArray(response.data.moneyCollections)) {
                    collectionsData = response.data.moneyCollections;
                }
            }

            // For pagination, we'll slice the data based on page and perPage
            const startIndex = (pageNum - 1) * perPage;
            const endIndex = startIndex + perPage;
            const pageData = collectionsData.slice(startIndex, endIndex);

            // Check if there are more items
            const hasMoreItems = endIndex < collectionsData.length;

            // For each collection, determine their payment status and sort by date (latest first)
            const collectionWithPaymentStatus = pageData
                .map((collection: any) => {
                    const paymentStatus = calculatePaymentStatusForCollection(collection);
                    return {
                        ...collection,
                        paymentStatus
                    };
                })
                .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, latest first

            if (pageNum === 1) {
                // For first page: replace all collections
                setAllCollections(collectionWithPaymentStatus);
                setHasMore(hasMoreItems);
            } else {
                // For additional pages: append to existing collections
                setAllCollections(prev => [...prev, ...collectionWithPaymentStatus]);
                setHasMore(hasMoreItems);
            }

            if (pageNum === 1) {
                applyFilters(collectionWithPaymentStatus); // Apply current filters to the fetched data
            } else {
                // When loading more, reapply filters to all collections
                applyFilters([...allCollections, ...collectionWithPaymentStatus]);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
            Alert.alert('Error', 'Failed to load collections');
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

    const loadMoreCollections = async () => {
        if (!hasMore || loadingMore) return; // Prevent multiple simultaneous requests
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchCollections(nextPage);
    };

    // Apply search and filter to the collections list
    const applyFilters = (collectionsList = allCollections) => {
        let filtered = [...collectionsList];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(collection =>
                collection.collectedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                collection.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                collection.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                collection.amount.toString().includes(searchQuery)
            );
        }

        // Apply category filter
        if (selectedFilter !== 'all') {
            if (selectedFilter === 'paid') {
                // 'paid' filter for collections means recent collections (within 30 days)
                filtered = filtered.filter(collection => collection.paymentStatus === 'paid');
            } else if (selectedFilter === 'overdue') {
                // 'overdue' filter for collections means old collections (older than 30 days)
                filtered = filtered.filter(collection => collection.paymentStatus === 'overdue');
            } else if (selectedFilter === 'monthly_donation' || selectedFilter === 'mayyathu' || selectedFilter === 'general') {
                // Specific category filter
                filtered = filtered.filter(collection => collection.category === selectedFilter);
            }
        }

        setFilteredCollections(filtered);
    };

    // Handle search query change
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Reset pagination when search changes
        if (query !== searchQuery) {
            setPage(1);
            fetchCollections(1);
        }
    };

    // Use the existing filter selection function definition
    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
        setFilterMenuVisible(false);
        // Reset pagination when filter changes
        setPage(1);
        fetchCollections(1);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchCollections();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1); // Reset to first page
        fetchCollections(1);
    };

    // Function to show custom alert
    const showAlert = (
        title: string,
        message: string,
        type: 'success' | 'error' | 'warning' | 'info' = 'info',
        buttons: Array<{ text: string, onPress?: () => void, style?: 'default' | 'cancel' | 'destructive' }> = [{ text: 'OK' }]
    ) => {
        setAlertConfig({
            title,
            message,
            onConfirm: () => {
                const confirmButton = buttons.find(btn => btn.text.toLowerCase() !== 'cancel');
                if (confirmButton && confirmButton.onPress) {
                    confirmButton.onPress();
                }
            },
            onCancel: () => {
                const cancelButton = buttons.find(btn => btn.text.toLowerCase() === 'cancel');
                if (cancelButton && cancelButton.onPress) {
                    cancelButton.onPress();
                }
            },
            confirmText: buttons.find(btn => btn.text.toLowerCase() !== 'cancel')?.text || 'OK',
            cancelText: buttons.find(btn => btn.text.toLowerCase() === 'cancel')?.text || 'Cancel'
        });
        setShowCustomAlert(true);
    };

    const deleteCollection = async (id: string) => {
        try {
            await dashboardService.deleteMoneyCollection(id);
            const updatedCollections = allCollections.filter(collection =>
                collection._id !== id && collection.id !== id
            );
            setAllCollections(updatedCollections);
            applyFilters(updatedCollections); // Reapply filters with updated data
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete collection');
        }
    };

    const confirmDelete = (id: string, description: string) => {
        showAlert('Delete Collection', `Are you sure you want to delete ${description}?`, 'warning', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteCollection(id) }
        ]);
    };

    const renderLeftSwipeActions = (id: string, description: string) => (
        <TouchableOpacity
            style={[styles.swipeableAction, styles.deleteAction]}
            onPress={() => {
                confirmDelete(id, description);
                closeSwipeable(id);
            }}
        >
            <XCircle size={24} color="#EF4444" />
        </TouchableOpacity>
    );

    const closeSwipeable = (id: string) => {
        const swipeable = swipeableRefs.current[id];
        if (swipeable && typeof swipeable.close === 'function') {
            swipeable.close();
        }
    };

    const showCollectionDetails = async (id: string) => {
        // For now, navigate to add collection screen in edit mode
        navigation.navigate('AddCollection', {
            mode: 'edit',
            item: allCollections.find(c => c._id === id || c.id === id)
        });
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-nocheck - Suppressing deprecated Swipeable warning temporarily. TODO: Replace with reanimated version
    const renderCollectionItem = ({ item }: { item: any }) => {
        const leftActions = (progress: any, dragX: any) => renderLeftSwipeActions(item._id || item.id, item.description || 'collection');

        return (
            <Swipeable
                ref={(ref: Swipeable | null) => {
                    swipeableRefs.current[item._id || item.id] = ref;
                }}
                renderLeftActions={leftActions}
                overshootLeft={false}
                overshootRight={false}
            >
                <TouchableOpacity
                    style={styles.collectionCard}
                    onPress={() => showCollectionDetails(item._id || item.id)}
                >
                    <View style={styles.collectionInfo}>
                        <View style={styles.avatarContainer}>
                            <IndianRupee size={20} color="white" />
                        </View>
                        <View style={styles.collectionDetails}>
                            <Text style={styles.collectionName}>{item.description || 'Collection'}</Text>

                            <View style={styles.collectionDetailsRow}>
                                {/* Category and Amount on the left */}
                                <View style={styles.leftStatusContainer}>
                                    {/* Category - Text only, no background */}
                                    <Text style={[
                                        styles.fundStatusText,
                                        item.category === 'mayyathu' ? styles.mayyathuText : styles.regularText
                                    ]}>
                                        {item.category || 'General'}
                                    </Text>

                                    {/* Amount */}
                                    <Text style={styles.amountText}>₹{item.amount || 0}</Text>
                                </View>

                                {/* Payment Status on the far right */}
                                {item.paymentStatus === 'overdue' ? (
                                    <Text style={[styles.paymentStatus, styles.paymentOverdue]}>Overdue</Text>
                                ) : item.paymentStatus === 'paid' ? (
                                    <Text style={[styles.paymentStatus, styles.paymentPaid]}>Paid</Text>
                                ) : (
                                    <Text style={[styles.paymentStatus, styles.paymentDue]}>Due</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb',
            paddingTop: 0, // Safe area will be handled by the wrapper View
        },
        content: {
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
        collectionCard: {
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
        collectionInfo: {
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
        collectionDetails: {
            flex: 1,
        },
        collectionName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1f2937',
        },
        collectionDetailsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
        },
        leftStatusContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        fundStatusText: {
            fontSize: 12,
            fontWeight: '500',
        },
        regularText: {
            color: '#1e40af', // dark blue
        },
        mayyathuText: {
            color: '#065f46', // dark green
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
        amountText: {
            fontWeight: 'bold',
            color: '#10b981',
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
            position: 'absolute',
            top: 50,
            right: 16,
            backgroundColor: 'transparent',
            zIndex: 1000,
            width: 150,
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
        searchBox: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isSearchFocused ? '#10b981' : '#d1d5db',
            borderRadius: 4,
            height: 40,
            backgroundColor: 'transparent',
            marginRight: 8,
            paddingHorizontal: 8
        },
        searchInput: {
            flex: 1,
            marginLeft: 8,
            fontSize: 14,
            color: '#1f2937'
        },
    });

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#10b981" />
                <Text style={{ marginTop: 10, color: '#6b7280' }}>Loading collections...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                title="Collections"
                subtitle={`${filteredCollections.length} ${filteredCollections.length === 1 ? 'collection' : 'collections'}`}
                rightComponent={
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddCollection', { mode: 'create' })}
                        style={{ padding: 8, marginRight: 6 }}  // Reduced margin to move 2px more right
                    >
                        <PlusCircle size={20} color="#10b981" />
                    </TouchableOpacity>
                }
            />

            {/* Search Bar and Filter Button */}
            <View style={styles.searchContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.searchBox}>
                        <Search size={16} color="#9ca3af" />
                        <TextInput
                            placeholder="Search collections..."
                            value={searchQuery}
                            onChangeText={handleSearch}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            style={styles.searchInput}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => setFilterMenuVisible(true)}
                        style={{ padding: 12 }}
                    >
                        <Filter size={20} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                {/* Modal for filter options - using native Modal */}
                <Modal
                    visible={filterMenuVisible}
                    transparent={true}
                    animationType="none"
                    onRequestClose={() => setFilterMenuVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={() => setFilterMenuVisible(false)}
                    >
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                            onStartShouldSetResponder={() => true}
                            onResponderRelease={() => setFilterMenuVisible(false)} />
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={[styles.modalItem, selectedFilter === 'all' ? styles.selectedFilter : {}]}
                                onPress={() => handleFilterSelect('all')}
                            >
                                <Text style={styles.modalItemText}>All Collections</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalItem, selectedFilter === 'paid' ? styles.selectedFilter : {}]}
                                onPress={() => handleFilterSelect('paid')}
                            >
                                <Text style={styles.modalItemText}>Recent (30 days)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalItem, selectedFilter === 'overdue' ? styles.selectedFilter : {}]}
                                onPress={() => handleFilterSelect('overdue')}
                            >
                                <Text style={styles.modalItemText}>Old (30+ days)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalItem, selectedFilter === 'monthly_donation' ? styles.selectedFilter : {}]}
                                onPress={() => handleFilterSelect('monthly_donation')}
                            >
                                <Text style={styles.modalItemText}>Monthly Fund</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalItem, selectedFilter === 'mayyathu' ? styles.selectedFilter : {}]}
                                onPress={() => handleFilterSelect('mayyathu')}
                            >
                                <Text style={styles.modalItemText}>Mayyathu Fund</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalItem, selectedFilter === 'general' ? styles.selectedFilter : {}]}
                                onPress={() => handleFilterSelect('general')}
                            >
                                <Text style={styles.modalItemText}>General</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            <View style={{ flex: 1, padding: 15 }}>
                <FlatList
                    data={filteredCollections}
                    renderItem={renderCollectionItem}
                    keyExtractor={(item) => item._id || item.id}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    onEndReached={loadMoreCollections}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                        loadingMore ? (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#10b981" />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {searchQuery || selectedFilter !== 'all'
                                    ? 'No collections found matching your criteria'
                                    : 'No collections found. Add your first collection!'}
                            </Text>
                            {!(searchQuery || selectedFilter !== 'all') && (
                                <TouchableOpacity
                                    style={[styles.addButton, { marginTop: 16 }]}
                                    onPress={() => navigation.navigate('AddCollection', { mode: 'create' })}
                                >
                                    <Text style={{ color: '#10b981', fontWeight: 'bold' }}>Add Collection</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    }
                />
            </View>

            {showCustomAlert && (
                <View style={styles.alertOverlay}>
                    <View style={styles.alertContainer}>
                        <View style={styles.alertHeader}>
                            <Info size={24} color="#3B82F6" style={styles.alertIcon} />
                            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
                        </View>
                        <Text style={styles.alertMessage}>{alertConfig.message}</Text>
                        <View style={styles.alertButtonContainer}>
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
            )}
        </View>
    );
}