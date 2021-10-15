import AppLayout from "../components/AppLayout";
import Head from "next/head";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowingList from "../components/FollowingList";
import FollowerList from "../components/FollwerList";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Router from "next/router";
const Profile = () => {
  const { me } = useSelector((state) => state.user);
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
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
        <FollowingList header="Follwers" data={me.Followers} />
      </AppLayout>
    </>
  );
};
export default Profile;
