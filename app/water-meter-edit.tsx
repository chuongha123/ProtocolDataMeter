import { waterMeterService } from '@/API/waterMeterService';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Formik, Field, FormikProps } from 'formik';
import * as Yup from 'yup';

// Định nghĩa schema validation
const EditWaterMeterSchema = Yup.object().shape({
  meterName: Yup.string()
    .required('Vui lòng nhập tên đồng hồ'),
  cubicMeters: Yup.number()
    .typeError('Chỉ số phải là số')
    .required('Vui lòng nhập chỉ số hiện tại'),
  firebasePath: Yup.string()
    .required('Vui lòng nhập đường dẫn Firebase'),
  description: Yup.string(),
});

// Định nghĩa interface cho form values
interface FormValues {
  meterName: string;
  cubicMeters: string;
  firebasePath: string;
  description: string;
}

export default function EditWaterMeterScreen() {
  const router = useRouter();
  const { meterId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState<FormValues>({
    meterName: '',
    cubicMeters: '',
    firebasePath: '',
    description: '',
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
          setInitialValues({
            meterName: meter.meterName,
            cubicMeters: meter.cubicMeters.toString(),
            description: meter.description || '',
            firebasePath: meter.firebasePath || '',
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

  // Hàm xử lý khi submit form
  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      await waterMeterService.update(Number(meterId), {
        id: Number(meterId),
        meterName: values.meterName,
        cubicMeters: Number(values.cubicMeters),
        description: values.description,
        firebasePath: values.firebasePath
      });
      router.back();
    } catch (error) {
      console.error('Failed to update water meter:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Custom component cho field
  const CustomInputField = ({ field, form, ...props }: any) => {
    const hasError = form.touched[field.name] && form.errors[field.name];
    
    return (
      <View style={styles.formGroup}>
        <ThemedText type="defaultSemiBold">
          {props.label} {props.required && <ThemedText type="defaultSemiBold" style={{ color: 'red' }}>*</ThemedText>}
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            { borderColor: hasError ? '#ff6b6b' : '#ccc' }
          ]}
          onChangeText={form.handleChange(field.name)}
          onBlur={form.handleBlur(field.name)}
          value={field.value}
          {...props}
        />
        {hasError && (
          <ThemedText style={styles.errorText}>{form.errors[field.name]}</ThemedText>
        )}
      </View>
    );
  };

  // Custom component cho textarea
  const CustomTextareaField = ({ field, form, ...props }: any) => {
    return (
      <View style={styles.formGroup}>
        <ThemedText type="defaultSemiBold">{props.label}</ThemedText>
        <TextInput
          style={styles.textarea}
          onChangeText={form.handleChange(field.name)}
          onBlur={form.handleBlur(field.name)}
          value={field.value}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          {...props}
        />
      </View>
    );
  };

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

          <Formik
            initialValues={initialValues}
            validationSchema={EditWaterMeterSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {(formikProps: FormikProps<FormValues>) => (
              <>
                <Field
                  name="meterName"
                  component={CustomInputField}
                  label="Tên đồng hồ"
                  placeholder="Nhập số serial đồng hồ"
                  required
                />

                <Field
                  name="cubicMeters"
                  component={CustomInputField}
                  label="Chỉ số hiện tại (m³)"
                  placeholder="Nhập chỉ số hiện tại"
                  keyboardType="numeric"
                  required
                />

                <Field
                  name="firebasePath"
                  component={CustomInputField}
                  label="Đường dẫn Firebase"
                  placeholder="Nhập đường dẫn Firebase"
                  required
                />

                <Field
                  name="description"
                  component={CustomTextareaField}
                  label="Ghi chú"
                  placeholder="Nhập ghi chú (không bắt buộc)"
                />

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
                      formikProps.isSubmitting && styles.disabledButton
                    ]}
                    onPress={() => formikProps.handleSubmit()}
                    disabled={formikProps.isSubmitting}
                  >
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                      {formikProps.isSubmitting ? 'Đang lưu...' : 'Lưu'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
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