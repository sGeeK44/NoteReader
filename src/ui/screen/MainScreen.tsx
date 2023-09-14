import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MusicScoreView } from '../component/MusicScoreView';
import Metronome from '../../domain/services/Metronome';
import { SpeechRecognizer } from '../../domain/services/SpeechRecognizer';
import { useInjection } from 'inversify-react';
import { Symbols } from '../../config/symbols';
import { SoundPlayer } from 'app/domain/services/SoundPlayer';
import { RandomNoteGenerator } from 'app/domain/services/RandomNoteGenerator';
import { MusicScoreBuilder } from 'app/domain/services/MusicScoreBuilder';
import { Tempo } from 'app/domain/services/Tempo';
import { Checker } from 'app/domain/services/Checker';
import { TimeProvider } from 'app/domain/services/TimeProvider';

export const MainScreen = () => {
  const [tempo, setTempo] = useState<string>('60');
  const [speech, setSpeech] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const speechRecognition = useInjection<SpeechRecognizer>(
    Symbols.SpeechRecognizer,
  );
  const timeProvider = useInjection<TimeProvider>(
    Symbols.TimeProvider,
  );
  const soundPlayer = useInjection<SoundPlayer>(Symbols.SoundPlayer);
  const randomNoteGenerator = useInjection<RandomNoteGenerator>(
    Symbols.RandomNoteGenerator,
  );

  let currentMeasure = 1;
  let currentNote = 1;

  const metronome = new Metronome(soundPlayer);
  const musicScoreBuilder = new MusicScoreBuilder(randomNoteGenerator);
  const score = musicScoreBuilder.build({ measure: 20 });
  let checker = new Checker(timeProvider, new Tempo(parseInt(tempo, 10)))
  speechRecognition.init('fr-fr');
  speechRecognition.subscribe(value => {
    setSpeech('#' + value)
    const result = checker.check(value, {
      measure: currentMeasure,
      value: score.measures[currentMeasure - 1].notes[currentNote - 1].notehead,
      measurePosition: currentNote,
      scoreSignature: score.timeSignature
    });

    if (currentMeasure === score.measures.length && currentNote === score.timeSignature.beat) {
      metronome.stopPlay();
      speechRecognition.stop();
      setResult("WIN ! Congrat :)")
      return;
    }

    if (result) {
      currentNote++;
      if (currentNote > score.timeSignature.beat) {
        currentNote = 1;
        currentMeasure++;
      }
    }
    checker.start();
    currentNote = 1;
    currentMeasure = 1;
  });


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
      <TextInput
        style={styles.text}
        onChangeText={value => {
          setTempo(value);
          metronome.setNewTempo(new Tempo(parseInt(value, 10)));
          checker = new Checker(timeProvider, new Tempo(parseInt(tempo, 10)))
        }}
        value={tempo}
      />
      <Button
        title="Start"
        onPress={() => {
          metronome.startPlay();
          speechRecognition.start(
            '["do", "ré", "mi", "fa", "sol", "la", "si"]',
          );
          setTimeout(() => {
            checker.start();
          }, 4000);
        }}
      />
      <Button
        title="Stop"
        onPress={() => {
          metronome.stopPlay();
          speechRecognition.stop();
        }}
      />
      <Text style={styles.text}>{speech}</Text>
      <Text style={styles.text}>{result}</Text>
    </SafeAreaView>
  );
};
