import axios from 'axios';
export const MNEMONIC_API_URL = 'https://itp-mnemonic.herokuapp.com/api';
// export const MNEMONIC_API_URL = 'http://192.168.1.150:8000/api';

export const fetchWordsByLetter = (uid, letter) => {
  return axios.get(`${MNEMONIC_API_URL}/lexicon/${uid}`);
};

export const saveMnemonics = (
  wordUseToGenerate,
  mnemonicLetter,
  selectedWords,
  device_id,
) => {
  return axios.post(`${MNEMONIC_API_URL}/mnemonic/save`, {
    word: wordUseToGenerate,
    phrases: selectedWords,
    device_id,
  });
};

export const getMnemonicHistories = device_id => {
  return axios.get(`${MNEMONIC_API_URL}/mnemonic/${device_id}`);
};
