import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, Wallet, User } from 'lucide-react-native';
import { useToken } from '@gluestack-style/react';

import DashboardScreen from '../screens/DashboardScreen';
import MembersListScreen from '../screens/MembersListScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    const primaryColor = useToken('colors', 'primary500');
    const grayColor = useToken('colors', 'coolGray400');

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: primaryColor,
                tabBarInactiveTintColor: grayColor,
                tabBarStyle: {
                    paddingBottom: 25,
                    paddingTop: 10,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5,
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Home color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Members"
                component={MembersListScreen}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Users color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Collections"
                component={CollectionsScreen}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Wallet color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <User color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
}
