import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';


jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: () => ({
        Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        Screen: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
    createBottomTabNavigator: () => ({
        Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        Screen: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    }),
}));

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('lucide-react-native', () => ({
    Home: 'Home',
    User: 'User',
    Users: 'Users',
    LayoutDashboard: 'LayoutDashboard',
    FileText: 'FileText',
}));

jest.mock('expo-status-bar', () => ({
    StatusBar: () => 'StatusBar',
}));

jest.mock('./context/AuthContext', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useAuth: () => ({
        userToken: 'mock-token',
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
    }),
}));

describe('<App />', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<App />).toJSON();
        // @ts-ignore
        expect(tree.children.length).toBe(1);
    });
});
