import { Form, Input, Space } from "antd"
import { useSelectedElement } from "../../state/editor/slice"

export const CommonFormItems = {
  Name: () => {
    return (
      <Form.Item name={"name"} label={"Название"}>
        <Input />
      </Form.Item>
    )
  },
  SvgId: () => {
    const se = useSelectedElement()

    if (!se) return null

    return (
      <Form.Item name={"svgId"} hidden initialValue={se.element.id}>
        <Input />
      </Form.Item>
    )
  },
  PointCoords: () => {
    const se = useSelectedElement()

    if (!se) return null

    return (
      <Space>
        <Form.Item
          name={"xCoord"}
          label={"Координата X"}
          initialValue={se.element.getAttribute("cx")}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"yCoord"}
          label={"Координата Y"}
          initialValue={se.element.getAttribute("cy")}
        >
          <Input />
        </Form.Item>
      </Space>
    )
  },
}
