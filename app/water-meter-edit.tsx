import {waterMeterService} from '@/API/waterMeterService';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useColorScheme} from '@/hooks/useColorScheme';
import {validateNumberField, validateRequiredField} from '@/utils/validateUtil';
import {useLocalSearchParams, useRouter} from 'expo-router';
import React, {ReactElement, useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

export default function EditWaterMeterScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const {meterId} = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    meterName: '',
    cubicMeters: '',
    description: '',
    firebasePath: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({
    meterName: '',
    cubicMeters: '',
    firebasePath: ''
  });

  // Fetch water meter data
  useEffect(() => {
    const fetchWaterMeter = async () => {
      if (!meterId) return;

      try {
        setIsLoading(true);
        const response = await waterMeterService.getWaterMeter(Number(meterId));
        const meter = response.data;

        if (meter) {
          setFormData({
            meterName: meter.meterName,
            cubicMeters: meter.cubicMeters.toString(),
            description: meter.description || '',
            firebasePath: meter.firebasePath || ''
          });
        } else {
          setError('Không tìm thấy đồng hồ nước');
        }
      } catch (err) {
        console.error('Error fetching water meter:', err);
        setError('Lỗi khi tải dữ liệu đồng hồ nước');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaterMeter();
  }, [meterId]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData({...formData, [field]: value});
    // Clear error when typing
    if (field in errors) {
      setErrors({...errors, [field]: ''});
    }
  };

  const validateForm = () => {
    const newErrors = {
      meterName: validateRequiredField(formData.meterName, "Vui lòng nhập tên đồng hồ"),
      cubicMeters: validateNumberField(formData.cubicMeters, "Vui lòng nhập số"),
      firebasePath: validateRequiredField(formData.firebasePath, "Vui lòng nhập đường dẫn Firebase")
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await waterMeterService.save({
        // id: Number(meterId),
        meterName: formData.meterName,
        cubicMeters: Number(formData.cubicMeters),
        description: formData.description,
        firebasePath: formData.firebasePath
      });
      router.back();
    } catch (error) {
      console.error('Failed to update water meter:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract form field rendering
  const renderFormField = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    isRequired = false,
    options = {}
  ): ReactElement => (
    <View style={styles.formGroup}>
      <ThemedText type="defaultSemiBold">{label} {isRequired &&
          <ThemedText type="defaultSemiBold" style={{color: 'red'}}>*</ThemedText>}</ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            color: colorScheme === 'dark' ? '#fff' : '#000',
            borderColor: field in errors && errors[field] ? '#ff6b6b' : '#ccc'
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
        value={formData[field]}
        onChangeText={(value) => updateField(field, value)}
        {...options}
      />
      {field in errors && errors[field] ? (
        <ThemedText style={styles.errorText}>{errors[field]}</ThemedText>
      ) : null}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.statusText}>Đang tải...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <ThemedText style={[styles.statusText, styles.errorText]}>{error}</ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>Quay lại</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ThemedView style={styles.formContainer}>
          <ThemedText type="title" style={styles.formTitle}>
            Cập nhật đồng hồ nước
          </ThemedText>

          {renderFormField('Tên đồng hồ', 'meterName', 'Nhập số serial đồng hồ', true)}
          {renderFormField('Chỉ số hiện tại (m³)', 'cubicMeters', 'Nhập chỉ số hiện tại', true, {keyboardType: 'numeric'})}
          {renderFormField('Đường dẫn Firebase', 'firebasePath', 'Nhập đường dẫn Firebase', true)}

          <View style={styles.formGroup}>
            <ThemedText type="defaultSemiBold">Ghi chú</ThemedText>
            <TextInput
              style={[
                styles.textarea,
                {color: colorScheme === 'dark' ? '#fff' : '#000'}
              ]}
              placeholder="Nhập ghi chú (không bắt buộc)"
              placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Hủy
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                isSubmitting && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
  },
  formTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  textarea: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingTop: 10,
    marginTop: 8,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    height: 45,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    minWidth: '45%',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#4a90e2',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'black',
  },
}); 