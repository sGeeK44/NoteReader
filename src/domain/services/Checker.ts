import {Tempo} from './Tempo';
import {Measure, MusicScore} from './MusicScoreBuilder';
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
  onGoodCallback: (
    measure: number,
    note: number,
    result: 'TO_EARLY' | 'TO_LATE' | 'PERFECT',
  ) => void = () => {
    // Nothing by default
  };
  onBadCallback: (measure: number, note: number, result: 'BAD_NOTE') => void =
    () => {
      // Nothing by default
    };

  private get currentMeasure(): Measure {
    return this.score.measures[this.currentMeasureIndex];
  }

  constructor(
    timeProvider: TimeProvider,
    private score: MusicScore,
    private tempo: Tempo,
    accuracy: number,
  ) {
    this.timeChecker = new TimeChecker(timeProvider, accuracy);
    this.noteHeaChecker = new NoteHeadChecker();
  }

  start(receive: string) {
    this.currentNoteIndex = 0;
    if (this.isRightNote(receive)) {
      return this.onGoodResult('PERFECT');
    }

    return this.onBadResult('BAD_NOTE');
  }

  next(receive: string): CheckResult {
    const isRigthNote = this.isRightNote(receive);

    if (!isRigthNote) {
      return this.onBadResult('BAD_NOTE');
    }

    const nbBeatBefore =
      this.currentNoteIndex === 0
        ? this.score.timeSignature.beat
        : countBeatBefore(
            this.score.timeSignature.duration,
            this.currentMeasure,
            this.currentNoteIndex,
          );
    const expectedTime = nbBeatBefore * this.tempo.toBpMs();
    const isOnTime = this.timeChecker.isOnTime(expectedTime);
    if (isOnTime !== 'ON_TIME') {
      return this.onGoodResult(isOnTime);
    }

    if (this.readLastNote()) {
      return this.onWin();
    }

    return this.onGoodResult('PERFECT');
  }

  isRightNote(receive: string): boolean {
    const actualNote = this.currentMeasure.notes[this.currentNoteIndex];
    return this.noteHeaChecker.isRigthNote(receive, actualNote.notehead);
  }

  readLastNote() {
    return (
      this.currentMeasureIndex === this.score.measures.length - 1 && //??
      this.currentNoteIndex ===
        this.score.measures[this.currentMeasureIndex].notes.length - 1
    );
  }

  readFirstNote(): boolean {
    return this.currentMeasureIndex === 0 && this.currentNoteIndex === 0;
  }

  onGoodNote(
    onGoodCallback: (
      measure: number,
      note: number,
      result: 'TO_EARLY' | 'TO_LATE' | 'PERFECT',
    ) => void,
  ) {
    this.onGoodCallback = onGoodCallback;
  }

  onBadNote(
    onBadCallback: (measure: number, note: number, result: 'BAD_NOTE') => void,
  ) {
    this.onBadCallback = onBadCallback;
  }

  private onWin(): 'WIN' {
    this.currentMeasureIndex = 0;
    this.currentNoteIndex = 0;
    return 'WIN';
  }

  private onBadResult(result: 'BAD_NOTE'): 'BAD' {
    this.onBadCallback(this.currentMeasureIndex, this.currentNoteIndex, result);
    this.currentNoteIndex = 0;
    return 'BAD';
  }

  private onGoodResult(result: 'TO_EARLY' | 'TO_LATE' | 'PERFECT'): 'GOOD' {
    this.onGoodCallback(
      this.currentMeasureIndex,
      this.currentNoteIndex,
      result,
    );
    if (this.currentNoteIndex === 0) {
      this.timeChecker.start();
    }

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
