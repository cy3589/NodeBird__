/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col, Card, Avatar } from "antd";
import { Router, useRouter } from "next/router";
import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";
import { useSelector } from "react-redux";
import styled from "@emotion/styled";

// import { useForm } from "react-hook-form";
const GlobalStyle = () => (
  <Global
    styles={css`
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
      * {
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
        transition: 1s;
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
        transition: 1s;
      }
    `}
  />
);
const AppLayout = ({ children, anotherUserProfile, anotherUserInfo }) => {
  const { me } = useSelector((state) => state.user);
  return (
    <div style={{ backgroundColor: "aliceblue", height: "100%" }}>
      <GlobalStyle />
      <Menu
        mode="horizontal"
        selectedKeys={[Router.pathname]}
        style={{ position: "sticky", top: "0", zIndex: "1" }}
      >
        <Menu.Item key="node-bird">
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="search-button">
          <Input.Search style={{ verticalAlign: "middle" }} enterButton />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? (
            <UserProfile
              anotherUserProfile={anotherUserProfile}
              anotherUserInfo={anotherUserInfo} //id값 들어있음.
            />
          ) : (
            !anotherUserProfile && <LoginForm />
          )}
        </Col>
        <Col xs={24} md={12}>
          {anotherUserInfo &&
          parseInt(anotherUserInfo.id, 10) !== parseInt(me?.id) ? (
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
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppLayout;
