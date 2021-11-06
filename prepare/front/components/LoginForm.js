import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button } from "antd";
import styled from "@emotion/styled";
import Link from "next/link";
import useInput from "../hooks/useInput";
import { loginRequestAction } from "../reducers/user";
// styled로 할 때에는 백틱으로 묶고 백틱 내에는 CSS적듯이 한다
const ButtonWrapper = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 2%;
`;
const FormWrapper = styled(Form)`
  padding: 10px;
`;
const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);
  const onSubmitForm = useCallback(() => {
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input
          type="email"
          name="user-email"
          id="user-email"
          value={email}
          onChange={onChangeEmail}
          required
          style={{ borderRadius: "10px" }}
        />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          id="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
          style={{ borderRadius: "10px" }}
        />
      </div>
      <ButtonWrapper>
        <Button
          type="primary"
          htmlType="submit"
          loading={logInLoading}
          style={{ borderRadius: "10px" }}
        >
          로그인
        </Button>
        <span>
          <Link href="/signup">
            <a>
              <Button style={{ borderRadius: "10px" }}>회원가입</Button>
            </a>
          </Link>
        </span>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
