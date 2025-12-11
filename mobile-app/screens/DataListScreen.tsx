import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Card as PaperCard, Button as PaperButton, ActivityIndicator } from 'react-native-paper';
import { dashboardService } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Plus, Database, IndianRupee, TrendingUp, Calendar } from 'lucide-react-native';

export default function DataListScreen() {
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
        dataCard: {
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
            alignItems: 'flex-start',
            marginBottom: 12,
        },
        iconContainer: {
            backgroundColor: '#ecfdf5',
            padding: 8,
            borderRadius: 8,
            marginRight: 12,
        },
        textContainer: {
            flex: 1,
        },
        dataName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1f2937',
        },
        dataDescription: {
            fontSize: 14,
            color: '#6b7280',
            marginTop: 4,
        },
        cardFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        recordCount: {
            fontSize: 14,
            color: '#6b7280',
        },
        viewButton: {
            backgroundColor: '#10b981',
        },
        viewButtonText: {
            color: 'white',
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

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const fetchData = async () => {
        try {
            // In a real app, this would be an API call to fetch data
            // For now, we'll create sample data
            const sampleData = [
                { id: '1', name: 'Collection Data', description: 'All money collection records', type: 'collection', count: 25 },
                { id: '2', name: 'Member Data', description: 'All member records', type: 'member', count: 150 },
                { id: '3', name: 'Report Data', description: 'Financial reports', type: 'report', count: 5 },
                { id: '4', name: 'Transaction Data', description: 'All transactions', type: 'transaction', count: 120 },
            ];
            setData(sampleData);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const renderItem = ({ item }: { item: any }) => (
        <PaperCard style={styles.dataCard}>
            <PaperCard.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Database size={24} color="#10b981" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.dataName}>{item.name}</Text>
                        <Text style={styles.dataDescription}>{item.description}</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.recordCount}>{item.count} records</Text>
                    <PaperButton
                        mode="contained"
                        onPress={() => navigation.navigate('DataDetail', { dataId: item.id })}
                        style={styles.viewButton}
                    >
                        <Text style={styles.viewButtonText}>View</Text>
                    </PaperButton>
                </View>
            </PaperCard.Content>
        </PaperCard>
    );

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#10b981" />
                <Text style={styles.loadingText}>Loading data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Data</Text>
                <View style={styles.addButton}>
                    <Plus size={20} color="white" />
                </View>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
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
                            <Text style={styles.emptyText}>No data available.</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}