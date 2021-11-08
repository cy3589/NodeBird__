/** @jsxImportSource @emotion/react */
import React, { useCallback } from "react";
import { css, Global } from "@emotion/react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col, Card, Avatar } from "antd";
import Router from "next/router";
import { useSelector } from "react-redux";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import useInput from "../hooks/useInput";

// import { useForm } from "react-hook-form";
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
const AppLayout = ({
  children,
  anotherUserProfile,
  anotherUserInfo,
  isHashtag,
}) => {
  const { me } = useSelector((state) => state.user);
  const [searchInput, onChangeSerachInput] = useInput("");
  const onSerach = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);
  return (
    <div style={{ backgroundColor: "aliceblue", height: "100%" }}>
      <GlobalStyle />
      <Menu
        mode="horizontal"
        // selectedKeys={[Router.pathname]}
        style={{ position: "sticky", top: "0", zIndex: "1" }}
      >
        <Menu.Item key="node-bird">
          <Link href="/">
            <a>HOME</a>
          </Link>
        </Menu.Item>
        {me && (
          <Menu.Item key="profile">
            <Link href="/profile">
              <a>내 프로필</a>
            </Link>
          </Menu.Item>
        )}
        <Menu.Item key="search-button">
          <Input.Search
            style={{ verticalAlign: "middle" }}
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
                width: "fit-content",
                borderRadius: "10px",
                marginBottom: "20px",
                marginTop: "8px",
                left: "50%",
                right: "50%",
                transform: "translate(-50% )",
              }}
            >{`#${isHashtag}`}</Card>
          )}
          {anotherUserInfo &&
          parseInt(anotherUserInfo.id, 10) !== parseInt(me?.id, 10) ? (
            <Card
              key={anotherUserInfo.id}
              style={{
                margin: "10px 0 10px 0",
                borderRadius: "10px",
                overflow: "hidden",
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
  anotherUserInfo: null,
  isHashtag: null,
};
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  anotherUserProfile: PropTypes.bool,
  anotherUserInfo: PropTypes.shape({
    postsLength: PropTypes.number,
    id: PropTypes.number,
    followingsLength: PropTypes.number,
    followersLength: PropTypes.number,
    nickname: PropTypes.string,
  }),
  isHashtag: PropTypes.string,
};
export default AppLayout;
