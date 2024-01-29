import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'app/App';
import { DictationScreenViewModel } from './DictationScreenViewModel';
import { Button } from 'react-native-paper';
import { ClefPicker } from 'app/ui/component/ClefPicker';
import { NotationPicker } from 'app/ui/component/NotationPicker';
import { TempoPicker } from 'app/ui/component/TempoPicker';
import { MeasurePicker } from 'app/ui/component/MeasurePicker';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const viewModel = new DictationScreenViewModel();

export const DictationScreen = ({ navigation }: Props) => {

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
          default={viewModel.notation}
          onSyllabicSelected={viewModel.onSyllabicSelected}
          onAlphabetSelected={viewModel.onAlphabetSelected} />
        <TempoPicker default={viewModel.tempo} onTempoChanged={viewModel.onTempoChanged} />
        <MeasurePicker default={viewModel.nbMeasure} OnNbMeasureChanged={viewModel.OnNbMeasureChanged} />
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
  )
};
