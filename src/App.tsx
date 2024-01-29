/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Provider } from 'inversify-react';
import { SplashScreen } from './ui/screen/SplashScreen';
import { ReadScreen } from './ui/screen/Read/ReadScreen';
import { PrivacyScreen } from './ui/screen/PrivacyScreen';
import { buildDependencies } from './config/common';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAsync } from 'react-async-hook';
import { TrainReadScreen } from './ui/screen/Read/TrainReadScreen';
import { Clef } from './domain/services/MusicScoreBuilder';
import { Notation } from './domain/services/Notation';
import { RhytmicNote } from './domain/services/RhytmicNote';
import { Notes } from './domain/services/Notes';
import { DictationScreen } from './ui/screen/Dictation/DictationScreen';
import { MenuScreen } from './ui/screen/MenuScreen';
import { TrainDictationScreen } from './ui/screen/Dictation/TrainDictationScreen';

export type RootStackParamList = {
  SplashScreen: undefined;
  MenuScreen: undefined;
  ReadScreen: undefined;
  TrainReadScreen: {
    tempo: number;
    nbMeasure: number;
    clef: Clef;
    notation: Notation;
    accuracy: number;
    rhytmics: RhytmicNote[];
    noteRange: [Notes, Notes];
  };
  PrivacyScreen: undefined;
  DictationScreen: undefined;
  TrainDictationScreen: {
    tempo: number;
    nbMeasure: number;
    clef: Clef;
    notation: Notation;
    noteRange: [Notes, Notes];
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const asyncDependencies = useAsync(buildDependencies, []);

  return (
    <>
      {asyncDependencies.result && (
        <Provider container={asyncDependencies.result}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen">
              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MenuScreen"
                component={MenuScreen}
                options={{
                  title: 'Music Theory Teacher',
                  headerTitleAlign: 'center',
                }}
              />
              <Stack.Screen
                name="ReadScreen"
                component={ReadScreen}
                options={{ title: 'Read' }}
              />
              <Stack.Screen
                name="TrainReadScreen"
                component={TrainReadScreen}
                options={{ title: 'Entrainement' }}
              />
              <Stack.Screen
                name="DictationScreen"
                component={DictationScreen}
                options={{ title: 'Dictation' }}
              />
              <Stack.Screen
                name="TrainDictationScreen"
                component={TrainDictationScreen}
                options={{ title: 'Entrainement' }}
              />
              <Stack.Screen
                name="PrivacyScreen"
                component={PrivacyScreen}
                options={{ title: 'Privacy Policy' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      )}
    </>
  );
}

export default App;
