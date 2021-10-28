import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { END } from "redux-saga";
import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import axios from "axios";

const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
    useSelector((state) => state.post);
  const [ref, inView] = useInView();
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

  useEffect(() => {
    if (inView && hasMorePosts && !loadPostsLoading) {
      const lastId = mainPosts[mainPosts.length - 1]?.id;
      dispatch({ type: LOAD_POSTS_REQUEST, lastId });
    }
  }, [hasMorePosts, loadPostsLoading, mainPosts, inView]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => {
        return <PostCard key={post.id} post={post} />;
      })}
      <div ref={hasMorePosts && !loadPostsLoading ? ref : undefined} />
    </AppLayout>
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
    ///////////////////////////////////////////////////////////////////////////
    store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    store.dispatch({ type: LOAD_POSTS_REQUEST });

    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);
export default Home;
