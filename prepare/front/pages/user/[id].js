import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Avatar, Card } from "antd";
import { END } from "redux-saga";
// import Head from "next/head";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import Error from "next/error";
import axios from "axios";
import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";
import {
  LOAD_MY_INFO_REQUEST,
  GET_USER_INFO_REQUEST,
} from "../../reducers/user";
import PostCard from "../../components/PostCard";
import wrapper from "../../store/configureStore";
import AppLayout from "../../components/AppLayout";
// import UserProfile from "../../components/UserProfile";

const User = () => {
  const dispatch = useDispatch();
  const [ref, inView] = useInView();
  const router = useRouter();
  const id = router.query?.id;
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );
  // const { getUserInfo, me, getUserInfoError } = useSelector(
  const { getUserInfo, getUserInfoError } = useSelector((state) => state.user);
  if (getUserInfoError) {
    return <Error statusCode={404} title="존재하지 않는 사용자입니다" />;
  }
  useEffect(() => {
    if (inView && hasMorePosts && !loadPostsLoading) {
      const lastId = mainPosts[mainPosts.length - 1]?.id;
      dispatch({ type: LOAD_USER_POSTS_REQUEST, data: id, lastId });
    }
  }, [hasMorePosts, loadPostsLoading, mainPosts, inView]);

  return (
    <>
      <AppLayout anotherUserProfile anotherUserInfo={getUserInfo}>
        {mainPosts.map((post, index) => {
          return (
            <div key={post.id}>
              {mainPosts.length - 4 === index && (
                <div
                  ref={hasMorePosts && !loadPostsLoading ? ref : undefined}
                />
              )}
              <PostCard key={post.id} post={post} />
            </div>
          );
        })}
      </AppLayout>
    </>
  );
};

// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// import { Avatar, Button, Card } from "antd";
// import { useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutRequestAction } from "../reducers/user";
// import styled from "@emotion/styled";

// const UserProfileCardStyle = styled(Card)`
//   border-radius: 10px;
//   overflow: hidden;
// `;
// const UserProfile = () => {
//   const dispatch = useDispatch();
//   const { me, logOutLoading } = useSelector((state) => state.user);
//   const onLogout = useCallback(() => {
//     dispatch(logoutRequestAction());
//   }, []);
//   return (
//     <div style={{ paddingTop: "8px", marginBottom: "10px" }}>
//       <UserProfileCardStyle
//         actions={[
//           <div key="twit">
//             게시물
//             <br />
//             {me.Posts.length}
//           </div>,
//           <div key="followings">
//             팔로잉
//             <br />
//             {me.Followings.length}
//           </div>,
//           <div key="followers">
//             팔로워
//             <br />
//             {me.Followers.length}
//           </div>,
//         ]}
//       >
//         <Card.Meta
//           title={me.nickname}
//           avatar={<Avatar>{me.nickname[0]}</Avatar>}
//         />
//         <Button
//           onClick={onLogout}
//           loading={logOutLoading}
//           style={{ borderRadius: "10px" }}
//         >
//           로그아웃
//         </Button>
//       </UserProfileCardStyle>
//     </div>
//   );
// };
// export default UserProfile;

// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
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
    // store.dispatch({ type: LOAD_POSTS_REQUEST });
    store.dispatch({ type: GET_USER_INFO_REQUEST, data: context.params.id });
    store.dispatch({ type: LOAD_USER_POSTS_REQUEST, data: context.params.id });

    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);
export default User;
