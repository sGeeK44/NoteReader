/**
 * @format
 */

import 'react-native';
import React from 'react';

// Note: import explicitly to use the types shiped with jest.
import { it } from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import { Container } from 'inversify';
import { MainScreen } from '../src/ui/screen/MainScreen';
import { Provider } from 'inversify-react';
import { SpeechRecognizer } from 'app/domain/services/SpeechRecognizer';
import { Symbols } from 'app/config/symbols';
import { FakeSpeechRecognizer } from './fakes/FakeSpeechRecognizer';
import { SoundPlayer } from 'app/domain/services/SoundPlayer';
import { FakeSoundPlayer } from './fakes/FakeSoundPlayer';
import { RandomNoteGenerator } from 'app/domain/services/RandomNoteGenerator';
import { FakeRandomNoteGenerator } from './fakes/FakeRandomNoteGenerator';

it('renders correctly', () => {
  const container = new Container();
  container
    .bind<SpeechRecognizer>(Symbols.SpeechRecognizer)
    .toConstantValue(new FakeSpeechRecognizer());
  container
    .bind<SoundPlayer>(Symbols.SoundPlayer)
    .toConstantValue(new FakeSoundPlayer());
  container
    .bind<RandomNoteGenerator>(Symbols.RandomNoteGenerator)
    .toConstantValue(new FakeRandomNoteGenerator());
  renderer.create(
    <Provider container={container}>
      <MainScreen />
    </Provider>,
  );
});
