import React from "react";
import Svg, { Rect, Circle, Path, G } from "react-native-svg";

interface GarbageTruckProps {
  width?: number;
  height?: number;
  color?: string;
}

export function GarbageTruck({ 
  width = 120, 
  height = 80, 
  color = "#10b981" 
}: GarbageTruckProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 80">
      <Rect x="5" y="10" width="70" height="45" rx="4" fill={color} />
      <Rect x="10" y="15" width="8" height="35" rx="1" fill="#ffffff" opacity="0.8" />
      <Rect x="22" y="15" width="8" height="35" rx="1" fill="#ffffff" opacity="0.8" />
      <Rect x="34" y="15" width="8" height="35" rx="1" fill="#ffffff" opacity="0.8" />
      <Rect x="46" y="15" width="8" height="35" rx="1" fill="#ffffff" opacity="0.8" />
      <Rect x="58" y="15" width="8" height="35" rx="1" fill="#ffffff" opacity="0.8" />
      <Rect x="65" y="18" width="28" height="37" rx="3" fill="#059669" />
      <Rect x="70" y="22" width="18" height="15" rx="2" fill="#bfdbfe" />
      <Circle cx="25" cy="60" r="12" fill="#374151" />
      <Circle cx="25" cy="60" r="6" fill="#9ca3af" />
      <Circle cx="78" cy="60" r="12" fill="#374151" />
      <Circle cx="78" cy="60" r="6" fill="#9ca3af" />
      <Rect x="85" y="45" width="8" height="10" rx="2" fill="#6b7280" />
    </Svg>
  );
}

export default GarbageTruck;