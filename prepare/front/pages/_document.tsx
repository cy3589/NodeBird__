// eslint-disable-next-line no-use-before-define
import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';

React.useLayoutEffect = React.useEffect;
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <title>SNS</title>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
