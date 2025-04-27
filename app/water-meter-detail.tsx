import { WaterMeter } from "@/API/types/waterMeter";
import { waterMeterService } from "@/API/waterMeterService";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import WaterMeterClock from "@/components/WaterMeterClock";
import { onValueChange } from "@/firebaseConfig";
import { Unsubscribe } from "@react-native-firebase/database";
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppDrawerScreenProps } from "./_layout";

export default function WaterMeterDetailScreen() {
  const { meterId } = useLocalSearchParams();
  const navigation = useNavigation<AppDrawerScreenProps>();
  const router = useRouter();
  const [waterMeter, setWaterMeter] = useState<WaterMeter | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const unsubscribe = useRef<Unsubscribe | null>(null);

  const fetchWaterMeter = async () => {
    if (!meterId) return;
    try {
      setLoading(true);
      // Clean up existing Firebase listener if any
      if (unsubscribe.current) {
        unsubscribe.current();
        unsubscribe.current = null;
      }
      
      const response = await waterMeterService.getWaterMeter(Number(meterId));
      const meter = response.data;

      if (meter) {
        setWaterMeter(meter);
        if (meter.firebasePath) {
          unsubscribe.current = onValueChange(meter.firebasePath, (data) => {
            setWaterMeter(prev => {
              if (prev) {
                prev = { ...prev, cubicMeters: data?.value ?? 0 };
              }
              return prev;
            })
          })
        }
      } else {
        setError("Không tìm thấy đồng hồ nước");
      }
    } catch (err) {
      console.error("Error fetching water meter:", err);
      setError("Lỗi khi tải dữ liệu đồng hồ nước");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWaterMeter();
  }, [fetchWaterMeter, meterId]);

  useFocusEffect(
    useCallback(() => {
      fetchWaterMeter().then();
      return () => {
        if (unsubscribe.current) {
          unsubscribe.current();
        }
      };
    }, [meterId])
  );

  // Generate random gauge values for demonstration
  const getRandomGaugeValues = () => {
    return [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ];
  };

  // Format cubic meters to 6-digit display
  const formatMeterReading = (value: number) => {
    return value.toString().padStart(6, '0');
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#4a90e2"]}
          tintColor="#4a90e2"
        />
      }
    >
      <ThemedView style={styles.content}>
        {loading && !refreshing ? (
          <ThemedText style={styles.statusText}>Đang tải...</ThemedText>
        ) : error ? (
          <ThemedText style={[styles.statusText, styles.errorText]}>{error}</ThemedText>
        ) : waterMeter ? (
          <>
            <ThemedText type="title" style={styles.title}>
              {waterMeter.meterName}
            </ThemedText>

            <View style={styles.clockContainer}>
              <WaterMeterClock
                meterReading={formatMeterReading(waterMeter.cubicMeters)}
                gaugeValues={getRandomGaugeValues()}
                width={300}
                height={300}
                waterMeter={waterMeter}
              />
            </View>

            <ThemedView style={styles.infoContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Thông tin đồng hồ
              </ThemedText>

              <View style={styles.infoRow}>
                <ThemedText type="defaultSemiBold">ID:</ThemedText>
                <ThemedText>{waterMeter.id}</ThemedText>
              </View>

              <View style={styles.infoRow}>
                <ThemedText type="defaultSemiBold">Tên đồng hồ:</ThemedText>
                <ThemedText>{waterMeter.meterName}</ThemedText>
              </View>

              <View style={styles.infoRow}>
                <ThemedText type="defaultSemiBold">Chỉ số (m³):</ThemedText>
                <ThemedText>{waterMeter.cubicMeters}</ThemedText>
              </View>

              {waterMeter.firebasePath && (
                <View style={styles.infoRow}>
                  <ThemedText type="defaultSemiBold">Firebase Path:</ThemedText>
                  <ThemedText>{waterMeter.firebasePath}</ThemedText>
                </View>
              )}
              
              {waterMeter.description && (
                <View style={styles.descriptionContainer}>
                  <ThemedText type="defaultSemiBold">Ghi chú:</ThemedText>
                  <ThemedText style={styles.description}>{waterMeter.description}</ThemedText>
                </View>
              )}
            </ThemedView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => {
                  navigation.navigate("water-meter-edit", {
                    meterId: waterMeter.id
                  });
                }}
              >
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                  Cập nhật
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => router.back()}
              >
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                  Quay lại
                </ThemedText>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    borderRadius: 8,
    minHeight: '100%',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  statusText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
  },
  errorText: {
    color: '#ff6b6b',
  },
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  infoContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  description: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    minWidth: '45%',
  },
  editButton: {
    backgroundColor: '#4a90e2',
  },
  backButton: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    color: 'black',
  },
});

