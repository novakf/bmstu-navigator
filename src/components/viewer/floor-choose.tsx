import { Form, Select } from "antd"
import { FC } from "react"
import styled from "styled-components"
import { setActiveFloorAction, useActiveFloor } from "../../state/viewer"
import { useDispatch } from "react-redux"

const floors = [
  { label: "9", value: 9 },
  { label: "4", value: 4 },
]

export const FloorChoose: FC = () => {
  const dispatch = useDispatch()
  const activeFloor = useActiveFloor()

  const changeActiveFloor = (newFloor: number) => {
    dispatch(setActiveFloorAction(newFloor))
  }

  return (
    <Container>
      <Form.Item label={"Этаж"}>
        <StyledSelect
          options={floors}
          // @ts-ignore
          onChange={changeActiveFloor}
          value={activeFloor}
        />
      </Form.Item>
    </Container>
  )
}

const Container = styled.div`
  position: absolute;
  z-index: 100;
  right: 20px;
  top: 20px;
`

export const StyledSelect = styled(Select)`
  width: 50px;
`
