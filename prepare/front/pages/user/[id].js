import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Avatar, Card } from "antd";
import { END } from "redux-saga";
// import Head from "next/head";
import { useRouter } from "next/router";
import Error from "next/error";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  IS_ANOTHERS_PROFILE,
  LOAD_USER_POSTS_REQUEST,
} from "../../reducers/post";
import {
  LOAD_MY_INFO_REQUEST,
  GET_USER_INFO_REQUEST,
} from "../../reducers/user";
import PostCard from "../../components/PostCard";
import wrapper from "../../store/configureStore";
import AppLayout from "../../components/AppLayout";
// import UserProfile from "../../components/UserProfile";

const User = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const id = parseInt(router.query?.id, 10);
  const { mainPosts, hasMorePosts, retweetError } = useSelector(
    (state) => state.post
  );
  // const { getUserInfo, me, getUserInfoError } = useSelector(
  const { getUserInfo, getUserInfoError } = useSelector((state) => state.user);
  if (getUserInfoError) {
    return <Error statusCode={404} title="존재하지 않는 사용자입니다" />;
  }
  useEffect(() => {
    if (me?.id !== id) {
      dispatch({ type: IS_ANOTHERS_PROFILE, data: true });
    }
  }, []);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);
  return (
    <>
      <AppLayout anotherUserProfile anotherUserInfo={getUserInfo}>
        <InfiniteScroll
          key="InfiniteScroll"
          dataLength={mainPosts.length}
          next={() => {
            const lastId = mainPosts[mainPosts.length - 1]?.id;
            return dispatch({
              type: LOAD_USER_POSTS_REQUEST,
              data: id,
              lastId,
            });
          }}
          hasMore={hasMorePosts}
        >
          {mainPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </InfiniteScroll>
      </AppLayout>
    </>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    // //////////////아래 작업을 안하면 프론트에서 쿠키가 공유됨////////////////////
    const cookie = context.req ? context.req.rawHeaders : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    // /////////////////////////////////////////////////////////////////////////
    store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    store.dispatch({ type: GET_USER_INFO_REQUEST, data: context.params.id });
    store.dispatch({ type: LOAD_USER_POSTS_REQUEST, data: context.params.id });

    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);
export default User;
