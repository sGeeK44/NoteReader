/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import App from './src/App';
import { name as appName } from './src/app.json';
import 'reflect-metadata'; // Need for inversify


export default function Main() {
    return (
        <PaperProvider>
            <App />
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
