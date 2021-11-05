import { BlockOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import styled from "@emotion/styled";
import ImagesZoom from "./ImagseZoom";

const StyleTwoImages = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const StyleOneImage = styled.div`
  width: 100%;
  img {
    width: 100%;
    object-fit: contain;
    padding: 10px;
    border-radius: 20px;
  }
`;
const MoreDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.25s;
  transform: scale(1);
  border-radius: 0 10px 10px 0;
  overflow: hidden;

  :hover {
    background-color: rgba(211, 211, 211, 0.8);
  }
  > img {
    filter: blur(17px);
    height: 100%;
    width: 100%;
    position: relative;
  }
  > div {
    position: absolute;
  }
`;
const PostImagesDiv = styled.div`
  display: flex;
  > img {
    width: 70%;
  }
  > MoreDiv {
    width: 30%;
  }
  padding: 10px;
  border-radius: 10px;
  overflow: hidden;
`;
const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);
  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);
  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);
  if (images?.length === 1) {
    return (
      <div>
        <div onClick={onZoom} style={{ zIndex: 0 }}>
          <StyleOneImage role="presentation">
            <img src={images[0].src} alt={images[0].src} />
          </StyleOneImage>
        </div>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </div>
    );
  }
  if (images?.length === 2) {
    return (
      <div
        css={css`
          overflow: hidden;
          display: grid;
          grid-gap: 1%;
          grid-template-columns: 1fr 1fr;
          place-items: center;
          padding: 10px;
        `}
      >
        <div style={{ width: "100%", height: "100%" }} onClick={onZoom}>
          <StyleTwoImages
            role="presentation"
            src={images[0].src}
            alt={images[0].src}
          />
        </div>
        <div style={{ width: "100%", height: "100%" }} onClick={onZoom}>
          <StyleTwoImages
            role="presentation"
            src={images[1].src}
            alt={images[1].src}
          />
        </div>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </div>
    );
  }
  if (images?.length === 0) {
    return <></>;
  }
  return (
    <>
      <PostImagesDiv>
        <img
          style={{ borderRadius: "10px 0 0 10px" }}
          role="presentation"
          src={images[0].src}
          alt={images[0].src}
        />
        {/* 더보기 div: MoreDiv */}
        <MoreDiv role="presentation" onClick={onZoom}>
          <img src={images[1].src} />
          <div>
            <PlusOutlined />
            <br />
            {images?.length - 1}개의 사진 더보기
          </div>
        </MoreDiv>
      </PostImagesDiv>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
