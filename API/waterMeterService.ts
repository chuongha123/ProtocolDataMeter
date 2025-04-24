import { api } from "./axiosInterceptor";
import { NewWaterMeter, WaterMeter } from "./types/waterMeter";

const API_URL = "/api/water-meters";

export const waterMeterService = {
  getWaterMeter: async (): Promise<WaterMeter> => {
    try {
      return await api.get<WaterMeter>("/water-meter");
    } catch (error) {
      console.error("Failed to fetch water meter data:", error);
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
  update: async (id: string, waterMeter: WaterMeter): Promise<WaterMeter> => {
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
