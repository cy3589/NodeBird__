import { Form, Input } from "antd";
import { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { CHANGE_NICKNAME_REQUEST } from "../reducers/user";
const NicknameEditForm = () => {
  const { me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || "");
  const dispatch = useDispatch();
  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  const style = useMemo(
    () => ({
      marginBottom: "20px",
      border: "1px solid #d9d9d9",
      padding: "20px",
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
      />
    </Form>
  );
};
export default NicknameEditForm;
