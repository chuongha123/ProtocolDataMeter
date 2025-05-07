import { waterMeterService } from '@/API/waterMeterService';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Formik, Field, ErrorMessage, FormikProps } from 'formik';
import * as Yup from 'yup';

// Định nghĩa schema validation
const AddWaterMeterSchema = Yup.object().shape({
  meterName: Yup.string()
    .required('Vui lòng nhập tên đồng hồ'),
  initialReading: Yup.number()
    .typeError('Chỉ số phải là số')
    .required('Vui lòng nhập chỉ số ban đầu'),
  firebasePath: Yup.string()
    .required('Vui lòng nhập đường dẫn Firebase'),
  description: Yup.string(),
});

// Định nghĩa interface cho form values
interface FormValues {
  meterName: string;
  initialReading: string;
  firebasePath: string;
  description: string;
}

// Định nghĩa giá trị ban đầu
const initialValues: FormValues = {
  meterName: '',
  initialReading: '',
  firebasePath: '',
  description: '',
};

export default function AddWaterMeterScreen() {
  const router = useRouter();

  // Hàm xử lý khi submit form
  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      console.log('Submitted water meter:', values);
      await waterMeterService.save({
        meterName: values.meterName,
        cubicMeters: Number(values.initialReading),
        description: values.description,
        firebasePath: values.firebasePath
      });
      router.back();
    } catch (error) {
      console.error('Failed to add water meter:', error);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ThemedView style={styles.formContainer}>
          <ThemedText type="title" style={styles.formTitle}>
            Thêm đồng hồ nước mới
          </ThemedText>

          <Formik
            initialValues={initialValues}
            validationSchema={AddWaterMeterSchema}
            onSubmit={handleSubmit}
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
                  name="initialReading"
                  component={CustomInputField}
                  label="Chỉ số ban đầu (m³)"
                  placeholder="Nhập chỉ số ban đầu"
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