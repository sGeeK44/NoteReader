import { Pitch, NoteHead, NoteDuration } from './MusicScoreBuilder';
import { AlphabetNotations } from './Notation';

export interface Notes {
    pitch: Pitch;
    notehead: NoteHead;
    duration: NoteDuration;
}

export function getAbsoluteIndex(note: Notes): number {
    const offset = (parseInt(note.pitch) - 1) * AlphabetNotations.length;
    return offset + AlphabetNotations.indexOf(note.notehead) + 1;
}

export function getIndexFromAbsoluteIndex(index: number): number {
    const noteIndex = index % AlphabetNotations.length;
    return (noteIndex == 0 ? AlphabetNotations.length : noteIndex) - 1;
}

export function getNoteFromAbsoluteIndex(index: number): Notes {
    const pitch = Math.trunc((index - 1) / AlphabetNotations.length) + 1;
    const notehead = AlphabetNotations[getIndexFromAbsoluteIndex(index)];

    return {
        duration: 4,
        notehead: notehead,
        pitch: pitch.toString() as Pitch
    };
}

export function getRange(min: Notes, max: Notes): Notes[] {

    const result: Notes[] = [];
    const minPitch = parseInt(min.pitch);
    const maxPitch = parseInt(max.pitch);
    const minNotehead = AlphabetNotations.indexOf(min.notehead);
    const maxNotehead = AlphabetNotations.indexOf(max.notehead);
    for (let j = minPitch; j <= maxPitch; j++) {
        const minIndex =
            minPitch == j
                ? minNotehead
                : 0;
        const maxIndex =
            maxPitch == j
                ? maxNotehead
                : AlphabetNotations.length - 1;

        for (let i = minIndex; i <= maxIndex; i++) {
            const note: Notes = {
                pitch: j.toString() as Pitch,
                duration: min.duration,
                notehead: AlphabetNotations[i]
            };
            result.push(note);
        }
    }
    return result
}
