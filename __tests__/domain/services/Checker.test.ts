import { describe, it, expect } from '@jest/globals';
import { Checker } from 'app/domain/services/Checker';
import { FakeTimeProvider } from '../../fakes/FakeTimeProvider';
import { Tempo } from 'app/domain/services/Tempo';
import { MusicScore } from 'app/domain/services/MusicScoreBuilder';

describe('Validate speech against music score and time', () => {
    it('First note can be spell at any time !', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, {
            clef: 'treble',
            timeSignature: {
                beat: 4,
                duration: 4
            },
            measures: [
                {
                    notes: [
                        { notehead: "a", duration: 4, pitch: '4' },
                        { notehead: "a", duration: 4, pitch: '4' },
                    ]
                }
            ]
        }, new Tempo(60))

        checker.start();

        timeProvider.setNow(3000);
        const result = checker.next("a");

        expect(result).toStrictEqual("GOOD");
    });
    it('Spell to early !', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, {
            clef: 'treble',
            timeSignature: {
                beat: 4,
                duration: 4
            },
            measures: [
                {
                    notes: [
                        { notehead: "a", duration: 4, pitch: '4' },
                        { notehead: "a", duration: 4, pitch: '4' },
                    ]
                }
            ]
        }, new Tempo(60))

        checker.start();
        checker.next("a");

        timeProvider.setNow(500);
        const result = checker.next("a");

        expect(result).toStrictEqual("BAD");
    });

    it('Spell to late !', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, {
            clef: 'treble',
            timeSignature: {
                beat: 4,
                duration: 4
            },
            measures: [
                {
                    notes: [
                        { notehead: "a", duration: 4, pitch: '4' },
                        { notehead: "a", duration: 4, pitch: '4' },
                    ]
                }
            ]
        }, new Tempo(60))

        checker.start();
        checker.next("a");

        timeProvider.setNow(1500);
        const result = checker.next("a");

        expect(result).toStrictEqual("BAD");
    });

    it('Spell all right :)', () => {
        const timeProvider = new FakeTimeProvider();
        const score: MusicScore = {
            clef: 'treble',
            timeSignature: {
                beat: 4,
                duration: 4
            },
            measures: [
                {
                    notes: [
                        { notehead: "a", duration: 4, pitch: '4' },
                        { notehead: "b", duration: 4, pitch: '4' },
                        { notehead: "c", duration: 4, pitch: '4' },
                        { notehead: "d", duration: 4, pitch: '4' },
                    ]
                },
                {
                    notes: [
                        { notehead: "e", duration: 4, pitch: '4' },
                        { notehead: "f", duration: 4, pitch: '4' },
                        { notehead: "g", duration: 4, pitch: '4' },
                        { notehead: "a", duration: 4, pitch: '4' },
                    ]
                }
            ]
        }
        const checker = new Checker(timeProvider, score, new Tempo(60));

        checker.start();

        expect(checker.next("a")).toStrictEqual("GOOD")

        timeProvider.setNow(1000);
        expect(checker.next("b")).toStrictEqual("GOOD")

        timeProvider.setNow(2000);
        expect(checker.next("c")).toStrictEqual("GOOD")

        timeProvider.setNow(3000);
        expect(checker.next("d")).toStrictEqual("GOOD")

        timeProvider.setNow(4000);
        expect(checker.next("e")).toStrictEqual("GOOD")

        timeProvider.setNow(5000);
        expect(checker.next("f")).toStrictEqual("GOOD")

        timeProvider.setNow(6000);
        expect(checker.next("g")).toStrictEqual("GOOD")

        timeProvider.setNow(7000);
        expect(checker.next("a")).toStrictEqual("WIN")
    });

    it('Spell with syllabic note at right time', () => {
        const timeProvider = new FakeTimeProvider();
        const score: MusicScore = {
            clef: 'treble',
            timeSignature: {
                beat: 4,
                duration: 4
            },
            measures: [
                {
                    notes: [
                        {
                            notehead: "c",
                            duration: 4,
                            pitch: '4'
                        }
                    ]
                }
            ]
        }
        const checker = new Checker(timeProvider, score, new Tempo(60));

        checker.start();

        timeProvider.setNow(1000);
        const result = checker.next("do");

        expect(result).toStrictEqual("GOOD");
    });

    it('Spell bad note at right time :(', () => {
        const timeProvider = new FakeTimeProvider();
        const score: MusicScore = {
            clef: 'treble',
            timeSignature: {
                beat: 4,
                duration: 4
            },
            measures: [
                {
                    notes: [
                        {
                            notehead: "a",
                            duration: 4,
                            pitch: '4'
                        }
                    ]
                }
            ]
        }
        const checker = new Checker(timeProvider, score, new Tempo(60));

        checker.start();

        timeProvider.setNow(1000);
        const result = checker.next("d");

        expect(result).toStrictEqual("BAD");
    });

    it('Has mistake restart at begining :(', () => {
        const timeProvider = new FakeTimeProvider();
        const checker = new Checker(timeProvider, {
            clef: 'treble',
            timeSignature: {
                beat: 4,
                duration: 4
            },
            measures: [
                {
                    notes: [
                        { notehead: "a", duration: 4, pitch: '4' },
                        { notehead: "b", duration: 4, pitch: '4' },
                        { notehead: "c", duration: 4, pitch: '4' },
                        { notehead: "d", duration: 4, pitch: '4' },
                    ]
                }
            ]
        }, new Tempo(60))

        checker.start();

        timeProvider.setNow(1000);
        expect(checker.next("a")).toStrictEqual("GOOD")

        timeProvider.setNow(2000);
        expect(checker.next("b")).toStrictEqual("GOOD")

        timeProvider.setNow(3000);
        expect(checker.next("a")).toStrictEqual("BAD")

        timeProvider.setNow(1000);
        expect(checker.next("a")).toStrictEqual("GOOD")

        timeProvider.setNow(2000);
        expect(checker.next("b")).toStrictEqual("GOOD")

        timeProvider.setNow(2500);
        expect(checker.next("c")).toStrictEqual("BAD")

        timeProvider.setNow(1000);
        expect(checker.next("a")).toStrictEqual("GOOD")

        timeProvider.setNow(2000);
        expect(checker.next("b")).toStrictEqual("GOOD")

        timeProvider.setNow(3000);
        expect(checker.next("c")).toStrictEqual("GOOD")

        timeProvider.setNow(4000);
        expect(checker.next("d")).toStrictEqual("WIN")
    });
});
