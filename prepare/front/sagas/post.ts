/* eslint-disable no-console */
import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
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
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
  LOAD_MORE_COMMENTS_FAILURE,
  LOAD_MORE_COMMENTS_REQUEST,
  LOAD_MORE_COMMENTS_SUCCESS,
  EDIT_POST_REQUEST,
  EDIT_POST_FAILURE,
  EDIT_POST_SUCCESS,
  LOAD_USER_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  REMOVE_COMMENT_REQUEST,
  REMOVE_COMMENT_SUCCESS,
  REMOVE_COMMENT_FAILURE,
  EDIT_COMMENT_REQUEST,
  EDIT_COMMENT_SUCCESS,
  EDIT_COMMENT_FAILURE,
  SHOW_LIKERS_MODAL_REQUEST,
  SHOW_LIKERS_MODAL_SUCCESS,
  SHOW_LIKERS_MODAL_FAILURE,
} from '@reducers/post';
import { AnyAction } from 'redux';

function addPostAPI(data: FormData) {
  return axios.post('/post', data);
}
function* addPost(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(addPostAPI, action.data); // result.data 안에 백엔드에서 보낸 정보가 담겨있음.
    yield put({
      type: ADD_POST_SUCCESS, // post 리듀서 조작부
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME, // user 리듀서 조작부
      data: { id: result.data.id, RetweetId: result.data.RetweetId },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: ADD_POST_FAILURE,
        error: err.response?.data,
      });
  }
}

function removePostAPI(data: number) {
  return axios.delete(`/post/${data}`); // delete는 data 못넣음. 따라서 data에 postId전달
}
function* removePost(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME, // user 리듀서 조작부
      data: result.data, // post의 id값이 들어있음
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: REMOVE_POST_FAILURE,
        error: err.response?.data,
      });
  }
}

function addCommentAPI(data: {
  content: string;
  postId: number;
  userId: number;
  isSinglePost: boolean;
}) {
  return axios.post(`/post/${data.postId}/comment`, data);
}
function* addComment(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    // data: { content: commentText, postId: post.id, userId: id },
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: { ...result.data, isSinglePost: action.data?.isSinglePost },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: ADD_COMMENT_FAILURE,
        error: err.response?.data,
      });
  }
}

function loadPostsAPI(lastId?: number) {
  return axios.get(`/posts?lastId=${lastId || 0}`);
}
function* loadPosts(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(loadPostsAPI, action.lastId);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: LOAD_POSTS_FAILURE,
        error: err.response?.data,
      });
  }
}

function likePostAPI(data: number) {
  return axios.patch(`/post/${data}/like`); // data:post.id
}
function* likePost(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data, // PostId, UserId가 들어있음
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: LIKE_POST_FAILURE,
        error: err.response?.data,
      });
  }
}

function unLikePostAPI(data: number) {
  return axios.delete(`/post/${data}/like`); // data:post.id
}
function* unLikePost(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(unLikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data, // PostId, UserId가 들어있음
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: UNLIKE_POST_FAILURE,
        error: err.response?.data,
      });
  }
}
function uploadImagesAPI(data: FormData) {
  return axios.post(`/post/images`, data); // Formdata는 {}로 감싸거나 하지 않고 그대로 전달
}
function* uploadImages(
  action: AnyAction,
): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: UPLOAD_IMAGES_FAILURE,
        data: err.response?.data,
      });
  }
}

function retweetAPI(data: number) {
  return axios.post(`/post/${data}/retweet`);
}
function* retweet(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME, // user 리듀서 조작부
      data: { id: result.data.id, RetweetId: result.data.RetweetId },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: RETWEET_FAILURE,
        error: err.response?.data,
      });
  }
}

async function loadPostAPI(data: number) {
  return axios.get(`/post/${data}`);
}
function* loadPost(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: LOAD_POST_FAILURE,
        error: err.response?.data,
      });
  }
}

