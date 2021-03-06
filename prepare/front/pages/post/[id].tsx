import { useRouter } from 'next/router';
import Error from 'next/error';
import { END } from 'redux-saga';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Head from 'next/head';
import wrapper from '@store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '@reducers/user';
import { LOAD_POST_REQUEST } from '@reducers/post';
import AppLayout from '@components/AppLayout';
import PostCard from '@components/PostCard';
import storeInterface, { SagaStore } from '@interfaces/storeInterface';
import { useEffect } from 'react';

const Post = () => {
  const dispatch = useDispatch();
  const { singlePost, loadPostError } = useSelector(
    (state: storeInterface) => state.post,
  );
  const { me } = useSelector((state: storeInterface) => state.user);
  useEffect(() => {
    if (!me) dispatch({ type: LOAD_MY_INFO_REQUEST });
  }, [dispatch, me]);
  const router = useRouter();
  const { id } = router.query;
  if (loadPostError && !singlePost) {
    return <Error statusCode={404} title="존재하지 않는 게시글입니다" />;
  }
  return (
    singlePost && (
      <AppLayout>
        <Head>
          <title>{singlePost.User.nickname}님의 글</title>
          <meta name="description" content={singlePost.content} />
          <meta
            property="og:title"
            content={`${singlePost.User.nickname}님의 게시글`}
          />
          <meta property="og:description" content={singlePost.content} />
          <meta
            property="og:image"
            content={
              singlePost.Images[0]
                ? singlePost.Images[0].src
                : 'https://nodebird.com/favicon.ico'
            }
          />
          {/* <meta property="og:url" content={`https://nodebird.com/post/${id}`} /> */}
          {/* 수정 필요 */}
          <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
        </Head>
        <PostCard post={{ ...singlePost, isSinglePost: true }} />
      </AppLayout>
    )
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    if (axios.defaults.headers) {
      const cookie = ctx.req ? ctx.req.rawHeaders : '';
      axios.defaults.headers.Cookie = '';
      if (ctx.req && cookie) {
        axios.defaults.headers.Cookie = cookie.toString();
      }
    }
    store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    store.dispatch({ type: LOAD_POST_REQUEST, data: ctx.params?.id });

    store.dispatch(END);
    await (store as SagaStore).sagaTask.toPromise();
    return { props: {} };
  },
);
export default Post;
