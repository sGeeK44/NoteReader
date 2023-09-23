import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'app/App';
import { Button, IconButton, RadioButton, Text, TextInput } from 'react-native-paper';
import { Clef } from 'app/domain/services/MusicScoreBuilder';
import { Notation } from 'app/domain/services/Notation';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export const MainScreen = ({ navigation }: Props) => {
  const [tempo, setTempo] = useState<string>('60');
  const [nbMeasure, setNbMeasure] = useState<number | ''>(20);
  const [clef, setClef] = useState<Clef>('treble');
  const [notation, setNotation] = useState<Notation>('syllabic');

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'space-between',
    },
    row: { flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', margin: 20 },
    radioButtonGroup: { alignItems: 'center' },
    text: { color: 'black', fontSize: 25 }
  });
  return (
    <SafeAreaView style={styles.content}>
      <View>
        <View style={styles.row}>
          <Text style={styles.text} >Clé</Text>
          <View style={styles.radioButtonGroup}>
            <IconButton icon='music-clef-treble'></IconButton>
            <RadioButton
              value="treble"
              status={clef === 'treble' ? 'checked' : 'unchecked'}
              onPress={() => setClef('treble')}
            />
          </View>
          <View style={styles.radioButtonGroup}>
            <IconButton icon='music-clef-bass'></IconButton>
            <RadioButton
              value="bass"
              status={clef === 'bass' ? 'checked' : 'unchecked'}
              onPress={() => setClef('bass')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.text} >Notation</Text>
          <View style={styles.radioButtonGroup}>
            <Text>Syllabique</Text>
            <RadioButton
              value="syllabic"
              status={notation === 'syllabic' ? 'checked' : 'unchecked'}
              onPress={() => setNotation('syllabic')}
            />
          </View>
          <View style={styles.radioButtonGroup}>
            <Text>Alphabetique</Text>
            <RadioButton
              value="alphabet"
              status={notation === 'alphabet' ? 'checked' : 'unchecked'}
              onPress={() => setNotation('alphabet')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.text} >Tempo</Text>
          <TextInput
            right={<TextInput.Icon icon="metronome" />}
            onChangeText={value => setTempo(value)}
            value={tempo}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.text} >Nombre de mesure</Text>
          <TextInput
            onChangeText={value => {
              const parsed = parseInt(value, 10);
              if (isNaN(parsed)) {
                setNbMeasure('');
                return;
              }
              setNbMeasure(parsed)
            }}
            value={nbMeasure.toString()}
          />
        </View>
      </View>
      <Button
        icon="music"
        mode='contained'
        onPress={() => {
          navigation.navigate('TrainScreen', { tempo: parseInt(tempo, 10), nbMeasure: nbMeasure == '' ? 0 : nbMeasure, clef: clef, notation: notation });
        }}>
        Start
      </Button>
    </SafeAreaView>
  );
};
