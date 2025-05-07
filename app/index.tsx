import { useAuth } from '@/utils/authContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { authToken, isLoading } = useAuth();

  // If loading, show nothing
  if (isLoading) {
    return null;
  }

  // Redirect based on login status
  if (authToken) {
    return <Redirect href="/(drawer)/(tabs)" />;
  } else {
    return <Redirect href="/login" />;
  }
} 