import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'app/App';
import {
  Button,
  RadioButton,
  Text,
  TextInput,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import {
  RhytmicNoteFigureMap,
} from 'app/domain/services/RhytmicNote';
import { MainScreenViewModel } from './MainScreenViewModel';
import { RhytmicChips } from 'app/ui/component/RhytmicChips';
import { useDisableBackButton } from '../hook/navigation/useDisableBackButton';
import { ClefPicker } from '../component/ClefPicker';
import { Notation } from 'app/domain/services/Notation';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const viewModel = new MainScreenViewModel();

export const MainScreen = ({ navigation }: Props) => {
  useDisableBackButton();
  const [tempo, setTempo] = useState<string>(viewModel.tempo);
  const [nbMeasure, setNbMeasure] = useState<string>(viewModel.nbMeasure);
  const [accuracy, setAccuracy] = useState<number>(viewModel.accuracy);
  const [notation, setNotation] = useState<Notation>(viewModel.notation);

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 20,
    },
    inputWithLabel: { alignItems: 'center' },
    label: { color: 'black', fontSize: 25 },
    secondaryLabel: { color: 'black', fontSize: 12 },
    sliderContainer: { width: '60%', alignItems: 'center' },
    slider: { width: '100%' },
    chips: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
  });

  return (
    <SafeAreaView style={styles.content}>
      <ScrollView>
        <ClefPicker
          defaultClef={viewModel.clef}
          onClefsSelected={value => {
            viewModel.onClefChanged(value);
          }}
          onNoteRangeChange={viewModel.onNoteRangeChange}
          getMinDefaultNote={viewModel.getMinDefaultNote}
          getMaxDefaultNote={viewModel.getMaxDefaultNote} />
        <View style={styles.row}>
          <Text style={styles.label}>Notation</Text>
          <View style={styles.inputWithLabel}>
            <Text style={styles.secondaryLabel}>Syllabique</Text>
            <RadioButton
              value={viewModel.notations.syllabic}
              status={notation == 'syllabic' ? 'checked' : 'unchecked'}
              onPress={() => {
                viewModel.onSyllabicSelected();
                setNotation('syllabic')
              }}
            />
          </View>
          <View style={styles.inputWithLabel}>
            <Text style={styles.secondaryLabel}>Alphabetique</Text>
            <RadioButton
              value={viewModel.notations.alphabet}
              status={notation == 'alphabet' ? 'checked' : 'unchecked'}
              onPress={() => {
                viewModel.onAlphabetSelected();
                setNotation('alphabet')
              }}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tempo</Text>
          <TextInput
            right={<TextInput.Icon icon="metronome" />}
            onChangeText={value => {
              viewModel.onTempoChanged(value);
              setTempo(value);
            }}
            value={tempo}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre de mesure</Text>
          <TextInput
            onChangeText={value => {
              viewModel.OnNbMeasureChanged(value)
              setNbMeasure(value);
            }}
            value={nbMeasure}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Rythme</Text>
          <View style={styles.chips}>
            {[...RhytmicNoteFigureMap.keys()].map(rhytmicNoteFigure => (
              <RhytmicChips
                key={rhytmicNoteFigure}
                value={rhytmicNoteFigure}
                onSelected={() => {
                  viewModel.OnRhytmicSelected(rhytmicNoteFigure);
                }}
                onUnselected={() => {
                  viewModel.OnRhytmicUnselected(rhytmicNoteFigure);
                }}
              />
            ))}
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Précision</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.secondaryLabel}>{accuracy} ms</Text>
            <Slider
              style={styles.slider}
              onValueChange={value => {
                viewModel.onAccuracyChanged(value);
                setAccuracy(value);
              }}
              value={accuracy}
              step={50}
              minimumValue={0}
              maximumValue={2000}
            />
          </View>
        </View>
      </ScrollView>
      <Button
        icon="music"
        mode="contained"
        onPress={() => {
          viewModel.onValidate(navigation);
        }}>
        Start
      </Button>
    </SafeAreaView>
  );
};
