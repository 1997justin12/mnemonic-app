import axios from 'axios';
export const MNEMONIC_API_URL =
  'https://itp-mnemonic.herokuapp.com/api/lexicon';

export const fetchWordsByLetter = (uid, letter) => {
  return axios.get(`${MNEMONIC_API_URL}/${uid}`);
};
