/**
 * @format
 */

import React, { AppRegistry } from 'react-native';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider
} from 'react-native-paper';
import App from './src/App';
import { name as appName } from './src/app.json';
import 'reflect-metadata'; // Need for inversify

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    "primary": '#466da3',
    "surfaceVariant": '#abcaf5',
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
