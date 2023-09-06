import {
  SpeechListener,
  SpeechRecognizer,
} from '../../src/domain/services/SpeechRecognizer';

export class FakeSpeechRecognizer implements SpeechRecognizer {
  init(_culture: string): void {
    // do nothing.
  }
  dispose(): void {
    // do nothing.
  }
  start(_grammar: string): void {
    // do nothing.
  }
  stop(): void {
    // do nothing.
  }
  subscribe(_listener: SpeechListener): void {
    // do nothing.
  }
  unsunscribe(): void {
    // do nothing.
  }
}
