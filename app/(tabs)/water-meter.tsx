import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WaterMeterClock from '@/components/WaterMeterClock';

export default function WaterMeterScreen() {
  const [meterReading, setMeterReading] = useState('000011');
  const [gaugeValues, setGaugeValues] = useState([6, 8, 3]);
  const [refreshing, setRefreshing] = useState(false);

  // Update meter reading randomly to simulate usage
  const updateReading = () => {
    // Increment reading by a small random amount
    const currentValue = parseInt(meterReading, 10);
    const newValue = currentValue + Math.floor(Math.random() * 10);
    setMeterReading(newValue.toString().padStart(6, '0'));
    
    // Update gauge values too
    setGaugeValues([
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ]);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      updateReading();
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196F3"]}
            tintColor="#2196F3"
          />
        }
      >
        <View style={styles.container}>
          <Text style={styles.title}>Đồng Hồ Nước</Text>
          
          <View style={styles.meterContainer}>
            <WaterMeterClock 
              meterReading={meterReading}
              gaugeValues={gaugeValues}
              width={300}
              height={300}
            />
            <View style={styles.meterSpacer} />
            <WaterMeterClock 
              meterReading={meterReading}
              gaugeValues={gaugeValues}
              width={300}
              height={300}
            />
            <View style={styles.meterSpacer} />
            <WaterMeterClock 
              meterReading={meterReading}
              gaugeValues={gaugeValues}
              width={300}
              height={300}
            />
          </View>
          
          <View style={styles.controlsContainer}>
            <Button 
              title="Cập nhật số liệu"
              onPress={updateReading}
            />
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Chỉ số đồng hồ: {meterReading} m³</Text>
            <Text style={styles.infoText}>Thời gian cập nhật: {new Date().toLocaleTimeString()}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 80, // Increase bottom padding to ensure content is visible
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  meterContainer: {
    width: '100%',
    alignItems: 'center',
  },
  meterSpacer: {
    height: 20,
  },
  controlsContainer: {
    marginVertical: 20,
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
}); 