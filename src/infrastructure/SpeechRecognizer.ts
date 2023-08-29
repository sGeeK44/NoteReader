import {
  EmitterSubscription,
  EventSubscription,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';

export type SpeechRecongnizerEvent = {
  data: string;
};

const {SpeechRecognizer} = NativeModules;
const eventEmitter = new NativeEventEmitter(SpeechRecognizer);

export default class SpeechRecongnizer {
  // Public functions
  loadModel = (path: string) => SpeechRecognizer.loadModel(path);

  currentRegisteredEvents: EmitterSubscription[] = [];

  start = (grammar: string | null = null): Promise<String> => {
    return new Promise<String>((resolve, reject) => {
      this.requestRecordPermission()
        .then(granted => {
          if (!granted) return reject('Audio record permission denied');

          this.currentRegisteredEvents.push(
            eventEmitter.addListener('onResult', (e: SpeechRecongnizerEvent) =>
              resolve(e.data),
            ),
          );
          this.currentRegisteredEvents.push(
            eventEmitter.addListener('onError', (e: SpeechRecongnizerEvent) =>
              reject(e.data),
            ),
          );
          this.currentRegisteredEvents.push(
            eventEmitter.addListener('onTimeout', () => reject('timeout')),
          );
          this.currentRegisteredEvents.push(
            eventEmitter.addListener(
              'onPartialResult',
              (e: SpeechRecongnizerEvent) => resolve(e.data),
            ),
          );

          SpeechRecognizer.start(grammar);
        })
        .catch(e => {
          reject(e);
        });
    }).finally(() => {
      this.cleanListeners();
    });
  };

  stop = () => {
    this.cleanListeners();
    SpeechRecognizer.stop();
  };

  unload = () => {
    this.cleanListeners();
    SpeechRecognizer.unload();
  };
  onResult = (
    onResult: (e: SpeechRecongnizerEvent) => void,
  ): EventSubscription => {
    return eventEmitter.addListener('onResult', onResult);
  };
  onError = (
    onError: (e: SpeechRecongnizerEvent) => void,
  ): EventSubscription => {
    return eventEmitter.addListener('onError', onError);
  };
  onTimeout = (
    onTimeout: (e: SpeechRecongnizerEvent) => void,
  ): EventSubscription => {
    return eventEmitter.addListener('onTimeout', onTimeout);
  };

  private requestRecordPermission = async () => {
    if (Platform.OS === 'ios') return true;
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
