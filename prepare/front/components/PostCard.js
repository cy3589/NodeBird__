import PropTypes from "prop-types";
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
  HeartTwoTone,
  CloseCircleFilled,
} from "@ant-design/icons";
import { Button, Card, Popover, Avatar, List, Comment, Modal } from "antd";
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
import confirm from "antd/lib/modal/confirm";

//  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =

const PostCard = ({ post }) => {
  const { me } = useSelector((state) => state.user);
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

  const dispatch = useDispatch();

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
    setEditMode(true);
  }, [editMode]);

  useEffect(() => {
    setEditMode(false);
  }, [editPostDone]);

  const onClickEditCancel = useCallback(() => {
    confirm({
      title: "취소하시겠어요?",
      content: "지금 취소하면 변경 내역이 삭제됩니다.",
      okText: "삭제",
      cancelText: "계속 수정하기",
      onOk() {
        setEditTextParent(post.content);
        setEditMode(false); //editMode가 취소됨
        return;
      },
      onCancel() {
        return; //editMode 유지
      },
    });
  }, [editMode]);

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
  }, [id]);

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
    confirm({
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
  const onclickComment = (commentInfo) => (e) => {
    if (e.target.nodeName === "DIV") {
      console.log("commentId: ", commentInfo.id);
      console.log("commentUserId: ", commentInfo.User.id);
      console.log("comment's PostId:", commentInfo.PostId);
      console.log("me.id:", me.id);
      confirm({
        okText: "수정",
        cancelText: "삭제",
        onOk() {
          return;
        },
        onCancel() {
          return;
        },
      });
    }
  };

  return (
    <>
      <div>
        <Card
          size="default"
          cover={<PostImages images={post.Images} />}
          style={{
            width: "100%",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            border: "1px solid #707070",
            overflow: "hidden",
            paddingTop: "6px",
            padding: "1px 1px 1px 1px",
          }}
          actions={
            editMode
              ? [
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridColumnGap: "2%",
                      paddingLeft: "2%",
                      paddingRight: "2%",
                    }}
                  >
                    <Button block type="primary" ghost onClick={onChangePost}>
                      저장
                    </Button>
                    <Button
                      block
                      type="danger"
                      ghost
                      icon={<CloseCircleFilled />}
                      onClick={onClickEditCancel}
                    />
                  </div>,
                ]
              : [
                  <RetweetOutlined key="retweet" onClick={onRetweet} />,
                  liked ? (
                    <HeartTwoTone
                      key="heart"
                      twoToneColor="#eb2f96"
                      onClick={onUnLike}
                    />
                  ) : (
                    <HeartOutlined key="heart" onClick={onLike} />
                  ),
                  <MessageOutlined key="comment" onClick={onToggleComment} />,
                  <Popover
                    key="more"
                    content={
                      <Button.Group>
                        {id && post.User.id === id ? (
                          <>
                            {!post.RetweetId && (
                              <Button onClick={onClickEditMode}>수정</Button>
                            )}
                            <Button
                              type="danger"
                              onClick={onRemovePost}
                              loading={removePostLoading}
                            >
                              삭제
                            </Button>
                          </>
                        ) : (
                          <Button>신고</Button>
                        )}
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
                  borderBottom: "1px solid #707070",
                  width: "95%",
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
                    editMode={editMode}
                    postData={post.Retweet.content}
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
                    setPostData={(v) => setEditTextParent(v)}
                  />
                }
              />
            </>
          )}
        </Card>
        {commentFormOpend ? (
          <div>
            <List
              header={
                <div key={post.id}>
                  {post.commentsCount >= post.Comments.length
                    ? `${post.commentsCount}개의 댓글`
                    : `${post.Comments.length}개의 댓글`}
                  <p />
                  {post.commentsCount > post.Comments.length && (
                    <Button
                      onClick={onMoreComments(post.id, post.Comments[0].id)}
                    >
                      댓글 더보기
                    </Button>
                  )}
                </div>
              }
              itemLayout="horizontal"
              dataSource={post.Comments}
              renderItem={(item) => (
                <>
                  <li>
                    <span onClick={onclickComment(item)}>
                      <Comment
                        style={{
                          border: "1px solid black",
                          borderRadius: "10px",
                          paddingLeft: "10px",
                          paddingRight: "10%",
                          margin: "10px 0 10px 0",
                          backgroundColor: "#f0f0f0",
                        }}
                        key={item.id}
                        author={
                          <a
                            href={`/user/${item.UserId}`}
                            css={css`
                              color: black;
                              :hover {
                                color: aquablue;
                              }
                            `}
                          >
                            {item.User.nickname}
                          </a>
                        }
                        avatar={
                          <a href={`/user/${item.UserId}`}>
                            <Avatar>{item.User.nickname[0]}</Avatar>
                          </a>
                        }
                        content={item.content}
                      />
                    </span>
                  </li>
                </>
              )}
            />
            <CommentForm post={post} commentFormOpend={commentFormOpend} />
          </div>
        ) : (
          <>
            <CommentForm post={post} commentFormOpend={commentFormOpend} />
          </>
        )}
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
