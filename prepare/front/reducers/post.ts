import { postStoreInterface } from '@interfaces/storeInterface';
import produce from 'immer';
import { AnyAction } from 'redux';

export const initialState: postStoreInterface = {
  mainPosts: [],
  imagePaths: [],
  singlePost: null,
  nowShowLikers: [],

  likePostLoading: false,
  likePostDone: false,
  likePostError: null,

  unLikePostLoading: false,
  unLikePostDone: false,
  unLikePostError: null,

  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  hasMorePosts: true,

  addPostLoading: false,
  addPostDone: false,
  addPostError: null,

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,

  removePostLoading: false,
  removePostDone: false,
  removePostError: null,

  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,

  retweetLoading: false,
  retweetDone: false,
  retweetError: null,

  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,

  loadMoreCommentsLoading: false,
  loadMoreCommentsDone: false,
  loadMoreCommentsError: null,
  hasMoreComments: true,

  editPostLoading: false,
  editPostDone: false,
  editPostError: null,

  removeCommentLoading: false,
  removeCommentDone: false,
  removeCommentError: null,

  editCommentLoading: false,
  editCommentDone: false,
  editCommentError: null,

  loadLikersLoading: false,
  loadLikersDone: false,
  loadLikersError: null,
  hasMoreLikers: true,

  isAnothersProfile: false,
};
export const IS_ANOTHERS_PROFILE = 'IS_ANOTHERS_PROFILE';

export const EDIT_POST_REQUEST = 'EDIT_POST_REQUEST';
export const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';
export const EDIT_POST_FAILURE = 'EDIT_POST_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const RETWEET_REQUEST = 'REWTEET_REQUEST';
export const RETWEET_SUCCESS = 'REWTEET_SUCCESS';
export const RETWEET_FAILURE = 'REWTEET_FAILURE';

export const LOAD_MORE_COMMENTS_REQUEST = 'LOAD_MORE_COMMENTS_REQUEST';
export const LOAD_MORE_COMMENTS_SUCCESS = 'LOAD_MORE_COMMENTS_SUCCESS';
export const LOAD_MORE_COMMENTS_FAILURE = 'LOAD_MORE_COMMENTS_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

export const REMOVE_COMMENT_REQUEST = 'REMOVE_COMMENT_REQUEST';
export const REMOVE_COMMENT_SUCCESS = 'REMOVE_COMMENT_SUCCESS';
export const REMOVE_COMMENT_FAILURE = 'REMOVE_COMMENT_FAILURE';

export const EDIT_COMMENT_REQUEST = 'EDIT_COMMENT_REQUEST';
export const EDIT_COMMENT_SUCCESS = 'EDIT_COMMENT_SUCCESS';
export const EDIT_COMMENT_FAILURE = 'EDIT_COMMENT_FAILURE';

export const SHOW_LIKERS_MODAL_REQUEST = 'SHOW_LIKERS_MODAL_REQUEST';
export const SHOW_LIKERS_MODAL_SUCCESS = 'SHOW_LIKERS_MODAL_SUCCESS';
export const SHOW_LIKERS_MODAL_FAILURE = 'SHOW_LIKERS_MODAL_FAILURE';
export const SHOW_LIKERS_MODAL_CLOSE = 'SHOW_LIKERS_MODAL_CLOSE';

export const addPost = (data: FormData) => ({
  type: ADD_POST_REQUEST,
  data, // TEXT정보만 담겨있음, ADD_POST_REQUEST 액션 실행->SAGA에서 data를 가지고 실행
});

