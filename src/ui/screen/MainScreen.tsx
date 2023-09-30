import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from 'app/App';
import {
  Button,
  IconButton,
  RadioButton,
  Text,
  TextInput,
} from 'react-native-paper';
import {Clef} from 'app/domain/services/MusicScoreBuilder';
import {Notation} from 'app/domain/services/Notation';
import Slider from '@react-native-community/slider';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export const MainScreen = ({navigation}: Props) => {
  const [tempo, setTempo] = useState<number | undefined>(60);
  const [nbMeasure, setNbMeasure] = useState<number | undefined>(6);
  const [clef, setClef] = useState<Clef>('treble');
  const [notation, setNotation] = useState<Notation>('syllabic');
  const [accuracy, setAccuracy] = useState<number>(300);

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
  });

  return (
    <SafeAreaView style={styles.content}>
      <ScrollView>
        <View style={styles.row}>
          <Text style={styles.label}>Clé</Text>
          <View style={styles.inputWithLabel}>
            <IconButton icon="music-clef-treble" />
            <RadioButton
              value="treble"
              status={clef === 'treble' ? 'checked' : 'unchecked'}
              onPress={() => setClef('treble')}
            />
          </View>
          <View style={styles.inputWithLabel}>
            <IconButton icon="music-clef-bass" />
            <RadioButton
              value="bass"
              status={clef === 'bass' ? 'checked' : 'unchecked'}
              onPress={() => setClef('bass')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Notation</Text>
          <View style={styles.inputWithLabel}>
            <Text style={styles.secondaryLabel}>Syllabique</Text>
            <RadioButton
              value="syllabic"
              status={notation === 'syllabic' ? 'checked' : 'unchecked'}
              onPress={() => setNotation('syllabic')}
            />
          </View>
          <View style={styles.inputWithLabel}>
            <Text style={styles.secondaryLabel}>Alphabetique</Text>
            <RadioButton
              value="alphabet"
              status={notation === 'alphabet' ? 'checked' : 'unchecked'}
              onPress={() => setNotation('alphabet')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tempo</Text>
          <TextInput
            right={<TextInput.Icon icon="metronome" />}
            onChangeText={value => {
              const parsed = parseInt(value, 10);
              if (isNaN(parsed)) {
                setTempo(undefined);
                return;
              }
              setTempo(parsed);
            }}
            value={tempo?.toString()}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre de mesure</Text>
          <TextInput
            onChangeText={value => {
              const parsed = parseInt(value, 10);
              if (isNaN(parsed)) {
                setNbMeasure(undefined);
                return;
              }
              setNbMeasure(parsed);
            }}
            value={nbMeasure?.toString()}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Précision</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.secondaryLabel}>{accuracy} ms</Text>
            <Slider
              style={styles.slider}
              onValueChange={setAccuracy}
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
          navigation.navigate('TrainScreen', {
            tempo: tempo ?? 60,
            nbMeasure: nbMeasure ?? 0,
            clef: clef,
            notation: notation,
            accuracy: accuracy,
          });
        }}>
        Start
      </Button>
    </SafeAreaView>
  );
};
