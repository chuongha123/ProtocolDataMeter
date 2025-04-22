import WaterMeter from '@/components/WaterMeter';
import { CLOCK1, onValueChange } from '@/firebaseConfig';
import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {

  useEffect(() => {
    onValueChange(CLOCK1, (data) => {
      console.log("data", data);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <WaterMeter
          meterReading="111111"
          gaugeValues={[6, 8, 3]}
          width={300}
          height={300}
        />
        <WaterMeter
          meterReading="111111"
          gaugeValues={[6, 8, 3]}
          width={300}
          height={300}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