function loadMoreCommentsAPI(data: { postId: number; lastCommentId: number }) {
  return axios.get(
    `/post/${data.postId}/comments?lastCommentId=${data.lastCommentId || 0}`,
  );
}
function* loadMoreComments(
  action: AnyAction,
): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(loadMoreCommentsAPI, action.data);
    yield put({
      type: LOAD_MORE_COMMENTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: LOAD_MORE_COMMENTS_FAILURE,
        error: err.response?.data,
      });
  }
}
function editPostAPI(data: { content: string; postId: number }) {
  return axios.patch(`/post/edit/${data.postId}`, data);
}

function* editPost(action: AnyAction): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(editPostAPI, action.data);
    yield put({
      type: EDIT_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: EDIT_POST_FAILURE,
        error: err.response?.data,
      });
  }
}

function loadUserPostsAPI(data: string, lastId?: number) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}
function* loadUserPosts(
  action: AnyAction,
): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: LOAD_USER_POSTS_FAILURE,
        error: err.response?.data,
      });
  }
}

function loadHashtagPostsAPI(data: string, lastId?: number) {
  return axios.get(
    `/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`,
  );
}
function* loadHashtagPosts(
  action: AnyAction,
): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: LOAD_HASHTAG_POSTS_FAILURE,
        error: err.response?.data,
      });
  }
}

function removeCommentAPI(data: {
  postId: number;
  commentUserId: number;
  commentId: number;
}) {
  return axios.delete(
    `/post/${data.postId}/${data.commentUserId}/${data.commentId}`,
  );
}
function* removeComment(
  action: AnyAction,
): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(removeCommentAPI, action.data);
    // action.data에는 postId, commentId가 담겨있다.
    yield put({
      type: REMOVE_COMMENT_SUCCESS,
      data: { ...result.data, isSinglePost: action.data?.isSinglePost },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: REMOVE_COMMENT_FAILURE,
        error: err.response?.data,
      });
  }
}

function editCommentAPI(data: {
  postId: number;
  commentUserId: number;
  commentId: number;
}) {
  return axios.patch(
    `/post/${data.postId}/${data.commentUserId}/${data.commentId}`,
    data,
  );
}
function* editComment(
  action: AnyAction,
): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(editCommentAPI, action.data);
    yield put({
      type: EDIT_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: EDIT_COMMENT_FAILURE,
        error: err.response?.data,
      });
  }
}

function showLikersModalAPI(data: { postId: number; lastLikerId: number }) {
  return axios.get(
    `/post/${data.postId}/likers?lastLikerId=${data.lastLikerId || 0}`,
  );
}
function* showLikersModal(
  action: AnyAction,
): Generator<AnyAction, void, AnyAction> {
  try {
    const result = yield call(showLikersModalAPI, action.data);
    yield put({
      type: SHOW_LIKERS_MODAL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error(err);
    if (axios.isAxiosError(err))
      yield put({
        type: SHOW_LIKERS_MODAL_FAILURE,
        error: err.response?.data,
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
function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}
function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}
function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}
function* watchLoadMoreComments() {
  yield takeLatest(LOAD_MORE_COMMENTS_REQUEST, loadMoreComments);
}
function* watchEditPost() {
  yield takeLatest(EDIT_POST_REQUEST, editPost);
}
function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}
function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}
function* watchRemoveComment() {
  yield takeLatest(REMOVE_COMMENT_REQUEST, removeComment);
}
function* watchEditComment() {
  yield takeLatest(EDIT_COMMENT_REQUEST, editComment);
}
function* watchShowLikersModal() {
  yield takeLatest(SHOW_LIKERS_MODAL_REQUEST, showLikersModal);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchRemovePost),
    fork(watchLoadPosts),
    fork(watchLikePost),
    fork(watchUnLikePost),
    fork(watchUploadImages),
    fork(watchRetweet),
    fork(watchLoadPost),
    fork(watchLoadMoreComments),
    fork(watchEditPost),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchRemoveComment),
    fork(watchEditComment),
    fork(watchShowLikersModal),
  ]);
}
