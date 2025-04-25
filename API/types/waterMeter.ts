export interface WaterMeter {
  id: number;
  meterName: string;
  cubicMeters: number;
  description?: string;
  firebasePath?: string;
}

export interface NewWaterMeter {
  meterName: string;
  cubicMeters: number;
  description?: string;
  firebasePath?: string;
}
