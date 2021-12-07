import axios from 'axios';

const apiEndPoint = 'https://itp-mnemonic.herokuapp.com/api/device';

export const saveSession = device_id => {
  return axios.post(`${apiEndPoint}`, {device_id});
};