export const addComment = (data: {
  content: string;
  postId: number;
  userId: number;
  isSinglePost: boolean;
}) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const reducer = (state = initialState, action: AnyAction = { type: '' }) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case IS_ANOTHERS_PROFILE:
        draft.isAnothersProfile = action.data;
        break;

      case SHOW_LIKERS_MODAL_REQUEST:
        draft.loadLikersLoading = true;
        draft.loadLikersDone = false;
        draft.loadLikersError = null;
        break;
      case SHOW_LIKERS_MODAL_SUCCESS:
        draft.nowShowLikers.push(...action.data);
        draft.loadLikersLoading = false;
        draft.loadLikersDone = true;
        draft.hasMoreLikers = action.data.length === 10;
        break;
      case SHOW_LIKERS_MODAL_FAILURE:
        draft.loadLikersLoading = false;
        draft.loadLikersError = action.error;
        break;
      case SHOW_LIKERS_MODAL_CLOSE:
        draft.nowShowLikers = [];
        break;
      case EDIT_COMMENT_REQUEST:
        draft.editCommentLoading = true;
        draft.editCommentDone = false;
        draft.editCommentError = null;
        break;
      case EDIT_COMMENT_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex((v) => {
          return v.id === action.data.PostId;
        });
        const targetComment = draft.mainPosts[postIndex].Comments.find(
          (v) => v.id === action.data.CommentId,
        );
        if (targetComment?.content) targetComment.content = action.data.comment;
        draft.editCommentLoading = false;
        draft.editCommentDone = true;
        break;
      }
      case EDIT_COMMENT_FAILURE:
        draft.editCommentLoading = false;
        draft.editCommentError = action.error;
        break;

      case REMOVE_COMMENT_REQUEST:
        draft.removeCommentLoading = true;
        draft.removeCommentDone = false;
        draft.removeCommentError = null;
        break;
      case REMOVE_COMMENT_SUCCESS:
        if (action.data.isSinglePost && draft.singlePost) {
          draft.singlePost.Comments = draft.singlePost.Comments.filter(
            (v) => v.id !== action.data.CommentId,
          );
          draft.singlePost.commentsCount -= 1;
        } else {
          const postIndex = draft.mainPosts.findIndex((v) => {
            return v.id === action.data.PostId;
          });

          draft.mainPosts[postIndex].Comments = draft.mainPosts[
            postIndex
          ].Comments.filter((v) => v.id !== action.data.CommentId);
          draft.mainPosts[postIndex].commentsCount -= 1;
        }

        draft.removeCommentLoading = false;
        draft.removeCommentDone = true;
        break;
      case REMOVE_COMMENT_FAILURE:
        draft.removeCommentLoading = false;
        draft.removeCommentError = action.error;
        break;

      case EDIT_POST_REQUEST:
        draft.editPostLoading = true;
        draft.editPostDone = false;
        draft.editPostError = null;
        break;
      case EDIT_POST_SUCCESS: {
        const index = draft.mainPosts.findIndex((v) => {
          return v.id === action.data.id;
        });
        draft.mainPosts[index] = action.data;
        draft.editPostLoading = false;
        draft.editPostDone = true;
        break;
      }
      case EDIT_POST_FAILURE:
        draft.editPostLoading = false;
        draft.editPostError = action.error;
        break;

      case LOAD_MORE_COMMENTS_REQUEST:
        draft.loadPostLoading = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
        break;

      case LOAD_MORE_COMMENTS_SUCCESS:
        if (!draft.singlePost) {
          const targetPostIndex = draft.mainPosts.findIndex(
            (v) => v.id === action.data.postId,
          );
          draft.mainPosts[targetPostIndex].Comments.unshift(
            ...action.data.comments.reverse(),
          );
        } else {
          draft.singlePost.Comments.unshift(...action.data.comments.reverse());
        }

        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        break;
      case LOAD_MORE_COMMENTS_FAILURE:
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
        break;

      case LOAD_POST_REQUEST:
        draft.loadPostLoading = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
        break;
      case LOAD_POST_SUCCESS:
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        draft.singlePost = action.data;
        break;
      case LOAD_POST_FAILURE:
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
        break;

      case RETWEET_REQUEST:
        draft.retweetLoading = true;
        draft.retweetDone = false;
        draft.retweetError = null;
        break;
      case RETWEET_SUCCESS:
        if (!draft.isAnothersProfile) {
          draft.mainPosts.unshift(action.data);
        }
        draft.retweetLoading = false;
        draft.retweetDone = true;
        break;
      case RETWEET_FAILURE:
        draft.retweetLoading = false;
        draft.retweetError = action.error;
        break;

      // case UPLOAD_IMAGES_REQUEST:
      //   draft.uploadImagesLoading = true;
      //   draft.uploadImagesDone = false;
      //   draft.uploadImagesError = null;
      //   break;
      // case UPLOAD_IMAGES_SUCCESS:
      //   draft.imagePaths = action.data;
      //   draft.uploadImagesLoading = false;
      //   draft.uploadImagesDone = true;
      //   break;
      // case UPLOAD_IMAGES_FAILURE:
      //   draft.uploadImagesLoading = false;
      //   draft.likePostError = action.error;
      //   break;

      case LIKE_POST_REQUEST:
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
        break;
      case LIKE_POST_SUCCESS:
        if (draft.singlePost) {
          draft.singlePost.Likers.push({ id: action.data.UserId });
        } else {
          const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
          post?.Likers.push({ id: action.data.UserId });
        }
        draft.likePostLoading = false;
        draft.likePostDone = true;
        break;
      case LIKE_POST_FAILURE:
        draft.likePostLoading = false;
        draft.likePostError = action.error;
        break;

      case UNLIKE_POST_REQUEST:
        draft.unLikePostLoading = true;
        draft.unLikePostDone = false;
        draft.unLikePostError = null;
        break;
      case UNLIKE_POST_SUCCESS:
        if (draft.singlePost) {
          draft.singlePost.Likers = draft.singlePost.Likers.filter(
            (v) => v.id !== action.data.UserId,
          );
        } else {
          const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
          if (post)
            post.Likers = post.Likers.filter(
              (v) => v.id !== action.data.UserId,
            );
        }
        draft.unLikePostLoading = false;
        draft.unLikePostDone = true;
        break;
      case UNLIKE_POST_FAILURE:
        draft.unLikePostLoading = false;
        draft.unLikePostError = action.error;
        break;

      case LOAD_USER_POSTS_REQUEST:
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_USER_POSTS_SUCCESS:
      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_POSTS_SUCCESS:
        draft.mainPosts = draft.mainPosts.concat(action.data);
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.hasMorePosts = action.data.length === 10;
        break;
      case LOAD_USER_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;

      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.mainPosts.unshift(action.data);
        draft.addPostLoading = false;
        draft.addPostDone = true;
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS:
        if (action.data.isSinglePost && draft.singlePost) {
          draft.singlePost.Comments.push(action.data);
          draft.singlePost.commentsCount += 1;
        } else {
          const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
          if (post) {
            post.Comments.push(action.data);
            post.commentsCount += 1;
          }
        }
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;

      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.mainPosts = draft.mainPosts.filter((v) => {
          return v.id !== action.data.PostId;
        });
        draft.removePostLoading = false;
        draft.removePostDone = true;
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;

      default:
        break;
    }
  });
};

export default reducer;
