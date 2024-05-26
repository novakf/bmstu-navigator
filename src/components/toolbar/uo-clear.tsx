import { DeleteOutlined } from "@ant-design/icons"
import { Button } from "antd"
import {
  removeObjectFromUoHoldersAction,
  removeObjectFromUoItemsAction,
  removeObjectFromUoLinksAction,
  useSelectedElement,
} from "../../state/editor/slice"
import { useDispatch } from "react-redux"

export const UOClear = () => {
  const dispatch = useDispatch()
  const se = useSelectedElement()
  const selectedUo = se?.uo

  const uoClear = () => {
    if (!selectedUo) return

    dispatch(removeObjectFromUoItemsAction(selectedUo))
    dispatch(removeObjectFromUoLinksAction(selectedUo))
    dispatch(removeObjectFromUoHoldersAction(selectedUo))
  }

  return (
    <Button
      icon={<DeleteOutlined />}
      onClick={uoClear}
      disabled={!selectedUo}
    />
  )
}
