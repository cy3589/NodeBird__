import PropTypes from "prop-types";
import Link from "next/link";
import useInput from "../hooks/useInput";
import { useCallback } from "react";
import { Input } from "antd";
const PostCardContent = ({ postData, editMode, setPostData }) => {
  const onChangeEditText = useCallback(
    (e) => {
      setPostData(e.target.value);
    },
    [postData]
  );
  return (
    <>
      {editMode ? (
        <>
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 10 }}
            defaultValue={postData}
            onChange={onChangeEditText}
            style={{ borderRadius: "10px" }}
          ></Input.TextArea>
        </>
      ) : (
        <>
          {postData.split(/(#[^\s#]+)/g).map((v, i) => {
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

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
