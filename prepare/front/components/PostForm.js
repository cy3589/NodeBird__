import React, { useCallback, useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Button } from "antd";
import styled from "styled-components";
import { addPost, UPLOAD_IMAGES_REQUEST } from "../reducers/post";
import useInput from "../hooks/useInput";

// const PostFormStyle = styled(Form)`
// margin:"10px 0 20px`;
const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const [text, onChangeText, setText] = useInput("");
  const dispatch = useDispatch();
  const imageInput = useRef();

  const onChangeImages = useCallback((e) => {
    const imgs = [];
    // [].forEach.call(e.target.files, async (f) => {
    //   const fileReader = new FileReader();
    //   fileReader.readAsDataURL(f);
    //   fileReader.onload = (e) => imgs.push(e.target.result);
    // });
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, async (f) => {
      imageFormData.append("image", f);
    });
    dispatch({ type: UPLOAD_IMAGES_REQUEST, data: imageFormData });
  }, []);
  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onSubmit = useCallback(() => {
    dispatch(addPost(text));
  }, [text]);

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
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
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
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
