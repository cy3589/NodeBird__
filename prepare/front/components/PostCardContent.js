import PropTypes from "prop-types";
import Link from "next/link";
//postData console.log로 찍어보니 Content값이 String으로 출력됨을 확인
const PostCardContent = ({ postData }) => {
  return (
    <>
      {postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if (v.match(/(#[^\s#]+)/)) {
          return (
            <Link key={i} href={`/hashtag/${v.slice(1)}`}>
              <a>{v}</a>
            </Link>
          );
        }
        return v;
      })}
    </>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
