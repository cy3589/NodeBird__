import { useCallback, VFC } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '@reducers/user';
import storeInterface, { postInterface } from '@interfaces/storeInterface';

const FollowButton: VFC<{ post: postInterface }> = ({ post }) => {
  // post에는 post의 정보가 포함되어있음
  // post의 정보: post의 id, post의 content, Comments, Image, 작성자(.User)의 id,nickname
  const { me, followLoading, unFollowLoading } = useSelector(
    (state: storeInterface) => state.user,
  );
  // me에는 내 정보가 담김(nickname, id, Posts, Followings, Followers)가 담김, Followings,Followers에는 nickname있음
  const dispatch = useDispatch();
  const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
  const onClickButton = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: post.User.id,
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post.User.id,
      });
    }
  }, [dispatch, isFollowing, post.User.id]);
  if (post.User.id === me?.id) {
    return null;
  }

  return (
    <div>
      <Button
        loading={followLoading || unFollowLoading}
        onClick={onClickButton}
        style={{
          borderRadius: '20px',
        }}
      >
        {isFollowing ? 'UnFollow' : 'Follow'}
      </Button>
    </div>
  );
};

export default FollowButton;
