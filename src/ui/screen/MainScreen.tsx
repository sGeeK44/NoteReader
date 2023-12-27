import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'app/App';
import {
  Button,
  IconButton,
  RadioButton,
  Text,
  TextInput,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import {
  RhytmicNote,
  RhytmicNoteFigureMap,
} from 'app/domain/services/RhytmicNote';
import { MainScreenViewModel } from './MainScreenViewModel';
import { RhytmicChips } from 'app/ui/component/RhytmicChips';
import { Clef } from 'app/domain/services/MusicScoreBuilder';
import { Notation } from 'app/domain/services/Notation';
import { useDisableBackButton } from '../hook/navigation/useDisableBackButton';
import { ClefPicker } from '../component/ClefPicker';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export const MainScreen = ({ navigation }: Props) => {
  useDisableBackButton();
  const rhytmics = [...RhytmicNoteFigureMap.keys()];
  const viewModel = new MainScreenViewModel();
  [viewModel.rhytmics, viewModel.setRhytmics] = useState<RhytmicNote[]>(["quarter"]);
  [viewModel.tempo, viewModel.setTempo] = useState<string>('60');
  [viewModel.nbMeasure, viewModel.setNbMeasure] = useState<string>('6');
  [viewModel.clef, viewModel.setClef] = useState<Clef>('treble');
  [viewModel.notation, viewModel.setNotation] = useState<Notation>('syllabic');
  [viewModel.accuracy, viewModel.setAccuracy] = useState<number>(500);

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
        <ClefPicker defaultClef='treble' onClefsSelected={viewModel.setClef} />
        <View style={styles.row}>
          <Text style={styles.label}>Notation</Text>
          <View style={styles.inputWithLabel}>
            <Text style={styles.secondaryLabel}>Syllabique</Text>
            <RadioButton
              value={viewModel.notations.syllabic}
              status={viewModel.isSyllabicChecked}
              onPress={() => viewModel.onSyllabicSelected()}
            />
          </View>
          <View style={styles.inputWithLabel}>
            <Text style={styles.secondaryLabel}>Alphabetique</Text>
            <RadioButton
              value={viewModel.notations.alphabet}
              status={viewModel.isAlphabetChecked}
              onPress={() => viewModel.onAlphabetSelected()}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tempo</Text>
          <TextInput
            right={<TextInput.Icon icon="metronome" />}
            onChangeText={value => viewModel.onTempoChanged(value)}
            value={viewModel.tempo}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre de mesure</Text>
          <TextInput
            onChangeText={value => viewModel.OnNbMeasureChanged(value)}
            value={viewModel.nbMeasure}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Rythme</Text>
          <View style={styles.chips}>
            {rhytmics.map(rhytmicNoteFigure => (
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
            <Text style={styles.secondaryLabel}>{viewModel.accuracy} ms</Text>
            <Slider
              style={styles.slider}
              onValueChange={viewModel.setAccuracy}
              value={viewModel.accuracy}
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
          navigation.navigate('TrainScreen', {
            tempo: viewModel.validTempoOrDefault,
            nbMeasure: viewModel.validNbMeasureOrDefault,
            clef: viewModel.clef,
            notation: viewModel.notation,
            accuracy: viewModel.accuracy,
            rhytmics: viewModel.validRhytmicsOrDefault,
          });
        }}>
        Start
      </Button>
    </SafeAreaView>
  );
};
