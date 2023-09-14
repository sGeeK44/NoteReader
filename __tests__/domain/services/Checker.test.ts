import { describe, it, expect, beforeEach } from '@jest/globals';
import { Checker } from 'app/domain/services/Checker';
import { FakeTimeProvider } from '../../fakes/FakeTimeProvider';
import { Tempo } from 'app/domain/services/Tempo';
import { Beat, NoteDuration, ScoreNote } from 'app/domain/services/MusicScoreBuilder';

describe('Spell right', () => {
    const scoreNote: ScoreNote = {
        value: "a",
        measure: 1,
        measurePosition: 1,
        scoreSignature: {
            beat: 4,
            duration: 4
        }
    }

    it('at right time :)', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60));

        checker.start();

        timeProvider.setNow(1000);
        const result = checker.check("a", scoreNote);

        expect(result).toBeTruthy()
    });

    it('to early !', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60))

        checker.start();

        timeProvider.setNow(500);
        const result = checker.check("a", scoreNote);

        expect(result).toBeFalsy()
    });

    it('to late !', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60))

        checker.start();

        timeProvider.setNow(1500);
        const result = checker.check("a", scoreNote);

        expect(result).toBeFalsy()
    });
});

describe('Spell right and Change note position', () => {
    const scoreNote = {
        value: "a",
        measure: 1,
        scoreSignature: {
            beat: 4 as Beat,
            duration: 4 as NoteDuration
        }
    }

    it('first position', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60));

        checker.start();

        timeProvider.setNow(1000);
        const result = checker.check("a", { measurePosition: 1, ...scoreNote });

        expect(result).toBeTruthy()
    });

    it('second position', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60))

        checker.start();

        timeProvider.setNow(2000);
        const result = checker.check("a", { measurePosition: 2, ...scoreNote });

        expect(result).toBeTruthy()
    });

    it('last position', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60))

        checker.start();

        timeProvider.setNow(4000);
        const result = checker.check("a", { measurePosition: 4, ...scoreNote });

        expect(result).toBeTruthy()
    });
});

describe('Spell right and Change measure position', () => {
    const scoreNote = {
        value: "a",
        measurePosition: 1,
        scoreSignature: {
            beat: 4 as Beat,
            duration: 4 as NoteDuration
        }
    }

    it('first meaure', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60));

        checker.start();

        timeProvider.setNow(1000);
        const result = checker.check("a", { measure: 1, ...scoreNote });

        expect(result).toBeTruthy()
    });

    it('second meaure', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60))

        checker.start();

        timeProvider.setNow(5000);
        const result = checker.check("a", { measure: 2, ...scoreNote });

        expect(result).toBeTruthy()
    });

    it('Ten meaure', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60))

        checker.start();

        timeProvider.setNow(37000);
        const result = checker.check("a", { measure: 10, ...scoreNote });

        expect(result).toBeTruthy()
    });
});

describe('Spell right and Change beat', () => {
    const scoreNote = {
        value: "a",
        measure: 2,
        measurePosition: 1,
        scoreSignature: {
            duration: 4 as NoteDuration
        }
    }

    it('One beat per meaure', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60));

        checker.start();

        timeProvider.setNow(2000);
        const result = checker.check("a", {
            ...scoreNote,
            scoreSignature: {
                beat: 1, ...scoreNote.scoreSignature
            }
        });

        expect(result).toBeTruthy()
    });

    it('Two beat per meaure', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60))

        checker.start();

        timeProvider.setNow(3000);
        const result = checker.check("a", {
            ...scoreNote,
            scoreSignature: {
                beat: 2, ...scoreNote.scoreSignature
            }
        });

        expect(result).toBeTruthy()
    });

    it('Three beat per meaure', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60))

        checker.start();

        timeProvider.setNow(4000);
        const result = checker.check("a", {
            ...scoreNote,
            scoreSignature: {
                beat: 3, ...scoreNote.scoreSignature
            }
        });

        expect(result).toBeTruthy()
    });
});

describe('Spell bad note', () => {
    const scoreNote: ScoreNote = {
        value: "a",
        measure: 1,
        measurePosition: 1,
        scoreSignature: {
            beat: 4,
            duration: 4
        }
    }

    it('at right time :(', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, new Tempo(60));

        checker.start();

        timeProvider.setNow(1000);
        const result = checker.check("d", scoreNote);

        expect(result).toBeFalsy()
    });
});
