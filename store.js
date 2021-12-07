import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {mnemonicSlice} from './_redux/mnemonic/mnemonicSlice';

export const store = configureStore({
  reducer: {
    mnemonic: mnemonicSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
