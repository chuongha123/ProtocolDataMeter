import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

interface WaterMeterProps {
  meterReading: string; // Digital display reading (e.g., "000011")
  gaugeValues: number[]; // Values for the 4 gauge dials (0-9)
  width?: number;
  height?: number;
}

export const WaterMeter: React.FC<WaterMeterProps> = ({
  meterReading = "000011",
  gaugeValues = [6, 8, 3, 5],
  width = 300,
  height = 300,
}) => {
  // Ensure meterReading is 6 digits
  const paddedReading = meterReading.padStart(6, '0').substring(0, 6);

  // Calculate sizes based on width/height
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.45;
  const digitalDisplayWidth = radius * 1.5;
  const digitalDisplayHeight = radius * 0.4;

  // Calculate positions for the gauges
  const gaugeRadius = radius * 0.18;
  const gaugePositions = [
    { x: centerX - radius * 0.5, y: centerY + radius * 0.2 },
    { x: centerX, y: centerY + radius * 0.3 },
    { x: centerX + radius * 0.5, y: centerY + radius * 0.2 },
    // { x: centerX, y: centerY - radius * 0.3 },
  ];

  // Draw gauge needle based on value (0-9)
  const renderNeedle = (cx: number, cy: number, value: number, index: number) => {
    const angle = (value / 10) * 2 * Math.PI - Math.PI / 2;
    const needleLength = gaugeRadius * 0.8;
    const x2 = cx + needleLength * Math.cos(angle);
    const y2 = cy + needleLength * Math.sin(angle);

    return (
      <G key={`gauge-${index}`}>
        {/* Gauge background */}
        <Circle cx={cx} cy={cy} r={gaugeRadius} fill="white" stroke="#888" strokeWidth={1} />

        {/* Tick marks - 10 marks for 0-9 */}
        {Array.from({ length: 10 }).map((_, i) => {
          const tickAngle = (i / 10) * 2 * Math.PI - Math.PI / 2;
          const innerRadius = gaugeRadius * 0.7;
          const outerRadius = gaugeRadius * 0.9;
          const x1 = cx + innerRadius * Math.cos(tickAngle);
          const y1 = cy + innerRadius * Math.sin(tickAngle);
          const x2 = cx + outerRadius * Math.cos(tickAngle);
          const y2 = cy + outerRadius * Math.sin(tickAngle);

          return <Path key={i} d={`M${x1},${y1} L${x2},${y2}`} stroke="#444" strokeWidth={1} />;
        })}

        {/* Needle */}
        <Circle cx={cx} cy={cy} r={gaugeRadius * 0.1} fill="red" />
        <Path d={`M${cx},${cy} L${x2},${y2}`} stroke="red" strokeWidth={2} />

        {/* Small numbers at key positions */}
        {[0, 2, 4, 6, 8].map((num) => {
          const numAngle = (num / 10) * 2 * Math.PI - Math.PI / 2;
          const textRadius = gaugeRadius * 0.6;
          const x = cx + textRadius * Math.cos(numAngle);
          const y = cy + textRadius * Math.sin(numAngle);

          return (
            <SvgText
              key={num}
              x={x}
              y={y}
              fontSize={gaugeRadius * 0.25}
              textAnchor="middle"
              alignmentBaseline="central"
              fill="#444"
            >
              {num}
            </SvgText>
          );
        })}
      </G>
    );
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Main meter casing */}
        <Circle cx={centerX} cy={centerY} r={radius} fill="#2f4ba2" stroke="#2f4ba2" strokeWidth={8} />

        {/* Definitions need to come first */}
        <Defs>
          <RadialGradient id="glassGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
            <Stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <Stop offset="70%" stopColor="#f0f0f0" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#d0d0d0" stopOpacity="0.5" />
          </RadialGradient>
        </Defs>

        <Circle
          cx={centerX}
          cy={centerY}
          r={radius - 4}
          fill="url(#glassGradient)"
          opacity={0.4}
        />

        {/* Digital display */}
        <Rect
          x={centerX - digitalDisplayWidth / 2}
          y={centerY - radius * 0.6}
          width={digitalDisplayWidth}
          height={digitalDisplayHeight}
          rx={5}
          ry={5}
          fill="white"
          stroke="#444"
          strokeWidth={1}
        />

        {/* Digital numbers */}
        {paddedReading.split('').map((digit, i) => (
          <Rect
            key={i}
            x={centerX - digitalDisplayWidth / 2 + digitalDisplayWidth * (i / 6) + 5}
            y={centerY - radius * 0.6 + 5}
            width={digitalDisplayWidth / 6 - 10}
            height={digitalDisplayHeight - 10}
            rx={2}
            ry={2}
            fill="#eee"
            stroke="#aaa"
            strokeWidth={0.5}
          />
        ))}

        {paddedReading.split('').map((digit, i) => (
          <SvgText
            key={i}
            x={centerX - digitalDisplayWidth / 2 + digitalDisplayWidth * ((i + 0.5) / 6)}
            y={centerY - radius * 0.6 + digitalDisplayHeight / 2 + 2}
            fontSize={digitalDisplayHeight * 0.6}
            textAnchor="middle"
            alignmentBaseline="central"
            fontWeight="bold"
          >
            {digit}
          </SvgText>
        ))}

        {/* Label above digital display */}
        <SvgText
          x={centerX}
          y={centerY - radius * 0.6 - 10}
          fontSize={12}
          textAnchor="middle"
          fill="#ffffff"
        >
          m³
        </SvgText>

        {/* Brand and model info */}
        <SvgText
          x={centerX}
          y={centerY - radius * 0.1 + 10}
          fontSize={14}
          fontWeight="bold"
          textAnchor="middle"
          fill="#d32f2f"
        >
          H N C
        </SvgText>

        {/* <SvgText
          x={centerX}
          y={centerY + radius * 0.05}
          fontSize={10}
          textAnchor="middle"
          fill="#444"
        >
          ISO 4064 Class C
        </SvgText> */}

        {/* Gauges */}
        {gaugePositions.map((pos, i) => renderNeedle(pos.x, pos.y, gaugeValues[i], i))}

        {/* Labels for multipliers */}
        {/* <SvgText x={gaugePositions[0].x} y={gaugePositions[0].y - gaugeRadius - 5} fontSize={8} textAnchor="middle">x0.001</SvgText>
        <SvgText x={gaugePositions[1].x} y={gaugePositions[1].y - gaugeRadius - 5} fontSize={8} textAnchor="middle">x0.01</SvgText>
        <SvgText x={gaugePositions[2].x} y={gaugePositions[2].y - gaugeRadius - 5} fontSize={8} textAnchor="middle">x0.1</SvgText>
        <SvgText x={gaugePositions[3].x} y={gaugePositions[3].y - gaugeRadius - 5} fontSize={8} textAnchor="middle">x0.0001</SvgText> */}

        {/* Realistic glass highlight reflections */}
        {/* Main oval highlight */}
        <Path
          d={`M${centerX - radius * 0.4},${centerY - radius * 0.5} 
              Q${centerX - radius * 0.2},${centerY - radius * 0.7} ${centerX},${centerY - radius * 0.45}
              Q${centerX + radius * 0.2},${centerY - radius * 0.25} ${centerX - radius * 0.1},${centerY - radius * 0.2}
              Q${centerX - radius * 0.3},${centerY - radius * 0.3} ${centerX - radius * 0.4},${centerY - radius * 0.5}
              Z`}
          fill="white"
          opacity={0.2}
        />

        {/* Secondary smaller highlight */}
        <Circle
          cx={centerX + radius * 0.3}
          cy={centerY - radius * 0.4}
          r={radius * 0.1}
          fill="white"
          opacity={0.1}
        />

        {/* Edge light refraction */}
        {/* <Path
          d={`M${centerX + radius * 0.8},${centerY} 
              A${radius * 0.8},${radius * 0.8} 0 0,1 ${centerX},${centerY + radius * 0.8}
              A${radius * 0.8},${radius * 0.8} 0 0,1 ${centerX - radius * 0.8},${centerY}`}
          fill="none"
          stroke="white"
          strokeWidth={radius * 0.03}
          opacity={0.08}
        /> */}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WaterMeter; 