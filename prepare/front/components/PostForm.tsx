import { useCallback, useRef, useEffect, useState, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import {
  // addPost,
  ADD_POST_REQUEST,
  // UPLOAD_IMAGES_REQUEST,
} from '@reducers/post';
import useInput from '@hooks/useInput';
import Image from 'next/image';
import styled from '@emotion/styled';
import storeInterface from '@interfaces/storeInterface';

const StyledImage = styled(Image)`
  padding-bottom: 1%;
  min-height: 90px;
  object-fit: contain;
  padding: 2%;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: 0.5s;
`;

// const PostFormStyle = styled(Form)`
// margin:"10px 0 20px`;
const PostForm = () => {
  // const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const { addPostDone } = useSelector((state: storeInterface) => state.post);
  const [text, onChangeText, setText] = useInput('');
  const [images, setImages] = useState<(string | ArrayBuffer)[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const dispatch = useDispatch();
  const imageInput = useRef<HTMLInputElement>(null);
  const ImageRemove = (i: number) => () => {
    setImages(images.filter((v, index) => index !== i));
    setImageFiles(imageFiles.filter((v, index) => index !== i));
  };

  const onChangeImages = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (images.length >= 9) {
        setImages(images.filter((v, index) => index < 9));
        setImageFiles(imageFiles.filter((v, index) => index < 9));
        alert('최대 9개 까지만 가능합니다.');
        return;
      }

      if (images.length + (e.target.files?.length ?? 0) > 9) {
        for (let i = 0; i < 9 - images.length; i += 1) {
          const fileReader = new FileReader();
          if (e.target.files) fileReader.readAsDataURL(e.target.files[i]);
          fileReader.onload = (event) => {
            setImages((prev) => {
              if (event.target && event.target.result !== null)
                return [...prev, event.target.result];
              return prev;
            });
          };
          setImageFiles((prev) => {
            if (e.target && e.target.files !== null)
              return [...prev, e.target.files[i]];
            return prev;
          });
        }
        alert('최대 9개 까지만 가능합니다.');
      } else {
        [].forEach.call(e.target.files, async (f) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(f);
          fileReader.onload = (event) => {
            setImages((prev) => {
              if (event.target && event.target.result !== null)
                return [...prev, event.target.result];
              return prev;
            });
          };
          setImageFiles((prev) => [...prev, f]);
        });
      }
    },
    [images, imageFiles],
  );

  useEffect(() => {
    if (addPostDone) {
      setText('');
      setImages([]);
      setImageFiles([]);
    }
  }, [addPostDone, setText]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current?.click();
  }, []);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    [].forEach.call(imageFiles, async (f) => {
      formData.append('image', f);
    });
    formData.append('content', text);

    dispatch({ type: ADD_POST_REQUEST, data: formData });
    document.getElementById('textInputArea')?.focus();
    return null;
  }, [text, imageFiles, dispatch]);
  // 더미데이터생성
  // useEffect(() => {
  //   const delay = (time) =>
  //     new Promise((r) => {
  //       setTimeout(() => {
  //         r();
  //       }, time);
  //     });
  //   (async () => {
  //     for (let i = 0; i < 100; i += 1) {
  //       // eslint-disable-next-line no-await-in-loop
  //       await delay(400);
  //       const formData = new FormData();
  //       formData.append('content', `더미더미더미더미더미더미더미더미${i}`);
  //       dispatch({ type: ADD_POST_REQUEST, data: formData });
  //       console.log(i);
  //     }
  //   })();
  // }, []);
  return (
    <Form
      style={{ margin: '10px 0 0 0' }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        style={{ borderRadius: '10px' }}
        autoSize={{ minRows: 4, maxRows: 10 }}
        value={text}
        onChange={onChangeText}
        placeholder="무슨 생각을 하고 계신가요?"
        id="textInputArea"
      />
      <div>
        <div style={{ marginBottom: '4px' }}>
          <input
            type="file"
            name="image"
            multiple
            hidden
            ref={imageInput}
            onChange={onChangeImages}
            accept="image/*"
          />
        </div>
        <Button style={{ borderRadius: '10px' }} onClick={onClickImageUpload}>
          이미지 업로드
        </Button>
        <Button
          type="primary"
          style={{ float: 'right', borderRadius: '10px' }}
          htmlType="submit"
        >
          게시
        </Button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridGap: '0.5rem',
          gridAutoRows: '3fr',
          marginTop: '3%',
        }}
      >
        {images.map((v, i) => (
          <div key={v?.toString()}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <StyledImage
                src={v.toString()}
                alt={v.toString()}
                width="100%"
                layout="fixed"
                height="100%"
              />
            </div>
            <Button
              className="ImageRemoveButton"
              danger
              block
              key={v.toString()}
              style={{
                height: '10%',
                minHeight: '30px',
                borderRadius: '8px',
                margin: '2% 0 2% 0',
              }}
              onClick={ImageRemove(i)}
              icon={<CloseCircleFilled />}
            />
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
