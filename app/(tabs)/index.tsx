import { WaterMeter } from "@/API/types/waterMeter";
import { waterMeterService } from "@/API/waterMeterService";
import { AppDrawerScreenProps } from "@/app/_layout";
import WaterMeterClock from "@/components/WaterMeterClock";
import { onValueChange } from "@/firebaseConfig";
import { Unsubscribe } from "@react-native-firebase/database";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const navigation = useNavigation<AppDrawerScreenProps>();
  const unsubscribe = useRef<Unsubscribe[]>([]);
  const [waterMeters, setWaterMeters] = useState<WaterMeter[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWaterMeters = useCallback(async () => {
    try {
      setLoading(true);
      // Clear existing Firebase listeners before fetching new data
      unsubscribe.current.forEach(unsub => unsub());
      unsubscribe.current = [];

      const response = await waterMeterService.getWaterMeters();
      const waterMeters = response.data || [];
      setWaterMeters(waterMeters); // Ensure it's always an array

      // Setup Firebase listeners
      waterMeters.forEach?.(meter => {
        if (meter.firebasePath) {
          unsubscribe.current.push(onValueChange(meter.firebasePath, (data) => {
            setWaterMeters(prev =>
              prev.map(m => m.id === meter.id ? { ...m, cubicMeters: data ?? 0 } : m)
            );
          }));
        }
      });
    } catch (err) {
      console.error("Failed to fetch water meters:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWaterMeters();
  }, []);

  const handleMeterPress = (meter: WaterMeter) => {
    navigation.navigate("water-meter-detail", { meterId: meter.id });
  };

  useFocusEffect(
    useCallback(() => {
      fetchWaterMeters().then();
      return () => {
        unsubscribe.current.forEach(unsub => unsub());
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196F3"]}
            tintColor="#2196F3"
          />
        }
      >
        {loading && !refreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
          </View>
        )}

        {waterMeters && waterMeters.length > 0 && (
          waterMeters.map((meter) => (
            <WaterMeterClock
              key={meter.id}
              waterMeter={meter}
              meterReading={meter.cubicMeters.toString()}
              width={300}
              height={300}
              gaugeValues={[6, 8, 3]}
              onPress={() => handleMeterPress(meter)}
            />
          ))
        )}

        {waterMeters && waterMeters.length === 0 && !loading && !refreshing && (
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
    paddingVertical: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});