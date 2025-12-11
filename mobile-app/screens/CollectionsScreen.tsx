import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { dashboardService } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Plus, IndianRupee, TrendingDown, Calendar, User } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';

export default function CollectionsScreen() {
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<any>();

    const fetchCollections = async () => {
        try {
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

            setCollections(collectionsData);
        } catch (error) {
            console.error('Error fetching collections:', error);
            Alert.alert('Error', 'Failed to load collections');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCollections();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString || 'N/A'; // Return original string or N/A if it's not a valid date
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb',
            paddingTop: 40,
        },
        content: {
            paddingHorizontal: 16,
            paddingTop: 20,
        },
        centerContent: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingText: {
            marginTop: 10,
            color: '#6b7280',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerTextContainer: {
            marginLeft: 8,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#2563eb',
        },
        headerSubtitle: {
            fontSize: 14,
            color: '#9ca3af',
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
        collectionCard: {
            marginVertical: 8,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        cardContent: {
            padding: 16,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        amountContainer: {
            flex: 1,
        },
        amount: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#10b981',
        },
        category: {
            fontSize: 14,
            color: '#6b7280',
        },
        iconContainer: {
            backgroundColor: '#ecfdf5',
            padding: 8,
            borderRadius: 8,
        },
        cardDetails: {
            marginBottom: 12,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 4,
        },
        detailText: {
            fontSize: 14,
            color: '#6b7280',
            marginLeft: 8,
        },
        description: {
            fontSize: 14,
            color: '#4b5563',
            fontStyle: 'italic',
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
    });

    const renderItem = ({ item }: { item: any }) => (
        <PaperCard style={styles.collectionCard}>
            <PaperCard.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amount}>₹{item.amount || 0}</Text>
                        <Text style={styles.category}>{item.category || 'Uncategorized'}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <IndianRupee size={24} color="#10b981" />
                    </View>
                </View>

                <View style={styles.cardDetails}>
                    <View style={styles.detailRow}>
                        <Calendar size={16} color="#6b7280" />
                        <Text style={styles.detailText}>{formatDate(item.date || '')}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <User size={16} color="#6b7280" />
                        <Text style={styles.detailText}>By {item.collectedBy || 'Admin'}</Text>
                    </View>
                </View>

                {item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                )}
            </PaperCard.Content>
        </PaperCard>
    );

    const theme = useTheme();
    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TrendingDown size={24} color="#2563eb" />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Collections</Text>
                        <Text style={styles.headerSubtitle}>{collections.length} {collections.length === 1 ? 'collection' : 'collections'}</Text>
                    </View>
                </View>
                <PaperButton
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddCollection')}
                    mode="contained"
                >
                    <Plus size={20} color="white" />
                </PaperButton>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={collections}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item._id || item.id || `${item.date}-${index}`}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#3b82f6']}
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No collections found. Add your first collection!</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}