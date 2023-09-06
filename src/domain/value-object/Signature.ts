import { Beat, NoteDuration } from '../services/MusicScoreBuilder';

export type Signature = {
    beat: Beat;
    duration: NoteDuration;
};

export function toString(signature: Signature) {
    return `${signature}/${signature.duration}`;
}