import React, { ReactNode, useState } from 'react';
import { Dimensions, View, StyleSheet, ScrollView } from 'react-native';
import { MusicScore } from 'app/domain/services/MusicScoreBuilder';
import { VexflowConverter } from 'app/vexflow/VexfloxConverter';
import { RnSvgContext } from 'app/vexflow/RnSvgContext';

export interface MusicScoreProps {
  score: MusicScore
}

export const MusicScoreView = ({ score }: MusicScoreProps) => {
  let measurePerLine: number;
  const [svg, setSvg] = useState<ReactNode>();
  const styles = StyleSheet.create({
    content: {
      backgroundColor: '#f2f2f2',
    },
  });

  const dim = Dimensions.get("screen")
  measurePerLine = dim.width >= dim.height ? 5 : 2;

  Dimensions.addEventListener('change', ({ screen: { width, height } }) => {
    measurePerLine = width >= height ? 5 : 2;
  })
  return (
    <ScrollView>
      <View
        style={styles.content}
        onLayout={event => {
          const { width } = event.nativeEvent.layout;
          const converter = new VexflowConverter();
          const context = new RnSvgContext(width, 1000);
          converter.toVexflow(context, score, { width: width - 2, measurePerLine: measurePerLine });
          setSvg(context.render());
        }}>
        {svg}
      </View>
    </ScrollView>
  );
};
