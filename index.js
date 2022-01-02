/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {Mnemonics} from './Mnemonic';
import {name as appName} from './app.json';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Image, Text, TouchableOpacity} from 'react-native';
import {store} from './store';
import {Provider} from 'react-redux';
import {MnemonicResults} from './MnemonicResults';
import {MnemonicHistory} from './MnemonicHistory';

const Stack = createNativeStackNavigator();

const StackScreens = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Mnemonics}
            options={({navigation}) => ({
              headerTitle: (
                props, // App Logo
              ) => (
                <Image
                  style={{width: 50, height: 50}}
                  source={require('./assets/logo.png')}
                  resizeMode="contain"
                />
              ),
              headerTitleStyle: {flex: 1, textAlign: 'center'},
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Mnemonic History')}
                  color="#000">
                  <Text>History</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Generated Mnemonics"
            component={MnemonicResults}
          />
          <Stack.Screen name="Mnemonic History" component={MnemonicHistory} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => StackScreens);
