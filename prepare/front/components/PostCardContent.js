import PropTypes from "prop-types";
import Link from "next/link";
// import useInput from "../hooks/useInput";
import React, { useCallback } from "react";
import { Input } from "antd";
import { useSelector } from "react-redux";

const PostCardContent = ({
  postData,
  editMode,
  setPostData,
  postId,
  postContent,
}) => {
  const { editModeWhat } = useSelector((state) => state.user);
  const onChangeEditText = useCallback(
    (e) => {
      setPostData(e.target.value);
    },
    [postData]
  );
  return (
    <>
      {editMode &&
      editModeWhat?.edit === "Post" &&
      editModeWhat?.id === postId ? (
        <>
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 10 }}
            defaultValue={postData}
            onChange={onChangeEditText}
            style={{ borderRadius: "10px" }}
          />
        </>
      ) : (
        <>
          {postContent.split(/(#[^\s#]+)/g).map((v, i) => {
            if (v.match(/(#[^\s#]+)/)) {
              return (
                <Link key={i} href={`/hashtag/${v.slice(1)}`}>
                  <a>{v}</a>
                </Link>
              );
            }
            return v;
          })}
        </>
      )}
    </>
  );
};
PostCardContent.defaultProps = {
  editMode: false,
  setPostData: null,
};
PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  setPostData: PropTypes.func,
  postId: PropTypes.node.isRequired,
  postContent: PropTypes.node.isRequired,
};

export default PostCardContent;
