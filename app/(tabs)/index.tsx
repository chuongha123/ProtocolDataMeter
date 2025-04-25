import { WaterMeter } from "@/API/types/waterMeter";
import { waterMeterService } from "@/API/waterMeterService";
import WaterMeterClock from "@/components/WaterMeterClock";
import { onValueChange } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [waterMeters, setWaterMeters] = useState<WaterMeter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaterMeters = async () => {
      try {
        setLoading(true);
        const response = await waterMeterService.getWaterMeters();
        setWaterMeters(response.waterMeters || []); // Ensure it's always an array

        // Setup Firebase listeners
        response.waterMeters?.forEach?.(meter => {
          if (meter.firebasePath) {
            onValueChange(meter.firebasePath, (data) => {
              setWaterMeters(prev =>
                prev.map(m => m.id === meter.id ? { ...m, cubicMeters: data?.value ?? 0 } : m)
              );
            });
          }
        });
      } catch (err) {
        console.error("Failed to fetch water meters:", err);
        setError("Không thể tải dữ liệu đồng hồ nước");
      } finally {
        setLoading(false);
      }
    };

    fetchWaterMeters();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <Text>Đang tải...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : waterMeters && waterMeters.length > 0 ? (
          waterMeters.map((meter) => (
            <WaterMeterClock
              key={meter.id}
              meterReading={meter.cubicMeters.toString()}
              width={300}
              height={300}
              gaugeValues={[6, 8, 3]}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text>Chưa có đồng hồ nước nào</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
