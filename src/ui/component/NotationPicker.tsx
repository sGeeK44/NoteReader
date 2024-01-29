import { RadioButton } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Clef } from 'app/domain/services/MusicScoreBuilder';
import { Notes } from 'app/domain/services/Notes';
import { Notation } from 'app/domain/services/Notation';


interface NotationPickerProps {
  default: Notation,
  onSyllabicSelected: () => void;
  onAlphabetSelected: () => void;
}

export const NotationPicker = (props: NotationPickerProps) => {
  const [notation, setNotation] = useState<Notation>(props.default);

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 20,
    },
    inputWithLabel: { alignItems: 'center' },
    label: { color: 'black', fontSize: 25 },
    secondaryLabel: { color: 'black', fontSize: 12 },
  });

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Notation</Text>
      <View style={styles.inputWithLabel}>
        <Text style={styles.secondaryLabel}>Syllabique</Text>
        <RadioButton
          value={notation}
          status={notation == 'syllabic' ? 'checked' : 'unchecked'}

          onPress={() => {
            setNotation('syllabic')
            props.onSyllabicSelected();
          }}
        />
      </View>
      <View style={styles.inputWithLabel}>
        <Text style={styles.secondaryLabel}>Alphabetique</Text>
        <RadioButton
          value={notation}
          status={notation == 'alphabet' ? 'checked' : 'unchecked'}
          onPress={() => {
            setNotation('alphabet')
            props.onAlphabetSelected();
          }}
        />
      </View>
    </View>
  );
};
