import React, { useEffect, useState } from 'react';
import { Box, FlatList, Text, VStack, HStack, Heading, Avatar, AvatarFallbackText, Spinner, useToast, Toast, ToastTitle, Card } from '@gluestack-ui/themed';
import { memberService } from '../services/api';
import { RefreshControl } from 'react-native';

export default function MembersListScreen() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const toast = useToast();

    const fetchMembers = async () => {
        try {
            const response = await memberService.getAll();
            setMembers(response.data.members || []);
        } catch (error) {
            console.error(error);
            toast.show({
                placement: 'top',
                render: ({ id }: { id: string }) => {
                    return (
                        <Toast nativeID={'toast-' + id} action="error" variant="accent">
                            <ToastTitle>Failed to load members</ToastTitle>
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
        fetchMembers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMembers();
    };

    const renderItem = ({ item }: { item: any }) => (
        <Card size="sm" variant="elevated" m="$2">
            <HStack space="md" alignItems="center">
                <Avatar bgColor="$amber600" size="md" borderRadius="$full">
                    <AvatarFallbackText>{item.fullName}</AvatarFallbackText>
                </Avatar>
                <VStack>
                    <Heading size="sm">{item.fullName}</Heading>
                    <Text size="xs" color="$coolGray500">{item.phone}</Text>
                    <Text size="xs" color="$coolGray500">Reg: {item.registrationNumber}</Text>
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
            <Heading size="xl" p="$4" pb="$2">Members</Heading>
            <FlatList
                data={members}
                renderItem={renderItem}
                keyExtractor={(item: any) => item._id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </Box>
    );
}
