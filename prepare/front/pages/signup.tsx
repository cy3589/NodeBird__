import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import AppLayout from '@components/AppLayout';
import useInput from '@hooks/useInput';
import { SIGN_UP_REQUEST, SIGN_UP_DONE } from '@reducers/user';
import storeInterface from '@interfaces/storeInterface';

const ErrorMessage = styled.div`
  color: red;
`;
const SignupBtton = styled.div`
  margin-top: 10px;
`;
const Signup = () => {
  const dispatch = useDispatch();

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const { signUpLoading, signUpDone, signUpError, me } = useSelector(
    (state: storeInterface) => state.user,
  );

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/');
    }
  }, [me]);

  useEffect(() => {
    if (signUpDone) {
      dispatch({ type: SIGN_UP_DONE });
      Router.replace('/');
    }
  }, [dispatch, signUpDone]);
  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password],
  );
  const [term, setTerm] = useState();
  const [termError, setTermError] = useState<boolean>();

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    return dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [dispatch, email, nickname, password, passwordCheck, term]);

  return (
    <AppLayout>
      <Head>
        <title>???????????? | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">?????????</label>
          <br />
          <Input
            type="email"
            name="user-email"
            value={email}
            required
            onChange={onChangeEmail}
          />
        </div>
        <div>
          <label htmlFor="user-nickname">?????????</label>
          <br />
          <Input
            name="user-nickname"
            value={nickname}
            required
            onChange={onChangeNickname}
          />
        </div>
        <div>
          <label htmlFor="user-password">????????????</label>
          <br />
          <Input
            name="user-password"
            type="password"
            value={password}
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-password-check">??????????????????</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && (
            <ErrorMessage>??????????????? ???????????? ????????????.</ErrorMessage>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            {termError && (
              <ErrorMessage>????????? ??????????????? ?????????.</ErrorMessage>
            )}
            ????????????
          </Checkbox>
        </div>
        <SignupBtton>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>
            ????????????
          </Button>
        </SignupBtton>
      </Form>
    </AppLayout>
  );
};
export default Signup;
