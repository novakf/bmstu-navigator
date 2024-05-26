import styled from "styled-components"
import { Button, Form, Input } from "antd"
import { ChangeEventHandler, FC, useState } from "react"
import { setUserAction } from "../state/user"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

export const Auth: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login, setLogin] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState(false)

  const changeLogin: ChangeEventHandler<HTMLInputElement> = (e) => {
    setLogin(e.target.value)
    setError(false)
  }

  const changePass: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPass(e.target.value)
    setError(false)
  }

  const submitLogin = () => {
    if (login !== "admin" || pass !== "admin") {
      setError(true)
      return
    }

    setError(false)
    dispatch(setUserAction({ id: "user", login }))
    navigate("/editor")
  }

  return (
    <Container>
      <Bg />
      <FormWrapper>
        {error && <Error>Неверный логин или пароль</Error>}
        <Form.Item label={"Логин"}>
          <StyledTextField value={login} onChange={changeLogin} />
        </Form.Item>
        <Form.Item label={"Пароль"}>
          <StyledTextField value={pass} onChange={changePass} />
        </Form.Item>
        <StyledButton onClick={submitLogin}>Войти</StyledButton>
      </FormWrapper>
    </Container>
  )
}

const Error = styled.div`
  color: red;
  margin-bottom: 12px;
`

const StyledButton = styled(Button)``

const StyledTextField = styled(Input)`
  margin-bottom: 10px;
`

const Bg = styled.div`
  position: absolute;
  top: 0;
  height: 30vh;
  width: 100%;
  background: #33b8b8;
  z-index: 1;
`

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ebebeb;
  height: 100vh;
`

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 70px 40px;
  height: 50vh;
  width: 40vw;
  background: white;
  z-index: 2;

  && .ant-form-item-label {
    display: block;
    width: 100%;
    text-align: left;
  }
`

export default Auth
