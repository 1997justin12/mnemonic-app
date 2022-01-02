import axios from 'axios';

const apiEndPoint = 'https://itp-mnemonic.herokuapp.com/api/lexicon';
// const apiEndPoint = 'http://192.168.1.150:8000/api/lexicon';

export const saveLexiconWord = (device_id, word) => {
  return axios.post(`${apiEndPoint}`, {device_id, word});
};

export const fetchWordsByLetter = (deviceId, letter) => {
  return axios.get(`${apiEndPoint}/${deviceId}/${letter}`);
};
