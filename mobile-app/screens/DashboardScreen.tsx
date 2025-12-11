import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { dashboardService } from '../services/api';
import { RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, Users, DollarSign, IndianRupee, Calendar, TrendingUp } from 'lucide-react-native';

export default function DashboardScreen() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<any>();

    const fetchStats = async () => {
        try {
            const response = await dashboardService.getStats();
            setStats(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                {typeof ActivityIndicator !== 'undefined' ? <ActivityIndicator size="large" color="#3b82f6" /> : null}
                <Text style={{ marginTop: 8, color: '#9ca3af' }}>Loading dashboard...</Text>
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb',
            paddingTop: 40,
        },
        content: {
            padding: 15,
            paddingTop: 40,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#2563eb',
            marginLeft: 8,
        },
        headerSubtitle: {
            fontSize: 14,
            color: '#9ca3af',
            marginLeft: 32,
        },
        statsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        statCard: {
            width: '48%',
            marginBottom: 12,
        },
        statCardContent: {
            padding: 16,
            backgroundColor: 'white',
            borderRadius: 12,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        statHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        iconContainer: {
            backgroundColor: '#ecfdf5', // emerald-50
            padding: 8,
            borderRadius: 999,
        },
        dateText: {
            fontSize: 12,
            color: '#9ca3af',
        },
        statLabel: {
            fontSize: 14,
            color: '#9ca3af',
            fontWeight: '500',
            marginBottom: 4,
        },
        statValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#374151',
        },
        recentCard: {
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        recentHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        recentTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#2563eb',
        },
        viewAllButton: {
            padding: 4,
        },
        viewAllText: {
            fontWeight: '500',
            color: '#059669',
        },
        collectionItem: {
            padding: 12,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            marginBottom: 8,
        },
        collectionDescription: {
            fontWeight: 'bold',
            color: '#374151',
        },
        collectionDetails: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
        },
        detailText: {
            fontSize: 12,
            color: '#9ca3af',
        },
        separator: {
            marginHorizontal: 4,
        },
        amountText: {
            color: '#059669',
            fontWeight: 'bold',
            alignSelf: 'flex-end',
        },
        categoryText: {
            fontSize: 12,
            color: '#9ca3af',
            alignSelf: 'flex-end',
        },
        noCollections: {
            padding: 16,
            backgroundColor: '#f3f4f6',
            borderRadius: 8,
            alignItems: 'center',
        },
        noCollectionsText: {
            color: '#9ca3af',
            textAlign: 'center',
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
                }
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TrendingUp size={24} color="#059669" />
                    <Text style={styles.headerTitle}>Dashboard</Text>
                </View>
                <Text style={styles.headerSubtitle}>Welcome back! Here's your overview</Text>

                <View style={styles.statsContainer}>
                    {[
                        { key: 'total-members', label: 'Total Members', value: stats?.totalUsers || 0, icon: Users, color: "#10b981" },
                        { key: 'total-collected', label: 'Total Collected', value: `₹${(stats?.totalMoneyCollected || 0).toLocaleString()}`, icon: IndianRupee, color: "#059669" },
                        { key: 'mayyathu-fund', label: 'Mayyathu Fund', value: `₹${(stats?.mayyathuFundCollected || 0).toLocaleString()}`, icon: DollarSign, color: "#047857" },
                        { key: 'monthly-donations', label: 'Monthly Donations', value: `₹${(stats?.monthlyDonationsCollected || 0).toLocaleString()}`, icon: Calendar, color: "#16a34a" },
                    ].map((stat) => (
                        <View key={stat.key} style={styles.statCard}>
                            <View style={styles.statCardContent}>
                                <View style={styles.statHeader}>
                                    <View style={[styles.iconContainer, { backgroundColor: stat.color + '10' }]}>
                                        <stat.icon size={16} color={stat.color} />
                                    </View>
                                    <Text style={styles.dateText}>
                                        {new Date().toLocaleDateString('en-US', { month: 'short' })}
                                    </Text>
                                </View>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <PaperCard style={styles.recentCard}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.recentTitle}>Recent Collections</Text>
                        <PaperButton
                            mode="text"
                            onPress={() => navigation.navigate('Collections')}
                            style={styles.viewAllButton}
                        >
                            <Text style={styles.viewAllText}>View All</Text>
                        </PaperButton>
                    </View>

                    {stats?.recentCollections && stats.recentCollections.length > 0 ? (
                        <View>
                            {stats.recentCollections.slice(0, 5).map((collection: any, index: number) => (
                                <View key={collection._id || `collection-${index}`} style={styles.collectionItem}>
                                    <Text style={styles.collectionDescription}>{collection.description}</Text>
                                    <View style={styles.collectionDetails}>
                                        <Text style={styles.detailText}>
                                            {new Date(collection.date).toLocaleDateString()}
                                        </Text>
                                        <Text style={styles.separator}>•</Text>
                                        <Text style={styles.detailText}>By {collection.collectedBy || 'Admin'}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.amountText}>+₹{collection.amount}</Text>
                                        <Text style={styles.categoryText}>{collection.category}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.noCollections}>
                            <Text style={styles.noCollectionsText}>No recent collections</Text>
                        </View>
                    )}
                </PaperCard>
            </ScrollView>
        </View>
    );
}
