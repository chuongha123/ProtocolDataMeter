import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Hamburger menu component
export function HamburgerButton({ onPress }: any) {
    return (
        <TouchableOpacity style={styles.hamburgerButton} onPress={onPress}>
            <View style={styles.burgerLine} />
            <View style={styles.burgerLine} />
            <View style={styles.burgerLine} />
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    hamburgerButton: {
        padding: 10,
        justifyContent: 'space-around',
        height: 40,
        width: 40,
        marginLeft: 5,
    },
    burgerLine: {
        height: 2,
        width: 20,
        backgroundColor: '#666',
        marginVertical: 2,
    },
});