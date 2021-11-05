import Router, { useRouter } from "next/router";
import Error from "next/error";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { useSelector } from "react-redux";
import axios from "axios";
import Head from "next/head";
import { useEffect } from "react";
const Post = () => {
  const { singlePost, loadPostError } = useSelector((state) => state.post);
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
          <meta name="description" content={singlePost.content}></meta>
          <meta
            property="og:title"
            content={`${singlePost.User.nickname}님의 게시글`}
          ></meta>
          <meta property="og:description" content={singlePost.content}></meta>
          <meta
            property="og:image"
            content={
              singlePost.Images[0]
                ? singlePost.Images[0].src
                : "https://nodebird.com/favicon.ico"
            }
          ></meta>
          <meta
            property="og:url"
            content={`https://nodebird.com/post/${id}`}
          ></meta>
        </Head>{" "}
        <PostCard post={{ ...singlePost, isSinglePost: true }} />
      </AppLayout>
    )
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const cookie = context.req ? context.req.rawHeaders : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    store.dispatch({ type: LOAD_POST_REQUEST, data: context.params.id });

    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);
export default Post;
