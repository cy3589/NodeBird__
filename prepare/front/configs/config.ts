export const backUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api-nodebird.cy3589.com'
    : 'http://192.168.219.117:3065';
// export const backUrl = "http://localhost:3065";
export default backUrl;
