import React, { ReactNode, useEffect, useState } from 'react';
import { Dimensions, View, StyleSheet, ScrollView } from 'react-native';
import { MusicScore } from 'app/domain/services/MusicScoreBuilder';
import { VexflowConverter } from 'app/vexflow/VexfloxConverter';
import { RnSvgContext } from 'app/vexflow/RnSvgContext';
import { Checker } from 'app/domain/services/Checker';
import { screen } from '@testing-library/react-native';
import { Voice } from 'vexflow';

export interface MusicScoreProps {
  context: RnSvgContext
  score: MusicScore;
  checker: Checker;
}

export const MusicScoreView = ({ score, checker }: MusicScoreProps) => {
  const [, updateState] = React.useState<{}>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [isLandscape, setIsLandscape] = useState<boolean>();
  const [width, setWidth] = useState<number>(0);
  const [context, setContext] = useState<RnSvgContext>();
  const [voices, setVoices] = useState<Voice[]>([]);
  const styles = StyleSheet.create({
    content: {
      backgroundColor: '#f2f2f2',
    },
  });


  const converter = new VexflowConverter();
  useEffect(() => {
    const dim = Dimensions.get('window');
    setIsLandscape(dim.width >= dim.height);
    Dimensions.addEventListener('change', ({ screen }) => {
      setIsLandscape(screen.width >= screen.height);
    });
  }, []);


  checker.onGoodNote((measure: number, note: number) => {
    const good = voices[measure - 1].getTickables()[note - 1];
    converter.setColorNote(good, "green");
    voices[measure - 1].draw(context);
    forceUpdate();
  });

  checker.onBadNote((measure: number, note: number) => {
    for (let i = 0; i < measure; i++) {
      for (let j = 0; j < note; j++) {
        console.log(i, j);
        const bad = voices[i].getTickables()[j];
        converter.setColorNote(bad, "black");
      }
      voices[i].draw(context);
      forceUpdate();
    }
  });

  return (
    <ScrollView>
      <View style={styles.content}
        onLayout={event => {
          const layout = event.nativeEvent.layout;
          setWidth(layout.width);
          const context = new RnSvgContext(layout.width, 1000);
          const voices = converter.toVexflow(score, {
            width: layout.width - 2,
            measurePerLine: isLandscape ? 5 : 2,
          });
          setVoices(voices);
          draw(context, voices);
          setContext(context);
        }}>
        {context?.render()}
      </View>
    </ScrollView>
  );
};

function draw(context: RnSvgContext | undefined, voices: Voice[]) {
  voices.forEach(voice => {
    const stave = voice.getStave();
    if (stave === undefined) {
      return;
    }
    stave.setContext(context);
    stave.draw();
    voice.draw(context);
  });
}