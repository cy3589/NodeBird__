export const backUrl =
  process.env.NODE_ENV === 'production'
    ? // ? 'http://api.mynodesns.shop'
      'http://192.168.219.117:3065'
    : // : "http://localhost:3065";
      'http://192.168.219.117:3065';
// export const backUrl = "http://localhost:3065";
export default backUrl;
