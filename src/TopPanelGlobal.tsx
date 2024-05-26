import { Button, Modal, Space } from "antd"
import Editor from "./svgedit/editor/Editor"
import { FC, useEffect, useState } from "react"
import { GenericUniverObjectForm } from "./components/generic-object-form"
import { useDispatch } from "react-redux"
import {
  selectUoItems,
  setFloorAction,
  setSelectedElementAction,
  useSelectedElement,
} from "./state/editor/slice"
import { UOLinkToolbar } from "./components/uo-link/uo-link-toolbar"
import { ScaleToolbar } from "./components/scale/scale-toolbar"
import { UOClear } from "./components/toolbar/uo-clear"
import { EditOutlined, PlusOutlined } from "@ant-design/icons"
import { find } from "lodash"
import { store } from "./state"
import { UoInfo } from "./components/toolbar/uo-info"
import { UoFloor } from "./components/toolbar/uo-floor"

type Props = {
  editor: Editor
}

export const TopPanelGlobal: FC<Props> = ({ editor }) => {
  const dispatch = useDispatch()
  const selectedElement = useSelectedElement()

  const [createModalOpen, setCreateModalOpen] = useState(false)

  useEffect(() => {
    editor.topPanel.onUpdate = () => {
      const state = store.getState()
      const uoItems = selectUoItems(state)
      const se = editor.selectedElement
      const uo = find(uoItems, { svgId: se.id }) ?? null

      dispatch(setSelectedElementAction({ svgId: se.id, uo }))
    }

    // @ts-ignore
    editor.onOpenDocument = () => {
      const svgRoot = document.getElementById("svgcontent")

      if (!svgRoot) return

      const floor = svgRoot.getAttribute("floor")

      if (floor) dispatch(setFloorAction(+floor))
    }
  }, [])

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
    <Space size={4} dir={"horizontal"}>
      <UoInfo />
      <Button
        onClick={create}
        disabled={!selectedElement || !!selectedElement.uo}
        icon={<PlusOutlined />}
      />
      <Button
        icon={<EditOutlined />}
        onClick={showInfo}
        disabled={!selectedElement || !selectedElement.uo}
      />
      <UOClear />
      <Modal
        destroyOnClose={true}
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
      <ScaleToolbar />
      <UoFloor />
      <UOLinkToolbar />
    </Space>
  )
}
