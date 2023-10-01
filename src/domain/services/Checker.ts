import {Tempo} from './Tempo';
import {MusicScore} from './MusicScoreBuilder';
import {TimeProvider} from './TimeProvider';
import {TimeChecker} from './TimeChecker';
import {NoteHeadChecker} from './NoteHeadChecker';
import {countBeatBefore} from './Beat';

export type CheckResult = 'GOOD' | 'BAD' | 'WIN';

export class Checker {
  timeChecker: TimeChecker;
  noteHeaChecker: NoteHeadChecker;
  currentMeasureIndex = 0;
  currentNoteIndex = 0;
  onGoodCallback: (measure: number, note: number) => void = () => {
    // Nothing by default
  };
  onBadCallback: (
    measure: number,
    note: number,
    result: 'TO_EARLY' | 'TO_LATE' | 'BAD_NOTE',
  ) => void = () => {
    // Nothing by default
  };

  constructor(
    timeProvider: TimeProvider,
    private score: MusicScore,
    private tempo: Tempo,
    accuracy: number,
  ) {
    this.timeChecker = new TimeChecker(timeProvider, accuracy);
    this.noteHeaChecker = new NoteHeadChecker();
  }

  start() {
    this.currentMeasureIndex = 0;
    this.currentNoteIndex = 0;
  }

  next(receive: string): CheckResult {
    const actualMeasure = this.score.measures[this.currentMeasureIndex];
    const actualNote = actualMeasure.notes[this.currentNoteIndex];
    const expected = {
      value: actualNote.notehead,
      scoreSignature: this.score.timeSignature,
    };

    const isRigthNote = this.noteHeaChecker.isRigthNote(
      receive,
      expected.value,
    );
    if (isRigthNote && this.readFirstNote()) {
      this.timeChecker.start();
      return this.onGoodResult();
    }

    const nbBeatBefore = countBeatBefore(
      this.score.timeSignature,
      actualMeasure,
      this.currentMeasureIndex,
      this.currentNoteIndex,
    );
    const isOnTime = this.timeChecker.isOnTime(
      nbBeatBefore * this.tempo.toBpMs(),
    );

    if (!isRigthNote) {
      return this.onBadResult('BAD_NOTE');
    }
    if (isOnTime !== 'ON_TIME') {
      return this.onBadResult(isOnTime);
    }

    if (this.readLastNote()) {
      return this.onWin();
    }

    return this.onGoodResult();
  }

  readLastNote() {
    return (
      this.currentMeasureIndex === this.score.measures.length - 1 &&
      this.currentNoteIndex ===
        this.score.measures[this.currentMeasureIndex].notes.length - 1
    );
  }

  readFirstNote(): boolean {
    return this.currentMeasureIndex === 0 && this.currentNoteIndex === 0;
  }

  onGoodNote(onGoodCallback: (measure: number, note: number) => void) {
    this.onGoodCallback = onGoodCallback;
  }

  onBadNote(
    onBadCallback: (
      measure: number,
      note: number,
      result: 'TO_EARLY' | 'TO_LATE' | 'BAD_NOTE',
    ) => void,
  ) {
    this.onBadCallback = onBadCallback;
  }

  private onWin(): 'WIN' {
    this.currentMeasureIndex = 0;
    this.currentNoteIndex = 0;
    return 'WIN';
  }

  private onBadResult(result: 'TO_EARLY' | 'TO_LATE' | 'BAD_NOTE'): 'BAD' {
    this.onBadCallback(this.currentMeasureIndex, this.currentNoteIndex, result);
    this.currentMeasureIndex = 0;
    this.currentNoteIndex = 0;
    this.timeChecker.reset();
    return 'BAD';
  }

  private onGoodResult(): 'GOOD' {
    this.onGoodCallback(this.currentMeasureIndex, this.currentNoteIndex);
    this.currentNoteIndex++;
    if (
      this.currentNoteIndex >
      this.score.measures[this.currentMeasureIndex].notes.length - 1
    ) {
      this.currentNoteIndex = 0;
      this.currentMeasureIndex++;
    }
    return 'GOOD';
  }
}
