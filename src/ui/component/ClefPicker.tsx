import { IconButton, RadioButton } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Clef } from 'app/domain/services/MusicScoreBuilder';


interface ClefPickerProps {
  defaultClef: Clef,
  onClefsSelected: (selectedClef: Clef) => void;
}

export const ClefPicker = (props: ClefPickerProps) => {
  const [clef, setClef] = useState<Clef>(props.defaultClef);

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 20,
    },
    inputWithLabel: { alignItems: 'center' },
    label: { color: 'black', fontSize: 25 },
    sliderContainer: { width: '60%', alignItems: 'center' },
    slider: { width: '100%' },
  });

  const OnClefChange = (selectedClef: Clef) => {
    setClef(selectedClef);
    props.onClefsSelected(selectedClef);
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Clé</Text>
      <View style={styles.inputWithLabel}>
        <IconButton icon="music-clef-treble" />
        <RadioButton
          value="treble"
          status={clef === 'treble' ? 'checked' : 'unchecked'}
          onPress={() => OnClefChange('treble')}
        />
      </View>
      <View style={styles.inputWithLabel}>
        <IconButton icon="music-clef-bass" />
        <RadioButton
          value="bass"
          status={clef === 'bass' ? 'checked' : 'unchecked'}
          onPress={() => OnClefChange('bass')}
        />
      </View>
    </View>
  );
};
