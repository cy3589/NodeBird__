import { Avatar, Button, Card } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../reducers/user";
const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);
  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);
  return (
    <>
      <Card
        actions={[
          <div key="twit">
            짹짹
            <br />
            {me.Posts.length}
          </div>,
          <div key="followings">
            팔로잉
            <br />
            {me.Followings.length}
          </div>,
          <div key="followers">
            팔로워
            <br />
            {me.Followers.length}
          </div>,
        ]}
      >
        <Card.Meta
          title={me.nickname}
          avatar={<Avatar>{me.nickname[0]}</Avatar>}
        />
        <Button onClick={onLogout} loading={logOutLoading}>
          로그아웃
        </Button>
      </Card>
    </>
  );
};
export default UserProfile;
