import axios from 'axios';
import { IncomingMessage } from 'http';
import { GetServerSidePropsContext } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

const testApi = async (
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  },
  ctx: GetServerSidePropsContext,
) => {
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  //   console.log(req.headers?.cookie);
  //   console.log(req.headers);
  //   console.log(ctx);
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  const { data } = await axios.post(
    process.env.NODE_ENV === 'production'
      ? 'http://124.50.73.52:3001/'
      : 'http://192.168.219.117:3001/',
    // { body: JSON.stringify(ctx) },
    { rawHeaders: req.rawHeaders, cookies: req.cookies },
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
