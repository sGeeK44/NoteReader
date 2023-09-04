import { SpeechListener, SpeechRecognizer as SpeechRecognizerService } from '../domain/services/SpeechRecognizer';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { injectable } from 'inversify';

const { SpeechRecognizer } = NativeModules;
const eventEmitter = new NativeEventEmitter(SpeechRecognizer);

export type SpeechRecongnizerEvent = {
  data: string;
};

@injectable()
export class AndroidSpeechRecongnizer implements SpeechRecognizerService {
  currentRegisteredEvents: EmitterSubscription[] = [];
  listner: SpeechListener | undefined;

  constructor() {
  }

  init(culture: string): void {
    SpeechRecognizer.loadModel(`model-${culture}`);
  }

  dispose(): void {
    this.cleanListeners();
    SpeechRecognizer.unload();
  }

  async start(grammar: string): Promise<void> {
    const granted = await this.requestRecordPermission();

    if (!granted)
      return;

    this.currentRegisteredEvents.push(
      eventEmitter.addListener('onResult', (e: string) => {
        console.log(e);
        if (this.listner === undefined)
          return;
        this.listner(e);
      })
    );

    SpeechRecognizer.start(grammar);
  };

  stop(): void {
    this.cleanListeners();
    SpeechRecognizer.stop();
  }

  subscribe(listener: SpeechListener): void {
    this.listner = listener;
  }

  unsunscribe(): void {
    this.listner = undefined;
  }

  private async requestRecordPermission() {
    if (Platform.OS === 'ios')
      return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO!,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  private cleanListeners = () => {
    this.currentRegisteredEvents.forEach(subscription => subscription.remove());
    this.currentRegisteredEvents = [];
  };
}
