import axios from 'axios';

const apiEndPoint = 'https://itp-mnemonic.herokuapp.com/api/dictionary';
// const apiEndPoint = 'http://192.168.1.150:8000/api/dictionary';

export const fetchWordsByLetter = letter => {
  return axios.get(`${apiEndPoint}/${letter}`);
};
