import React, { useEffect, useState } from 'react';
import { Box, Text, ScrollView, VStack, HStack, Heading, Card, Spinner, useToast, Toast, ToastTitle } from '@gluestack-ui/themed';
import { dashboardService } from '../services/api';
import { RefreshControl } from 'react-native';

export default function DashboardScreen() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const toast = useToast();

    const fetchStats = async () => {
        try {
            const response = await dashboardService.getStats();
            setStats(response.data);
        } catch (error) {
            console.error(error);
            toast.show({
                placement: 'top',
                render: ({ id }: { id: string }) => {
                    return (
                        <Toast nativeID={'toast-' + id} action="error" variant="accent">
                            <ToastTitle>Failed to load dashboard data</ToastTitle>
                        </Toast>
                    )
                },
            });
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
            <Box flex={1} justifyContent="center" alignItems="center">
                <Spinner size="large" />
            </Box>
        );
    }

    return (
        <Box flex={1} backgroundColor="$coolGray100">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <VStack space="md" p="$4" pt="$10">
                    <Heading size="xl">Dashboard</Heading>

                    <HStack space="md" flexWrap="wrap">
                        {[
                            { key: 'total-members', label: 'Total Members', value: stats?.totalUsers || 0 },
                            { key: 'total-collected', label: 'Total Collected', value: `₹${stats?.totalMoneyCollected || 0}` },
                            { key: 'mayyathu-fund', label: 'Mayyathu Fund', value: `₹${stats?.mayyathuFundCollected || 0}` },
                            { key: 'monthly-donations', label: 'Monthly Donations', value: `₹${stats?.monthlyDonationsCollected || 0}` },
                        ].map((stat) => (
                            <Card key={stat.key} size="md" variant="elevated" m="$1" width="$40">
                                <VStack space="xs">
                                    <Text size="sm" color="$coolGray500">{stat.label}</Text>
                                    <Heading size="lg">{stat.value}</Heading>
                                </VStack>
                            </Card>
                        ))}
                    </HStack>

                    <Heading size="md" mt="$4">Recent Collections</Heading>
                    <VStack space="sm">
                        {stats?.recentCollections && stats.recentCollections.length > 0 ? (
                            stats.recentCollections.slice(0, 5).map((collection: any, index: number) => (
                                <Card key={collection._id || `collection-${index}`} size="sm" variant="elevated">
                                    <HStack justifyContent="space-between" alignItems="center">
                                        <VStack>
                                            <Text bold>{collection.description}</Text>
                                            <Text size="xs" color="$coolGray500">{new Date(collection.date).toLocaleDateString()}</Text>
                                        </VStack>
                                        <Text color="$green600" bold>+₹{collection.amount}</Text>
                                    </HStack>
                                </Card>
                            ))
                        ) : (
                            <Text color="$coolGray500" textAlign="center">No recent collections</Text>
                        )}
                    </VStack>
                </VStack>
            </ScrollView>
        </Box>
    );
}
