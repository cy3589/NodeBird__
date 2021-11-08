import React, { useEffect } from "react";
import Router from "next/router";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { END } from "redux-saga";
import axios from "axios";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowingList from "../components/FollowingList";
import FollowerList from "../components/FollowerList";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
} from "../reducers/user";
import wrapper from "../store/configureStore";

const Profile = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }

    dispatch({ type: LOAD_FOLLOWERS_REQUEST });
    dispatch({ type: LOAD_FOLLOWINGS_REQUEST });
  }, [me && me.id]);
  if (!(me && me.id)) return null;

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowingList header="Followings" data={me.Followings} />
        <FollowerList header="Follwers" data={me.Followers} />
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
    store.dispatch({ type: LOAD_FOLLOWERS_REQUEST });
    store.dispatch({ type: LOAD_FOLLOWINGS_REQUEST });
    store.dispatch(END);
    await store.sagaTask.toPromise();
  }
);

export default Profile;
