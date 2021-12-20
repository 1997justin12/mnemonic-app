import axios from 'axios';
export const MNEMONIC_API_URL =
  'https://itp-mnemonic.herokuapp.com/api/lexicon';
// export const MNEMONIC_API_URL = 'http://192.168.1.150:8000/api/lexicon';

export const fetchWordsByLetter = (uid, letter) => {
  return axios.get(`${MNEMONIC_API_URL}/${uid}`);
};

export const saveMnemonics = (
  wordUseToGenerate,
  mnemonicLetter,
  selectedWords,
) => {
  return axios.post(`${MNEMONIC_API_URL}/save-mnemonics`, {
    wordUseToGenerate,
    mnemonicLetter,
    selectedWords,
  });
};
