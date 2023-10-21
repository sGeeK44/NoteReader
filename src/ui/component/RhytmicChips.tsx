import { ReactElement, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import {
  RhytmicNote,
} from 'app/domain/services/RhytmicNote';

import DoubleEighth from 'app/assets/double-eighth.svg';
import EighthDottedDouble from 'app/assets/eighth-dotted-double.svg';
import FourSixteen from 'app/assets/four-sixteen.svg';
import HalfDotted from 'app/assets/half-dotted.svg';
import Half from 'app/assets/half.svg';
import Quarter from 'app/assets/quarter.svg';
import QyarterDottedEighth from 'app/assets/quarter-dotted-eighth.svg';
import Whole from 'app/assets/whole.svg';

export interface MusicScoreProps {
  value: RhytmicNote;
  onSelected: () => void;
  onUnselected: () => void;
}

export const RhytmicChips = ({ value, onSelected, onUnselected }: MusicScoreProps) => {
  const [selected, setSelected] = useState<boolean>(false);
  const styles = StyleSheet.create({
    chip: { margin: 5, backgroundColor: 'transparent', height: 35, width: 80 },
  });

  return (
    <Chip
      style={styles.chip}
      mode="outlined"
      selected={selected}
      onPress={() => {
        setSelected(!selected)
        if (selected) {
          onUnselected();
        }
        else {
          onSelected();
        }
      }}>
      {getName(value)}
    </Chip>
  );
};

function getName(rhytmicFigures: RhytmicNote): ReactElement {
  switch (rhytmicFigures) {
    case 'quarter':
      return <Quarter width="35" height="25" />;
    case 'half':
      return <Half width="45" height="25" />;
    case 'half-dotted':
      return <HalfDotted width="45" height="25" />;
    case 'whole':
      return <Whole width="45" height="25" />;
    case 'double-eighth':
      return <DoubleEighth width="45" height="25" />;
    case 'eighth-dotted-double':
      return <EighthDottedDouble width="45" height="25" />;
    case 'four-sixteenth':
      return <FourSixteen width="45" height="25" />;
    case 'quarter-dotted-eighth':
      return <QyarterDottedEighth width="45" height="25" />;
  }
}
