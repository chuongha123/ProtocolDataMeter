import { waterMeterService } from "@/API/waterMeterService";
import WaterMeter from "@/components/WaterMeter";
import { CLOCK1, CLOCK2, onValueChange } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [clock1, setClock1] = useState(0);
  const [clock2, setClock2] = useState(0);
  useEffect(() => {
    onValueChange(CLOCK1, (data) => {
      setClock1(data.value);
      waterMeterService.save({
        meterName: "Clock 1",
        cubicMeters: data.value,
      });
    });
    onValueChange(CLOCK2, (data) => {
      setClock2(data.value);
      waterMeterService.save({
        meterName: "Clock 2",
        cubicMeters: data.value,
      });
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <WaterMeter
          meterReading={clock1.toString()}
          gaugeValues={[6, 8, 3]}
          width={300}
          height={300}
        />
        <WaterMeter
          meterReading={clock2.toString()}
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
