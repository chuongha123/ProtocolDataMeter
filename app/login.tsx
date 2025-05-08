import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";

import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useAuth } from "../utils/authContext";

// Định nghĩa schema validation
const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
});

// Định nghĩa interface cho form values
interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  // Initial values
  const initialValues: LoginFormValues = {
    username: "",
    password: "",
  };

  // Handle login
  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting }: any
  ) => {
    try {
      const mockToken = "mock-auth-token-123";
      const mockUserData = {
        id: "1",
        username: values.username,
        email: "user@example.com",
      };

      // Store the auth token and user data
      await login(mockToken, mockUserData);

      // Navigation is handled in the login function of authContext
    } catch (error) {
      Alert.alert(
        "Lỗi",
        error instanceof Error ? error.message : "Đăng nhập thất bại"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="auto" />
      <ThemedView style={styles.container}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <ThemedText style={styles.title}>Đăng Nhập</ThemedText>

        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              <ThemedView style={styles.inputContainer}>
                <FontAwesome
                  name="user"
                  size={20}
                  color="#007AFF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tên đăng nhập"
                  placeholderTextColor="#A0A0A0"
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
              </ThemedView>
              {touched.username && errors.username && (
                <ThemedText style={styles.errorText}>
                  {errors.username}
                </ThemedText>
              )}

              <ThemedView style={styles.inputContainer}>
                <FontAwesome
                  name="lock"
                  size={20}
                  color="#007AFF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#A0A0A0"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
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
                <ThemedText style={styles.errorText}>
                  {errors.password}
                </ThemedText>
              )}

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isSubmitting && styles.loginButtonDisabled,
                ]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                <ThemedText style={styles.loginButtonText}>
                  {isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <ThemedView style={styles.registerContainer}>
          <ThemedText style={styles.registerText}>
            Chưa có tài khoản?{" "}
          </ThemedText>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <ThemedText style={styles.registerLink}>Đăng ký</ThemedText>
            </TouchableOpacity>
          </Link>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    lineHeight: 32,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
    height: "100%",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  loginButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  registerText: {
    fontSize: 15,
  },
  registerLink: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#007AFF",
  },
});
