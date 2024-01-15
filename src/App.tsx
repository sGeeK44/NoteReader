/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Provider } from 'inversify-react';
import { SplashScreen } from './ui/screen/SplashScreen';
import { MainScreen } from './ui/screen/MainScreen';
import { PrivacyScreen } from './ui/screen/PrivacyScreen';
import { buildDependencies } from './config/common';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAsync } from 'react-async-hook';
import { TrainScreen } from './ui/screen/TrainScreen';
import { Clef } from './domain/services/MusicScoreBuilder';
import { Notation } from './domain/services/Notation';
import { RhytmicNote } from './domain/services/RhytmicNote';
import { PrivacyButton } from './ui/component/PrivacyButton';
import { Notes } from './domain/services/Notes';

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
    noteRange: [Notes, Notes];
  };
  PrivacyScreen: undefined;
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
                name="MainScreen"
                component={MainScreen}
                options={{
                  title: 'Music Theory Teacher',
                  headerTitleAlign: 'center',
                  headerBackVisible: false,
                  headerRight: () => (
                    <PrivacyButton />
                  ),
                }}
              />
              <Stack.Screen
                name="TrainScreen"
                component={TrainScreen}
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
