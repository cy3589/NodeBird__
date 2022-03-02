import { all, fork } from 'redux-saga/effects';
import axios from 'axios';
import postSaga from '@sagas/post';
import userSaga from '@sagas/user';
import { backUrl } from '@configs/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;
export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
