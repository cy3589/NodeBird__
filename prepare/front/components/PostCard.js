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
  Comment,
  Modal,
  Popconfirm,
  Badge,
  Space,
  Input,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import { useState, useCallback, useEffect } from "react";
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
import CommentModal from "./CommentModal";
import { css } from "@emotion/react";
import { CSSTransition } from "react-transition-group";
import IndividualComment from "./IndividualComment";
import { EDIT_MODE_WHAT } from "../reducers/user";
//  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =

const PostCard = ({ post }) => {
  const { me, editModeWhat } = useSelector((state) => state.user);
  const {
    removePostLoading,
    loadMoreCommentsLoading,
    hasMoreComments,
    editPostDone,
  } = useSelector((state) => state.post);
  const id = me?.id;
  const [commentFormOpend, setCommentFormOpend] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTextParent, setEditTextParent] = useState(post.content);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onMoreComments = useCallback(
    (postId, lastCommentId) => () => {
      dispatch({
        type: LOAD_MORE_COMMENTS_REQUEST,
        data: { postId: postId, lastCommentId: lastCommentId },
      });
    },
    []
  );

  const liked = post.Likers.find((v) => v.id === id);
  const onClickEditMode = useCallback(() => {
    console.log("onClickEditMode Clicked!!");
    dispatch({ type: EDIT_MODE_WHAT, data: { edit: "Post", id: post.id } });
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
        setEditTextParent(post.content);
        setEditMode(false); //editMode가 취소됨
        dispatch({ type: EDIT_MODE_WHAT, data: null });
        return;
      },
      onCancel() {
        return; //editMode 유지
      },
    });
    return;
  }, [editMode, editModeWhat]);

  const onChangePost = useCallback(() => {
    if (!editTextParent || !editTextParent.trim()) {
      return alert("게시글을 작성하세요.");
    }
    dispatch({
      type: EDIT_POST_REQUEST,
      data: {
        content: editTextParent,
        postId: post.id,
      },
    });
  }, [editTextParent]);
  const onRetweet = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }

    dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id, me?.Posts]);

  // setState에 콜백함수를 넣으면 전달되는 인자(prev부분)에는 이전의 데이터가 들어있다.
  const onLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    dispatch({ type: LIKE_POST_REQUEST, data: post.id });
  }, [id]);
  const onUnLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    dispatch({ type: UNLIKE_POST_REQUEST, data: post.id });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpend((prev) => !prev);
  }, []);
  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    Modal.confirm({
      maskClosable: true,
      title: "삭제하시겠어요?",
      okText: "삭제",
      cancelText: "취소",
      onOk() {
        dispatch({
          type: REMOVE_POST_REQUEST,
          data: post.id,
        });
      },
      onCancel() {
        return;
      },
    });
  }, [id]);
  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <Card
          size="default"
          cover={<PostImages images={post.Images} />}
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
            editModeWhat?.id === post.id
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
                    ></Button>
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
                      <Badge size="small" count={post.Likers.length}>
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
                      <Badge size="small" count={post.Likers.length}>
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
                    <Badge size="small" count={post.Comments.length}>
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
                          {id && post.User.id === id ? (
                            <>
                              {!post.RetweetId && (
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
                            <Button style={{ borderRadius: "10px" }}>
                              신고
                            </Button>
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
            post.RetweetId ? (
              <div
                style={{
                  fontSize: "12px",
                }}
              >
                {`${post.User.nickname}님이 리트윗 했습니다`}
              </div>
            ) : null
          }
        >
          {post.RetweetId && post.Retweet ? (
            <Card
              style={{ borderRadius: "10px" }}
              key={post.id}
              cover={<PostImages images={post.Retweet.Images} />}
            >
              <Card.Meta
                key={post.id}
                avatar={
                  <a key={post.id} href={`/user/${post.Retweet.User.id}`}>
                    <Avatar key={post.id}>
                      {post.Retweet.User.nickname[0]}
                    </Avatar>
                  </a>
                }
                title={
                  <a
                    key={post.id}
                    href={`/user/${post.Retweet.User.id}`}
                    css={css`
                      color: black;
                      :hover {
                        color: aquablue;
                      }
                    `}
                  >
                    {post.Retweet.User.nickname}
                  </a>
                }
                description={
                  <PostCardContent
                    key={post.id}
                    postData={post.Retweet.content}
                    postId={post.id}
                    postContent={post.Retweet.content}
                  />
                }
              />
            </Card>
          ) : (
            <>
              <Card.Meta
                key={post.id}
                avatar={
                  <a key={post.id} href={`/user/${post.User.id}`}>
                    <Avatar key={post.id}>{post.User.nickname[0]}</Avatar>
                  </a>
                }
                title={[
                  <a
                    href={`/user/${post.User.id}`}
                    key={post.id}
                    css={css`
                      color: black;
                      :hover {
                        color: aquablue;
                      }
                    `}
                  >
                    {post.User.nickname}
                  </a>,
                  <span key={post.id + 1} style={{ float: "right" }}>
                    {id && id != post.User.id && <FollowButton post={post} />}
                  </span>,
                ]}
                description={
                  <PostCardContent
                    editMode={editMode}
                    postData={editTextParent}
                    postId={post.id}
                    setPostData={(v) => setEditTextParent(v)}
                    postContent={post.content}
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
              header={
                <div key={post.id}>{`${post.Comments.length}개의 댓글`}</div>
              }
              itemLayout="horizontal"
              dataSource={post.Comments}
              renderItem={(item) => (
                <IndividualComment item={item} me={me} post={post} />
              )}
            />
            <CommentForm post={post} commentFormOpend={commentFormOpend} />
          </div>
        </CSSTransition>
      </div>
    </>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default PostCard;
