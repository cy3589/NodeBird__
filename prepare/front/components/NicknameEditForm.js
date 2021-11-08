import { Form, Input } from "antd";
import React, { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { CHANGE_NICKNAME_REQUEST } from "../reducers/user";

const NicknameEditForm = () => {
  const { me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || "");
  const dispatch = useDispatch();
  const onSubmit = useCallback(() => {
    return dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  const style = useMemo(
    () => ({
      marginTop: "8px",
      marginBottom: "20px",
      border: "1px solid #d9d9d9",
      padding: "20px",
      borderRadius: "10px",
    }),
    []
  );
  return (
    <Form style={style}>
      <Input.Search
        addonBefore="닉네임"
        enterButton="수정"
        onChange={onChangeNickname}
        onSearch={onSubmit}
        placeholder="바꿀 닉네임을 입력해주세요"
        type="text"
      />
    </Form>
  );
};
export default NicknameEditForm;
