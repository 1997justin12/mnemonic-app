import {createSlice} from '@reduxjs/toolkit';

const initialMnemonicState = {
  listLoading: false,
  actionsLoading: false,
  dictionaries: null,
  lasterError: null,
  initComplete: false,
  vocabulary: {
    a: [],
    b: [],
    c: [],
    d: [],
    e: [],
    f: [],
    g: [],
    h: [],
    i: [],
    j: [],
    k: [],
    l: [],
    m: [],
    n: [],
    o: [],
    p: [],
    q: [],
    r: [],
    s: [],
    t: [],
    u: [],
    v: [],
    w: [],
    x: [],
    y: [],
    z: [],
  },
  generatedMnemonics: '',
  mnemonicLetter: '',
  wordUseToGenerate: '',
  mnemonicHistories: [],
};

export const callTypes = {
  list: 'list',
  action: 'action',
};

export const mnemonicSlice = createSlice({
  name: 'mnemonic',
  initialState: initialMnemonicState,
  reducers: {
    catchError: (state, action) => {
      state.error = action.payload.error;
      state.initComplete = false;

      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      state.initComplete = false;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
        console.log('LOADING...');
      }
      console.log(state.actionsLoading);
    },
    initComplete: (state, action) => {
      state.initComplete = true;
    },
    mnemonicsFetched: (state, action) => {
      const {entites} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entites = entites;
    },
    saveVocabulary: (state, action) => {
      const {words} = action.payload;
      let vocabulary = state.vocabulary;
      words.map(item => {
        const {word} = item;
        const letter = word.charAt(0);
        vocabulary[letter].push(word);
      });
      state.vocabulary = vocabulary;
      state.initComplete = true;
    },
    generatedMnemonic: (state, action) => {
      state.actionsLoading = false;
      state.generatedMnemonics = action.payload.mnemonics;
      state.wordUseToGenerate = action.payload.wordUseToGenerate;
      state.mnemonicLetter = action.payload.mnemonicLetter;
    },
    mnemonicHistories: (state, action) => {
      const {mnemonics = []} = action.payload;
      state.actionsLoading = false;
      state.mnemonicHistories = mnemonics;
    },
  },
});
