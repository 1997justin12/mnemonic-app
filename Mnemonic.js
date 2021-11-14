import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, Text, TextInput, View} from 'react-native';
import {letterA, letterB, letterC} from './dictionary/dictionary';
export const Mnemonics = () => {
  const [textInput, setTextInput] = useState('');
  console.log({letterA, letterB, letterC});
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TextInput style={styles.input} onChangeText={setTextInput} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  input: {
    height: 40,
    lineHeight: 30,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});
