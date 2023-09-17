import { Tempo } from './Tempo';
import { MusicScore } from './MusicScoreBuilder';
import { TimeProvider } from './TimeProvider';
import { TimeChecker } from './TimeChecker';
import { NoteHeadChecker } from './NoteHeadChecker';

export type CheckResult = 'GOOD' | 'BAD' | 'WIN';

export class Checker {
    timeChecker: TimeChecker;
    noteHeaChecker: NoteHeadChecker;
    currentMeasure = 1;
    currentNote = 1;
    onGoodCallback: (measure: number, note: number) => void = () => { };
    onBadCallback: (measure: number, note: number) => void = () => { };

    constructor(
        timeProvider: TimeProvider,
        private score: MusicScore,
        private tempo: Tempo,
    ) {
        this.timeChecker = new TimeChecker(timeProvider);
        this.noteHeaChecker = new NoteHeadChecker();
    }

    start() {
        this.currentMeasure = 1;
        this.currentNote = 1;
    }

    next(receive: string): CheckResult {
        const expected = {
            measure: this.currentMeasure,
            value:
                this.score.measures[this.currentMeasure - 1].notes[this.currentNote - 1]
                    .notehead,
            measurePosition: this.currentNote,
            scoreSignature: this.score.timeSignature,
        };
        const isRigthNote = this.noteHeaChecker.isRigthNote(
            receive,
            expected.value,
        );
        if (isRigthNote && this.currentMeasure == 1 && this.currentNote == 1) {
            this.timeChecker.start();
            return this.onGoodResult();
        }

        const nbBeatBefore = (expected.measure - 1) * expected.scoreSignature.beat;
        const isOnTime = this.timeChecker.isOnTime(
            (nbBeatBefore + expected.measurePosition - 1) * this.tempo.toBpMs(),
        );
        if (!isOnTime || !isRigthNote) {
            return this.onBadResult();
        }

        if (
            this.currentMeasure === this.score.measures.length &&
            this.currentNote === this.score.timeSignature.beat
        ) {
            return this.onWin();
        }

        return this.onGoodResult();
    }

    onGoodNote(onGoodCallback: (measure: number, note: number) => void) {
        this.onGoodCallback = onGoodCallback;
    }

    onBadNote(onBadCallback: (measure: number, note: number) => void) {
        this.onBadCallback = onBadCallback;
    }

    private onWin(): 'WIN' {
        this.currentMeasure = 1;
        this.currentNote = 1;
        return 'WIN';
    }

    private onBadResult(): 'BAD' {
        this.onBadCallback(this.currentMeasure, this.currentNote);
        this.currentMeasure = 1;
        this.currentNote = 1;
        this.timeChecker.reset();
        return 'BAD';
    }

    private onGoodResult(): 'GOOD' {
        this.onGoodCallback(this.currentMeasure, this.currentNote);
        this.currentNote++;
        if (this.currentNote > this.score.timeSignature.beat) {
            this.currentNote = 1;
            this.currentMeasure++;
        }
        return 'GOOD';
    }
}
