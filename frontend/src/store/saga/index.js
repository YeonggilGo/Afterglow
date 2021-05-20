import { all } from 'redux-saga/effects'
import { accountSagas } from './accountSagas'
import { pictureSagas } from './pictureSagas'

export default function* rootSaga() {
  yield all([...accountSagas, ...pictureSagas])
}