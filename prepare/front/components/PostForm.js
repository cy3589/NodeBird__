import React, { useCallback, useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Button } from "antd";
import styled from "styled-components";
import {
  addPost,
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
} from "../reducers/post";
import useInput from "../hooks/useInput";
import { CloseCircleFilled } from "@ant-design/icons";
const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.5rem;
  grid-auto-rows: 3fr;
`;

// const PostFormStyle = styled(Form)`
// margin:"10px 0 20px`;
const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const [text, onChangeText, setText] = useInput("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const dispatch = useDispatch();
  const imageInput = useRef();
  const ImageRemove = (i) => () => {
    setImages(images.filter((v, index) => index !== i));
    setImageFiles(imageFiles.filter((v, index) => index !== i));
  };

  const onChangeImages = useCallback(
    (e) => {
      if (images.length >= 10) {
        setImages(images.filter((v, index) => index < 10));
        setImageFiles(imageFiles.filter((v, index) => index < 10));
        alert("최대 10개 까지만 가능합니다.");
        return;
      }

      if (images.length + e.target.files.length > 10) {
        for (let i = 0; i < 10 - images.length; i++) {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(e.target.files[i]);
          fileReader.onload = (event) => {
            setImages((prev) => [...prev, event.target.result]);
          };
          setImageFiles((prev) => [...prev, e.target.files[i]]);
        }
        alert("최대 10개 까지만 가능합니다.");
      } else {
        [].forEach.call(e.target.files, async (f) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(f);
          fileReader.onload = (event) => {
            setImages((prev) => [...prev, event.target.result]);
          };
          setImageFiles((prev) => [...prev, f]);
        });
      }
    },
    [images, imageFiles]
  );

  useEffect(() => {
    if (addPostDone) {
      setText("");
      setImages([]);
      setImageFiles([]);
    }
  }, [addPostDone]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert("게시글을 작성하세요.");
    }
    const formData = new FormData();
    [].forEach.call(imageFiles, async (f) => {
      formData.append("image", f);
    });
    formData.append("content", text);

    dispatch({ type: ADD_POST_REQUEST, data: formData });
    document.getElementById("textInputArea").focus();
  }, [text, imageFiles]);

  return (
    <Form
      style={{ margin: "10px 0 20px" }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
        id="textInputArea"
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
          accept="image/*"
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <ImagePreview>
        {images.map((v, i) => (
          <div key={v + i}>
            <img
              src={v}
              key={v}
              style={{
                width: "100%",
                paddingBottom: "1%",
                height: 0,
                minHeight: "90px",
                objectFit: "contain",
                padding: "2%",
                borderRadius: "8px",
                border: "1px solid #f0f0f0",
                transition: "0.5s",
              }}
            />
            <Button
              className="ImageRemoveButton"
              danger
              block
              key={i}
              style={{
                height: "10%",
                minHeight: "30px",
                borderRadius: "8px",
                margin: "2% 0 2% 0",
              }}
              onClick={ImageRemove(i)}
              icon={<CloseCircleFilled />}
            />
          </div>
        ))}
        {/* {imagePaths.map((v) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img
              src={`http://localhost:3065/${v}`}
              style={{ width: "200px" }}
              alt={v}
            />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))} */}
      </ImagePreview>
    </Form>
  );
};

export default PostForm;
