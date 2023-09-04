import { SpeechRecognizer } from '../domain/services/SpeechRecognizer';
import { Container } from 'inversify';
import { Symbols } from './symbols';
import { AndroidSpeechRecongnizer } from '../infrastructure/AndroidSpeechRecognizer';

export async function buildDependencies(): Promise<Container> {
  const container = new Container();
  container.bind<SpeechRecognizer>(Symbols.SpeechRecognizer).to(AndroidSpeechRecongnizer).inSingletonScope();
  return Promise.resolve(container);
}
