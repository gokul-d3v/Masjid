import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, Wallet, User, Database } from 'lucide-react-native';

import DashboardScreen from '../screens/DashboardScreen';
import MembersListScreen from '../screens/MembersListScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DataListScreen from '../screens/DataListScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#10b981', // green500
                tabBarInactiveTintColor: '#9ca3af', // coolGray400
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
                name="Data"
                component={DataListScreen}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Database color={color} size={size} />,
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
