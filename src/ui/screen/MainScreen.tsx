import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'app/App';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { Clef } from 'app/domain/services/MusicScoreBuilder';

export interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export const MainScreen = ({ navigation }: Props) => {
  const [tempo, setTempo] = useState<string>('60');
  const [nbMeasure, setNbMeasure] = useState<number | ''>(20);
  const [clef, setClef] = useState<Clef>('treble');

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'space-between',
    },
    row: { flexDirection: 'row', justifyContent: "space-between", margin: 20 },
    text: { color: 'black', fontSize: 25 }
  });
  return (
    <SafeAreaView style={styles.content}>
      <View>
        <SegmentedButtons
          value={clef}
          onValueChange={value => setClef(value as Clef)}
          buttons={[
            {
              icon: 'music-clef-treble',
              value: 'treble',
              label: 'Sol',
            },
            {
              icon: 'music-clef-treble',
              value: 'bass',
              label: 'Fa',
            },
          ]}
        />
        <View style={styles.row}>
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
          navigation.navigate('TrainScreen', { tempo: parseInt(tempo, 10), nbMeasure: nbMeasure == '' ? 0 : nbMeasure, clef: clef });
        }}>
        Start
      </Button>
    </SafeAreaView>
  );
};
