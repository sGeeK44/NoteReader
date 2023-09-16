import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MusicScore } from 'app/domain/services/MusicScoreBuilder';
import { VexflowConverter } from 'app/vexflow/VexfloxConverter';
import { RnSvgContext } from 'app/vexflow/RnSvgContext';

export interface MusicScoreProps {
  score: MusicScore
}

export const MusicScoreView = ({ score }: MusicScoreProps) => {
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
          const { width } = event.nativeEvent.layout;
          const measurePerLine = 5;
          const converter = new VexflowConverter();
          const context = new RnSvgContext(width, 1000);

          console.log("To vexflow", score);
          converter.toVexflow(context, score, { width: width - 2, measurePerLine: measurePerLine });
          try {
            setSvg(context.render());
          } catch (error) {
            console.error(error);
          }
        }}>
        {svg}
      </View>
    </ScrollView>
  );
};
