import { InputNumber } from "antd"
import { FC } from "react"
import { setFloorAction, useFloor } from "../../state/editor/slice"
import { useDispatch } from "react-redux"

export const UoFloor: FC = () => {
  const dispatch = useDispatch()
  const floor = useFloor() ?? 0

  const changeFloor = (value: number | null) => {
    const svgRoot = document.getElementById("svgcontent")

    if (value && svgRoot) {
      console.log(svgRoot)
      dispatch(setFloorAction(value))
      // svgRoot.setAttribute("floor", String(value))
    }
  }

  return <InputNumber value={floor} onChange={changeFloor} />
}
