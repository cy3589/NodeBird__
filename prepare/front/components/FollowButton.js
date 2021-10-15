import { useCallback } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";
const FollowButton = ({ post }) => {
  //post에는 post의 정보가 포함되어있음
  //post의 정보: post의 id, post의 content, Comments, Image, 작성자(.User)의 id,nickname
  const { me, followLoading, unFollowLoading } = useSelector(
    (state) => state.user
  );
  //me에는 내 정보가 담김(nickname, id, Posts, Followings, Followers)가 담김, Followings,Followers에는 nickname있음
  const dispatch = useDispatch();
  const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
  const onClickButton = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: { id: post.User.id, nickname: post.User.nickname },
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: { id: post.User.id, nickname: post.User.nickname },
      });
    }
  }, [isFollowing]);
  return (
    <>
      <Button
        loading={followLoading || unFollowLoading}
        onClick={onClickButton}
      >
        {isFollowing ? "UnFollow" : "Follow"}
      </Button>
    </>
  );
};

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
};

export default FollowButton;
