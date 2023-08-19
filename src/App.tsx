/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Provider} from 'inversify-react';
import {MainScreen} from './ui/mainScreen';
import {buildDependencies} from './config/common';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAsync} from 'react-async-hook';
import {SafeAreaView, Text} from 'react-native';

export type RootStackParamList = {
  MainScreen: undefined;
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
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      )}
    </>
  );
}

export default App;
