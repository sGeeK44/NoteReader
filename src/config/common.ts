import {SpeechRecognizer} from '../domain/services/SpeechRecognizer';
import {Container} from 'inversify';
import {Symbols} from './symbols';
import {AndroidSpeechRecongnizer} from '../infrastructure/AndroidSpeechRecognizer';
import {AndroidRandomNoteGenerator} from 'app/infrastructure/AndroidRandomNoteGenerator';
import {RandomNoteGenerator} from 'app/domain/services/RandomNoteGenerator';
import {AndroidTimeProvider} from 'app/infrastructure/AndroidTimeProvider';
import {TimeProvider} from 'app/domain/services/TimeProvider';
import {Metronome} from 'app/domain/services/Metronome';
import {AndroidMetronome} from 'app/infrastructure/AndroidMetronome';

export async function buildDependencies(): Promise<Container> {
  const container = new Container();
  container
    .bind<RandomNoteGenerator>(Symbols.RandomNoteGenerator)
    .to(AndroidRandomNoteGenerator)
    .inSingletonScope();
  container
    .bind<Metronome>(Symbols.Metronome)
    .to(AndroidMetronome)
    .inSingletonScope();
  container
    .bind<SpeechRecognizer>(Symbols.SpeechRecognizer)
    .to(AndroidSpeechRecongnizer)
    .inSingletonScope();
  container
    .bind<TimeProvider>(Symbols.TimeProvider)
    .to(AndroidTimeProvider)
    .inSingletonScope();
  return Promise.resolve(container);
}
