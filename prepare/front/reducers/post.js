import produce from "immer";
export const initialState = {
  mainPosts: [],
  imagePaths: [],
  singlePost: null,

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
};

export const EDIT_POST_REQUEST = "EDIT_POST_REQUEST";
export const EDIT_POST_SUCCESS = "EDIT_POST_SUCCESS";
export const EDIT_POST_FAILURE = "EDIT_POST_FAILURE";

export const LOAD_POST_REQUEST = "LOAD_POST_REQUEST";
export const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
export const LOAD_POST_FAILURE = "LOAD_POST_FAILURE";

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";

export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

export const LOAD_HASHTAG_POSTS_REQUEST = "LOAD_HASHTAG_POSTS_REQUEST";
export const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
export const LOAD_HASHTAG_POSTS_FAILURE = "LOAD_HASHTAG_POSTS_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const RETWEET_REQUEST = "REWTEET_REQUEST";
export const RETWEET_SUCCESS = "REWTEET_SUCCESS";
export const RETWEET_FAILURE = "REWTEET_FAILURE";

export const LOAD_MORE_COMMENTS_REQUEST = "LOAD_MORE_COMMENTS_REQUEST";
export const LOAD_MORE_COMMENTS_SUCCESS = "LOAD_MORE_COMMENTS_SUCCESS";
export const LOAD_MORE_COMMENTS_FAILURE = "LOAD_MORE_COMMENTS_FAILURE";

export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";

export const REMOVE_COMMENT_REQUEST = "REMOVE_COMMENT_REQUEST";
export const REMOVE_COMMENT_SUCCESS = "REMOVE_COMMENT_SUCCESS";
export const REMOVE_COMMENT_FAILURE = "REMOVE_COMMENT_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data, // TEXT정보만 담겨있음, ADD_POST_REQUEST 액션 실행->SAGA에서 data를 가지고 실행
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case REMOVE_COMMENT_REQUEST:
        draft.removeCommentLoading = true;
        draft.removeCommentDone = false;
        draft.removeCommentError = null;
        break;
      case REMOVE_COMMENT_SUCCESS:
        const postIndex = draft.mainPosts.findIndex((v) => {
          return v.id === action.data.PostId;
        });

        draft.mainPosts[postIndex].Comments = draft.mainPosts[
          postIndex
        ].Comments.filter((v) => v.id !== action.data.CommentId);
        // const comments = draft.mainPosts[postIndex].Comments;
        // comments = comments.filter((v) => v.id !== action.data.CommentId);
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
      case EDIT_POST_SUCCESS:
        const index = draft.mainPosts.findIndex((v) => {
          return v.id === action.data.id;
        });
        draft.mainPosts[index] = action.data;
        draft.editPostLoading = false;
        draft.editPostDone = true;
        break;
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
        //    `/post/${data.postId}/comments?lastCommentId=${data.lastCommentId || 0}`
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
        draft.mainPosts.unshift(action.data);
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
        const post_ = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post_.Likers.push({ id: action.data.UserId });
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
        const post__ = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post__.Likers = post__.Likers.filter(
          (v) => v.id !== action.data.UserId
        );
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
        if (action.data.isSinglePost) {
          draft.singlePost.Comments.push(action.data);
        }
        // find함수는 배열 내 요소를 순회한다.
        // 콜백함수의 인자 v에는 배열의 요소가 담겨있고
        // 콜백이 true인 첫 번째 요소를 반환하고 종료됨
        //post에는 v.id가 action.data.postId인 요소(post객체)가 담겨있음.
        else {
          const post = draft.mainPosts.find(
            (v) => parseInt(v.id) === parseInt(action.data.PostId)
          );
          post.Comments.push(action.data);
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
