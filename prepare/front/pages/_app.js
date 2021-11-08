import React from "react";
import PropTypes from "prop-types";
import "antd/dist/antd.css";
import Head from "next/head";
import wrapper from "../store/configureStore";

const SNS = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>SNS</title>
      </Head>
      <Component />
    </>
  );
};

SNS.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(SNS);
