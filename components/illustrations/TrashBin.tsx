import React from "react";
import Svg, { Rect, Path, Circle } from "react-native-svg";

interface TrashBinProps {
  width?: number;
  height?: number;
  color?: string;
  filled?: boolean;
}

export function TrashBin({ 
  width = 40, 
  height = 50, 
  color = "#10b981",
  filled = false
}: TrashBinProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 50">
      <Rect x="15" y="0" width="10" height="4" rx="2" fill="#6b7280" />
      <Rect x="5" y="4" width="30" height="6" rx="2" fill="#6b7280" />
      <Rect x="8" y="10" width="24" height="35" rx="3" fill={color} />
      <Rect x="13" y="14" width="3" height="28" rx="1" fill="#ffffff" opacity="0.4" />
      <Rect x="19" y="14" width="3" height="28" rx="1" fill="#ffffff" opacity="0.4" />
      <Rect x="25" y="14" width="3" height="28" rx="1" fill="#ffffff" opacity="0.4" />
      {filled && (
        <Rect x="10" y="20" width="20" height="20" rx="2" fill="#ffffff" opacity="0.3" />
      )}
    </Svg>
  );
}

export default TrashBin;