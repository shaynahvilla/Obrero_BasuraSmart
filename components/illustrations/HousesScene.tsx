import React from "react";
import Svg, { Path, Rect, Circle, G } from "react-native-svg";

interface HousesSceneProps {
  width?: number;
  height?: number;
}

export function HousesScene({ width = 300, height = 200 }: HousesSceneProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 300 200">
      <Circle cx="260" cy="40" r="25" fill="#fbbf24" />
      <G fill="#ffffff">
        <Circle cx="60" cy="35" r="12" />
        <Circle cx="75" cy="35" r="15" />
        <Circle cx="90" cy="35" r="12" />
        <Rect x="60" y="35" width="30" height="10" />
      </G>
      <G fill="#ffffff">
        <Circle cx="180" cy="50" r="10" />
        <Circle cx="192" cy="50" r="12" />
        <Circle cx="204" cy="50" r="10" />
        <Rect x="180" y="50" width="24" height="8" />
      </G>
      <Rect x="0" y="160" width="300" height="40" fill="#10b981" />
      <Rect x="30" y="110" width="60" height="50" fill="#ffffff" />
      <Path d="M25 110 L60 70 L95 110" fill="#374151" />
      <Rect x="50" y="130" width="15" height="30" fill="#6b7280" />
      <Rect x="75" y="120" width="12" height="15" fill="#bfdbfe" />
      <Rect x="200" y="100" width="70" height="60" fill="#ffffff" />
      <Path d="M195 100 L235 55 L275 100" fill="#374151" />
      <Rect x="225" y="125" width="18" height="35" fill="#6b7280" />
      <Rect x="248" y="110" width="15" height="18" fill="#bfdbfe" />
      <Rect x="115" y="70" width="70" height="90" fill="#ffffff" />
      <Path d="M110 70 L150 40 L190 70" fill="#374151" />
      <Rect x="125" y="85" width="12" height="15" fill="#bfdbfe" />
      <Rect x="144" y="85" width="12" height="15" fill="#bfdbfe" />
      <Rect x="163" y="85" width="12" height="15" fill="#bfdbfe" />
      <Rect x="125" y="110" width="12" height="15" fill="#bfdbfe" />
      <Rect x="144" y="110" width="12" height="15" fill="#bfdbfe" />
      <Rect x="163" y="110" width="12" height="15" fill="#bfdbfe" />
      <Rect x="140" y="135" width="20" height="25" fill="#6b7280" />
      <G transform="translate(85, 155)">
        <Rect x="0" y="0" width="60" height="35" rx="3" fill="#10b981" />
        <Rect x="50" y="5" width="20" height="30" rx="2" fill="#059669" />
        <Rect x="55" y="8" width="12" height="12" rx="1" fill="#bfdbfe" />
        <Circle cx="15" cy="38" r="8" fill="#374151" />
        <Circle cx="15" cy="38" r="4" fill="#9ca3af" />
        <Circle cx="55" cy="38" r="8" fill="#374151" />
        <Circle cx="55" cy="38" r="4" fill="#9ca3af" />
        <Rect x="8" y="8" width="6" height="20" rx="1" fill="#ffffff" />
        <Rect x="22" y="8" width="6" height="20" rx="1" fill="#ffffff" />
      </G>
    </Svg>
  );
}

export default HousesScene;