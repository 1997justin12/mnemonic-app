import axios from 'axios';

const apiEndPoint = 'https://itp-mnemonic.herokuapp.com/api/dictionary';

export const fetchWordsByLetter = letter => {
  return axios.get(`${apiEndPoint}/${letter}`);
};
