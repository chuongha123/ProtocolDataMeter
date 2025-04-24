import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { HamburgerButton } from './HamburgerButton';

// Menu items
const MENU_ITEMS = [
    { title: 'Trang chủ', route: '/' },
    { title: 'Đồng hồ nước', route: '/water-meter' },
    { title: 'Thống kê', route: '/statistics' },
    { title: 'Cài đặt', route: '/settings' },
];

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.7;

export function DrawerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';

    const toggleDrawer = () => {
        if (isOpen) {
            // Close drawer
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -DRAWER_WIDTH,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => setIsOpen(false));
        } else {
            // Open drawer
            setIsOpen(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.5,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    const navigateTo = (route: string) => {
        toggleDrawer();
        // Small delay to allow animation to start
        setTimeout(() => router.push(route as any, {}), 100);
    };

    const resetState = () => {
        console.log('Màn hình đang được focus');
    };

    useFocusEffect(
        useCallback(() => {
            // Code sẽ chạy mỗi khi màn hình này được focus
            console.log('Màn hình đang được focus');

            // Hoặc reset state
            resetState();

            return () => {
                // Cleanup khi màn hình mất focus
            };
        }, [])
    );

    return (
        <>
            <HamburgerButton onPress={toggleDrawer} />

            {isOpen && (
                <>
                    <TouchableWithoutFeedback onPress={toggleDrawer}>
                        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
                    </TouchableWithoutFeedback>

                    <Animated.View
                        style={[
                            styles.drawer,
                            { transform: [{ translateX: slideAnim }] },
                            colorScheme === 'dark' ? styles.drawerDark : styles.drawerLight
                        ]}
                    >
                        <View style={styles.drawerHeader}>
                            <ThemedText type="title">Menu</ThemedText>
                        </View>

                        <View style={styles.drawerContent}>
                            {MENU_ITEMS.map((item) => (
                                <TouchableOpacity
                                    key={item.route}
                                    style={styles.menuItem}
                                    onPress={() => navigateTo(item.route)}
                                >
                                    <ThemedText type="defaultSemiBold">
                                        {item.title}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    hamburgerButton: {
        padding: 10,
        justifyContent: 'space-around',
        height: 40,
        width: 40,
    },
    burgerLine: {
        height: 2,
        width: 20,
        backgroundColor: '#666',
        marginVertical: 2,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 998,
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        zIndex: 999,
        paddingTop: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    drawerLight: {
        backgroundColor: '#fff',
    },
    drawerDark: {
        backgroundColor: '#121212',
    },
    drawerHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150, 150, 150, 0.2)',
    },
    drawerContent: {
        padding: 20,
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150, 150, 150, 0.1)',
    },
}); 