import { IconButton, RadioButton } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Clef, Measure, MusicScore } from 'app/domain/services/MusicScoreBuilder';
import { RnSvgContext } from 'app/vexflow/RnSvgContext';
import { VexflowConverter, VexflowScore } from 'app/vexflow/VexfloxConverter';


interface ClefPickerProps {
  defaultClef: Clef,
  onClefsSelected: (selectedClef: Clef) => void;
}

function drawScore(score: RnSvgContext, width: number, clef: Clef) {
  const converter = new VexflowConverter();
  score.clear();
  const stave = converter.createStave(0, 0, width - 2, clef);
  stave.setContext(score)
  stave.draw()
}

export const ClefPicker = (props: ClefPickerProps) => {
  const [width, setWidth] = useState<number>(0);
  const [clef, setClef] = useState<Clef>(props.defaultClef);
  const [score,] = useState<RnSvgContext>(new RnSvgContext(width, 100));

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    inputWithLabel: {
      flexDirection: 'row', alignItems: 'center'
    },
    label: { color: 'black', fontSize: 25 },
    sliderContainer: { width: '60%', alignItems: 'center' },
    slider: { width: '100%' },
  });

  const OnClefChange = (selectedClef: Clef) => {
    setClef(selectedClef);
    drawScore(score, width, selectedClef);
    props.onClefsSelected(selectedClef);
  };


  return (
    <View onLayout={event => {
      const layout = event.nativeEvent.layout;
      drawScore(score, layout.width, clef)
      setWidth(layout.width);
      score.setWidth(layout.width)
    }}>
      <View style={styles.row}>
        <Text style={styles.label}>Clé</Text>
        <View style={styles.inputWithLabel}>
          <IconButton icon="music-clef-treble" />
          <RadioButton
            value="treble"
            status={clef === 'treble' ? 'checked' : 'unchecked'}
            onPress={() => OnClefChange('treble')}
          />
        </View>
        <View style={styles.inputWithLabel}>
          <IconButton icon="music-clef-bass" />
          <RadioButton
            value="bass"
            status={clef === 'bass' ? 'checked' : 'unchecked'}
            onPress={() => OnClefChange('bass')}
          />
        </View>
      </View>
      <View>
        {score?.render()}
      </View>
    </View>
  );
};
