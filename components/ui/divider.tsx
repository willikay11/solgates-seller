import { View, StyleSheet, DimensionValue } from 'react-native';

type DividerProps = {
  color?: string;
  width?: DimensionValue;
  height?: number;
};

export default function Divider({ color = '#D9D9D9', width = 100, height = 1 }: DividerProps) {
  return <View style={[{ backgroundColor: color, width, height }]} />;
}
