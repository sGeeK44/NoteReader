import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'app/App';
import {
  Button,
  Text,
  TextInput,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import {
  RhytmicNoteFigureMap,
} from 'app/domain/services/RhytmicNote';
import { ReadScreenViewModel } from './ReadScreenViewModel';
import { RhytmicChips } from 'app/ui/component/RhytmicChips';
import { useDisableBackButton } from '../../hook/navigation/useDisableBackButton';
import { ClefPicker } from '../../component/ClefPicker';
import { NotationPicker } from 'app/ui/component/NotationPicker';
import { TempoPicker } from 'app/ui/component/TempoPicker';
import { MeasurePicker } from 'app/ui/component/MeasurePicker';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const viewModel = new ReadScreenViewModel();

export const ReadScreen = ({ navigation }: Props) => {
  useDisableBackButton();
  const [nbMeasure, setNbMeasure] = useState<string>(viewModel.nbMeasure);
  const [accuracy, setAccuracy] = useState<number>(viewModel.accuracy);

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
        <NotationPicker
          default={viewModel.notations.syllabic}
          onSyllabicSelected={viewModel.onSyllabicSelected}
          onAlphabetSelected={viewModel.onAlphabetSelected} />
        <TempoPicker default={viewModel.tempo} onTempoChanged={viewModel.onTempoChanged} />
        <MeasurePicker default={viewModel.nbMeasure} OnNbMeasureChanged={viewModel.OnNbMeasureChanged} />
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
