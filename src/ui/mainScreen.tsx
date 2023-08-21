import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {Formatter, Stave, StaveNote, Voice} from 'vexflow';
import {RNVexFlowSVGContext} from 'react-native-vexflow-canvas';

export const MainScreen = () => {
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

  const formatter = new Formatter()
    .joinVoices([voice])
    .formatToStave([voice], treble);
  voice.draw(context, treble);

  return (
    <SafeAreaView>
      <View>{context.render()}</View>
    </SafeAreaView>
  );
};
