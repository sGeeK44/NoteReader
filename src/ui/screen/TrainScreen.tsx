import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { MusicScoreView } from '../component/MusicScoreView';
import { SpeechRecognizer } from '../../domain/services/SpeechRecognizer';
import { MusicScoreBuilder } from 'app/domain/services/MusicScoreBuilder';
import { Checker } from 'app/domain/services/Checker';
import { Symbols } from 'app/config/symbols';
import { Tempo } from 'app/domain/services/Tempo';
import { TimeProvider } from 'app/domain/services/TimeProvider';
import { useInjection } from 'inversify-react';
import { RandomNoteGenerator } from 'app/domain/services/RandomNoteGenerator';
import { Metronome } from 'app/domain/services/Metronome';
import { RootStackParamList } from 'app/App';
import { RouteProp } from "@react-navigation/native"
import { TimeChecker } from 'app/domain/services/TimeChecker';

interface Props {
  route: RouteProp<RootStackParamList, 'TrainScreen'>;
}

export const TrainScreen = ({ route }: Props) => {
  const speechRecognition = useInjection<SpeechRecognizer>(Symbols.SpeechRecognizer);
  const timeProvider = useInjection<TimeProvider>(Symbols.TimeProvider);
  const metronome = useInjection<Metronome>(Symbols.Metronome);
  metronome.init("baguettes")
  const randomNoteGenerator = useInjection<RandomNoteGenerator>(Symbols.RandomNoteGenerator);

  const musicScoreBuilder = new MusicScoreBuilder(randomNoteGenerator);
  const score = musicScoreBuilder.build({ measure: 10 });
  speechRecognition.init('fr-fr');

  const { tempo } = route.params;
  const checker = new Checker(timeProvider, score, new Tempo(tempo))

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    score: {
      flex: 1,
      paddingHorizontal: 10,
    },
    text: { color: 'black', fontSize: 25 },
  });

  return (
    <SafeAreaView style={styles.content}>
      <View style={styles.score}>
        <MusicScoreView score={score} />
      </View>
      <Button
        title="Start"
        onPress={() => {
          console.log(tempo);
          metronome.play(tempo);
          const timeChecker = new TimeChecker(timeProvider);
          timeChecker.start();
          speechRecognition?.subscribe(value => {
            const result = checker?.next(value)
            console.log(result);
          });
          speechRecognition?.start(
            '["do", "ré", "mi", "fa", "sol", "la", "si"]',
          );
          checker?.start();
        }}
      />
      <Button
        title="Stop"
        onPress={() => {
          console.log(Date.now())
          metronome.stop();
          speechRecognition?.stop();
        }}
      />
    </SafeAreaView>
  );
};
