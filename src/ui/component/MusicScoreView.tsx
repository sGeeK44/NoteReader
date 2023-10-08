import React, {useEffect, useState} from 'react';
import {Dimensions, View, StyleSheet, ScrollView} from 'react-native';
import {MusicScore} from 'app/domain/services/MusicScoreBuilder';
import {VexflowConverter, VexflowScore} from 'app/vexflow/VexfloxConverter';
import {RnSvgContext} from 'app/vexflow/RnSvgContext';
import {Checker} from 'app/domain/services/Checker';

export interface MusicScoreProps {
  score: MusicScore;
  checker: Checker;
}

export const MusicScoreView = ({score, checker}: MusicScoreProps) => {
  const [, updateState] = React.useState<object>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [isLandscape, setIsLandscape] = useState<boolean>();
  const [scoreSvg] = useState<RnSvgContext>(new RnSvgContext(0, 1000));
  const [feedbackSvg] = useState<RnSvgContext>(new RnSvgContext(0, 1000));
  const [vexflowScore, setVexflowScore] = useState<VexflowScore>();
  const styles = StyleSheet.create({
    content: {
      backgroundColor: '#f2f2f2',
    },
    feedbackScore: {position: 'absolute'},
  });

  const converter = new VexflowConverter();
  useEffect(() => {
    const dim = Dimensions.get('window');
    setIsLandscape(dim.width >= dim.height);
    Dimensions.addEventListener('change', ({screen}) => {
      setIsLandscape(screen.width >= screen.height);
    });
  }, []);

  checker.onGoodNote((measure: number, note: number) => {
    vexflowScore?.drawGoodNote(feedbackSvg, measure, note);
    forceUpdate();
  });

  checker.onBadNote(
    (
      measure: number,
      note: number,
      result: 'TO_EARLY' | 'TO_LATE' | 'BAD_NOTE',
    ) => {
      feedbackSvg?.clear();
      for (let i = 0; i <= measure; i++) {
        vexflowScore?.resetNote(feedbackSvg, i);
      }

      const color = getColor(result);
      vexflowScore?.drawNote(feedbackSvg, measure, note, color);
      forceUpdate();
    },
  );

  return (
    <ScrollView>
      <View
        style={styles.content}
        onLayout={event => {
          const layout = event.nativeEvent.layout;
          scoreSvg.clear();
          scoreSvg.setWidth(layout.width);
          feedbackSvg.setWidth(layout.width);
          const vfScore = converter.toVexflow(score, {
            width: layout.width - 2,
            measurePerLine: isLandscape ? 2 : 1,
          });
          vfScore?.draw(scoreSvg);
          setVexflowScore(vfScore);
        }}>
        <View>{scoreSvg?.render()}</View>
        <View style={styles.feedbackScore}>{feedbackSvg?.render()}</View>
      </View>
    </ScrollView>
  );
};

function getColor(result: 'TO_EARLY' | 'TO_LATE' | 'BAD_NOTE') {
  switch (result) {
    case 'TO_EARLY':
      return 'lightblue';
    case 'TO_LATE':
      return 'yellow';
    case 'BAD_NOTE':
      return 'red';
    default:
      return 'black';
  }
}
