import { Beat, NoteDuration } from '../services/MusicScoreBuilder';

export type Signature = {
    beat: Beat;
    duration: NoteDuration;
};

export function toString(signature: Signature): string {
    return `${signature.beat}/${signature.duration}`;
}
