import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import AppLayout from '@components/AppLayout';
import PostForm from '@components/PostForm';
import PostCard from '@components/PostCard';
import { LOAD_POSTS_REQUEST } from '@reducers/post';
import { LOAD_MY_INFO_REQUEST } from '@reducers/user';
import wrapper from '@store/configureStore';
import storeInterface, { SagaStore } from '@interfaces/storeInterface';
import loadMyInfoForVercel from '@api/loadMyInfoForVercel';

const Home = () => {
  const { me } = useSelector((state: storeInterface) => state.user);
  const { mainPosts, hasMorePosts, retweetError } = useSelector(
    (state: storeInterface) => state.post,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: LOAD_MY_INFO_REQUEST });
  }, [dispatch]);
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
        loader=""
      >
        {mainPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx: GetServerSidePropsContext) => {
    // const cookie = ctx.req ? ctx.req.headers.cookie : '';
    // axios.defaults.withCredentials = true;
    // if (axios.defaults.headers) {
    //   axios.defaults.headers.Cookie = '';
    //   if (ctx.req && cookie) {
    //     axios.defaults.headers.Cookie = cookie;
    //   }
    // }
    await loadMyInfoForVercel(store);
    store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    store.dispatch({ type: LOAD_POSTS_REQUEST });
    store.dispatch(END);
    await (store as SagaStore).sagaTask.toPromise();
    return { props: {} };
  },
);
export default Home;
