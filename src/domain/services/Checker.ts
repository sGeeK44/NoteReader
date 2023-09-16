import { Tempo } from './Tempo';
import { MusicScore } from "./MusicScoreBuilder";
import { TimeProvider } from "./TimeProvider";
import { TimeChecker } from './TimeChecker';
import { NoteHeadChecker } from './NoteHeadChecker';

export type CheckResult = "GOOD" | "BAD" | "WIN";

export class Checker {
    timeChecker: TimeChecker;
    noteHeaChecker: NoteHeadChecker;
    currentMeasure: number = 1;
    currentNote: number = 1;

    constructor(timeProvider: TimeProvider, private score: MusicScore, private tempo: Tempo) {
        this.timeChecker = new TimeChecker(timeProvider);
        this.noteHeaChecker = new NoteHeadChecker();
    }

    start() {
        this.currentMeasure = 1;
        this.currentNote = 1;
        this.timeChecker.start();
    }

    next(receive: string): CheckResult {
        const expected = {
            measure: this.currentMeasure,
            value: this.score.measures[this.currentMeasure - 1].notes[this.currentNote - 1].notehead,
            measurePosition: this.currentNote,
            scoreSignature: this.score.timeSignature
        };
        const nbBeatBefore = (expected.measure - 1) * expected.scoreSignature.beat;
        const isOnTime = this.timeChecker.isOnTime((nbBeatBefore + expected.measurePosition) * this.tempo.toBpMs());
        if (!isOnTime) {
            this.currentMeasure = 1;
            this.currentNote = 1;
            this.timeChecker.reset();
            return "BAD";
        }

        const isRigthNote = this.noteHeaChecker.isRigthNote(receive, expected.value);
        if (!isRigthNote) {
            this.currentMeasure = 1;
            this.currentNote = 1;
            this.timeChecker.reset();
            return "BAD";
        }

        if (this.currentMeasure === this.score.measures.length && this.currentNote === this.score.timeSignature.beat) {
            this.currentMeasure = 1;
            this.currentNote = 1;
            return "WIN";
        }

        this.currentNote++;
        if (this.currentNote > this.score.timeSignature.beat) {
            this.currentNote = 1;
            this.currentMeasure++;
        }
        return "GOOD";
    }
}