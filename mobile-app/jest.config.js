module.exports = {
    preset: 'react-native',
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@gluestack-ui/.*|@gluestack-style/.*|lucide-react-native)',
    ],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    setupFiles: ['./jest.setup.js'],
    moduleNameMapper: {
        'expo/src/winter/runtime.native.ts': '<rootDir>/jest/empty-mock.js',
    },
};
