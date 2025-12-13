import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, Wallet, Calendar } from 'lucide-react-native';

import DashboardScreen from '../screens/DashboardScreen';
import MembersListScreen from '../screens/MembersListScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import MuslimCalendarScreen from '../screens/MuslimCalendarScreen';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
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
                name="Calendar"
                component={MuslimCalendarScreen}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Calendar color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
}
