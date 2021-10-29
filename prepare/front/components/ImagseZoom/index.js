import { useState } from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";
import styled from "@emotion/styled";
import {
  Globaled,
  Indicator,
  CloseButton,
  Overlay,
  Header,
  SlickWrapper,
  ImgWrapper,
} from "./styles";
const SlideImage = styled.img`
  width: 100%;
  object-fit: contain;
`;

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      {console.log(images)}
      <Globaled />
      <Header style={{ zIndex: 2 }}>
        <h1>상세 이미지</h1>
        <CloseButton onClick={onClose}>X</CloseButton>
      </Header>
      <SlickWrapper>
        <Slick
          initialSlide={0}
          beforeChange={(slide) => setCurrentSlide(slide)}
          infinite
          arrows={false}
          slidesToShow={1}
          slidesToScroll={1}
          style={{ height: "calc(100% - 44px)" }}
        >
          {images.map((v, i) => (
            <ImgWrapper key={v.src}>
              <SlideImage src={v.src} alt={v.src} />
            </ImgWrapper>
          ))}
        </Slick>
        <Indicator>
          <div>{`${currentSlide + 1} / ${images.length}`}</div>
        </Indicator>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.proptypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
