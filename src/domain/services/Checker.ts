import { Tempo } from './Tempo';
import { ScoreNote } from "./MusicScoreBuilder";
import { TimeProvider } from "./TimeProvider";
import { TimeChecker } from './TimeChecker';
import { NoteHeadChecker } from './NoteHeadChecker';

export class Checker {
    timeChecker: TimeChecker;
    noteHeaChecker: NoteHeadChecker;

    constructor(timeProvider: TimeProvider, private tempo: Tempo) {
        this.timeChecker = new TimeChecker(timeProvider);
        this.noteHeaChecker = new NoteHeadChecker();
    }

    check(receive: string, expected: ScoreNote) {
        const nbBeatBefore = (expected.measure - 1) * expected.scoreSignature.beat;
        const isOnTime = this.timeChecker.isOnTime((nbBeatBefore + expected.measurePosition) * this.tempo.toBpMs());
        if (!isOnTime) {
            return false;
        }

        return this.noteHeaChecker.isRigthNote(receive, expected.value);
    }

    start() {
        this.timeChecker.start();
    }
}