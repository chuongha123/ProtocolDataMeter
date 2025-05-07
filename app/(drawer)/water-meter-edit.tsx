import { Redirect, useLocalSearchParams } from 'expo-router';

// Redirect to the main edit screen file with params
export default function WaterMeterEditRedirect() {
  const { meterId } = useLocalSearchParams<{ meterId: string }>();
  return <Redirect href={`/water-meter-edit?meterId=${meterId}`} />;
} 