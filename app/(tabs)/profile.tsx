import React from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useAuth } from '../../utils/authContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user-circle" size={80} color="#007AFF" />
        </View>
        <ThemedText style={styles.name}>{user?.username || 'Người dùng'}</ThemedText>
        <ThemedText style={styles.email}>{user?.email || 'email@example.com'}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Thông tin cá nhân</ThemedText>
        
        <ThemedView style={styles.menuItem}>
          <FontAwesome name="user" size={20} color="#007AFF" style={styles.menuIcon} />
          <ThemedText style={styles.menuText}>Thông tin tài khoản</ThemedText>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </ThemedView>
        
        <ThemedView style={styles.menuItem}>
          <FontAwesome name="lock" size={20} color="#007AFF" style={styles.menuIcon} />
          <ThemedText style={styles.menuText}>Đổi mật khẩu</ThemedText>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Cài đặt</ThemedText>
        
        <ThemedView style={styles.menuItem}>
          <FontAwesome name="bell" size={20} color="#007AFF" style={styles.menuIcon} />
          <ThemedText style={styles.menuText}>Thông báo</ThemedText>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </ThemedView>
        
        <ThemedView style={styles.menuItem}>
          <FontAwesome name="language" size={20} color="#007AFF" style={styles.menuIcon} />
          <ThemedText style={styles.menuText}>Ngôn ngữ</ThemedText>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Khác</ThemedText>
        
        <ThemedView style={styles.menuItem}>
          <FontAwesome name="info-circle" size={20} color="#007AFF" style={styles.menuIcon} />
          <ThemedText style={styles.menuText}>Về ứng dụng</ThemedText>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </ThemedView>
        
        <ThemedView style={styles.menuItem}>
          <FontAwesome name="question-circle" size={20} color="#007AFF" style={styles.menuIcon} />
          <ThemedText style={styles.menuText}>Trợ giúp & Hỗ trợ</ThemedText>
          <FontAwesome name="chevron-right" size={14} color="#999" />
        </ThemedView>
      </ThemedView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={20} color="#FF3B30" style={styles.logoutIcon} />
        <ThemedText style={styles.logoutText}>Đăng xuất</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    marginRight: 16,
    width: 20,
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutIcon: {
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
}); 