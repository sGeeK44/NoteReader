import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MusicScoreBuilder } from 'app/domain/services/MusicScoreBuilder';
import { VexflowConverter } from 'app/vexflow/VexfloxConverter';
import { RnSvgContext } from 'app/vexflow/RnSvgContext';
import { Symbols } from 'app/config/symbols';
import { useInjection } from 'inversify-react';
import { RandomNoteGenerator } from 'app/domain/services/RandomNoteGenerator';

export const MusicScore = () => {
  const [svg, setSvg] = useState<ReactNode>();
  const randomNoteGenerator = useInjection<RandomNoteGenerator>(
    Symbols.RandomNoteGenerator,
  );
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
          const musicScoreBuilder = new MusicScoreBuilder(randomNoteGenerator);
          const score = musicScoreBuilder.build({ measure: 15 });
          const converter = new VexflowConverter();
          const context = new RnSvgContext(width, 2000);
          converter.toVexflow(context, score, { width: width - 2, stavePerLine: 5 });
          try {
            setSvg(context.render());
          } catch (error) {
            console.log(error);
          }
        }}>
        {svg}
      </View>
    </ScrollView>
  );
};
