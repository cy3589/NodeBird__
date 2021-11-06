import React, { useCallback, useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Button } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import {
  // addPost,
  ADD_POST_REQUEST,
  // UPLOAD_IMAGES_REQUEST,
} from "../reducers/post";
import useInput from "../hooks/useInput";

// const PostFormStyle = styled(Form)`
// margin:"10px 0 20px`;
const PostForm = () => {
  // const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const { addPostDone } = useSelector((state) => state.post);
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
      if (images.length >= 9) {
        setImages(images.filter((v, index) => index < 9));
        setImageFiles(imageFiles.filter((v, index) => index < 9));
        alert("최대 9개 까지만 가능합니다.");
        return;
      }

      if (images.length + e.target.files.length > 9) {
        for (let i = 0; i < 9 - images.length; i += 1) {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(e.target.files[i]);
          fileReader.onload = (event) => {
            setImages((prev) => [...prev, event.target.result]);
          };
          setImageFiles((prev) => [...prev, e.target.files[i]]);
        }
        alert("최대 9개 까지만 가능합니다.");
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
    return null;
  }, [text, imageFiles]);

  return (
    <Form
      style={{ margin: "10px 0 0 0" }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        style={{ borderRadius: "10px" }}
        autoSize={{ minRows: 4, maxRows: 10 }}
        value={text}
        onChange={onChangeText}
        placeholder="무슨 생각을 하고 계신가요?"
        id="textInputArea"
      />
      <div>
        <div style={{ marginBottom: "4px" }}>
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
        <Button style={{ borderRadius: "10px" }} onClick={onClickImageUpload}>
          이미지 업로드
        </Button>
        <Button
          type="primary"
          style={{ float: "right", borderRadius: "10px" }}
          htmlType="submit"
        >
          게시
        </Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridGap: "0.5rem",
          gridAutoRows: "3fr",
          marginTop: "3%",
        }}
      >
        {images.map((v, i) => (
          <div key={v}>
            <img
              src={v}
              alt={v}
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
              key={v}
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
      </div>
    </Form>
  );
};

export default PostForm;
