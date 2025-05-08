import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useAuth } from '../utils/authContext';
import { authService } from '@/API/authService';

// Định nghĩa schema validation
const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .required('Vui lòng nhập tên đăng nhập'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
  fullName: Yup.string()
    .required('Vui lòng nhập họ và tên'),
});

// Định nghĩa interface cho form values
interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register } = useAuth();

  // Giá trị ban đầu
  const initialValues: RegisterFormValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  };

  // Xử lý đăng ký
  const handleRegister = async (values: RegisterFormValues, { setSubmitting }: any) => {
    try {
      const request = {
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      }
      // Store the auth token and user data
      await register(request);
      // Navigation is handled in the login function of authContext
      await login({ username: values.username, password: values.password });
    } catch (error) {
      Alert.alert('Lỗi', error instanceof Error ? error.message : 'Đăng ký thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.innerContainer}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <ThemedText style={styles.title}>Đăng Ký</ThemedText>

          <Formik
            initialValues={initialValues}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting
            }) => (
              <>
                <ThemedView style={styles.inputContainer}>
                  <FontAwesome name="user" size={20} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Tên đăng nhập"
                    placeholderTextColor="#A0A0A0"
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    autoCapitalize="none"
                    editable={!isSubmitting}
                  />
                </ThemedView>
                {touched.username && errors.username && (
                  <ThemedText style={styles.errorText}>{errors.username}</ThemedText>
                )}

                <ThemedView style={styles.inputContainer}>
                  <FontAwesome name="envelope" size={20} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#A0A0A0"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isSubmitting}
                  />
                </ThemedView>
                {touched.email && errors.email && (
                  <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
                )}

                <ThemedView style={styles.inputContainer}>
                  <FontAwesome name="user" size={20} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Họ và tên"
                    placeholderTextColor="#A0A0A0"
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    autoCapitalize="none"
                    editable={!isSubmitting}
                  />
                </ThemedView>
                {touched.fullName && errors.fullName && (
                  <ThemedText style={styles.errorText}>{errors.fullName}</ThemedText>
                )}

                <ThemedView style={styles.inputContainer}>
                  <FontAwesome name="lock" size={20} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    placeholderTextColor="#A0A0A0"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!isSubmitting}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    disabled={isSubmitting}
                  >
                    <FontAwesome
                      name={showPassword ? "eye-slash" : "eye"}
                      size={20}
                      color="#A0A0A0"
                    />
                  </TouchableOpacity>
                </ThemedView>
                {touched.password && errors.password && (
                  <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
                )}

                <ThemedView style={styles.inputContainer}>
                  <FontAwesome name="lock" size={20} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Xác nhận mật khẩu"
                    placeholderTextColor="#A0A0A0"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!isSubmitting}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                    disabled={isSubmitting}
                  >
                    <FontAwesome
                      name={showConfirmPassword ? "eye-slash" : "eye"}
                      size={20}
                      color="#A0A0A0"
                    />
                  </TouchableOpacity>
                </ThemedView>
                {touched.confirmPassword && errors.confirmPassword && (
                  <ThemedText style={styles.errorText}>{errors.confirmPassword}</ThemedText>
                )}

                <TouchableOpacity
                  style={[styles.registerButton, isSubmitting && styles.registerButtonDisabled]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <ThemedText style={styles.registerButtonText}>
                    {isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký'}
                  </ThemedText>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <ThemedView style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>Đã có tài khoản? </ThemedText>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.loginLink}>Đăng nhập</ThemedText>
              </TouchableOpacity>
            </Link>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 8,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  loginText: {
    fontSize: 15,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007AFF',
  },
}); 