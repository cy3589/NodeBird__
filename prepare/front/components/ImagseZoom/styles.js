/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import { CloseOutlined } from "@ant-design/icons";
import React from "react";

export const Globaled = () => (
  <Global
    styles={css`
      .slick-slide {
        display: inline-block;
      }
      .ant-card-cover {
        transform: none !important;
      }
    `}
  />
);
export const Indicator = styled.div`
  text-align: center;

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;
export const CloseButton = styled(CloseOutlined)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px;
  line-height: 14px;
  cursor: pointer;
`;
export const Overlay = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
export const Header = styled.header`
  height: 44px;
  background: white;
  position: relative;
  padding: 0;
  text-align: center;
  & h1 {
    margin: 0;
    font-size: 17px;
    color: #333;
    line-height: 44px;
  }
`;
export const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  backdrop-filter: blur(10px) brightness(50%);

  & * {
    height: 100%;
  }
`;

export const ImgWrapper = styled.div`
  height: 100%;
  padding: 32px;
  text-align: center;
  & img {
    margin: 0 auto;
    max-height: 750px;
  }
`;
