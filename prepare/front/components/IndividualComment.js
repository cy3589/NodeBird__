import { CloseCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Comment, Input, Modal, Space } from "antd";
import { useState, useCallback, useEffect } from "react";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { EDIT_MODE_WHAT } from "../reducers/user";
import { EDIT_COMMENT_REQUEST, REMOVE_COMMENT_REQUEST } from "../reducers/post";

const IndividualComment = ({ item, me, post }) => {
  const [commentEditMode, setCommentEditMode] = useState(false);
  const [comment, onChangeComment, setComment] = useInput(item.content);
  const { editModeWhat } = useSelector((state) => state.user);
  const { editCommentLoading, editCommentDone } = useSelector(
    (state) => state.post
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mode, setMode] = useState(null);

  const dispatch = useDispatch();
  const myComment = "myComment";
  const myPostNotMyComment = "myPostNotMyComment";
  const notMyPostNotMyComment = "notMyPostNotMyComment";

  useEffect(() => {
    // if (isEditMode) setEditMode(false);
    setCommentEditMode(false);
  }, [editCommentDone]);

  const onEditComment = useCallback(() => {
    if (!comment || !comment.trim()) {
      return alert("댓글을 작성하세요.");
    }
    dispatch({
      type: EDIT_COMMENT_REQUEST,
      data: {
        postId: post.id,
        commentId: item.id,
        commentUserId: item.UserId,
        comment: comment,
      },
    });
  }, [comment]);

  const onRemoveComment = useCallback(() => {
    if (!me?.id) {
      return alert("로그인이 필요합니다.");
    }
    if (mode !== myComment) {
      return alert("타인의 게시글의 댓글은 삭제할 수 없습니다.");
    }

    Modal.confirm({
      maskClosable: true,
      title: "삭제하시겠어요?",
      okText: "삭제",
      cancelText: "취소",
      onOk() {
        dispatch({
          type: REMOVE_COMMENT_REQUEST,
          data: {
            commentUserId: item.UserId,
            commentId: item.id,
            postId: post.id,
          },
        });
        setIsModalVisible(false);
      },
      onCancel() {
        return;
      },
    });
  }, [me, mode]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onCancelEditComment = useCallback(() => {
    Modal.confirm({
      maskClosable: true,
      title: "취소하시겠어요?",
      content: "지금 취소하면 변경 내역이 삭제됩니다.",
      okText: "수정 취소",
      cancelText: "계속 수정하기",
      onOk() {
        setCommentEditMode(false);
        setComment(item.content);
        dispatch({ type: EDIT_MODE_WHAT, data: null });
        return;
      },
      onCancel() {
        return; //editMode 유지
      },
    });
  }, [commentEditMode]);
  const onclickComment = useCallback(
    (e) => {
      if (me && e.target.nodeName === "DIV") {
        // 로그인 되어있고 아바타,닉네임이 아닌 '댓글'을 클릭했는지 확인
        const mode =
          item.UserId === me.id // 내가 작성한 댓글인지 => 수정,삭제
            ? myComment
            : me.id === post.User.id // 내 게시글인지+(남의 댓글인지) => 신고, 삭제
            ? myPostNotMyComment
            : notMyPostNotMyComment; // (남의 게시글인지)+(남의 댓글인지) => 신고
        setIsModalVisible(true);
        setMode(mode);
        // setPopoverVisible(true);
      }
    },
    [me, isModalVisible]
  );

  // setIsModalVisible(true);

  return (
    <>
      <li>
        <div onClick={onclickComment}>
          <Comment
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: "10px",
              paddingLeft: "10px",
              paddingRight: "7%",
              margin: "10px 0 10px 0",
              backgroundColor: "rgba(255,255,255)",
              width:
                !(
                  commentEditMode &&
                  editModeWhat?.edit === "Comment" &&
                  editModeWhat?.id === item.id
                ) && "fit-content",
              transition: "width 1s",
            }}
            key={item.id}
            author={
              <a
                href={`/user/${item.UserId}`}
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
              <>
                {commentEditMode &&
                editModeWhat?.edit === "Comment" &&
                editModeWhat?.id === item.id ? (
                  <div>
                    <Input.TextArea
                      style={{
                        borderRadius: "10px",
                        position: "relative",
                      }}
                      autoSize={{ minRows: 2, maxRows: 10 }}
                      value={comment}
                      onChange={onChangeComment}
                    />
                    <Space
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        float: "right",
                        paddingTop: "13px",
                      }}
                    >
                      <Button
                        block
                        type="primary"
                        ghost
                        style={{ width: "fit-content" }}
                        onClick={onEditComment}
                        loading={editCommentLoading}
                      >
                        저장
                      </Button>
                      <Button
                        block
                        type="danger"
                        ghost
                        icon={<CloseCircleFilled />}
                        onClick={onCancelEditComment}
                      ></Button>
                    </Space>
                  </div>
                ) : (
                  <>
                    <div>{item.content}</div>
                  </>
                )}
              </>
            }
          />
        </div>
        <Modal
          maskClosable={true}
          visible={isModalVisible}
          onCancel={handleCancel}
          title={
            mode === myComment ? "내 댓글" : `${item.User.nickname} 님의 댓글`
          }
          footer={
            <div>
              {mode === myComment ? (
                <>
                  <Button
                    onClick={() => {
                      setCommentEditMode(true);
                      setIsModalVisible(false);
                      dispatch({
                        type: EDIT_MODE_WHAT,
                        data: { edit: "Comment", id: item.id },
                      });
                    }}
                  >
                    수정
                  </Button>
                  <Button onClick={onRemoveComment}>삭제</Button>
                </>
              ) : mode === myPostNotMyComment ? (
                <>
                  <Button>신고</Button>
                  <Button>삭제</Button>
                </>
              ) : (
                <Button>신고</Button>
              )}
            </div>
          }
        >
          {item.content}
        </Modal>
      </li>
    </>
  );
};

export default IndividualComment;
