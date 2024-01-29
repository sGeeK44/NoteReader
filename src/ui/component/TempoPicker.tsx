import { TextInput } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';


interface TempoPickerProps {
  default: string,
  onTempoChanged: (value: string) => void;
}

export const TempoPicker = (props: TempoPickerProps) => {
  const [tempo, setTempo] = useState<string>(props.default);

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 20,
    },
    label: { color: 'black', fontSize: 25 },
  });

  return (<View style={styles.row}>
    <Text style={styles.label}>Tempo</Text>
    <TextInput
      right={<TextInput.Icon icon="metronome" />}
      onChangeText={value => {
        setTempo(value);
        props.onTempoChanged(value);
      }}
      value={tempo}
    />
  </View>
  );
};
