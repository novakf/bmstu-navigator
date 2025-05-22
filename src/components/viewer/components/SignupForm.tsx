import React, { KeyboardEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { styled } from 'styled-components';

type Props = {
  setError: (value: boolean) => void;
  onSubmit: () => void;
};

const SignupForm: React.FC<Props> = ({ setError, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [repeatError, setRepeatError] = useState(false);

  const dispatch = useDispatch();

  const submit = () => {
    // axios
    //   .post('http://localhost:3001/auth/signup', {
    //     email,
    //     name,
    //     password,
    //   })
    //   .then((res) => {
    //     dispatch(setUserDataAction(res.data.user))
    //     if (res.status === 200) {
    //       useMessage({ messageText: 'Аккаунт успешно создан' }, dispatch)
    //     }
    //     onSubmit()
    //   })
    //   .catch(function (error) {
    //     useMessage({ messageText: error.response.data.message, status: 'error'}, dispatch)
    //   })
  };

  useEffect(() => {
    if (emailErr || repeatError) setError(true);
    else setError(false);
  }, [emailErr, repeatError]);

  const emailValid = (email: string) => {
    return !/\S+@\S+\.\S+/.test(email) && email.length > 0;
  };

  const blurEmail = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmailErr(emailValid(e.target.value));

  const blurRepeat = () =>
    repeatPassword
      ? setRepeatError(password !== repeatPassword)
      : setRepeatError(false);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      return (e.target as HTMLElement).blur();
    }
  };

  return (
    <>
      <Title>Создать аккаунт</Title>
      <InputLabel>Имя(*)</InputLabel>
      <StyledInput
        style={{ marginBottom: '20px' }}
        $error={false}
        type="text"
        placeholder={'Иван Иванов'}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => handleKeyPress(e)}
      />
      <InputLabel>Email(*)</InputLabel>
      <StyledInput
        $error={emailErr}
        onBlur={blurEmail}
        type="text"
        placeholder={'example@mail.org'}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            return (e.target as HTMLElement).blur();
          }
        }}
      />
      <ErrorText $error={emailErr}>Неверный формат</ErrorText>
      <Passwords>
        <Pass>
          <InputLabel>Пароль(*)</InputLabel>
          <StyledInput
            $error={repeatError}
            type="text"
            placeholder={'****'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                return (e.target as HTMLElement).blur();
              }
            }}
            onBlur={blurRepeat}
          />
        </Pass>
        <Pass>
          <InputLabel>Повторите(*)</InputLabel>
          <StyledInput
            $error={repeatError}
            type="text"
            placeholder={'****'}
            value={repeatPassword}
            onBlur={blurRepeat}
            onChange={(e) => setRepeatPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                return (e.target as HTMLElement).blur();
              }
            }}
          />
        </Pass>
      </Passwords>
      <ErrorText style={{ textAlign: 'center' }} $error={repeatError}>
        Пароли не совпадают
      </ErrorText>
      <FormButton
        onClick={submit}
        disabled={
          !password ||
          !email ||
          !name ||
          !repeatPassword ||
          emailErr ||
          repeatError
        }
      >
        Создать аккаунт
      </FormButton>
    </>
  );
};

const ErrorText = styled.div<{ $error: boolean }>`
  opacity: 0;
  color: #d30000;
  margin: 10px 0;
  font-size: 12px;

  ${(p) => p.$error && `opacity: 1;`}
`;

const Pass = styled.div`
  display: flex;
  flex-direction: column;
`;

const Passwords = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
`;

const FormButton = styled.button`
  border: none;
  border-radius: 10px;
  background: #003983;
  padding: 10px 0;
  font-size: 20px;
  color: #fff;
  margin-top: auto;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background: #00275b;
  }

  &:active {
    background: #01367d;
  }

  &:disabled {
    background: #cbcbcb;
    cursor: not-allowed;
  }
`;

const InputLabel = styled.div`
  color: #a7a7a7;
`;

const StyledInput = styled.input<{ $error: boolean }>`
  border: none;
  padding: 0px;
  outline: none;
  width: calc(100% - 24px);
  border-bottom: 2px solid #dddddd;
  padding: 6px 10px;
  font-size: 14px;
  transition: all 0.2s;

  height: 30px;

  &:focus {
    border-bottom: 2px solid #898989;
    ${(p) => p.$error && `border-bottom: 2px solid #ff000082;`}
  }

  ${(p) => p.$error && `border-bottom: 2px solid #ff000082;`}
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;
export default SignupForm;
