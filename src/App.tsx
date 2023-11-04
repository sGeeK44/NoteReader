/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider } from 'inversify-react';
import { SplashScreen } from './ui/screen/SplashScreen';
import { MainScreen } from './ui/screen/MainScreen';
import { buildDependencies } from './config/common';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAsync } from 'react-async-hook';
import { TrainScreen } from './ui/screen/TrainScreen';
import { Clef } from './domain/services/MusicScoreBuilder';
import { Notation } from './domain/services/Notation';
import { RhytmicNote } from './domain/services/RhytmicNote';

export type RootStackParamList = {
  SplashScreen: undefined;
  MainScreen: undefined;
  TrainScreen: {
    tempo: number;
    nbMeasure: number;
    clef: Clef;
    notation: Notation;
    accuracy: number;
    rhytmics: RhytmicNote[];
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
              <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="MainScreen" component={MainScreen} options={{
                title: 'Music Theory Teacher',
                headerTitleAlign: 'center', headerBackVisible: false
              }} />
              <Stack.Screen name="TrainScreen" component={TrainScreen} options={{ title: 'Entrainement' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      )}
    </>
  );
}

export default App;
