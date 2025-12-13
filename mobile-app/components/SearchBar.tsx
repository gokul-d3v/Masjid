import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    containerStyle?: ViewStyle;
}

export default function SearchBar({
    value,
    onChangeText,
    placeholder = 'Search...',
    containerStyle
}: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isFocused ? '#025937' : '#d1d5db',
            borderRadius: 4,
            height: 40,
            backgroundColor: 'transparent',
            paddingHorizontal: 8,
        },
        input: {
            flex: 1,
            marginLeft: 8,
            fontSize: 14,
            color: '#1f2937',
        },
    });

    return (
        <View style={[styles.container, containerStyle]}>
            <Search size={16} color="#9ca3af" />
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={styles.input}
                placeholderTextColor="#9ca3af"
            />
        </View>
    );
}
