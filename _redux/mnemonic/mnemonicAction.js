import * as requestFromServer from './mnemonicCrud';
import {mnemonicSlice, callTypes} from './mnemonicSlice';
const RiTa = require('rita');

const {actions} = mnemonicSlice;

export const fetchMnemonics = (uid, letter) => dispatch => {
  dispatch(actions.startCall({callType: callTypes.list}));
  return requestFromServer
    .fetchWordsByLetter(uid, letter)
    .then(response => {
      const {data} = response;
      dispatch(actions.saveVocabulary({words: data}));
    })
    .catch(error => {
      error.clientMessage = 'Error while fetching!';
      dispatch(actions.catchError({error, callType: callTypes.list}));
    });
};

export const initComplete = () => {
  return dispatch(actions.initComplete());
};

export const generateMnemonics = rules => async dispatch => {
  dispatch(actions.startCall({callType: callTypes.action}));
  let rg = await RiTa.grammar(rules);
  let mnemonic = await rg.expand();
  dispatch(actions.generatedMnemonic({mnemonic}));
};
