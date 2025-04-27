import {WaterMeter} from "@/API/types/waterMeter";
import {waterMeterService} from "@/API/waterMeterService";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import WaterMeterClock from "@/components/WaterMeterClock";
import {useFocusEffect, useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback, useState} from "react";
import {ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";

export default function WaterMeterDetailScreen() {
  const {meterId} = useLocalSearchParams();
  const router = useRouter();
  const [waterMeter, setWaterMeter] = useState<WaterMeter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWaterMeter = async () => {
    if (!meterId) return;
    try {
      setLoading(true);
      const response = await waterMeterService.getWaterMeter(Number(meterId));
      const meter = response.data;

      if (meter) {
        setWaterMeter(meter);
      } else {
        setError("Không tìm thấy đồng hồ nước");
      }
    } catch (err) {
      console.error("Error fetching water meter:", err);
      setError("Lỗi khi tải dữ liệu đồng hồ nước");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWaterMeter();
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
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {loading ? (
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
                  // Navigate to edit page (to be implemented)
                  console.log("Edit water meter with ID:", waterMeter.id);
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

