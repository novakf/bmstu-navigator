import React, { useState } from 'react';
import { Modal } from 'antd';
import { styled } from 'styled-components';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import BmstuLogo from '../../BmstuLogo';
import GenericModal from '../Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  type: string;
};

const PopupForm: React.FC<Props> = ({ open, onClose, type }) => {
  const handleClose = () => {
    onClose?.();
  };
  const [error, setError] = useState(false);
  const [formType, setFormType] = useState(type);

  return (
    <GenericModal open={open} onClose={handleClose}>
      <Content>
        <Left>
          <LeftTitle>Добро пожаловать!</LeftTitle>
          <ImageContainer $error={error}></ImageContainer>

          {formType === 'Login' ? (
            <Hint>
              Нет аккаунта?{' '}
              <ChangeContentButton onClick={() => setFormType('Signup')}>
                Создать аккаунт
              </ChangeContentButton>
            </Hint>
          ) : (
            <Hint>
              Уже создали?{' '}
              <ChangeContentButton onClick={() => setFormType('Login')}>
                Войти
              </ChangeContentButton>
            </Hint>
          )}
          <BmstuLogo
            style={{
              width: '50%',
              height: '100%',
              position: 'absolute',
              top: '0',
              zIndex: '0',
              left: '0',
            }}
          />
        </Left>
        <Right>
          {formType === 'Login' ? (
            <LoginForm setError={setError} onSubmit={handleClose} />
          ) : (
            <SignupForm setError={setError} onSubmit={handleClose} />
          )}

          {formType === 'Login' ? (
            <Hint
              style={{ display: window.innerWidth < 500 ? 'flex' : 'none' }}
            >
              Нет аккаунта?{' '}
              <ChangeContentButton onClick={() => setFormType('Signup')}>
                Создать аккаунт
              </ChangeContentButton>
            </Hint>
          ) : (
            <Hint
              style={{ display: window.innerWidth < 500 ? 'flex' : 'none' }}
            >
              Уже создали?{' '}
              <ChangeContentButton onClick={() => setFormType('Login')}>
                Войти
              </ChangeContentButton>
            </Hint>
          )}
        </Right>
      </Content>
    </GenericModal>
  );
};

const Hint = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;

  @media (max-width: 500px) {
    margin-top: 20px;
  }
`;

const ChangeContentButton = styled.div`
  cursor: pointer;
  text-decoration: underline;
`;

const ImageContainer = styled.div<{ $error: boolean }>`
  display: flex;
  justify-content: center;
  height: 215px;
  width: 200px;
  background-size: 200px;
  background-repeat: no-repeat;
  margin-left: auto;
  margin-right: auto;
  z-index: 1;

  transition: all 0.3s;
`;

const Content = styled.div`
  display: flex;
`;

const LeftTitle = styled.div`
  font-size: 24px;
  z-index: 1;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  background: #ebebeb;
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
  padding: 24px;
  gap: 40px;
  justify-content: space-between;

  @media (max-width: 500px) {
    display: none;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  border-radius: 10px;
  padding: 24px;

  @media (max-width: 500px) {
    width: 100%;
  }
`;

export default PopupForm;
