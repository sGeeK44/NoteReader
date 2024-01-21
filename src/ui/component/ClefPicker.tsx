import { IconButton, RadioButton } from 'react-native-paper';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clef } from 'app/domain/services/MusicScoreBuilder';
import { Notes, getAbsoluteIndex, getIndexFromAbsoluteIndex, getNoteFromAbsoluteIndex, getRange } from 'app/domain/services/Notes';
import { RnSvgContext } from 'app/vexflow/RnSvgContext';
import { VexflowConverter } from 'app/vexflow/VexfloxConverter';
import Slider, { LabelProps, SliderValue } from "react-native-a11y-slider";
import { SyllabicNotations } from 'app/domain/services/Notation';


interface ClefPickerProps {
  defaultClef: Clef,
  onClefsSelected: (selectedClef: Clef) => void;
  onNoteRangeChange: (noteRange: [Notes, Notes]) => void;
  getMinDefaultNote: (clef: Clef) => Notes;
  getMaxDefaultNote: (clef: Clef) => Notes;
}

function drawScore(score: RnSvgContext, width: number, clef: Clef, min: Notes, max: Notes) {
  const converter = new VexflowConverter();
  score.clear();
  const notes = getRange(min, max);
  const [voice, _] = converter.createLine(clef, null, notes, 0, 0, width - 2);
  const stave = voice.getStave();
  stave?.setContext(score)
  stave?.draw()
  voice.setContext(score).draw()
}

function ThumbSlider() {
  return (
    <View
      style={{
        backgroundColor: "black",
        height: ThumbSlider.size,
        width: ThumbSlider.size,
        borderRadius: ThumbSlider.size / 2
      }}
    />
  );
}
ThumbSlider.size = 24;

function LabelSlider({
  position,
  style,
  textStyle,
}: LabelProps) {
  const [height, setHeight] = useState(30);
  const MIN_HEIGHT = 30;

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const height = Math.max(event.nativeEvent.layout.height, MIN_HEIGHT);
    setHeight(height);
  }, []);

  const styles = StyleSheet.create({
    // The container positions the label above the marker thumb.
    container: {
      marginBottom: 8,
      height: MIN_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
    },
    // The inner container allows the label to grow with the text
    inner: {
      position: "absolute",
      top: 0,
      paddingVertical: 7,
      paddingHorizontal: 12,
    },
    text: {
      fontSize: 16,
    },
  });

  const containerStyles = useMemo(() => {
    return [styles.container, { height: height }];
  }, [height]);

  const labelStyles = useMemo(
    () => [styles.inner, style],
    [styles, style]
  );

  const textStyles = useMemo(() => [styles.text, textStyle], [textStyle]);

  if (typeof position?.value === "undefined") {
    return <></>;
  }

  return (
    <View>
      <View style={containerStyles}>
        <View style={labelStyles} onLayout={onLayout}>
          <Text style={textStyles}>{SyllabicNotations[getIndexFromAbsoluteIndex(position.value as number)]}</Text>
        </View>
      </View>
    </View>
  );
}

export const ClefPicker = (props: ClefPickerProps) => {
  const [width, setWidth] = useState<number>(0);
  const [clef, setClef] = useState<Clef>(props.defaultClef);
  const [score,] = useState<RnSvgContext>(new RnSvgContext(width, 100));
  const [minNote, setMinNote] = useState<Notes>(props.getMinDefaultNote('treble'));
  const [maxNote, setMaxNote] = useState<Notes>(props.getMaxDefaultNote('treble'));

  useEffect(() => {
    drawScore(score, width, clef, minNote, maxNote)
  }, [minNote, maxNote]);

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
    sliderContainer: { padding: 10 },
  });

  const OnClefChange = (selectedClef: Clef) => {
    setClef(selectedClef);
    const min = props.getMinDefaultNote(selectedClef);
    setMinNote(min)

    const max = props.getMaxDefaultNote(selectedClef);
    setMaxNote(max)
    drawScore(score, width, selectedClef, min, max);
    props.onClefsSelected(selectedClef);
    props.onNoteRangeChange([min, max]);
  };

  function onNoteChange(values: SliderValue[]) {
    const min = getNoteFromAbsoluteIndex(values[0] as number);
    setMinNote(min);
    const max = getNoteFromAbsoluteIndex(values[1] as number);
    setMaxNote(max);
    props.onNoteRangeChange([min, max]);
    return values;
  }

  return (
    <View onLayout={event => {
      const layout = event.nativeEvent.layout;
      drawScore(score, layout.width, clef, minNote, maxNote)
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
        <View>{score?.render()}</View>
        <View style={styles.sliderContainer}>
          {clef == 'treble' && <Slider
            labelComponent={LabelSlider}
            markerComponent={ThumbSlider}
            min={getAbsoluteIndex(minNote)}
            max={getAbsoluteIndex(maxNote)}
            values={[getAbsoluteIndex(minNote), getAbsoluteIndex(maxNote)]}
            onChange={onNoteChange} />}
          {clef == 'bass' && <Slider
            labelComponent={LabelSlider}
            markerComponent={ThumbSlider}
            min={getAbsoluteIndex(minNote)}
            max={getAbsoluteIndex(maxNote)}
            values={[getAbsoluteIndex(minNote), getAbsoluteIndex(maxNote)]}
            onChange={onNoteChange} />}
        </View>
      </View>
    </View>
  );
};
