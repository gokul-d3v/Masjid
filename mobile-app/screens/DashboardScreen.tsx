import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { dashboardService } from '../services/api';
import { RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, Users, DollarSign, IndianRupee, Calendar, TrendingUp, LogOut } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import AlertBox from '../components/AlertBox';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';

export default function DashboardScreen() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertProps, setAlertProps] = useState({
        title: '',
        message: '',
        type: 'info' as 'success' | 'error' | 'warning' | 'info',
        buttons: [{ text: 'OK' }]
    });
    const navigation = useNavigation<any>();
    const { signOut } = useAuth();
    const insets = useSafeAreaInsets();

    const showAlert = (
        title: string,
        message: string,
        type: 'success' | 'error' | 'warning' | 'info' = 'info',
        buttons = [{ text: 'OK' }]
    ) => {
        setAlertProps({ title, message, type, buttons });
        setAlertVisible(true);
    };

    const fetchStats = async () => {
        try {
            const response = await dashboardService.getStats();
            setStats(response.data);
        } catch (error) {
            console.error(error);
            showAlert('Error', 'Failed to load dashboard data', 'error');
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

    const theme = useTheme();
    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f9fafb',
            paddingTop: 0, // Safe area will be handled by the wrapper View
        },
        content: {
            padding: 15,
            paddingTop: 16, // Keep some padding below the header
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
        logoutButton: {
            padding: 4,
            borderRadius: 20,
        },
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
                }
                showsVerticalScrollIndicator={false}
            >
                <Header
                    title="Dashboard"
                    subtitle="Welcome back! Here's your overview"
                    rightComponent={
                        <TouchableOpacity
                            onPress={signOut}
                            style={{ padding: 8 }}
                        >
                            <LogOut size={20} color="#ef4444" />
                        </TouchableOpacity>
                    }
                />

                <Animatable.View animation="fadeInDown" duration={800} delay={300} style={styles.statsContainer}>
                    {[
                        { key: 'total-members', label: 'Total Members', value: stats?.totalUsers || 0, icon: Users, color: "#025937" },
                        { key: 'total-collected', label: 'Total Collected', value: `₹${(stats?.totalMoneyCollected || 0).toLocaleString()}`, icon: IndianRupee, color: "#059669" },
                        { key: 'mayyathu-fund', label: 'Mayyathu Fund', value: `₹${(stats?.mayyathuFundCollected || 0).toLocaleString()}`, icon: DollarSign, color: "#047857" },
                        { key: 'monthly-donations', label: 'Monthly Donations', value: `₹${(stats?.monthlyDonationsCollected || 0).toLocaleString()}`, icon: Calendar, color: "#16a34a" },
                    ].map((stat, index) => (
                        <View
                            key={stat.key}
                            style={styles.statCard}
                        >
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
                </Animatable.View>

                <Animatable.View
                    animation="fadeInUp"
                    duration={800}
                    delay={600}
                    style={styles.recentCard}
                >
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
                                <View
                                    key={collection._id || `collection-${index}`}
                                    style={styles.collectionItem}
                                >
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
                </Animatable.View>
            </ScrollView>

            <AlertBox
                visible={alertVisible}
                title={alertProps.title}
                message={alertProps.message}
                type={alertProps.type}
                buttons={alertProps.buttons}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
}
