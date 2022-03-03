import { useState, VFC } from 'react';
import Slick from 'react-slick';
import styled from '@emotion/styled';
import {
  Globaled,
  Indicator,
  CloseButton,
  Overlay,
  Header,
  SlickWrapper,
  ImgWrapper,
} from '@styles/ImageZoomstyled';
import { ImagesInterface } from '@interfaces/storeInterface';

const SlideImage = styled.img`
  width: 100%;
  object-fit: contain;
`;
const SlickStyled = styled(Slick)`
  height: calc(100% - 44px);
`;

const ImagesZoom: VFC<{ images: ImagesInterface[]; onClose: () => void }> = ({
  images,
  onClose,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Globaled />
      <Header style={{ zIndex: 2 }}>
        <h1>상세 이미지</h1>
        <CloseButton onClick={onClose}>X</CloseButton>
      </Header>
      <SlickWrapper>
        <SlickStyled
          initialSlide={0}
          beforeChange={(slide) => setCurrentSlide(slide)}
          infinite
          arrows={false}
          slidesToShow={1}
          slidesToScroll={1}
        >
          {images.map((v) => (
            <ImgWrapper key={v.src}>
              <SlideImage src={v.src} alt={v.src} />
            </ImgWrapper>
          ))}
        </SlickStyled>
        <Indicator>
          <div>{`${currentSlide + 1} / ${images.length}`}</div>
        </Indicator>
      </SlickWrapper>
    </Overlay>
  );
};

export default ImagesZoom;
