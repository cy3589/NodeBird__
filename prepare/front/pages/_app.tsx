import React from 'react';
import 'antd/dist/antd.css';
import Head from 'next/head';
import wrapper from '@store/configureStore';
import { AppProps } from 'next/app';

const SNS = ({ Component }: AppProps) => {
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

export default wrapper.withRedux(SNS);
