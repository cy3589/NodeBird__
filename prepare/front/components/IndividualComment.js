import { CloseCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Comment, Input, Modal, Space } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import useInput from "../hooks/useInput";
import { EDIT_MODE_WHAT } from "../reducers/user";
import { EDIT_COMMENT_REQUEST, REMOVE_COMMENT_REQUEST } from "../reducers/post";
import ReportModal from "./ReportModal";

const IndividualComment = ({ item, me, post }) => {
  const [commentEditMode, setCommentEditMode] = useState(false);
  const [comment, onChangeComment, setComment] = useInput(item.content);
  const { editModeWhat } = useSelector((state) => state.user);
  const { editCommentLoading, editCommentDone } = useSelector(
    (state) => state.post
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mode, setMode] = useState(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const dispatch = useDispatch();
  const myComment = "myComment";
  const myPostNotMyComment = "myPostNotMyComment";
  const notMyPostNotMyComment = "notMyPostNotMyComment";

  useEffect(() => {
    setCommentEditMode(false);
  }, [editCommentDone]);
  const onReportComment = useCallback(() => {
    setIsModalVisible(false);
    setIsReportModalVisible(true);
  }, [isReportModalVisible, isModalVisible]);
  const onEditComment = useCallback(() => {
    if (!comment || !comment.trim()) {
      return alert("댓글을 작성하세요.");
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
  }, [comment]);

  const onRemoveComment = useCallback(() => {
    if (!me?.id) {
      return alert("로그인이 필요합니다.");
    }
    if (mode !== myComment && mode !== myPostNotMyComment) {
      return alert("타인의 게시글의 댓글은 삭제할 수 없습니다.");
    }

    return Modal.confirm({
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
            isSinglePost: post.isSinglePost,
          },
        });
        setIsModalVisible(false);
      },
      onCancel() {
        return null;
      },
    });
  }, [me, mode, item, post.commentsCount]);

  const handleCancel = () => {
    return setIsModalVisible(false);
  };

  const onCancelEditComment = useCallback(() => {
    return Modal.confirm({
      maskClosable: true,
      title: "취소하시겠어요?",
      content: "지금 취소하면 변경 내역이 삭제됩니다.",
      okText: "수정 취소",
      cancelText: "계속 수정하기",
      onOk() {
        setCommentEditMode(false);
        setComment(item.content);
        dispatch({ type: EDIT_MODE_WHAT, data: null });
        return null;
      },
      onCancel() {
        return null; // editMode 유지
      },
    });
  }, [commentEditMode]);
  const onclickComment = useCallback(
    (e) => {
      if (me && e.target.nodeName === "DIV") {
        // 로그인 되어있고 아바타,닉네임이 아닌 '댓글'을 클릭했는지 확인
        setMode(
          item.UserId === me.id
            ? myComment
            : me.id === post.User.id
            ? myPostNotMyComment
            : notMyPostNotMyComment
        );
        setIsModalVisible(true);
        return null;
        // setPopoverVisible(true);
      }
      return null;
    },
    [me, isModalVisible]
  );

  // setIsModalVisible(true);

  return (
    <>
      {console.log(post.isSinglePost)}
      <li>
        <div onClick={onclickComment}>
          <span>
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
                        />
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
          </span>
        </div>
        <Modal
          maskClosable
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
                    type="primary"
                    ghost
                  >
                    수정
                  </Button>
                  <Button onClick={onRemoveComment} type="danger">
                    삭제
                  </Button>
                </>
              ) : mode === myPostNotMyComment ? (
                <>
                  <Button onClick={onReportComment}>신고</Button>
                  <Button onClick={onRemoveComment} type="danger">
                    삭제
                  </Button>
                </>
              ) : (
                <Button onClick={onReportComment}>신고</Button>
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
    </>
  );
};

IndividualComment.defaultProps = {
  me: null,
  item: null,
};

IndividualComment.propTypes = {
  post: PropTypes.objectOf(PropTypes.object).isRequired,
  me: PropTypes.objectOf(PropTypes.object),
  item: PropTypes.objectOf(PropTypes.object),
};

export default IndividualComment;
