import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {MusicScoreView} from '../component/MusicScoreView';
import {SpeechRecognizer} from '../../domain/services/SpeechRecognizer';
import {MusicScoreBuilder} from 'app/domain/services/MusicScoreBuilder';
import {Checker} from 'app/domain/services/Checker';
import {Symbols} from 'app/config/symbols';
import {Tempo} from 'app/domain/services/Tempo';
import {TimeProvider} from 'app/domain/services/TimeProvider';
import {useInjection} from 'inversify-react';
import {RandomNoteGenerator} from 'app/domain/services/RandomNoteGenerator';
import {Metronome} from 'app/domain/services/Metronome';
import {RootStackParamList} from 'app/App';
import {RouteProp} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {toWords} from 'app/domain/services/Notation';
import {AndroidRandomRhytmicNoteGenerator} from 'app/infrastructure/AndroidRandomRhytmicFigureGenerator';

interface Props {
  route: RouteProp<RootStackParamList, 'TrainScreen'>;
}

export const TrainScreen = ({route}: Props) => {
  const {tempo, nbMeasure, clef, notation, accuracy} = route.params;
  const speechRecognition = useInjection<SpeechRecognizer>(
    Symbols.SpeechRecognizer,
  );
  const timeProvider = useInjection<TimeProvider>(Symbols.TimeProvider);
  const metronome = useInjection<Metronome>(Symbols.Metronome);
  metronome.init('baguettes');
  const randomNoteGenerator = useInjection<RandomNoteGenerator>(
    Symbols.RandomNoteGenerator,
  );

  const musicScoreBuilder = new MusicScoreBuilder(
    randomNoteGenerator,
    new AndroidRandomRhytmicNoteGenerator(),
  );
  const score = musicScoreBuilder.build({
    measure: nbMeasure,
    clef: clef,
    timeSignature: {beat: 4, duration: 4},
  });
  speechRecognition.init('fr-fr');

  const checker = new Checker(timeProvider, score, new Tempo(tempo), accuracy);

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    score: {
      flex: 1,
      paddingHorizontal: 10,
    },
    buttons: {
      flexDirection: 'row',
      padding: 20,
      justifyContent: 'space-around',
    },
    text: {color: 'black', fontSize: 25},
  });

  return (
    <SafeAreaView style={styles.content}>
      <View style={styles.score}>
        <MusicScoreView score={score} checker={checker} />
      </View>
      <View style={styles.buttons}>
        <Button
          icon="play"
          mode="contained"
          onPress={() => {
            metronome.play(tempo);
            let isFirst = true;
            speechRecognition?.subscribe(value => {
              if (isFirst) {
                checker?.start();
                isFirst = false;
              }
              const result = checker?.next(value);
              if (result === 'WIN') {
                metronome.stop();
                speechRecognition?.stop();
              }
            });
            speechRecognition?.start(toWords(notation));
          }}>
          Start
        </Button>
        <Button
          icon="stop"
          mode="contained"
          onPress={() => {
            metronome.stop();
            speechRecognition?.stop();
          }}>
          Stop
        </Button>
      </View>
    </SafeAreaView>
  );
};
