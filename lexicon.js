import axios from 'axios';

const apiEndPoint = 'https://itp-mnemonic.herokuapp.com/api/lexicon';

export const saveLexiconWord = (device_id, word) => {
  return axios.post(`${apiEndPoint}`, {device_id, word});
};

export const fetchWordsByLetter = (deviceId, letter) => {
  return axios.get(`${apiEndPoint}/${deviceId}/${letter}`);
};
