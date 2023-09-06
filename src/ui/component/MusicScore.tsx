import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MusicScoreBuilder } from 'app/domain/services/MusicScoreBuilder';
import { VexflowConverter } from 'app/vexflow/VexfloxConverter';
import { RnSvgContext } from 'app/vexflow/RnSvgContext';

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
          const { width } = event.nativeEvent.layout;
          const scoreBuilder = new MusicScoreBuilder();
          const score = scoreBuilder.build();
          const converter = new VexflowConverter();
          const context = new RnSvgContext(width, 1000);
          converter.toVexflow(context, score, width - 2);
          setSvg(context.render());
        }}>
        {svg}
      </View>
    </ScrollView>
  );
};
