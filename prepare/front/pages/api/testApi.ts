import axios from 'axios';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSidePropsContext } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

const testApi = async (
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  },
  ctx: GetServerSidePropsContext,
  res: ServerResponse,
) => {
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  //   console.log(req.headers?.cookie);
  //   console.log(req.headers);
  //   console.log(ctx);
  if (ctx && res) {
    console.log();
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  const { data } = await axios.post(
    process.env.NODE_ENV === 'production'
      ? 'http://124.50.73.52:3001/'
      : 'http://192.168.219.117:3001/',
    // { body: JSON.stringify(ctx) },
    { rawHeaders: res.req.rawHeaders, cookies: res.req.headers.cookie },
    { withCredentials: true },
  );
  console.log(data);
  console.log(data);
  console.log(data);
  console.log(data);
  console.log(data);
  console.log(data);
  console.log(data);
  console.log(data);
  console.log(data);
  console.log(data);
  console.log(data);
  console.log(data);
  console.log(data);
};

export default testApi;
