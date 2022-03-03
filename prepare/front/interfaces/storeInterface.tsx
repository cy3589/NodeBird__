import { AnyAction, Store } from 'redux';
import { Task } from 'redux-saga';

export interface followInterface {
  id: number;
  nickname?: string;
  Follow?: {
    createdAt: string;
    updatedAt: string;
    FollowingId: number;
    FollowerId: number;
  };
}
export interface meInterface {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  Posts: Array<{ id: number; RetweetId?: number }>;
  Followers: Array<followInterface>;
  Followings: Array<followInterface>;
}
export interface userStoreInterface {
  loadMyInfoLoading: boolean;
  loadMyInfoDone: boolean;
  loadMyInfoError: any | null;

  logInLoading: boolean;
  logInDone: boolean;
  logInError: any | null;

  logOutLoading: boolean;
  logOutDone: boolean;
  logOutError: any | null;

  signUpLoading: boolean;
  signUpDone: boolean;
  signUpError: any | null;

  changeNicknameLoading: boolean;
  changeNicknameDone: boolean;
  changeNicknameError: any | null;

  followLoading: boolean;
  followDone: boolean;
  followError: any | null;

  unFollowLoading: boolean;
  unFollowDone: boolean;
  unFollowError: any | null;

  loadFollowingsLoading: boolean;
  loadFollowingsDone: boolean;
  loadFollowingsError: any | null;

  loadFollowersLoading: boolean;
  loadFollowersDone: boolean;
  loadFollowersError: any | null;

  blcokUserLoading: boolean;
  blcokUserDone: boolean;
  blcokUserError: any | null;

  getUserInfoLoading: boolean;
  getUserInfoDone: boolean;
  getUserInfoError: any | null;

  editModeWhat: any | null;

  getUserInfo: any | null;
  me?: meInterface;
  signUpData: any;
  loginData: any;
  userInfo: any;
}
interface comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  UserId: number;
  PostId: number;
  isSinglePost: boolean;
  User: { id: number; nickname: string };
}
export interface ImagesInterface {
  id: number;
  src: string;
  createdAt: string;
  updatedAt: string;
}
export interface postInterface {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  UserId: number;
  RetweetId: null;
  User: {
    id: number;
    nickname: string;
  };
  Images: ImagesInterface[];
  Comments: comment[];
  Likers: any[];
  Retweet: any;
  commentsCount: number;
  isSinglePost?: boolean;
}
export interface postStoreInterface {
  mainPosts: Array<postInterface>;
  imagePaths: Array<string>;
  singlePost: postInterface | null;
  nowShowLikers: Array<any>;

  likePostLoading: boolean;
  likePostDone: boolean;
  likePostError: any | null;

  unLikePostLoading: boolean;
  unLikePostDone: boolean;
  unLikePostError: any | null;

  loadPostsLoading: boolean;
  loadPostsDone: boolean;
  loadPostsError: any | null;
  hasMorePosts: boolean;

  addPostLoading: boolean;
  addPostDone: boolean;
  addPostError: any | null;

  addCommentLoading: boolean;
  addCommentDone: boolean;
  addCommentError: any | null;

  removePostLoading: boolean;
  removePostDone: boolean;
  removePostError: any | null;

  uploadImagesLoading: boolean;
  uploadImagesDone: boolean;
  uploadImagesError: any | null;

  retweetLoading: boolean;
  retweetDone: boolean;
  retweetError: any | null;

  loadPostLoading: boolean;
  loadPostDone: boolean;
  loadPostError: any | null;

  loadMoreCommentsLoading: boolean;
  loadMoreCommentsDone: boolean;
  loadMoreCommentsError: any | null;
  hasMoreComments: boolean;

  editPostLoading: boolean;
  editPostDone: boolean;
  editPostError: any | null;

  removeCommentLoading: boolean;
  removeCommentDone: boolean;
  removeCommentError: any | null;

  editCommentLoading: boolean;
  editCommentDone: boolean;
  editCommentError: any | null;

  loadLikersLoading: boolean;
  loadLikersDone: boolean;
  loadLikersError: any | null;
  hasMoreLikers: boolean;

  isAnothersProfile: boolean;
}

interface storeInterface {
  user: userStoreInterface;
  post: postStoreInterface;
}
export interface SagaStore extends Store<any, AnyAction> {
  sagaTask: Task;
  dispatch: any;
}

export default storeInterface;
