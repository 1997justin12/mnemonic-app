import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Button,
  TextInput,
  View,
  TouchableHighlight,
  Text,
  Image,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import SplashScreen from 'react-native-splash-screen';
import * as dictionary from './dictionary';
import * as device from './device';
import * as lexicon from './lexicon';
import * as action from './_redux/mnemonic/mnemonicAction';
import {getUniqueId} from 'react-native-device-info';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

const RiTa = require('rita');
const filter = {
  box: 'inbox',
  indexFrom: 0,
};

export const Mnemonics = () => {
  const {currentState} = useSelector(
    state => ({
      currentState: state.mnemonic,
    }),
    shallowEqual,
  );
  const {
    vocabulary = null,
    actionsLoading = false,
    generatedMnemonic = '',
  } = currentState;
  const dispatch = useDispatch();
  const [textInput, setTextInput] = useState('');
  const [initApp, setInitApp] = useState(false);
  const [generating, setGenerating] = useState(false);

  const getWords = letter => {
    if (vocabulary && vocabulary.hasOwnProperty(letter)) {
      let wordList = [];
      let words = vocabulary[letter];
      words.map(word => {
        if (RiTa.hasWord(word)) {
          wordList.push(word);
        }
      });
      // console.log({wordList});
      return wordList;
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (!currentState.initComplete) {
      saveSession();
    }
    if (currentState && currentState.initComplete && !initApp) {
      SplashScreen.hide();
      setInitApp(true);
    }
  }, [currentState]);

  const requestREADSMS = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'Mnemonic Gen',
          message: 'Mnemonic Gen would like to access your message inbox.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        SmsAndroid.list(
          JSON.stringify(filter),
          fail => {
            console.log('Failed with this error: ' + fail);
          },
          async (count, smsList) => {
            var arr = JSON.parse(smsList);
            let listOfLexiconWords = [];
            arr.forEach(function (object) {
              let content = object.body;
              content = content.split(' ');
              content.map(word => {
                let nWord = word.replace(/[^a-zA-Z ]/g, '');
                if (RiTa.hasWord(nWord)) {
                  listOfLexiconWords.push(nWord);
                }
              });
            });

            try {
              lexicon.saveLexiconWord(getUniqueId(), listOfLexiconWords);
            } catch (error) {
              console.log(error);
            }
          },
        );
      } else {
        console.log('inbox permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const saveSession = async () => {
    try {
      const request = device.saveSession(getUniqueId());
      await request.then(response => {
        requestREADSMS();
        dispatch(action.fetchMnemonics(getUniqueId()));
        return response.data;
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getRandomWord = arr => {
    let rand = Math.round(Math.random() * arr.length);
    let randWord = arr[rand];
    return randWord;
  };

  const generateWord = arr => {
    let words = [];

    arr.map(word => {
      let hasWord = RiTa.hasWord(word);
      if (hasWord) {
        words.push(word);
      }
    });
    return words;
  };

  const onPressButton = async e => {
    setGenerating(true);
    let rules = generate();

    await dispatch(action.generateMnemonics(rules));
  };

  const generate = () => {
    let mnemonic = textInput.toLocaleLowerCase();
    if (mnemonic.split(' ').length - 1) {
      mnemonic = mnemonic.split(' ');
    } else {
      mnemonic = mnemonic.split('');
    }

    let generatedWords = [];
    let type = ['noun', 'verb', 'adjective'];
    let typeCount = 0;

    for (let x = 0; x < mnemonic.length; x++) {
      if (mnemonic.length > 1) {
        generatedWords.push(generateWord(getWords(mnemonic[x].charAt(0))));
        typeCount++;
        if (typeCount == type.length) {
          typeCount = 0;
        }
      } else {
        generatedWords.push(generateWord(getWords(mnemonic[x])));
        typeCount++;
        if (typeCount == type.length) {
          typeCount = 0;
        }
      }
    }

    let rules = {};

    generatedWords.map((words, key) => {
      if (!rules.hasOwnProperty('start')) {
        rules['start'] = '';
      }
      rules['start'] += `$line${key} `;

      if (!rules.hasOwnProperty(`line${key}`)) {
        rules[`line${key}`] = '';
        let concatWords = '';
        words.map((word, wordKey) => {
          if (concatWords == '') {
            concatWords += `${word} |`;
          } else {
            if (wordKey == words.length - 1) {
              concatWords += ` ${word}`;
            } else {
              concatWords += ` ${word} |`;
            }
          }
        });
        rules[`line${key}`] = concatWords;
      }
    });
    return rules;
  };
  console.log({actionsLoading});
  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('./assets/bg.jpg')}
        // resizeMode="cover"
        style={styles.image}>
        <View style={styles.container}>
          {!actionsLoading && (
            <ActivityIndicator size="large" color="#00ff00" />
          )}
          <View>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={styles.input}
              onChangeText={setTextInput}
              placeholder={'Enter Words or Phrase to begin'}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submit}
              onPress={onPressButton}
              underlayColor="#1E5E52">
              <Text style={styles.submitText}>GENERATE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    padding: 10,
    width: '100%',
    flexDirection: 'column',
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 2,
    borderRadius: 5,
    textAlignVertical: 'center',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 18,
    borderColor: '#267E6F',
    color: '#405450',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    padding: 10,
    alignSelf: 'center',
    marginTop: 40,
  },
  button: {
    margin: 0,
    width: '60%',
    borderRadius: '50px',
    backgroundColor: '#267E6F',
  },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#267E6F',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#267E6F',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
