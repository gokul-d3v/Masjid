import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { TextInput as PaperInput } from 'react-native-paper';
import type { KeyboardTypeOptions } from 'react-native';

interface FormInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    icon?: React.ReactNode;
    keyboardType?: KeyboardTypeOptions;
    maxLength?: number;
    disabled?: boolean;
    mode?: 'outlined' | 'flat';
    multiline?: boolean;
    containerStyle?: ViewStyle;
    secureTextEntry?: boolean;
}

export default function FormInput({
    label,
    value,
    onChangeText,
    error,
    icon,
    keyboardType,
    maxLength,
    disabled = false,
    mode = 'outlined',
    multiline = false,
    containerStyle,
    secureTextEntry = false
}: FormInputProps) {
    const styles = StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainer: {
            position: 'absolute',
            left: 12,
            top: 16,
            zIndex: 1,
        },
        input: {
            flex: 1,
        },
        errorText: {
            color: '#ef4444',
            fontSize: 12,
            marginTop: 4,
            marginLeft: 4,
        },
    });

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.inputWrapper}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <PaperInput
                    label={label}
                    value={value}
                    onChangeText={onChangeText}
                    error={!!error}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    disabled={disabled}
                    mode={mode}
                    multiline={multiline}
                    secureTextEntry={secureTextEntry}
                    style={[styles.input, icon ? { paddingLeft: 40 } : {}]}
                    theme={{ colors: { primary: '#059669', background: 'transparent' } }}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}
