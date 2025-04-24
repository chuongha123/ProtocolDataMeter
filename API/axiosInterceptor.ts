import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { config } from "./config";

// API response interface for consistent typing
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// Custom error interface
export interface ApiError {
  message: string;
  code?: string | number;
  status?: number;
  data?: any;
}

// Environment check (safer than using __DEV__ directly)
const isDevelopment = process.env.NODE_ENV !== "production";

// Create axios config with types
const axiosConfig: AxiosRequestConfig = {
  baseURL: config.baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create(axiosConfig);

/**
 * Get authentication token - replace with your own token storage method
 * This is more flexible than direct localStorage reference which may not work in all environments
 */
const getAuthToken = (): string | null => {
  // For web
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("authToken");
  }

  // For React Native or other environments, implement appropriate storage
  // e.g., AsyncStorage, SecureStore, etc.
  return null;
};

// Request interceptor with proper TypeScript types
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Add auth token if available
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (isDevelopment) {
      console.log("🚀 API Request:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Handle request setup errors
    if (isDevelopment) {
      console.error("❌ Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Response interceptor with proper TypeScript types
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Log response in development
    if (isDevelopment) {
      console.log("📥 API Response:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError): Promise<ApiError> => {
    // Create standardized error object
    const apiError: ApiError = {
      message: "An unknown error occurred",
    };

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      apiError.status = status;
      apiError.data = data;

      // Try to extract error message from response
      if (data) {
        if (typeof data === "string") {
          apiError.message = data;
        } else if (typeof data === "object" && data !== null) {
          // Type guard to ensure data is an object
          const errorData = data as Record<string, any>;

          if (errorData.message && typeof errorData.message === "string") {
            apiError.message = errorData.message;
          } else if (errorData.error) {
            apiError.message =
              typeof errorData.error === "string"
                ? errorData.error
                : "Server error";
          }
        } else {
          apiError.message = `Server error: ${status}`;
        }
      } else {
        apiError.message = `Server error: ${status}`;
      }

      // Log error in development
      if (isDevelopment) {
        console.error(`❌ Response error (${status}):`, data);
      }

      // Handle specific status codes
      switch (status) {
        case 401:
          apiError.code = "unauthorized";
          // Handle unauthorized - e.g., redirect to login
          break;
        case 403:
          apiError.code = "forbidden";
          break;
        case 404:
          apiError.code = "not_found";
          break;
        case 500:
          apiError.code = "server_error";
          break;
        default:
          apiError.code = `http_${status}`;
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      apiError.message = "Network error: No response from server";
      apiError.code = "network_error";

      if (isDevelopment) {
        console.error("❌ Network error:", error.message);
      }
    } else {
      // Error in request configuration
      apiError.message = error.message || "Request configuration error";
      apiError.code = "request_error";

      if (isDevelopment) {
        console.error("❌ Request error:", error.message);
      }
    }

    const errorMessage = new Error(apiError.message);
    Object.assign(errorMessage, apiError);
    return Promise.reject(errorMessage);
  }
);

// Typed request methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance
      .get<T, AxiosResponse<T>>(url, config)
      .then((response) => response.data);
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance
      .post<T, AxiosResponse<T>>(url, data, config)
      .then((response) => response.data);
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance
      .put<T, AxiosResponse<T>>(url, data, config)
      .then((response) => response.data);
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance
      .delete<T, AxiosResponse<T>>(url, config)
      .then((response) => response.data);
  },
};

export default axiosInstance;
