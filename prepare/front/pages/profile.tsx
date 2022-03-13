import { useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '@components/AppLayout';
import NicknameEditForm from '@components/NicknameEditForm';
import FollowingList from '@components/FollowingList';
import FollowerList from '@components/FollowerList';
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
} from '@reducers/user';
import wrapper from '@store/configureStore';
import storeInterface, { SagaStore } from '@interfaces/storeInterface';

const Profile = () => {
  const dispatch = useDispatch();
  const { me, loadMyInfoDone } = useSelector(
    (state: storeInterface) => state.user,
  );
  useEffect(() => {
    if (!me) dispatch({ type: LOAD_MY_INFO_REQUEST });
  }, [dispatch, me]);
  useEffect(() => {
    if (!(me && me.id) && loadMyInfoDone) {
      Router.push('/');
    }
    dispatch({ type: LOAD_FOLLOWERS_REQUEST });
    dispatch({ type: LOAD_FOLLOWINGS_REQUEST });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
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
  (store) => async (ctx) => {
    const cookie = ctx.req ? ctx.req.headers.cookie : '';
    if (axios.defaults.headers) {
      axios.defaults.headers.Cookie = '';
      if (ctx.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
    }
    store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    store.dispatch({ type: LOAD_FOLLOWERS_REQUEST });
    store.dispatch({ type: LOAD_FOLLOWINGS_REQUEST });
    store.dispatch(END);
    await (store as SagaStore).sagaTask.toPromise();
    return { props: {} };
  },
);

export default Profile;
