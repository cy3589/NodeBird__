/* eslint-disable no-nested-ternary */
import { useState, useCallback, useEffect, VFC } from 'react';
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
  HeartTwoTone,
  CloseCircleFilled,
} from '@ant-design/icons';

import 'dayjs/locale/pt';
import relativeTime from 'dayjs/plugin/relativeTime';

// Load plugins

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
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { css } from '@emotion/react';
import { CSSTransition } from 'react-transition-group';
// import useInput from "../hooks/useInput";
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Router from 'next/router';
import PostImages from '@components/PostImages';
import CommentForm from '@components/CommentForm';
import PostCardContent from '@components/PostCardContent';
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
  LOAD_MORE_COMMENTS_REQUEST,
  EDIT_POST_REQUEST,
} from '@reducers/post';
import FollowButton from '@components/FollowButton';
// import CommentModal from "./CommentModal";
import IndividualComment from '@components/IndividualComment';
import { EDIT_MODE_WHAT } from '@reducers/user';
import ReportModal from '@components/ReportModal';
import ShowLikersModal from '@components/ShowLikersModal';
import storeInterface, { postInterface } from '@interfaces/storeInterface';
//  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
interface PostCardProps {
  post: postInterface & { isSinglePost?: boolean };
}
const PostCard: VFC<PostCardProps> = ({ post }) => {
  const { me, editModeWhat } = useSelector(
    (state: storeInterface) => state.user,
  );
  const { removePostLoading, editPostDone, singlePost } = useSelector(
    (state: storeInterface) => state.post,
  );
  const id = me?.id;
  const [commentFormOpend, setCommentFormOpend] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTextParent, setEditTextParent] = useState(post?.content);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showLikersModal, setShowLikersModal] = useState(false);
  dayjs.locale('ko');
  dayjs.extend(relativeTime);
  const onClickReportButton = useCallback(() => {
    setIsModalVisible(true);
  }, []);
  const dispatch = useDispatch();

  const onMoreComments = useCallback(
    (postId, lastCommentId) => () => {
      dispatch({
        type: LOAD_MORE_COMMENTS_REQUEST,
        data: { postId, lastCommentId },
      });
    },
    [dispatch],
  );

  const liked = post?.Likers.find((v) => v.id === id);
  const onClickEditMode = useCallback(() => {
    dispatch({ type: EDIT_MODE_WHAT, data: { edit: 'Post', id: post?.id } });
    setEditMode(true);
    return null;
  }, [dispatch, post?.id]);

  useEffect(() => {
    setEditMode(false);
  }, [editPostDone]);

  const onClickEditCancel = useCallback(() => {
    Modal.confirm({
      maskClosable: true,
      title: '취소하시겠어요?',
      content: '지금 취소하면 변경 내역이 삭제됩니다.',
      okText: '수정 취소',
      cancelText: '계속 수정하기',
      onOk() {
        Modal.destroyAll();
        setEditTextParent(post?.content);
        setEditMode(false); // editMode가 취소됨
        return dispatch({ type: EDIT_MODE_WHAT, data: null });
      },
      onCancel() {
        return null; // editMode 유지
      },
    });
    return null;
  }, [dispatch, post?.content]);

  const onChangePost = useCallback(() => {
    if (!editTextParent || !editTextParent.trim()) {
      return alert('게시글을 작성하세요.');
    }
    return dispatch({
      type: EDIT_POST_REQUEST,
      data: {
        content: editTextParent,
        postId: post?.id,
      },
    });
  }, [dispatch, editTextParent, post?.id]);
  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }

    return dispatch({
      type: RETWEET_REQUEST,
      data: post?.id,
    });
  }, [dispatch, id, post?.id]);

  // setState에 콜백함수를 넣으면 전달되는 인자(prev부분)에는 이전의 데이터가 들어있다.
  const onLike = useCallback(() => {
    // (e) => {
    // if (e.target.nodeName === 'SPAN' || e.target.nodeName === 'SUP') {
    //   return setShowLikersModal(true);
    // }
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({ type: LIKE_POST_REQUEST, data: post?.id });
  }, [dispatch, id, post?.id]);
  const onUnLike = useCallback(() => {
    // (e) => {
    // if (e.target.nodeName === 'SPAN' || e.target.nodeName === 'SUP') {
    //   return setShowLikersModal(true);
    // }
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({ type: UNLIKE_POST_REQUEST, data: post?.id });
  }, [dispatch, id, post?.id]);

  const onToggleComment = useCallback(() => {
    return setCommentFormOpend((prev) => !prev);
  }, []);
  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return Modal.confirm({
      maskClosable: true,
      title: '삭제하시겠어요?',
      okText: '삭제',
      cancelText: '취소',
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
  }, [dispatch, id, post?.id]);
  const onClickCard = useCallback(
    (e) => {
      if (e.target.nodeName === 'DIV' && !singlePost)
        Router.push(`/post/${post.id}`);
    },
    [post.id, singlePost],
  );

  const onClickRetweetCard = useCallback((e, retweetId) => {
    e.stopPropagation();
    if (e.target.nodeName === 'DIV') Router.push(`/post/${retweetId}`);
  }, []);

  return (
    <div style={{ marginBottom: '20px' }}>
      <Card
        onClick={onClickCard}
        size="default"
        cover={<PostImages images={post?.Images} />}
        style={{
          width: '100%',
          backgroundColor: 'rgba(255,255,255)',
          borderRadius: '10px',
          border: '1px solid #f0f0f0',
          overflow: 'hidden',
          paddingTop: '6px',
          padding: '1px 1px 1px 1px',
          // marginTop: post.isSinglePost && 8,
          marginTop: 8,
        }}
        actions={
          editMode &&
          editModeWhat?.edit === 'Post' &&
          editModeWhat?.id === post?.id
            ? [
                <Space
                  key="space"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    float: 'right',
                    paddingRight: '5%',
                  }}
                >
                  <Button
                    key="onChangePostBtn"
                    block
                    type="primary"
                    ghost
                    onClick={onChangePost}
                    style={{ width: 'fit-content' }}
                  >
                    저장
                  </Button>
                  <Button
                    key="onClickEditCancelBtn"
                    block
                    danger
                    ghost
                    icon={<CloseCircleFilled />}
                    onClick={onClickEditCancel}
                  />
                </Space>,
              ]
            : [
                // retweetInvaild
                <RetweetOutlined
                  // @ts-ignore
                  css={css`
                    color: #a0a0a0;
                    transform: scale(1.5);
                    :hover {
                      transform: scale(1.8);
                    }
                  `}
                  style={{ transition: '0.3s' }}
                  key="retweet"
                  onClick={onRetweet}
                />,
                liked ? (
                  <div
                    onClick={onUnLike}
                    onKeyPress={onUnLike}
                    role="button"
                    tabIndex={0}
                    key="unLike"
                  >
                    <Badge
                      size="small"
                      count={post?.Likers.length}
                      offset={post?.Likers.length <= 10 ? [7, 0] : [12, -2]}
                    >
                      <HeartTwoTone
                        // @ts-ignore
                        css={css`
                          transform: scale(1.5);
                          :hover {
                            transform: scale(1.8);
                          }
                        `}
                        style={{ transition: '0.3s' }}
                        key="heart"
                        twoToneColor="#eb2f96"
                      />
                    </Badge>
                  </div>
                ) : (
                  <div
                    onClick={onLike}
                    onKeyPress={onLike}
                    tabIndex={0}
                    role="button"
                    key="like"
                  >
                    <Badge
                      size="small"
                      count={post?.Likers.length}
                      offset={post?.Likers.length <= 10 ? [7, 0] : [12, -2]}
                    >
                      <HeartOutlined
                        // @ts-ignore
                        css={css`
                          color: #a0a0a0;
                          transform: scale(1.5);
                          :hover {
                            transform: scale(1.8);
                          }
                        `}
                        style={{ transition: '0.3s' }}
                        key="heart"
                      />
                    </Badge>
                  </div>
                ),
                <div
                  onClick={onToggleComment}
                  onKeyPress={onToggleComment}
                  tabIndex={0}
                  role="button"
                  key="toggleComment"
                >
                  <Badge
                    size="small"
                    count={
                      post?.commentsCount
                        ? Math.max(post?.Comments.length, post?.commentsCount)
                        : 0
                    }
                    offset={
                      Math.max(post?.Comments.length, post?.commentsCount) <= 10
                        ? [7, 0]
                        : [12, -2]
                    }
                  >
                    <MessageOutlined
                      // @ts-ignore
                      css={css`
                        color: #a0a0a0;
                        transform: scale(1.5);
                        :hover {
                          transform: scale(1.8);
                        }
                      `}
                      style={{ transition: '0.3s' }}
                      key="comment"
                    />
                  </Badge>
                </div>,
                <Popover
                  overlayInnerStyle={{ borderRadius: '10px' }}
                  key="more"
                  content={
                    <Button.Group>
                      <Space>
                        {id ? (
                          post?.User.id === id ? (
                            <>
                              {!post?.RetweetId && (
                                <Button
                                  style={{ borderRadius: '10px' }}
                                  onClick={onClickEditMode}
                                >
                                  수정
                                </Button>
                              )}
                              <Button
                                style={{ borderRadius: '10px' }}
                                danger
                                onClick={onRemovePost}
                                loading={removePostLoading}
                              >
                                삭제
                              </Button>
                            </>
                          ) : (
                            <Button
                              style={{ borderRadius: '10px' }}
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
                fontSize: '12px',
              }}
            >
              {`${post?.User.nickname}님이 리트윗 했습니다`}
            </div>
          ) : null
        }
      >
        {post?.RetweetId && post?.Retweet ? (
          <Card
            onClick={(e) => onClickRetweetCard(e, post.RetweetId)}
            style={{ borderRadius: '10px' }}
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
                  // @ts-ignore
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
          <Card.Meta
            key={post?.id}
            avatar={
              <a key={post?.id} href={`/user/${post?.User.id}`}>
                <Avatar key={post?.id}>{post?.User.nickname[0]}</Avatar>
              </a>
            }
            title={
              <>
                <a
                  key="title-nickname"
                  href={`/user/${post?.User.id}`}
                  // @ts-ignore
                  css={css`
                    color: black;
                    :hover {
                      color: aquablue;
                    }
                  `}
                >
                  {post?.User.nickname}
                </a>
                <span key="title-button" style={{ float: 'right' }}>
                  {id && id !== post.User.id && <FollowButton post={post} />}
                </span>
                <div
                  key="title-date"
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {dayjs(Date.parse(post.createdAt) - 10000).fromNow()}
                </div>
              </>
            }
            description={
              <PostCardContent
                editMode={editMode}
                postData={editTextParent}
                postId={post?.id}
                setPostData={(v = '') => setEditTextParent(v)}
                postContent={post?.content}
              />
            }
          />
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
              post?.Comments.length || post?.commentsCount ? (
                <>
                  <Card size="small" key={post?.id}>
                    {`${
                      Math.max(post?.Comments.length, post?.commentsCount) ||
                      post?.Comments.length ||
                      post?.commentsCount
                    }개의 댓글`}
                  </Card>
                  {post.Comments && post.Comments.length < post.commentsCount && (
                    <Button
                      style={{ width: 'fit-content', marginTop: '10px' }}
                      size="middle"
                      onClick={
                        post.Comments &&
                        onMoreComments(post.id, post.Comments[0]?.id)
                      }
                    >
                      {post?.commentsCount && post?.Comments.length
                        ? `${
                            post.commentsCount - post.Comments.length
                          }개의 댓글 더보기`
                        : null}
                    </Button>
                  )}
                </>
              ) : null
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

      <CSSTransition in={showLikersModal} timeout={700} unmountOnExit>
        <ShowLikersModal
          postId={post.id}
          showLikersModal={showLikersModal}
          setShowLikersModal={setShowLikersModal}
        />
      </CSSTransition>

      {isModalVisible && (
        <ReportModal
          ReportWhat="Post"
          reportPostId={post?.id}
          reportUserNickname={post?.User.nickname}
          reportUserId={post?.User.id}
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      )}
    </div>
  );
};
export default PostCard;
