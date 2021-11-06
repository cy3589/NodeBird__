import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
  HeartTwoTone,
  CloseCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Popover,
  Avatar,
  List,
  // Comment,
  Modal,
  // Popconfirm,
  Badge,
  Space,
  // Input,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { css } from "@emotion/react";
import { CSSTransition } from "react-transition-group";
// import useInput from "../hooks/useInput";
import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
  LOAD_MORE_COMMENTS_REQUEST,
  EDIT_POST_REQUEST,
} from "../reducers/post";
import FollowButton from "./FollowButton";
// import CommentModal from "./CommentModal";
import IndividualComment from "./IndividualComment";
import { EDIT_MODE_WHAT } from "../reducers/user";
import ReportModal from "./ReportModal";
//  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =

const PostCard = ({ post }) => {
  const { me, editModeWhat } = useSelector((state) => state.user);
  const {
    removePostLoading,
    // loadMoreCommentsLoading,
    // hasMoreComments,
    editPostDone,
  } = useSelector((state) => state.post);
  const id = me?.id;
  const [commentFormOpend, setCommentFormOpend] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTextParent, setEditTextParent] = useState(post?.content);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [reportContent, onChangeReportContent, setReportContent] = useInput("");
  // const [reportContent, setReportContent] = useInput("");

  const onClickReportButton = useCallback(() => {
    console.log("onClickReportButton Clicked!!");
    setIsModalVisible(true);
  }, [isModalVisible]);

  const dispatch = useDispatch();

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };

  // const onReportPost = () => {
  //   Modal.confirm({
  //     title: "게시글 신고",
  //     content: (
  //       <Input.TextArea
  //         placeholder="어떤 문제가 발생했나요?"
  //         style={{
  //           borderRadius: "10px",
  //           position: "relative",
  //         }}
  //         autoSize={{ minRows: 2, maxRows: 10 }}
  //         value={reportContent}
  //         onChange={(e) => setReportContent(e.target.value)}
  //       />
  //     ),
  //     maskClosable: true,
  //     cancelText: "취소",
  //     closable: true,
  //     okText: "신고하기",
  //     onOk: () => {
  //       console.log("Reported Post!!");
  //       console.log({
  //         type: "REPORT_PORT_REQUEST",
  //         data: {
  //           postId: post?.id,
  //           postedUserId: post?.UserId,
  //           reportUserId: me.id,
  //           reportContent: reportContent,
  //         },
  //       });
  //     },
  //   });
  // };
  const onMoreComments = useCallback(
    (postId, lastCommentId) => () => {
      dispatch({
        type: LOAD_MORE_COMMENTS_REQUEST,
        // data: { postId: postId, lastCommentId: lastCommentId },
        data: { postId, lastCommentId },
      });
    },
    [post.Comments]
  );

  const liked = post?.Likers.find((v) => v.id === id);
  const onClickEditMode = useCallback(() => {
    console.log("onClickEditMode Clicked!!");
    dispatch({ type: EDIT_MODE_WHAT, data: { edit: "Post", id: post?.id } });
    setEditMode(true);
  }, [editModeWhat, editMode]);

  useEffect(() => {
    // if (isEditMode) setEditMode(false);
    setEditMode(false);
  }, [editPostDone]);

  const onClickEditCancel = useCallback(() => {
    console.log("onClickEditCancel");
    Modal.confirm({
      maskClosable: true,
      title: "취소하시겠어요?",
      content: "지금 취소하면 변경 내역이 삭제됩니다.",
      okText: "수정 취소",
      cancelText: "계속 수정하기",
      onOk() {
        setEditTextParent(post?.content);
        setEditMode(false); // editMode가 취소됨
        return dispatch({ type: EDIT_MODE_WHAT, data: null });
      },
      onCancel() {
        return null; // editMode 유지
      },
    });
    return null;
  }, [editMode, editModeWhat]);

  const onChangePost = useCallback(() => {
    if (!editTextParent || !editTextParent.trim()) {
      return alert("게시글을 작성하세요.");
    }
    return dispatch({
      type: EDIT_POST_REQUEST,
      data: {
        content: editTextParent,
        postId: post?.id,
      },
    });
  }, [editTextParent]);
  const onRetweet = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }

    return dispatch({
      type: RETWEET_REQUEST,
      data: post?.id,
    });
  }, [id, me?.Posts]);

  // setState에 콜백함수를 넣으면 전달되는 인자(prev부분)에는 이전의 데이터가 들어있다.
  const onLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({ type: LIKE_POST_REQUEST, data: post?.id });
  }, [id]);
  const onUnLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({ type: UNLIKE_POST_REQUEST, data: post?.id });
  }, [id]);

  const onToggleComment = useCallback(() => {
    return setCommentFormOpend((prev) => !prev);
  }, []);
  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    return Modal.confirm({
      maskClosable: true,
      title: "삭제하시겠어요?",
      okText: "삭제",
      cancelText: "취소",
      onOk() {
        dispatch({
          type: REMOVE_POST_REQUEST,
          data: post?.id,
        });
      },
      onCancel() {
        return null;
      },
    });
  }, [id]);
  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <Card
          size="default"
          cover={<PostImages images={post?.Images} />}
          style={{
            width: "100%",
            backgroundColor: "rgba(255,255,255)",
            borderRadius: "10px",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
            paddingTop: "6px",
            padding: "1px 1px 1px 1px",
          }}
          actions={
            editMode &&
            editModeWhat?.edit === "Post" &&
            editModeWhat?.id === post?.id
              ? [
                  <Space
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      float: "right",
                      paddingRight: "5%",
                    }}
                  >
                    <Button
                      block
                      type="primary"
                      ghost
                      onClick={onChangePost}
                      style={{ width: "fit-content" }}
                    >
                      저장
                    </Button>
                    <Button
                      block
                      type="danger"
                      ghost
                      icon={<CloseCircleFilled />}
                      onClick={onClickEditCancel}
                    />
                  </Space>,
                ]
              : [
                  // retweetInvaild
                  <RetweetOutlined
                    css={css`
                      color: #a0a0a0;
                      transform: scale(1.5);
                      :hover {
                        transform: scale(1.8);
                      }
                    `}
                    style={{ transition: "0.3s" }}
                    key="retweet"
                    onClick={onRetweet}
                  />,
                  liked ? (
                    <div onClick={onUnLike}>
                      <Badge size="small" count={post?.Likers.length}>
                        <HeartTwoTone
                          css={css`
                            transform: scale(1.5);
                            :hover {
                              transform: scale(1.8);
                            }
                          `}
                          style={{ transition: "0.3s" }}
                          key="heart"
                          twoToneColor="#eb2f96"
                        />
                      </Badge>
                    </div>
                  ) : (
                    <div onClick={onLike}>
                      <Badge size="small" count={post?.Likers.length}>
                        <HeartOutlined
                          css={css`
                            color: #a0a0a0;
                            transform: scale(1.5);
                            :hover {
                              transform: scale(1.8);
                            }
                          `}
                          style={{ transition: "0.3s" }}
                          key="heart"
                        />
                      </Badge>
                    </div>
                  ),
                  <div onClick={onToggleComment}>
                    <Badge
                      size="small"
                      count={
                        post?.commentsCount &&
                        Math.max(post?.Comments.length, post?.commentsCount)
                      }
                    >
                      <MessageOutlined
                        css={css`
                          color: #a0a0a0;
                          transform: scale(1.5);
                          :hover {
                            transform: scale(1.8);
                          }
                        `}
                        style={{ transition: "0.3s" }}
                        key="comment"
                      />
                    </Badge>
                  </div>,
                  <Popover
                    overlayInnerStyle={{ borderRadius: "10px" }}
                    key="more"
                    content={
                      <Button.Group>
                        <Space>
                          {id ? (
                            post?.User.id === id ? (
                              <>
                                {!post?.RetweetId && (
                                  <Button
                                    style={{ borderRadius: "10px" }}
                                    onClick={onClickEditMode}
                                  >
                                    수정
                                  </Button>
                                )}
                                <Button
                                  style={{ borderRadius: "10px" }}
                                  type="danger"
                                  onClick={onRemovePost}
                                  loading={removePostLoading}
                                >
                                  삭제
                                </Button>
                              </>
                            ) : (
                              <Button
                                style={{ borderRadius: "10px" }}
                                onClick={onClickReportButton}
                              >
                                신고
                              </Button>
                            )
                          ) : (
                            <div>로그인이 필요합니다</div>
                          )}
                        </Space>
                      </Button.Group>
                    }
                  >
                    <EllipsisOutlined />
                  </Popover>,
                ]
          }
          title={
            post?.RetweetId ? (
              <div
                style={{
                  fontSize: "12px",
                }}
              >
                {`${post?.User.nickname}님이 리트윗 했습니다`}
              </div>
            ) : null
          }
        >
          {post?.RetweetId && post?.Retweet ? (
            <Card
              style={{ borderRadius: "10px" }}
              key={post?.id}
              cover={<PostImages images={post?.Retweet.Images} />}
            >
              <Card.Meta
                key={post?.id}
                avatar={
                  <a key={post?.id} href={`/user/${post?.Retweet.User.id}`}>
                    <Avatar key={post?.id}>
                      {post?.Retweet.User.nickname[0]}
                    </Avatar>
                  </a>
                }
                title={
                  <a
                    key={post?.id}
                    href={`/user/${post?.Retweet.User.id}`}
                    css={css`
                      color: black;
                      :hover {
                        color: aquablue;
                      }
                    `}
                  >
                    {post?.Retweet.User.nickname}
                  </a>
                }
                description={
                  <PostCardContent
                    key={post?.id}
                    postData={post?.Retweet.content}
                    postId={post?.id}
                    postContent={post?.Retweet.content}
                  />
                }
              />
            </Card>
          ) : (
            <>
              <Card.Meta
                key={post?.id}
                avatar={
                  <a key={post?.id} href={`/user/${post?.User.id}`}>
                    <Avatar key={post?.id}>{post?.User.nickname[0]}</Avatar>
                  </a>
                }
                title={[
                  <a
                    href={`/user/${post?.User.id}`}
                    key={post?.id}
                    css={css`
                      color: black;
                      :hover {
                        color: aquablue;
                      }
                    `}
                  >
                    {post?.User.nickname}
                  </a>,
                  <span key={post?.id + 1} style={{ float: "right" }}>
                    {id && id !== post?.User.id && <FollowButton post={post} />}
                  </span>,
                ]}
                description={
                  <PostCardContent
                    editMode={editMode}
                    postData={editTextParent}
                    postId={post?.id}
                    setPostData={(v) => setEditTextParent(v)}
                    postContent={post?.content}
                  />
                }
              />
            </>
          )}
        </Card>
        <CSSTransition
          in={commentFormOpend}
          timeout={700}
          classNames="testTransition"
          unmountOnExit
        >
          <div>
            <List
              locale={{
                emptyText: (
                  <>
                    <div>댓글이 없습니다.</div>
                    <div>첫 댓글을 작성해보세요!</div>
                  </>
                ),
              }}
              header={
                <>
                  {post?.Comments.length || post?.commentsCount ? (
                    <>
                      <Card size="small" key={post?.id}>
                        {`${Math.max(
                          post?.Comments.length,
                          post?.commentsCount
                        )}개의 댓글`}
                      </Card>
                      {post.Comments &&
                        post.Comments.length < post.commentsCount && (
                          <Button
                            style={{ width: "fit-content", marginTop: "10px" }}
                            size="default"
                            onClick={
                              post.Comments &&
                              onMoreComments(post.id, post.Comments[0]?.id)
                            }
                          >
                            {`${
                              post?.commentsCount - post?.Comments.length
                            }개의 댓글 더보기`}
                          </Button>
                        )}
                    </>
                  ) : null}
                </>
              }
              itemLayout="horizontal"
              dataSource={post?.Comments}
              renderItem={(item) => (
                <IndividualComment item={item} me={me} post={post} />
              )}
            />
            <CommentForm post={post} commentFormOpend={commentFormOpend} />
          </div>
        </CSSTransition>

        {isModalVisible && (
          <ReportModal
            ReportWhat="Post"
            reportPostId={post?.id}
            reportPost={post}
            reportUserNickname={post?.User.nickname}
            reportUserId={post?.User.id}
            userId={me.id}
            setIsModalVisible={setIsModalVisible}
            isModalVisible={isModalVisible}
          />
        )}
      </div>
    </>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    RetweetId: PropTypes.number,
    commentsCount: PropTypes.number,
    User: PropTypes.objectOf(PropTypes.object),
    Retweet: PropTypes.objectOf(PropTypes.object),
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
