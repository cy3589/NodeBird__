import { Button, Form, Input } from 'antd';
import { useCallback, useEffect, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SendOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import useInput from '@hooks/useInput';
import { ADD_COMMENT_REQUEST } from '@reducers/post';
import storeInterface from '@interfaces/storeInterface';

interface CommnetFormProps {
  post: {
    id: number;
    isSinglePost?: boolean;
  };
  commentFormOpend: boolean;
}
const CommentForm: VFC<CommnetFormProps> = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state: storeInterface) => state.user.me?.id);
  const { addCommentDone, addCommentLoading } = useSelector(
    (state: storeInterface) => state.post,
  );
  const [commentText, onChangeCommentText, setCommentText] = useInput('');
  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone, setCommentText]);

  const onSubmitComment = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    if (!commentText) {
      return alert('댓글을 작성하세요');
    }
    return dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        content: commentText,
        postId: post.id,
        userId: id,
        isSinglePost: post.isSinglePost,
      },
    });
  }, [commentText, dispatch, id, post.id, post.isSinglePost]);
  return (
    <Form
      onFinish={onSubmitComment}
      // @ts-ignore
      css={css`
        margin: 5px -4px 0px -4px;
      `}
    >
      <Form.Item
        style={{
          position: 'relative',
          margin: 0,
        }}
      >
        <div key={post.id}>
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 10 }}
            style={{ borderRadius: '10px' }}
            className="commentInputArea"
            value={commentText}
            onChange={onChangeCommentText}
            rows={4}
            autoFocus={false} // true로 수정
          />
          <Button
            loading={addCommentLoading}
            type="primary"
            htmlType="submit"
            style={{
              width: '13%',
              float: 'right',
              marginRight: '1%',
              marginTop: '1.5%',
              borderRadius: '10px',
            }}
            icon={<SendOutlined />}
          />
        </div>
      </Form.Item>
    </Form>
  );
};

export default CommentForm;
