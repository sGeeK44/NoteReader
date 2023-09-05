export type SpeechListener = (value: string) => void;

export interface SpeechRecognizer {
  init(culture: string): void;
  dispose(): void;
  start(grammar: string): void;
  stop(): void;
  subscribe(listener: SpeechListener): void;
  unsunscribe(): void;
}
