import { combineReducers } from 'redux';

import { persistReducer } from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';

import accountReducer from './accountReducer';
import pictureReducer from './pictureReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  Whitelist: ['accountReducer', 'pictureReducer']
}


const rootReducer = combineReducers({
  accountRd: accountReducer,
  pictureRd: pictureReducer,
})


export default persistReducer(persistConfig, rootReducer)