import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import App from './src/App';
import { store } from './src/store';

const Root = () => (
  <Provider store={store}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <App />
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
  </Provider>
);

AppRegistry.registerComponent('TicTacToeMobile', () => Root); 