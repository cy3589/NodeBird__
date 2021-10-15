import PropTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd";
import { useRouter, pathname } from "next/router";
import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { createGlobalStyle } from "styled-components";
// import { useForm } from "react-hook-form";

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 important;
  }
  .ant-col:first-child {
    padding-left: 0 !important;
  }
  .ant-col:last-child{
    padding-rignt: 0 !important;
  }
`;

const SerachInput = styled(Input.Search)`
  vertical-align: middle;
`;
const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  return (
    <div>
      <Global />
      <Menu mode="horizontal" selectedKeys={[pathname]}>
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
          <SerachInput enterButton />
        </Menu.Item>
        <Menu.Item key="join-button">
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://www.naver.com"
            target="__blank"
            rel="noreferrer noopener"
          >
            Link
          </a>
        </Col>
      </Row>
    </div>
  );
};
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppLayout;
