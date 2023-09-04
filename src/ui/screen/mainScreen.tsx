import React, { useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { MusicScore } from '../component/MusicScore';
import Metronome from '../../infrastructure/AndroidMetronome';
import { SpeechRecognizer } from '../../domain/services/SpeechRecognizer';
import { useInjection } from 'inversify-react';
import { Symbols } from '../../config/symbols';

export const MainScreen = () => {
  const [tempo, setTempo] = useState<string>('60');
  const [speech, setSpeech] = useState<string>('');
  const speechRecognition = useInjection<SpeechRecognizer>(Symbols.SpeechRecognizer);
  speechRecognition.init('fr-fr');
  speechRecognition.subscribe(value => setSpeech('#' + value));
  const metronome = new Metronome();

  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent: 'flex-end',
    }}>
      <View style={{
        flex: 1,
        paddingHorizontal: 10
      }}>
        <MusicScore />
      </View>
      <TextInput
        style={{ color: 'black' }}
        onChangeText={value => {
          setTempo(value);
          metronome.setNewTempo(parseInt(value));
        }}
        value={tempo}></TextInput>
      <Button
        title="Start Play"
        onPress={() => {
          metronome.startPlay();
        }}></Button>
      <Button
        title="Stop Play"
        onPress={() => {
          metronome.stopPlay();
        }}></Button>
      <Button
        title="Lecture"
        onPress={() => {
          speechRecognition.start('["do", "ré", "mi", "fa", "sol", "la", "si"]');
        }}></Button>
      <Button
        title="Stop Lecture"
        onPress={() => {
          speechRecognition.stop();
        }}></Button>
      <Text style={{ color: 'black', fontSize: 25 }}>{speech}</Text>
    </SafeAreaView>
  );
};
