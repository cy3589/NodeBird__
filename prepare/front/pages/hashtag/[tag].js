import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card } from "antd";
import { END } from "redux-saga";
import Head from "next/head";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import axios from "axios";
import {
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_USER_POSTS_REQUEST,
} from "../../reducers/post";
import {
  LOAD_MY_INFO_REQUEST,
  GET_USER_INFO_REQUEST,
} from "../../reducers/user";
import PostCard from "../../components/PostCard";
import wrapper from "../../store/configureStore";
import AppLayout from "../../components/AppLayout";
import UserProfile from "../../components/UserProfile";

const User = () => {
  const dispatch = useDispatch();
  const [ref, inView] = useInView();
  const router = useRouter();
  const tag = router.query.tag;
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );
  const { getUserInfo, me } = useSelector((state) => state.user);
  useEffect(() => {
    if (inView && hasMorePosts && !loadPostsLoading) {
      const lastId = mainPosts[mainPosts.length - 1]?.id;
      dispatch({ type: LOAD_USER_POSTS_REQUEST, data: tag, lastId });
    }
  }, [hasMorePosts, loadPostsLoading, mainPosts, inView]);

  return (
    <>
      <AppLayout isHashtag={tag}>
        {mainPosts.length > 0
          ? mainPosts.map((post, index) => {
              return (
                <div key={post?.id}>
                  {mainPosts.length - 4 === index && (
                    <div
                      ref={hasMorePosts && !loadPostsLoading ? ref : undefined}
                    />
                  )}
                  <PostCard key={post?.id} post={post} />
                </div>
              );
            })
          : null}
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    ////////////////아래 작업을 안하면 프론트에서 쿠키가 공유됨////////////////////
    const cookie = context.req ? context.req.rawHeaders : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    // store.dispatch({ type: LOAD_POSTS_REQUEST });
    // store.dispatch({ type: GET_USER_INFO_REQUEST, data: context.params.id });
    store.dispatch({
      type: LOAD_HASHTAG_POSTS_REQUEST,
      data: context.params.tag,
    });

    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);
export default User;
