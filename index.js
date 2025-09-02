import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/App';  // 👈 updated path
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
