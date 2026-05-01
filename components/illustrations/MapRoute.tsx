import React from "react";
import Svg, { Rect, Circle, Path, G, Line } from "react-native-svg";

interface MapRouteProps {
  width?: number;
  height?: number;
}

export function MapRoute({ width = 320, height = 400 }: MapRouteProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 320 400">
      <Rect x="0" y="0" width="320" height="100" fill="#dbeafe" />
      <Path 
        d="M0 350 Q80 320 160 340 Q240 360 320 330 L320 400 L0 400 Z" 
        fill="#d1d5db" 
      />
      <Path 
        d="M0 370 Q100 350 200 365 Q280 375 320 360 L320 400 L0 400 Z" 
        fill="#9ca3af" 
      />
      <Path 
        d="M30 300 Q60 250 100 280 Q150 310 180 250 Q210 190 260 220 Q290 240 300 200"
        stroke="#10b981"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="0"
      />
      <G transform="translate(30, 285)">
        <Rect x="0" y="0" width="20" height="25" rx="3" fill="#10b981" />
        <Rect x="3" y="3" width="14" height="5" fill="#ffffff" opacity="0.5" />
        <Path d="M2 -5 L10 -12 L18 -5" stroke="#10b981" strokeWidth="3" fill="none" />
      </G>
      <G transform="translate(95, 265)">
        <Rect x="0" y="0" width="20" height="25" rx="3" fill="#10b981" />
        <Rect x="3" y="3" width="14" height="5" fill="#ffffff" opacity="0.5" />
        <Path d="M2 -5 L10 -12 L18 -5" stroke="#10b981" strokeWidth="3" fill="none" />
      </G>
      <G transform="translate(175, 235)">
        <Rect x="0" y="0" width="20" height="25" rx="3" fill="#6b7280" />
        <Rect x="3" y="3" width="14" height="5" fill="#ffffff" opacity="0.5" />
        <Path d="M2 -5 L10 -12 L18 -5" stroke="#6b7280" strokeWidth="3" fill="none" />
      </G>
      <G transform="translate(255, 205)">
        <Rect x="0" y="0" width="20" height="25" rx="3" fill="#6b7280" />
        <Rect x="3" y="3" width="14" height="5" fill="#ffffff" opacity="0.5" />
        <Path d="M2 -5 L10 -12 L18 -5" stroke="#6b7280" strokeWidth="3" fill="none" />
      </G>
      <G transform="translate(120, 245) rotate(-20)">
        <Rect x="0" y="0" width="40" height="25" rx="3" fill="#10b981" />
        <Rect x="32" y="3" width="12" height="19" rx="2" fill="#059669" />
        <Rect x="35" y="5" width="7" height="8" rx="1" fill="#bfdbfe" />
        <Circle cx="10" cy="28" r="5" fill="#374151" />
        <Circle cx="35" cy="28" r="5" fill="#374151" />
      </G>
      <Circle cx="50" cy="320" r="15" fill="#10b981" />
      <Circle cx="40" cy="325" r="12" fill="#059669" />
      <Circle cx="270" cy="340" r="18" fill="#10b981" />
      <G transform="translate(150, 310)">
        <Rect x="0" y="10" width="30" height="25" fill="#ffffff" />
        <Path d="M-3 10 L15 -5 L33 10" fill="#6b7280" />
        <Rect x="12" y="22" width="8" height="13" fill="#9ca3af" />
      </G>
      <G transform="translate(220, 305)">
        <Rect x="0" y="10" width="25" height="20" fill="#ffffff" />
        <Path d="M-2 10 L12.5 0 L27 10" fill="#6b7280" />
        <Rect x="9" y="18" width="7" height="12" fill="#9ca3af" />
      </G>
    </Svg>
  );
}

export default MapRoute;