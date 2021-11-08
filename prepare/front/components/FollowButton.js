import React, { useCallback } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowButton = ({ post }) => {
  // post에는 post의 정보가 포함되어있음
  // post의 정보: post의 id, post의 content, Comments, Image, 작성자(.User)의 id,nickname
  const { me, followLoading, unFollowLoading } = useSelector(
    (state) => state.user
  );
  // me에는 내 정보가 담김(nickname, id, Posts, Followings, Followers)가 담김, Followings,Followers에는 nickname있음
  const dispatch = useDispatch();
  const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
  if (post.User.id === me.id) {
    return null;
  }
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
  }, [isFollowing]);
  return (
    <>
      <div>
        <Button
          loading={followLoading || unFollowLoading}
          onClick={onClickButton}
          style={{
            borderRadius: "20px",
          }}
        >
          {isFollowing ? "UnFollow" : "Follow"}
        </Button>
      </div>
    </>
  );
};

FollowButton.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.shape({ id: PropTypes.number }),
  }).isRequired,
};

export default FollowButton;
