import { CloseCircleFilled } from '@ant-design/icons';
import { Avatar, Button, Comment, Input, Modal, Space } from 'antd';
import { useState, useCallback, useEffect, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
import useInput from '@hooks/useInput';
import { EDIT_MODE_WHAT } from '@reducers/user';
import { EDIT_COMMENT_REQUEST, REMOVE_COMMENT_REQUEST } from '@reducers/post';
import ReportModal from '@components/ReportModal';
import storeInterface, {
  meInterface,
  postInterface,
} from '@interfaces/storeInterface';

interface IndividualCommentProps {
  item: {
    PostId: number;
    User: { id: number; nickname: string };
    UserId: number;
    content: string;
    createdAt: string;
    id: number;
    isSinglePost?: boolean;
    updatedAt: string;
  };
  me?: meInterface | null;
  post: postInterface;
}
const IndividualComment: VFC<IndividualCommentProps> = ({ item, me, post }) => {
  const [commentEditMode, setCommentEditMode] = useState(false);
  const [comment, onChangeComment, setComment] = useInput(item.content);
  const { editModeWhat } = useSelector((state: storeInterface) => state.user);
  const { editCommentLoading, editCommentDone } = useSelector(
    (state: storeInterface) => state.post,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mode, setMode] = useState<
    'myComment' | 'myPostNotMyComment' | 'notMyPostNotMyComment' | null
  >(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const dispatch = useDispatch();
  const myComment = 'myComment';
  const myPostNotMyComment = 'myPostNotMyComment';
  const notMyPostNotMyComment = 'notMyPostNotMyComment';

  useEffect(() => {
    setCommentEditMode(false);
  }, [editCommentDone]);
  const onReportComment = useCallback(() => {
    setIsModalVisible(false);
    setIsReportModalVisible(true);
  }, []);
  const onEditComment = useCallback(() => {
    if (!comment || !comment.trim()) {
      return alert('????????? ???????????????.');
    }
    return dispatch({
      type: EDIT_COMMENT_REQUEST,
      data: {
        postId: post.id,
        commentId: item.id,
        commentUserId: item.UserId,
        comment,
      },
    });
  }, [comment, dispatch, item.UserId, item.id, post.id]);

  const onRemoveComment = useCallback(() => {
    if (!me?.id) {
      return alert('???????????? ???????????????.');
    }
    if (mode !== myComment && mode !== myPostNotMyComment) {
      return alert('????????? ???????????? ????????? ????????? ??? ????????????.');
    }

    return Modal.confirm({
      maskClosable: true,
      title: '??????????????????????',
      okText: '??????',
      cancelText: '??????',
      onOk() {
        dispatch({
          type: REMOVE_COMMENT_REQUEST,
          data: {
            commentUserId: item.UserId,
            commentId: item.id,
            postId: post.id,
            isSinglePost: post.isSinglePost || false,
          },
        });
        setIsModalVisible(false);
      },
      onCancel() {
        return null;
      },
    });
  }, [
    me?.id,
    mode,
    dispatch,
    item.UserId,
    item.id,
    post.id,
    post.isSinglePost,
  ]);

  const handleCancel = () => {
    return setIsModalVisible(false);
  };

  const onCancelEditComment = useCallback(() => {
    return Modal.confirm({
      maskClosable: true,
      title: '??????????????????????',
      content: '?????? ???????????? ?????? ????????? ???????????????.',
      okText: '?????? ??????',
      cancelText: '?????? ????????????',
      onOk() {
        setCommentEditMode(false);
        setComment(item.content);
        dispatch({ type: EDIT_MODE_WHAT, data: null });
        return null;
      },
      onCancel() {
        return null; // editMode ??????
      },
    });
  }, [dispatch, item.content, setComment]);
  const onclickComment = useCallback(
    (e) => {
      if (me && e.target.nodeName === 'DIV') {
        // ????????? ???????????? ?????????,???????????? ?????? '??????'??? ??????????????? ??????
        setMode(() => {
          if (item.UserId === me.id) return myComment;
          if (me.id === post.User.id) return myPostNotMyComment;
          return notMyPostNotMyComment;
        });
        setIsModalVisible(true);
        return null;
        // setPopoverVisible(true);
      }
      return null;
    },
    [me, item.UserId, post.User.id],
  );

  // setIsModalVisible(true);

  return (
    <li>
      <div
        onClick={onclickComment}
        onKeyPress={onclickComment}
        role="button"
        tabIndex={0}
      >
        <span>
          <Comment
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: '10px',
              paddingLeft: '10px',
              paddingRight: '7%',
              margin: '10px 0 10px 0',
              backgroundColor: 'rgba(255,255,255)',
              width: !(
                commentEditMode &&
                editModeWhat?.edit === 'Comment' &&
                editModeWhat?.id === item.id
              )
                ? 'fit-content'
                : '',
              transition: 'width 1s',
            }}
            key={item.id}
            author={
              <a
                href={`/user/${item.UserId}`}
                // @ts-ignore
                css={css`
                  color: black;
                  :hover {
                    color: #1e5878;
                  }
                `}
              >
                {item.User.nickname}
              </a>
            }
            avatar={
              <a href={`/user/${item.UserId}`}>
                <Avatar
                  // @ts-ignore
                  css={css`
                    transition: 0.2s;
                    :hover {
                      transform: scale(1.2);
                    }
                  `}
                >
                  {item.User.nickname[0]}
                </Avatar>
              </a>
            }
            content={
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {commentEditMode &&
                editModeWhat?.edit === 'Comment' &&
                editModeWhat?.id === item.id ? (
                  <div>
                    <Input.TextArea
                      style={{
                        borderRadius: '10px',
                        position: 'relative',
                      }}
                      autoSize={{ minRows: 2, maxRows: 10 }}
                      value={comment}
                      onChange={onChangeComment}
                    />
                    <Space
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        float: 'right',
                        paddingTop: '13px',
                      }}
                    >
                      <Button
                        block
                        type="primary"
                        ghost
                        style={{ width: 'fit-content' }}
                        onClick={onEditComment}
                        loading={editCommentLoading}
                      >
                        ??????
                      </Button>
                      <Button
                        block
                        danger
                        ghost
                        icon={<CloseCircleFilled />}
                        onClick={onCancelEditComment}
                      />
                    </Space>
                  </div>
                ) : (
                  <div>{item.content}</div>
                )}
              </>
            }
          />
        </span>
      </div>
      <Modal
        maskClosable
        visible={isModalVisible}
        onCancel={handleCancel}
        title={
          mode === myComment ? '??? ??????' : `${item.User.nickname} ?????? ??????`
        }
        footer={
          <div>
            {/* eslint-disable-next-line no-nested-ternary */}
            {mode === myComment ? (
              <>
                <Button
                  onClick={() => {
                    setCommentEditMode(true);
                    setIsModalVisible(false);
                    dispatch({
                      type: EDIT_MODE_WHAT,
                      data: { edit: 'Comment', id: item.id },
                    });
                  }}
                  type="primary"
                  ghost
                >
                  ??????
                </Button>
                <Button onClick={onRemoveComment} danger>
                  ??????
                </Button>
              </>
            ) : mode === myPostNotMyComment ? (
              <>
                <Button onClick={onReportComment}>??????</Button>
                <Button onClick={onRemoveComment} danger>
                  ??????
                </Button>
              </>
            ) : (
              <Button onClick={onReportComment}>??????</Button>
            )}
          </div>
        }
      >
        {item.content}
      </Modal>
      {isReportModalVisible && (
        <ReportModal
          ReportWhat="Comment"
          reportPostId={post.id}
          reportUserId={item.User.id}
          reportUserNickname={item.User.nickname}
          reportCommentId={item.id}
          reportComment={item.content}
          isModalVisible={isReportModalVisible}
          setIsModalVisible={setIsReportModalVisible}
        />
      )}
    </li>
  );
};

export default IndividualComment;
