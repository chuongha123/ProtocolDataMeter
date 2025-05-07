import { Redirect, useLocalSearchParams } from 'expo-router';

// Redirect to the main detail screen file with params
export default function WaterMeterDetailRedirect() {
  const { meterId } = useLocalSearchParams<{ meterId: string }>();
  return <Redirect href={`/water-meter-detail?meterId=${meterId}`} />;
}

