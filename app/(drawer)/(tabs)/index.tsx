import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/utils/authContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Chào mừng bạn trở lại!</ThemedText>
      <ThemedText style={styles.subtitle}>
        {user ? `Đăng nhập với tên: ${user.username}` : 'Đang tải...'}
      </ThemedText>
      
      <ThemedView style={styles.content}>
        <ThemedText style={styles.contentText}>
          Đây là trang chủ của ứng dụng quản lý đồng hồ nước.
        </ThemedText>
        <ThemedText style={styles.contentText}>
          Sử dụng menu để điều hướng đến các tính năng khác.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  content: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
}); 