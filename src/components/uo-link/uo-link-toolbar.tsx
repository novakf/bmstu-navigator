import { CheckOutlined, LinkOutlined } from "@ant-design/icons"
import { Button, Input, Space, message } from "antd"
import { ChangeEventHandler, useEffect, useState } from "react"
import { useSelectedElement } from "../../state/editor/slice"
import styled from "styled-components"

export const UOLinkToolbar = () => {
  const [modeActive, setModeActive] = useState(false)
  const [leftNodeId, setLeftNodeId] = useState("")
  const [rightNodeId, setRightNodeId] = useState("")
  const [weight, setWeight] = useState(0)
  const se = useSelectedElement()
  const seId = se?.element.id

  useEffect(() => {
    if (!modeActive) return
    if (!seId) return

    if (!leftNodeId) {
      setLeftNodeId(seId)
      return
    }

    if (rightNodeId) {
      setLeftNodeId(seId)
      setRightNodeId("")
      return
    }

    setRightNodeId(seId)
  }, [seId])

  const toggleMode = () => {
    setModeActive(!modeActive)
  }

  const linkNodes = () => {
    if (!leftNodeId || !rightNodeId || !weight) {
      message.error("Заполните все поля")
      return
    }

    const uoLinks = JSON.parse(localStorage.getItem("uoLinks") || "[]")

    const uoLink = {
      left: leftNodeId,
      right: rightNodeId,
    }

    setLeftNodeId("")
    setRightNodeId("")
    setWeight(0)
    message.success("Связь создана")
  }

  const changeLeftNode: ChangeEventHandler<HTMLInputElement> = (e) => {
    setLeftNodeId(e.target.value.trim())
  }

  const changeRightNode: ChangeEventHandler<HTMLInputElement> = (e) => {
    setRightNodeId(e.target.value.trim())
  }

  const changeWeight: ChangeEventHandler<HTMLInputElement> = (e) => {
    setWeight(+e.target.value.trim())
  }

  return (
    <Space>
      <Button
        type={modeActive ? "primary" : "default"}
        icon={<LinkOutlined />}
        onClick={toggleMode}
      />
      {modeActive && (
        <>
          <NodeInput value={leftNodeId} onChange={changeLeftNode} />
          <NodeInput value={rightNodeId} onChange={changeRightNode} />
          <NodeInput
            placeholder={"Вес"}
            value={weight}
            onChange={changeWeight}
          />
          <Button icon={<CheckOutlined />} onClick={linkNodes} />
        </>
      )}
    </Space>
  )
}

const NodeInput = styled(Input)`
  width: 100px;
`
