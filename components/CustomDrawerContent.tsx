import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from './ThemedText';

const MENU_ITEMS = [
    { title: 'Tất cả đồng hồ nước', route: '/water-meter' },
    { title: 'Thêm đồng hồ nước', route: '/add-water-meter' },
];

type CustomDrawerContentProps = {
    navigation: any;
};

export function CustomDrawerContent({ navigation }: Readonly<CustomDrawerContentProps>) {
    const router = useRouter();

    return (
        <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
                <ThemedText type="title">Protocol Data Meter</ThemedText>
            </View>

            <View>
                {MENU_ITEMS.map((item) => (
                    <TouchableOpacity
                        key={item.route}
                        style={styles.menuItem}
                        onPress={() => {
                            navigation.closeDrawer();
                            router.push(item.route as any);
                        }}
                    >
                        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        paddingTop: 20,
    },
    drawerHeader: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150, 150, 150, 0.2)',
        marginBottom: 10,
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150, 150, 150, 0.1)',
    },
});