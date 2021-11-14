/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {Mnemonics} from './Mnemonic';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Mnemonics);
