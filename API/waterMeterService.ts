import {api} from "./axiosInterceptor";
import {NewWaterMeter, WaterMeter} from "./types/waterMeter";

const API_URL = "/api/water-meters";

export const waterMeterService = {
  getWaterMeter: async (id: number): Promise<{ data: WaterMeter }> => {
    try {
      return await api.get<{ data: WaterMeter }>(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Failed to fetch water meter data:", error);
      throw error;
    }
  },

  getWaterMeters: async (): Promise<{ data: WaterMeter[] }> => {
    try {
      return await api.get<{ data: WaterMeter[] }>(API_URL);
    } catch (error) {
      console.error("Failed to fetch water meters:", error);
      throw error;
    }
  },

  save: async (waterMeter: NewWaterMeter): Promise<WaterMeter> => {
    try {
      return await api.post<WaterMeter>(API_URL, waterMeter);
    } catch (error) {
      console.error("Failed to save water meter data:", error);
      throw error;
    }
  },

  // Additional methods
  update: async (id: number, waterMeter: WaterMeter): Promise<WaterMeter> => {
    try {
      return await api.put<WaterMeter>(`${API_URL}/${id}`, waterMeter);
    } catch (error) {
      console.error(`Failed to update water meter with ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Failed to delete water meter with ID ${id}:`, error);
      throw error;
    }
  },
};
