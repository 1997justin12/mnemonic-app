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

export const generateMnemonics = rules => dispatch => {
  dispatch(actions.startCall({callType: callTypes.action}));
  let rg = RiTa.grammar(rules);
  let mnemonics = [];

  for (let x = 0; x < 10; x++) {
    let mnemonic = rg.expand();
    mnemonics.push(mnemonic);
  }

  dispatch(actions.generatedMnemonic({mnemonics}));
};
