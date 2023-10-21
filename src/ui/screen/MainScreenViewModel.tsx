import { useState } from 'react';
import { Clef } from 'app/domain/services/MusicScoreBuilder';
import { Notation } from 'app/domain/services/Notation';
import { RhytmicNote } from 'app/domain/services/RhytmicNote';

export function MainScreenViewModel() {
  const [rhytmics, setRhytmics] = useState<RhytmicNote[]>([]);
  const [tempo, setTempo] = useState<number | undefined>(60);
  const [nbMeasure, setNbMeasure] = useState<number | undefined>(6);
  const [clef, setClef] = useState<Clef>('treble');
  const [notation, setNotation] = useState<Notation>('syllabic');
  const [accuracy, setAccuracy] = useState<number>(500);

  const onTempoChanged = (value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      setTempo(undefined);
      return;
    }
    setTempo(parsed);
  };

  const notations: { alphabet: Notation; syllabic: Notation } = {
    alphabet: 'alphabet',
    syllabic: 'syllabic',
  };

  const onSyllabicSelected = () => {
    setNotation(notations.syllabic);
  };

  const isSyllabicChecked: 'checked' | 'unchecked' =
    notation === notations.syllabic ? 'checked' : 'unchecked';

  const onAlphabetSelected = () => {
    console.log(notation);
    setNotation(notations.alphabet);
  };

  const isAlphabetChecked: 'checked' | 'unchecked' =
    notation === notations.alphabet ? 'checked' : 'unchecked';

  return {
    tempo: tempo,
    onTempoChanged,
    nbMeasure,
    setNbMeasure,
    clef,
    setClef,
    notation,
    notations,
    isAlphabetChecked,
    onAlphabetSelected,
    isSyllabicChecked,
    onSyllabicSelected,
    accuracy,
    setAccuracy,
    rhytmics
  };
}
