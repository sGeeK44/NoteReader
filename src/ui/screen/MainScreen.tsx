import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from 'app/App';
import {
  Button,
  Chip,
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
import {MainScreenViewModel} from './MainScreenViewModel';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export const MainScreen = ({navigation}: Props) => {
  const rhytmics = [...RhytmicNoteFigureMap.keys()];
  const viewModel = MainScreenViewModel();

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
    inputWithLabel: {alignItems: 'center'},
    label: {color: 'black', fontSize: 25},
    secondaryLabel: {color: 'black', fontSize: 12},
    sliderContainer: {width: '60%', alignItems: 'center'},
    slider: {width: '100%'},
    chips: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
    chip: {margin: 5},
  });

  function getName(rhytmicFigures: RhytmicNote): string {
    switch (rhytmicFigures) {
      case 'quarter':
        return 'Noire';
      case 'half':
        return 'Blanche';
      case 'half-dotted':
        return 'Blanche pointée';
      case 'whole':
        return 'Ronde';
      case 'double-eighth':
        return 'Double croche';
      case 'eighth-dotted-double':
        return 'Croche pointé double';
      case 'four-double-eighth':
        return 'Quatre double croche';
      case 'quarter-dotted-eighth':
        return 'Noire pointée croche';
    }
  }

  return (
    <SafeAreaView style={styles.content}>
      <ScrollView>
        <View style={styles.row}>
          <Text style={styles.label}>Clé</Text>
          <View style={styles.inputWithLabel}>
            <IconButton icon="music-clef-treble" />
            <RadioButton
              value="treble"
              status={viewModel.clef === 'treble' ? 'checked' : 'unchecked'}
              onPress={() => viewModel.setClef('treble')}
            />
          </View>
          <View style={styles.inputWithLabel}>
            <IconButton icon="music-clef-bass" />
            <RadioButton
              value="bass"
              status={viewModel.clef === 'bass' ? 'checked' : 'unchecked'}
              onPress={() => viewModel.setClef('bass')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Notation</Text>
          <View style={styles.inputWithLabel}>
            <Text style={styles.secondaryLabel}>Syllabique</Text>
            <RadioButton
              value={viewModel.notations.syllabic}
              status={viewModel.isSyllabicChecked}
              onPress={viewModel.onSyllabicSelected}
            />
          </View>
          <View style={styles.inputWithLabel}>
            <Text style={styles.secondaryLabel}>Alphabetique</Text>
            <RadioButton
              value={viewModel.notations.alphabet}
              status={viewModel.isAlphabetChecked}
              onPress={viewModel.onAlphabetSelected}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tempo</Text>
          <TextInput
            right={<TextInput.Icon icon="metronome" />}
            onChangeText={viewModel.onTempoChanged}
            value={viewModel.tempo?.toString()}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre de mesure</Text>
          <TextInput
            onChangeText={value => {
              const parsed = parseInt(value, 10);
              if (isNaN(parsed)) {
                viewModel.setNbMeasure(undefined);
                return;
              }
              viewModel.setNbMeasure(parsed);
            }}
            value={viewModel.nbMeasure?.toString()}
          />
        </View>
        <View style={styles.chips}>
          {rhytmics.map(rhytmicNoteFigure => (
            <Chip
              key={rhytmicNoteFigure}
              style={styles.chip}
              mode="flat"
              onPress={() => console.log('Pressed')}>
              {getName(rhytmicNoteFigure)}
            </Chip>
          ))}
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
            tempo: viewModel.tempo ?? 60,
            nbMeasure: viewModel.nbMeasure ?? 0,
            clef: viewModel.clef,
            notation: viewModel.notation,
            accuracy: viewModel.accuracy,
          });
        }}>
        Start
      </Button>
    </SafeAreaView>
  );
};
