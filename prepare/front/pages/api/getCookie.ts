import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

const getCookie = async (
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  },
) => req?.headers?.cookie;
export default getCookie;
