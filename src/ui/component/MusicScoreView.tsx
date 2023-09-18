import React, { useEffect, useState } from 'react';
import { Dimensions, View, StyleSheet, ScrollView, Text } from 'react-native';
import { MusicScore } from 'app/domain/services/MusicScoreBuilder';
import { VexflowConverter, VexflowScore } from 'app/vexflow/VexfloxConverter';
import { RnSvgContext } from 'app/vexflow/RnSvgContext';
import { Checker } from 'app/domain/services/Checker';

export interface MusicScoreProps {
  score: MusicScore;
  checker: Checker;
}

export const MusicScoreView = ({ score, checker }: MusicScoreProps) => {
  const [, updateState] = React.useState<{}>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [isLandscape, setIsLandscape] = useState<boolean>();
  const [rawContext, setRawContext] = useState<RnSvgContext>();
  const [resultContext, setResultContext] = useState<RnSvgContext>();
  const [vexflowScore, setvexflowScore] = useState<VexflowScore>();
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
    vexflowScore?.drawGoodNote(resultContext, measure, note);
    forceUpdate();
  });

  checker.onBadNote((measure: number, note: number) => {
    resultContext?.clear();
    for (let i = 1; i <= measure; i++) {
      vexflowScore?.resetNote(resultContext, i);
    }
    vexflowScore?.drawBadNote(resultContext, measure, note);
    forceUpdate();
  });

  return (
    <ScrollView>
      <View style={styles.content}
        onLayout={event => {
          const layout = event.nativeEvent.layout;
          const rawContext = new RnSvgContext(layout.width, 1000);
          const resultContext = new RnSvgContext(layout.width, 1000);
          console.log(resultContext.render());
          const vexflowScore = converter.toVexflow(score, {
            width: layout.width - 2,
            measurePerLine: isLandscape ? 5 : 2,
          });
          vexflowScore?.draw(rawContext);

          setvexflowScore(vexflowScore);
          setRawContext(rawContext);
          setResultContext(resultContext);
        }}>
        <View>{rawContext?.render()}</View>
        <View style={{ position: 'absolute' }}>{resultContext?.render()}</View>
      </View>
    </ScrollView >
  );
};
