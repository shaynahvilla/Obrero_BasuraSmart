import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

interface BellProps {
  width?: number;
  height?: number;
  color?: string;
  hasNotification?: boolean;
}

export function Bell({ 
  width = 24, 
  height = 24, 
  color = "#ef4444",
  hasNotification = true
}: BellProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C10.9 2 10 2.9 10 4V4.29C7.19 5.17 5 7.92 5 11V17L3 19V20H21V19L19 17V11C19 7.92 16.81 5.17 14 4.29V4C14 2.9 13.1 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z"
        fill={color}
      />
      {hasNotification && (
        <Circle cx="17" cy="6" r="4" fill={color} />
      )}
    </Svg>
  );
}

export default Bell;