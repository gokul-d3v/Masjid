import React, { useEffect, useState } from 'react';
import { Box, FlatList, Text, VStack, HStack, Heading, Spinner, useToast, Toast, ToastTitle, Card, Badge, BadgeText } from '@gluestack-ui/themed';
import { dashboardService } from '../services/api';
import { RefreshControl } from 'react-native';

export default function CollectionsScreen() {
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const toast = useToast();

    const fetchCollections = async () => {
        try {
            const response = await dashboardService.getMoneyCollections();
            setCollections(response.data || []);
        } catch (error) {
            console.error(error);
            toast.show({
                placement: 'top',
                render: ({ id }: { id: string }) => {
                    return (
                        <Toast nativeID={'toast-' + id} action="error" variant="accent">
                            <ToastTitle>Failed to load collections</ToastTitle>
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
        fetchCollections();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCollections();
    };

    const renderItem = ({ item }: { item: any }) => (
        <Card size="sm" variant="elevated" m="$2">
            <HStack justifyContent="space-between" alignItems="center">
                <VStack space="xs" flex={1}>
                    <Text bold>{item.description}</Text>
                    <Text size="xs" color="$coolGray500">{new Date(item.date).toLocaleDateString()}</Text>
                    <Text size="xs" color="$coolGray500">By: {item.collectedBy}</Text>
                </VStack>
                <VStack alignItems="flex-end" space="xs">
                    <Text color="$green600" bold>+₹{item.amount}</Text>
                    <Badge size="sm" variant="solid" borderRadius="$none" action="info">
                        <BadgeText>{item.category}</BadgeText>
                    </Badge>
                </VStack>
            </HStack>
        </Card>
    );

    if (loading && !refreshing) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <Spinner size="large" />
            </Box>
        );
    }

    return (
        <Box flex={1} backgroundColor="$coolGray100" pt="$10">
            <Heading size="xl" p="$4" pb="$2">Collections</Heading>
            <FlatList
                data={collections}
                renderItem={renderItem}
                keyExtractor={(item: any, index) => item._id || item.id || `${item.date}-${index}`}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </Box>
    );
}
