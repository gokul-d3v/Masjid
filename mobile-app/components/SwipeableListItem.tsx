import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface SwipeAction {
    icon: React.ReactNode;
    color: string;
    backgroundColor: string;
    onPress: () => void;
}

interface SwipeableListItemProps {
    id: string;
    children: React.ReactNode;
    leftActions?: SwipeAction[];
    rightActions?: SwipeAction[];
    onPress?: () => void;
}

export interface SwipeableListItemRef {
    close: () => void;
}

const SwipeableListItem = forwardRef<SwipeableListItemRef, SwipeableListItemProps>(
    ({ id, children, leftActions, rightActions, onPress }, ref) => {
        const swipeableRef = useRef<Swipeable>(null);

        useImperativeHandle(ref, () => ({
            close: () => {
                swipeableRef.current?.close();
            }
        }));

        const renderLeftActions = () => {
            if (!leftActions || leftActions.length === 0) return null;

            return (
                <>
                    {leftActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.swipeableAction,
                                { backgroundColor: action.backgroundColor }
                            ]}
                            onPress={action.onPress}
                        >
                            {action.icon}
                        </TouchableOpacity>
                    ))}
                </>
            );
        };

        const renderRightActions = () => {
            if (!rightActions || rightActions.length === 0) return null;

            return (
                <>
                    {rightActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.swipeableAction,
                                { backgroundColor: action.backgroundColor }
                            ]}
                            onPress={action.onPress}
                        >
                            {action.icon}
                        </TouchableOpacity>
                    ))}
                </>
            );
        };

        const styles = StyleSheet.create({
            swipeableAction: {
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 8,
            },
        });

        return (
            <Swipeable
                ref={swipeableRef}
                renderLeftActions={leftActions ? renderLeftActions : undefined}
                renderRightActions={rightActions ? renderRightActions : undefined}
                overshootLeft={false}
                overshootRight={false}
            >
                {onPress ? (
                    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                        {children}
                    </TouchableOpacity>
                ) : (
                    <>{children}</>
                )}
            </Swipeable>
        );
    }
);

SwipeableListItem.displayName = 'SwipeableListItem';

export default SwipeableListItem;
