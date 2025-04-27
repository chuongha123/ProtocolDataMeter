import { Redirect } from 'expo-router';
import { useAuth } from '../utils/authContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';

export default function Index() {
  const { authToken, isLoading } = useAuth();

  // Show a loading screen while checking authentication status
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Đang tải...</ThemedText>
      </View>
    );
  }

  // Redirect to the appropriate screen based on authentication status
  if (authToken) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
  },
}); 