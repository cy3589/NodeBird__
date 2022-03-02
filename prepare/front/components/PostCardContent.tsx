import { useCallback, VFC } from 'react';
import Link from 'next/link';
import { Input } from 'antd';
import { useSelector } from 'react-redux';
import storeInterface from '@interfaces/storeInterface';

interface PostCardContentProps {
  postData: any;
  editMode?: any;
  setPostData?: any;
  postId: any;
  postContent: any;
}
const PostCardContent: VFC<PostCardContentProps> = ({
  postData,
  editMode,
  setPostData,
  postId,
  postContent,
}) => {
  const { editModeWhat } = useSelector((state: storeInterface) => state.user);
  const onChangeEditText = useCallback(
    (e) => {
      setPostData(e.target.value);
    },
    [setPostData],
  );
  if (editMode && editModeWhat?.edit === 'Post') {
    if (editModeWhat?.id === postId)
      return (
        <Input.TextArea
          autoSize={{ minRows: 4, maxRows: 10 }}
          defaultValue={postData}
          onChange={onChangeEditText}
          style={{ borderRadius: '10px' }}
        />
      );
    return postContent.split(/(#[^\s#]+)/g).map((v: string, i: number) => {
      if (v.match(/(#[^\s#]+)/)) {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Link key={i} href={`/hashtag/${v.slice(1)}`}>
            {v}
          </Link>
        );
      }
      return v;
    });
  }
  return null;
};

export default PostCardContent;
