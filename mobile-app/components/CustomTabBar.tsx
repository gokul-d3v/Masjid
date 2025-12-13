import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();
    const [layoutWidth, setLayoutWidth] = useState(0);
    const tabWidth = layoutWidth / state.routes.length;

    // Animation for the sliding indicator
    const translateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Only animate if we have a valid width
        if (layoutWidth > 0) {
            Animated.spring(translateValue, {
                toValue: state.index * tabWidth,
                useNativeDriver: true,
                friction: 12,
                tension: 60
            }).start();
        }
    }, [state.index, tabWidth, layoutWidth]);

    const onLayout = (e: any) => {
        setLayoutWidth(e.nativeEvent.layout.width);
    };

    return (
        <View
            style={[styles.container, { bottom: Math.max(insets.bottom - 10, 5) }]}
        >
            <View
                style={styles.contentContainer}
                onLayout={onLayout}
            >
                {/* Floating Circle Indicator */}
                {layoutWidth > 0 && (
                    <Animated.View
                        style={[
                            styles.indicatorContainer,
                            {
                                width: tabWidth,
                                transform: [{ translateX: translateValue }]
                            }
                        ]}
                    >
                        <View style={styles.floatingCircle} />
                    </Animated.View>
                )}

                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    // Render the icon
                    const Icon = options.tabBarIcon;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabButton}
                        >
                            <View style={[styles.iconWrapper, isFocused && styles.iconWrapperFocused]}>
                                {Icon && Icon({
                                    focused: isFocused,
                                    color: isFocused ? 'white' : '#9ca3af',
                                    size: isFocused ? 28 : 24
                                })}
                            </View>
                            <Text style={[
                                styles.label,
                                {
                                    color: isFocused ? '#025937' : '#9ca3af',
                                    fontWeight: isFocused ? 'bold' : '500',
                                    opacity: isFocused ? 0 : 1,
                                    height: isFocused ? 0 : 'auto'
                                }
                            ]}>
                                {typeof label === 'string' ? label : route.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        position: 'absolute',
        left: 20,
        right: 20,
        borderRadius: 20,
        height: 70,
    },
    contentContainer: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        overflow: 'hidden',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        zIndex: 1,
    },
    label: {
        fontSize: 10,
        marginTop: 4,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapperFocused: {
        transform: [{ translateY: -10 }],
    },
    indicatorContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0, // Ensure relative positioning references the start
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
    },
    floatingCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#025937',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        marginBottom: 20,
    }
});

export default CustomTabBar;
