import { TextInput } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';


interface MeasurePickerProps {
  default: string,
  OnNbMeasureChanged: (value: string) => void;
}

export const MeasurePicker = (props: MeasurePickerProps) => {
  const [nbMeasure, setNbMeasure] = useState<string>(props.default);

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 20,
    },
    label: { color: 'black', fontSize: 25 },
  });

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Nombre de mesure</Text>
      <TextInput
        onChangeText={value => {
          setNbMeasure(value);
          props.OnNbMeasureChanged(value)
        }}
        value={nbMeasure}
      />
    </View>
  );
};
