/* eslint-disable no-console */
import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  FOLLOW_REQUEST,
  FOLLOW_FAILURE,
  FOLLOW_SUCCESS,
  UNFOLLOW_REQUEST,
  UNFOLLOW_FAILURE,
  UNFOLLOW_SUCCESS,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_FAILURE,
  LOAD_MY_INFO_SUCCESS,
  CHANGE_NICKNAME_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  BLOCK_USER_REQUEST,
  BLOCK_USER_SUCCESS,
  BLOCK_USER_FAILURE,
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE,
} from '@reducers/user';
import { AnyAction } from 'redux';

function logInAPI(data: { email: string; password: string }) {
  return axios.post('/user/login', data);
}
function* logIn(action: AnyAction): any {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: LOG_IN_FAILURE,
        error: err.response?.data,
      });
  }
}

function logOutAPI() {
  return axios.post('/user/logout');
}
function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err)) {
      yield put({
        type: LOG_OUT_FAILURE,
        error: err.response?.data,
      });
    }
  }
}
function signUpAPI(data: {
  email: string;
  password: string;
  nickname: string;
}) {
  return axios.post('/user', data);
}
function* signUp(action: AnyAction) {
  try {
    yield call(signUpAPI, action.data);
    // yield delay(1000);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: SIGN_UP_FAILURE,
        error: err.response?.data,
      });
  }
}

function FollowAPI(data: number) {
  return axios.patch(`/user/${data}/follow`);
}
function* Follow(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(FollowAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: FOLLOW_FAILURE,
        error: err.response?.data,
      });
  }
}

function UnFollowAPI(data: number) {
  return axios.delete(`/user/${data}/follow`);
}
function* UnFollow(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    yield call(UnFollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: UNFOLLOW_FAILURE,
        error: err.response?.data,
      });
  }
}

function LoadMyInfoAPI() {
  return axios.get('/user');
}
function* LoadMyInfo(): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(LoadMyInfoAPI);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: LOAD_MY_INFO_FAILURE,
        error: err.response?.data,
      });
  }
}

function changeNicknameAPI(data: string) {
  return axios.patch('/user/nickname', { nickname: data });
}
function* changeNickname(
  action: AnyAction,
): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: CHANGE_NICKNAME_FAILURE,
        error: err.response?.data,
      });
  }
}

function loadFollowingsAPI() {
  return axios.get('/user/followings');
}
function* loadFollowings(): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(loadFollowingsAPI);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: LOAD_FOLLOWINGS_FAILURE,
        error: err.response?.data,
      });
  }
}

function loadFollowersAPI() {
  return axios.get('/user/followers');
}
function* loadFollowers(): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(loadFollowersAPI);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: LOAD_FOLLOWERS_FAILURE,
        error: err.response?.data,
      });
  }
}

function blockUserAPI(data: number) {
  return axios.delete(`/user/follower/${data}`);
}
function* blockUser(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(blockUserAPI, action.data);
    yield put({
      type: BLOCK_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: BLOCK_USER_FAILURE,
        error: err.response?.data,
      });
  }
}

function getUserInfoAPI(data: number) {
  return axios.get(`/user/info/${data}`);
}
function* getUserInfo(
  action: AnyAction,
): Generator<AnyAction, void, AnyAction> {
  // action.data는 userId가 담겨있음
  try {
    const result = yield call(getUserInfoAPI, action.data);
    yield put({
      type: GET_USER_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: GET_USER_INFO_FAILURE,
        error: err.response?.data,
      });
  }
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}
function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}
function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}
function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, Follow);
}
function* watchUnFollow() {
  yield takeLatest(UNFOLLOW_REQUEST, UnFollow);
}
function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, LoadMyInfo);
}
function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}
function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}
function* watchBlockUser() {
  yield takeLatest(BLOCK_USER_REQUEST, blockUser);
}
function* watchGetUserInfo() {
  yield takeLatest(GET_USER_INFO_REQUEST, getUserInfo);
}
export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnFollow),
    fork(watchLoadMyInfo),
    fork(watchChangeNickname),
    fork(watchLoadFollowings),
    fork(watchLoadFollowers),
    fork(watchBlockUser),
    fork(watchGetUserInfo),
  ]);
}
