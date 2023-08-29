import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, Text, TextInput, View} from 'react-native';
import {Formatter, Stave, StaveNote, Voice} from 'vexflow';
import {RNVexFlowSVGContext} from 'react-native-vexflow-canvas';
import Sound from 'react-native-sound';
import SpeechRecognizer from '../infrastructure/SpeechRecognizer';

export const MainScreen = () => {
  const [tempo, setTempo] = useState<string>('60');
  const [speech, setSpeech] = useState<string>('');
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
  const voiceRecognition = new SpeechRecognizer();
  useEffect(() => {
    voiceRecognition.loadModel('model-fr-fr');
    voiceRecognition.onResult(e => {
      console.log(e);
      setSpeech(speech + '#' + e);
    });
    voiceRecognition.onError(e => {
      console.log('EEEEE', e);
    });
  });
  const context = draw();

  return (
    <SafeAreaView>
      <View>{context.render()}</View>
      <TextInput
        style={{color: 'black'}}
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
          console.log('startlistening');
          voiceRecognition.start('["do", "ré", "mi", "fa", "sol", "la", "si"]');
        }}></Button>
      <Button
        title="Stop Lecture"
        onPress={() => {
          console.log('stop listening');
          voiceRecognition.stop();
        }}></Button>
      <Text style={{color: 'black'}}>{speech}</Text>
    </SafeAreaView>
  );
};

function draw() {
  const context = new RNVexFlowSVGContext(0, 0);
  const treble = new Stave(0, 0, 340);

  treble.setContext(context);
  treble.setClef('treble');
  treble.setTimeSignature('3/4');
  treble.draw();
  const stave = new Stave(0, 100, 340);

  stave.setContext(context);
  stave.setClef('bass');
  stave.setTimeSignature('3/4');
  stave.draw();
  context.svg.applyProps({
    width: 350,
    height: 250,
  });
  const notes = [
    new StaveNote({clef: 'treble', keys: ['c/4', 'e/4'], duration: 'q'}),
    new StaveNote({clef: 'treble', keys: ['d/4'], duration: 'q'}),
    new StaveNote({clef: 'treble', keys: ['b/4'], duration: 'qr'}),
    new StaveNote({clef: 'treble', keys: ['c/4', 'e/4', 'g/4'], duration: 'q'}),
  ];

  const voice = new Voice({num_beats: 4, beat_value: 4});
  voice.addTickables(notes);

  const formatter = new Formatter();
  formatter.joinVoices([voice]).formatToStave([voice], treble);
  voice.draw(context, treble);
  return context;
}
