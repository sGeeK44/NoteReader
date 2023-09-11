import { SpeechRecognizer } from '../domain/services/SpeechRecognizer';
import { Container } from 'inversify';
import { Symbols } from './symbols';
import { AndroidSpeechRecongnizer } from '../infrastructure/AndroidSpeechRecognizer';
import { SoundPlayer } from 'app/domain/services/SoundPlayer';
import { AndroidSoundPlayer } from 'app/infrastructure/AndroidSoundPlayer';
import { AndroidRandomNoteGenerator } from 'app/infrastructure/AndroidRandomNoteGenerator';
import { RandomNoteGenerator } from 'app/domain/services/RandomNoteGenerator';

export async function buildDependencies(): Promise<Container> {
  const container = new Container();
  container
    .bind<RandomNoteGenerator>(Symbols.RandomNoteGenerator)
    .to(AndroidRandomNoteGenerator)
    .inSingletonScope();
  container
    .bind<SoundPlayer>(Symbols.SoundPlayer)
    .to(AndroidSoundPlayer)
    .inSingletonScope();
  container
    .bind<SpeechRecognizer>(Symbols.SpeechRecognizer)
    .to(AndroidSpeechRecongnizer)
    .inSingletonScope();
  return Promise.resolve(container);
}
