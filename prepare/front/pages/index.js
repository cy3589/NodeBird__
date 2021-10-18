import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
    useSelector((state) => state.post);
  const dispatch = useDispatch();

  console.log(mainPosts[mainPosts.length - 1]?.id);

  useEffect(() => {
    dispatch({ type: LOAD_MY_INFO_REQUEST });
    dispatch({ type: LOAD_POSTS_REQUEST });
  }, []);
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.scrollY + document.documentElement.clientHeight >
          document.documentElement.scrollHeight - 300 &&
        hasMorePosts &&
        !loadPostsLoading
      ) {
        const lastId = mainPosts[mainPosts.length - 1]?.id;
        dispatch({ type: LOAD_POSTS_REQUEST, lastId });
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => {
        return <PostCard key={post.id} post={post} />;
      })}
    </AppLayout>
  );
};
export default Home;
