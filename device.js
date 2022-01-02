import axios from 'axios';

const apiEndPoint = 'https://itp-mnemonic.herokuapp.com/api/device';
// const apiEndPoint = 'http://192.168.1.150:8000/api/device';

export const saveSession = device_id => {
  return axios.post(`${apiEndPoint}`, {device_id});
};
