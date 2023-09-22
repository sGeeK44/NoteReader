/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider, useInjection } from 'inversify-react';
import { MainScreen } from './ui/screen/MainScreen';
import { buildDependencies } from './config/common';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAsync } from 'react-async-hook';
import { TrainScreen } from './ui/screen/TrainScreen';
import { Clef } from './domain/services/MusicScoreBuilder';

export type RootStackParamList = {
  MainScreen: undefined;
  TrainScreen: {
    tempo: number;
    nbMeasure: number;
    clef: Clef
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
            <Stack.Navigator initialRouteName="MainScreen">
              <Stack.Screen name="MainScreen" component={MainScreen} />
              <Stack.Screen name="TrainScreen" component={TrainScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      )}
    </>
  );
}

export default App;
