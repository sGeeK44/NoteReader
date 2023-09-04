import React, { useMemo, useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import SpeechRecognizer from '../../infrastructure/SpeechRecognizer';
import { MusicScore } from '../component/MusicScore';
import Metronome from '../../infrastructure/Metronome';

const metronome = new Metronome();
const voiceRecognition = new SpeechRecognizer();
voiceRecognition.loadModel('model-fr-fr');

export const MainScreen = () => {
  const [tempo, setTempo] = useState<string>('60');
  const [speech, setSpeech] = useState<string>('');
  useMemo(() => {
    voiceRecognition.onResult(e => {
      setSpeech('#' + e);
    });
  }, [voiceRecognition]);

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
          voiceRecognition.start('["do", "ré", "mi", "fa", "sol", "la", "si"]');
        }}></Button>
      <Button
        title="Stop Lecture"
        onPress={() => {
          voiceRecognition.stop();
        }}></Button>
      <Text style={{ color: 'black', fontSize: 25 }}>{speech}</Text>
    </SafeAreaView>
  );
};
