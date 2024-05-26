import { Input } from "antd"
import styled from "styled-components"
import { setScaleAction, useScale } from "../../state/editor/slice"
import { ChangeEventHandler } from "react"
import { useDispatch } from "react-redux"

export const ScaleToolbar = () => {
  const dispatch = useDispatch()
  const scale = useScale()

  const changeScale: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newScale = +e.target.value.trim()
    console.log(newScale)

    dispatch(setScaleAction(newScale))
  }

  return <StyledInput value={scale} type={"number"} onChange={changeScale} />
}

const StyledInput = styled(Input)`
  width: 100px;
`
