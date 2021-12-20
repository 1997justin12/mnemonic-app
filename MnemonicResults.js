import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import {saveMnemonics} from './_redux/mnemonic/mnemonicAction';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

const Item = ({item, onPress, backgroundColor, textColor, borderColor}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, backgroundColor, borderColor]}>
    <Text style={[styles.title, textColor]}>{item}</Text>
  </TouchableOpacity>
);

export const MnemonicResults = () => {
  const dispatch = useDispatch();
  const {currentState} = useSelector(
    state => ({
      currentState: state.mnemonic,
    }),
    shallowEqual,
  );
  const [generatedMnemonics, setGeneratedMnemonics] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);

  useEffect(() => {
    if (currentState && currentState.generatedMnemonics) {
      let list = [];

      currentState.generatedMnemonics.map((item, index) => {
        list.push({id: index + 1, word: item, selected: false});
      });

      setGeneratedMnemonics(list);
    }
  }, [currentState.generatedMnemonics]);

  const selectWord = id => {
    if (selectedWords.indexOf(id) == -1) {
      if (selectedWords.length < 3) {
        let items = [...selectedWords, id];
        generatedMnemonics.map(item => {
          if (item.id === id) {
            item.selected = true;
          }
          return item;
        });
        setSelectedWords(items);
      }
    } else {
      let selectedWordIndex = selectedWords.indexOf(id);
      let items = selectedWords;
      items.splice(selectedWordIndex, 1);
      generatedMnemonics.map(item => {
        if (item.id === id) {
          item.selected = false;
        }
        return item;
      });
      setSelectedWords([...items]);
    }
  };

  const renderItem = ({item}) => {
    const backgroundColor = item.selected == true ? '#81ecec' : '#fff';
    const color = item.selected == true ? '#2d3436' : '#2d3436';
    const borderColor = item.selected == true ? '#2d3436' : '#00cec9';

    return (
      <Item
        item={item.word}
        onPress={() => selectWord(item.id)}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
        borderColor={{borderColor}}
      />
    );
  };

  const saveMnemonics = e => {
    e.preventDefault();
    let selectedWords = [];
    generatedMnemonics.map(item => {
      if (item.selected) {
        selectedWords.push(item.word);
      }
    });
    selectedWords = selectedWords.join('');
    console.log(currentState.wordUseToGenerate, currentState.mnemonicLetter, {
      selectedWords,
    });
    dispatch(
      saveMnemonics(
        currentState.wordUseToGenerate,
        currentState.mnemonicLetter,
        selectedWords,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('./assets/bg.jpg')}
        // resizeMode="cover"
        style={styles.image}>
        <FlatList
          data={generatedMnemonics}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedWords}
        />
        {selectedWords && selectedWords.length === 3 && (
          <TouchableOpacity
            style={styles.submit}
            onPress={() => saveMnemonics}
            underlayColor="#1E5E52">
            <Text style={styles.submitText}>SAVE SELECTED WORD</Text>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#74b9ff',
  },
  item: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  submit: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#267E6F',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#267E6F',
    position: 'absolute',
    bottom: 10,
    margin: 'auto',
    width: 250,
    alignSelf: 'center',
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
