/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './src/app.json';
import 'reflect-metadata'; // Need for inversify

AppRegistry.registerComponent(appName, () => App);
