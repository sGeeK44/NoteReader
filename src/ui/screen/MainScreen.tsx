import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {MusicScore} from '../component/MusicScore';
import Metronome from '../../domain/services/Metronome';
import {SpeechRecognizer} from '../../domain/services/SpeechRecognizer';
import {useInjection} from 'inversify-react';
import {Symbols} from '../../config/symbols';
import {SoundPlayer} from 'app/domain/services/SoundPlayer';

export const MainScreen = () => {
  const [tempo, setTempo] = useState<string>('60');
  const [speech, setSpeech] = useState<string>('');
  const speechRecognition = useInjection<SpeechRecognizer>(
    Symbols.SpeechRecognizer,
  );
  speechRecognition.init('fr-fr');
  speechRecognition.subscribe(value => setSpeech('#' + value));
  const soundPlayer = useInjection<SoundPlayer>(Symbols.SoundPlayer);
  const metronome = new Metronome(soundPlayer);

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    score: {
      flex: 1,
      paddingHorizontal: 10,
    },
    text: {color: 'black', fontSize: 25},
  });
  return (
    <SafeAreaView style={styles.content}>
      <View style={styles.score}>
        <MusicScore />
      </View>
      <TextInput
        style={styles.text}
        onChangeText={value => {
          setTempo(value);
          metronome.setNewTempo(parseInt(value, 10));
        }}
        value={tempo}
      />
      <Button
        title="Start Play"
        onPress={() => {
          metronome.startPlay();
        }}
      />
      <Button
        title="Stop Play"
        onPress={() => {
          metronome.stopPlay();
        }}
      />
      <Button
        title="Lecture"
        onPress={() => {
          speechRecognition.start(
            '["do", "ré", "mi", "fa", "sol", "la", "si"]',
          );
        }}
      />
      <Button
        title="Stop Lecture"
        onPress={() => {
          speechRecognition.stop();
        }}
      />
      <Text style={styles.text}>{speech}</Text>
    </SafeAreaView>
  );
};
