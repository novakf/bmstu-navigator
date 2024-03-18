import { Button, Modal } from "antd"
import Editor from "./svgedit/editor/Editor"
import { FC, useEffect, useState } from "react"
import { GenericUniverObjectForm } from "./components/generic-object-form"
import { useDispatch } from "react-redux"
import {
  setSelectedElementAction,
  useSelectedElement,
} from "./state/editor/slice"
import { UOLinkToolbar } from "./components/uo-link/uo-link-toolbar"

type Props = {
  editor: Editor
}

export const TopPanelGlobal: FC<Props> = ({ editor }) => {
  const dispatch = useDispatch()
  const selectedElement = useSelectedElement()

  const [createModalOpen, setCreateModalOpen] = useState(false)

  useEffect(() => {
    editor.topPanel.onUpdate = () => {
      const se = editor.selectedElement
      const properties = JSON.parse(localStorage.getItem(se.id) || "null")

      console.log(se, properties, se.id)

      dispatch(setSelectedElementAction({ id: se.id, properties }))
    }
  })

  const create = () => {
    setCreateModalOpen(true)
  }

  const showInfo = () => {
    console.log(editor, "editor")
  }

  const onSubmit = () => {
    dispatch(setSelectedElementAction(null))
    setCreateModalOpen(false)
  }

  const onCancel = () => {
    dispatch(setSelectedElementAction(null))
    setCreateModalOpen(false)
  }

  return (
    <div>
      <Button
        onClick={create}
        disabled={!selectedElement || !!selectedElement.properties}
      >
        Создать
      </Button>
      <Button
        onClick={showInfo}
        disabled={!selectedElement || !selectedElement.properties}
      >
        Инфо
      </Button>
      <Modal
        open={createModalOpen}
        onCancel={() => {
          dispatch(setSelectedElementAction(null))
          setCreateModalOpen(false)
        }}
        footer={null}
      >
        {selectedElement && (
          <GenericUniverObjectForm onSubmit={onSubmit} onCancel={onCancel} />
        )}
      </Modal>
      <UOLinkToolbar />
    </div>
  )
}
