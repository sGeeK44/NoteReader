import React, {ReactNode, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {BarNote, Flow, Formatter, Stave, StaveNote, Voice} from 'vexflow';
import {RnSvgContext} from './RnSvgContext';

export const MusicScore = () => {
  const [svg, setSvg] = useState<ReactNode>();
  const styles = StyleSheet.create({
    content: {
      backgroundColor: '#f2f2f2',
    },
  });
  return (
    <ScrollView>
      <View
        style={styles.content}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          const context = new RnSvgContext(width, 1000);
          draw(width, context);
          setSvg(context.render());
        }}>
        {svg}
      </View>
    </ScrollView>
  );
};

function draw(width: number, context: RnSvgContext) {
  const w = width - 2;
  const treble = new Stave(0, 0, w);

  treble.setContext(context);
  treble.setClef('treble');
  treble.setTimeSignature('3/4');
  treble.draw();
  drawStave(100, width, context);
  drawStave(200, width, context);
  drawStave(300, width, context);
  drawStave(400, width, context);
  drawStave(500, width, context);
  drawStave(600, width, context);
  drawStave(700, width, context);
  drawStave(800, width, context);
}

function drawStave(y: number, width: number, context: RnSvgContext) {
  const stave = new Stave(0, y, width);
  stave.setContext(context);
  stave.draw();
  const voice = new Voice({
    num_beats: 4,
    beat_value: 4,
    resolution: Flow.RESOLUTION,
  });
  const notes = [
    new StaveNote({clef: 'treble', keys: ['c/4'], duration: '8'}),
    new StaveNote({clef: 'treble', keys: ['c/4'], duration: '8'}),
    new StaveNote({clef: 'treble', keys: ['c/4'], duration: '8'}),
    new StaveNote({clef: 'treble', keys: ['c/4'], duration: '8'}),
    new StaveNote({clef: 'treble', keys: ['c/4'], duration: '8'}),
    new StaveNote({clef: 'treble', keys: ['c/4'], duration: '8'}),
    new StaveNote({clef: 'treble', keys: ['c/4'], duration: '8'}),
    new StaveNote({clef: 'treble', keys: ['c/4'], duration: '8'}),
  ];
  voice.addTickables([...notes, new BarNote()]);

  const formatter = new Formatter();
  formatter
    .joinVoices([voice])
    .formatToStave([voice], stave, {auto_beam: true});
  voice.draw(context, stave);
}
