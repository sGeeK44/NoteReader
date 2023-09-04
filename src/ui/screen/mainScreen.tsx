import React, { useMemo, useState } from 'react';
import { Button, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import Sound from 'react-native-sound';
import SpeechRecognizer from '../../infrastructure/SpeechRecognizer';
import { MusicScore } from '../component/MusicScore';

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
  let intervalId: NodeJS.Timeout;
  Sound.setCategory('Playback');
  var ding = new Sound('baguettes.mp3', Sound.MAIN_BUNDLE);
  function startPlay() {
    intervalId = setInterval(() => {
      ding.play();
    }, (parseInt(tempo) / 60) * 1000);
  }

  function stopPlay() {
    clearInterval(intervalId);
  }

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
        onChangeText={setTempo}
        value={tempo}></TextInput>
      <Button
        title="Start Play"
        onPress={() => {
          startPlay();
        }}></Button>
      <Button
        title="Stop Play"
        onPress={() => {
          stopPlay();
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
