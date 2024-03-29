/** @jsxImportSource @emotion/react */
import { FC, useCallback } from 'react';
import { css, Global } from '@emotion/react';
import Link from 'next/link';
import { Menu, Input, Row, Col, Card, Avatar } from 'antd';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import UserProfile from '@components/UserProfile';
import LoginForm from '@components/LoginForm';
import useInput from '@hooks/useInput';
import storeInterface from '@interfaces/storeInterface';

const GlobalStyle = () => (
  <Global
    styles={css`
      .ant-input-search
        > .ant-input-group
        > .ant-input-group-addon:last-child
        .ant-input-search-button {
        border-radius: 10px;
      }
      .ant-modal-content {
        border-radius: 10px;
        overflow: hidden;
      }
      .ant-btn {
        border-radius: 10px;
      }

      .ant-row {
        margin-right: 0 !important;
        margin-left: 0 !important;
      }
      .ant-row:last-child {
        padding: 0 4px 0 4px;
      }
      .ant-col:first-of-type {
        // padding-left: 0 !important;
      }
      .ant-col:last-child {
        // padding-right: 0 !important;
      }
      span {
        white-space: nowrap;
      }
      * {
        white-space: pre-wrap;
        word-break: break-all;
      }
      .ant-card-head-wrapper {
      }
      .ant-card-body * {
      }

      .testTransition-enter {
        opacity: 0;
        transform: scale(0.9);
        max-height: 0;
      }
      .testTransition-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: 0.7s;
        max-height: 1500px;
      }
      .testTransition-exit {
        opacity: 1;
        max-height: 1500px;
      }
      .testTransition-exit-active {
        opacity: 0;
        max-height: 0;
        transform: scale(0.9);
        transition: 0.7s;
      }
    `}
  />
);
interface AppLayoutProps {
  anotherUserProfile?: boolean;
  anotherUserInfo?: {
    id: number;
    postsLength: number;
    followingsLength: number;
    followersLength: number;
    nickname: string;
  };
  isHashtag?: string;
}
const AppLayout: FC<AppLayoutProps> = ({
  children,
  anotherUserProfile,
  anotherUserInfo,
  isHashtag,
}) => {
  const { me } = useSelector((state: storeInterface) => state.user);
  const [searchInput, onChangeSerachInput] = useInput('');
  const onSerach = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);
  return (
    <div style={{ backgroundColor: 'aliceblue', height: '100%' }}>
      <GlobalStyle />
      <Menu
        mode="horizontal"
        // selectedKeys={[Router.pathname]}
        style={{ position: 'sticky', top: '0', zIndex: 1 }}
      >
        <Menu.Item key="node-bird">
          <Link href="/" passHref>
            <p>HOME</p>
          </Link>
        </Menu.Item>
        {me && (
          <Menu.Item key="profile">
            <Link href="/profile" passHref>
              <p>내 프로필</p>
            </Link>
          </Menu.Item>
        )}
        <Menu.Item key="search-button">
          <Input.Search
            style={{ verticalAlign: 'middle' }}
            enterButton
            value={searchInput}
            onChange={onChangeSerachInput}
            onSearch={onSerach}
          />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? (
            <UserProfile
              anotherUserProfile={anotherUserProfile}
              anotherUserInfo={anotherUserInfo} // id값 들어있음.
            />
          ) : (
            !anotherUserProfile && <LoginForm />
          )}
        </Col>
        <Col xs={24} md={12}>
          {isHashtag && (
            <Card
              style={{
                width: 'fit-content',
                borderRadius: '10px',
                marginBottom: '20px',
                marginTop: '8px',
                left: '50%',
                right: '50%',
                transform: 'translate(-50% )',
              }}
            >{`#${isHashtag}`}</Card>
          )}
          {anotherUserInfo && anotherUserInfo.id !== me?.id ? (
            <Card
              key={anotherUserInfo.id}
              style={{
                margin: '10px 0 10px 0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
              actions={[
                <div key="twit">
                  게시물
                  <br />
                  {anotherUserInfo.postsLength}
                </div>,
                <div key="followings">
                  팔로잉
                  <br />
                  {anotherUserInfo.followingsLength}
                </div>,
                <div key="followers">
                  팔로워
                  <br />
                  {anotherUserInfo.followersLength}
                </div>,
              ]}
            >
              <Card.Meta
                title={anotherUserInfo.nickname}
                avatar={<Avatar>{anotherUserInfo.nickname[0]}</Avatar>}
              />
            </Card>
          ) : null}
          {children}
        </Col>
      </Row>
    </div>
  );
};

AppLayout.defaultProps = {
  anotherUserProfile: false,
  anotherUserInfo: undefined,
  isHashtag: undefined,
};
export default AppLayout;
