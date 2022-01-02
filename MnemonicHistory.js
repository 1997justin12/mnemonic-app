import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import * as actions from './_redux/mnemonic/mnemonicAction';
import {getUniqueId} from 'react-native-device-info';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

const Item = ({item, onPress, backgroundColor, textColor, borderColor}) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.item, backgroundColor, borderColor]}>
        <Text style={[styles.title, textColor]}>{item?.word}</Text>
      </TouchableOpacity>
      {item.selected && (
        <View style={styles.viewMnemonics}>
          {item.phrases.map(iitem => {
            return <Text style={styles.fontSizeText}>{iitem.phrase}</Text>;
          })}
        </View>
      )}
    </>
  );
};

export const MnemonicHistory = () => {
  const dispatch = useDispatch();
  const [mnemonics, setMnemonics] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const {currentState} = useSelector(
    state => ({
      currentState: state.mnemonic,
    }),
    shallowEqual,
  );
  const {mnemonicHistories = []} = currentState;
  console.log({mnemonicHistories});
  useEffect(() => {
    dispatch(actions.getHistories(getUniqueId()));
  }, []);

  useEffect(() => {
    if (currentState && currentState.mnemonicHistories) {
      let list = [];
      mnemonicHistories.map((item, index) => {
        list.push({
          id: index,
          word: item.word,
          selected: false,
          phrases: item?.phrases,
        });
      });
      setMnemonics(list);
    }
  }, [currentState.mnemonicHistories]);

  const selectWord = id => {
    if (selectedWords.indexOf(id) == -1) {
      if (selectedWords.length < 3) {
        let items = [...selectedWords, id];
        mnemonics.map(item => {
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
      mnemonics.map(item => {
        if (item.id === id) {
          item.selected = false;
        }
        return item;
      });
      setSelectedWords([...items]);
    }
  };

  const renderItem = ({item}) => {
    const backgroundColor = '#fff';
    const color = '#2d3436';
    const borderColor = '#cfcfcf';
    return (
      <Item
        item={item}
        onPress={() => selectWord(item.id)}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
        borderColor={{borderColor}}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('./assets/bg.jpg')} style={styles.image}>
        <FlatList
          data={mnemonics}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedWords}
        />
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
    // marginVertical: 8,
    // marginHorizontal: 16,
    borderWidth: 1,
    // borderRadius: 5,
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
  viewMnemonics: {
    backgroundColor: '#fff',
    padding: 5,
    borderColor: '#cecece',
    borderWidth: 1,
  },
  fontSizeText: {
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'capitalize',
    margin: 5,
    fontWeight: 'bold',
  },
});
