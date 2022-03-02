import { useCallback, useState } from 'react';
import { Avatar, Button, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { CSSTransition } from 'react-transition-group';
import { logoutRequestAction } from '@reducers/user';
import ShowFollowModal from '@components/ShowFollowModal';
import storeInterface from '@interfaces/storeInterface';
import { useRouter } from 'next/router';

const UserProfileCardStyle = styled(Card)`
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
`;

// const anotherUserProfileCardStyle = styled(Card)`
//   border-radius: 10px;
//   overflow: hidden;
//   margin-top: 10px;
// `;
// const UserProfile = ({ anotherUserProfile, anotherUserInfo }) => {
const UserProfile = () => {
  const router = useRouter();
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showWhat, setShowWhat] = useState(' ');
  const dispatch = useDispatch();
  const { me, logOutLoading, loadMyInfoLoading } = useSelector(
    (state: storeInterface) => state.user,
  );
  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction());
  }, [dispatch]);
  const onClickFollowings = useCallback(() => {
    setShowWhat('followings');
    setShowFollowModal(true);
    return null;
  }, []);
  const onClickFollowers = useCallback(() => {
    setShowWhat('followers');
    setShowFollowModal(true);
    return null;
  }, []);
  if (!me) {
    if (!loadMyInfoLoading) {
      router.push('/');
      return null;
    }
    return <div>Loading...</div>;
  }
  // parseInt(anotherUserInfo.id ,10) == parseInt(me.id) 라면 내 정보 보는중.
  return (
    <div style={{ paddingTop: '8px', marginBottom: '10px' }}>
      <CSSTransition in={showFollowModal} timeout={700} unmountOnExit>
        <ShowFollowModal
          id={me.id}
          showFollowModal={showFollowModal}
          setShowFollowModal={setShowFollowModal}
          showWhat={showWhat}
          setShowWhat={setShowWhat}
        />
      </CSSTransition>
      <UserProfileCardStyle
        actions={[
          <a href={`/user/${me.id}`} key="twit">
            게시물
            <br />
            {me.Posts.length}
          </a>,
          <div
            key="followings"
            onClick={onClickFollowings}
            onKeyPress={onClickFollowings}
            tabIndex={0}
            role="button"
          >
            팔로잉
            <br />
            {me.Followings.length}
          </div>,
          <div
            key="followers"
            onClick={onClickFollowers}
            onKeyPress={onClickFollowers}
            tabIndex={0}
            role="button"
          >
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
        <Button
          onClick={onLogout}
          loading={logOutLoading}
          style={{
            borderRadius: '10px',
            marginTop: '10px',
            marginRight: '100%',
          }}
        >
          로그아웃
        </Button>
      </UserProfileCardStyle>
    </div>
  );
};
export default UserProfile;
