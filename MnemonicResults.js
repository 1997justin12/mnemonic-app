import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title, textColor]}>{item}</Text>
  </TouchableOpacity>
);

export const MnemonicResults = () => {
  const {currentState} = useSelector(
    state => ({
      currentState: state.mnemonic,
    }),
    shallowEqual,
  );

  const {generatedMnemonics = []} = currentState;

  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({item}) => {
    const backgroundColor = '#f9c2ff';
    const color = 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item)}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={generatedMnemonics}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
