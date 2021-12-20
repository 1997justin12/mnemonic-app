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

export const Mnemonics = ({navigation}) => {
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
      return wordList;
    } else {
      return [];
    }
  };

  useEffect(() => {
    saveSession();
  }, []);

  useEffect(() => {
    if (currentState && currentState.initComplete) {
      SplashScreen.hide();
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

                // Analyze the existing text if its a valid word
                if (RiTa.hasWord(nWord)) {
                  listOfLexiconWords.push(nWord);
                }
              });
            });

            try {
              lexicon
                .saveLexiconWord(getUniqueId(), listOfLexiconWords)
                .then(response => {
                  console.log({response});
                })
                .catch(err => {
                  console.log({err});
                });
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
      await request
        .then(response => {
          requestREADSMS();
          dispatch(action.fetchMnemonics(getUniqueId()));
          return response.data;
        })
        .catch(err => {
          console.log({err});
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

  // University of SouthEastern Philippines - Text
  const onPressButton = e => {
    let rules = generate();
    let wordUseToGenerate = textInput;
    let mnemonicLetter = textInput
      .split('')
      .filter(a => a.match(/[A-Z]/))
      .join('');

    if (mnemonicLetter.split(' ').length - 1) {
      mnemonicLetter = mnemonicLetter.split(' ');
    } else {
      mnemonicLetter = mnemonicLetter.split('');
    }

    mnemonicLetter = mnemonicLetter.join('');

    dispatch(
      action.generateMnemonics(rules, wordUseToGenerate, mnemonicLetter),
    );
    navigation.navigate('Generated Mnemonics');
  };

  const generate = () => {
    // get the value of the textbox and get all the letters that is in CAPITAL
    let mnemonic = textInput
      .split('')
      .filter(a => a.match(/[A-Z]/))
      .join('')
      .toLowerCase();

    if (mnemonic.split(' ').length - 1) {
      mnemonic = mnemonic.split(' ');
    } else {
      mnemonic = mnemonic.split('');
    }

    let generatedWords = [];
    let type = ['noun', 'verb', 'adjective'];
    let typeCount = 0;

    // loop through the Letters and fetch corresponding words
    // U S E P
    for (let x = 0; x < mnemonic.length; x++) {
      if (mnemonic.length > 1) {
        // fetch all the words that exist on the searched `Letter`
        // U - [Umbrella... etc..]
        generatedWords.push(generateWord(getWords(mnemonic[x].charAt(0))));

        typeCount++;
        if (typeCount == type.length) {
          typeCount = 0;
        }
      } else {
        // fetch all the words that exist on the searched `Letter`
        generatedWords.push(generateWord(getWords(mnemonic[x])));
        typeCount++;
        if (typeCount == type.length) {
          typeCount = 0;
        }
      }
    }

    // U S E P

    let rules = {};

    generatedWords.map((words, key) => {
      if (!rules.hasOwnProperty('start')) {
        rules['start'] = '';
      }
      // start: <subject> <verb> <object> or <verb> <subject> <object> etc... <verb> <subject> <object> <object>
      rules['start'] += `$line${key} `;
      // this are the list of data sets that can be found using the `Letter`
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

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('./assets/bg.jpg')}
        // resizeMode="cover"
        style={styles.image}>
        <View style={styles.container}>
          {actionsLoading && <ActivityIndicator size="large" color="#00ff00" />}
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
    borderColor: 'transparent',
    color: '#2d3436',
    backgroundColor: 'transparent',
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
    backgroundColor: '#00cec9',
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
