import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { END } from "redux-saga";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";

const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, retweetError } = useSelector(
    (state) => state.post
  );
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch({ type: LOAD_MY_INFO_REQUEST });
  //   dispatch({ type: LOAD_POSTS_REQUEST });
  // }, []);
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  return (
    <AppLayout>
      {me && <PostForm />}
      <InfiniteScroll
        key="InfiniteScroll"
        dataLength={mainPosts.length}
        next={() => {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          return dispatch({ type: LOAD_POSTS_REQUEST, lastId });
        }}
        hasMore={hasMorePosts}
      >
        {mainPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </AppLayout>
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
    store.dispatch({ type: LOAD_POSTS_REQUEST });

    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);
export default Home;
