import { all, fork, delay, put, takeLatest, call } from "redux-saga/effects";
import axios from "axios";
import {
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  ADD_POST_TO_ME,
  REMOVE_POST_OF_ME,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_FAILURE,
  LOAD_POSTS_SUCCESS,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
} from "../reducers/post";

function addPostAPI(data) {
  return axios.post("/post", { content: data });
}
function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data); //result.data 안에 백엔드에서 보낸 정보가 담겨있음.
    yield put({
      type: ADD_POST_SUCCESS, // post 리듀서 조작부
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME, //user 리듀서 조작부
      data: result.data.id,
    });
  } catch (err) {
    console.error(err);
    put({
      type: ADD_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.post("/api/post", data);
}
function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS, // post 리듀서 조작부
      data: action.data, //post의 id값이 들어있음
    });
    yield put({
      type: REMOVE_POST_OF_ME, //user 리듀서 조작부
      data: action.data, //post의 id값이 들어있음
    });
  } catch (err) {
    console.error(err);
    put({
      type: REMOVE_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}
function* addComment(action) {
  try {
    // data: { content: commentText, postId: post.id, userId: id },
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    put({
      type: ADD_COMMENT_FAILURE,
      data: err.response.data,
    });
  }
}

function loadPostsAPI() {
  return axios.get(`/posts`);
}
function* loadPosts() {
  try {
    const result = yield call(loadPostsAPI);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    put({
      type: LOAD_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`); //data:post.id
}
function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data, //PostId, UserId가 들어있음
    });
  } catch (err) {
    console.error(err);
    put({
      type: LIKE_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function unLikePostAPI(data) {
  return axios.delete(`/post/${data}/like`); //data:post.id
}
function* unLikePost(action) {
  try {
    const result = yield call(unLikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data, //PostId, UserId가 들어있음
    });
  } catch (err) {
    console.error(err);
    put({
      type: UNLIKE_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}
function* watchLoadPosts() {
  yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
}
function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* watchUnLikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unLikePost);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchRemovePost),
    fork(watchLoadPosts),
    fork(watchLikePost),
    fork(watchUnLikePost),
  ]);
}
