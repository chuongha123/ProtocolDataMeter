export interface WaterMeter {
  id: string;
  meterName: string;
  cubicMeters: number;
}

export interface NewWaterMeter {
  meterName: string;
  cubicMeters: number;
}
