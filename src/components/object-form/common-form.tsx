import { Form, Input, Space, message } from "antd"
import { useFloor, useSelectedElement } from "../../state/editor/slice"
import { createLineFrom, fixed } from "../../utils"
import { SVG_ID_SLICE } from "../../constants"

export const CommonFormItems = {
  Name: () => {
    return (
      <Form.Item name={"name"} label={"Название"}>
        <Input />
      </Form.Item>
    )
  },
  Id: () => {
    const se = useSelectedElement()

    if (!se) return null

    const id = se.element.id.slice(SVG_ID_SLICE)

    return (
      <Form.Item name={"id"} hidden initialValue={id}>
        <Input />
      </Form.Item>
    )
  },
  SvgId: () => {
    const se = useSelectedElement()

    if (!se) return null

    return (
      <Form.Item name={"svgId"} initialValue={se.element.id}>
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
  Lines: () => {
    const se = useSelectedElement()
    const lines = []

    if (!se) return null

    const d = se.element.getAttribute("d")

    if (!d) {
      message.error("Направляющая должна быть элементом типа path")
      return null
    }

    const rawLines = d.slice(1, d.length - 1).split("L")
    d.at(-1) === "z" && rawLines.pop()

    if (rawLines.length === 0) {
      message.error("path должен содержать L элементы")
      return null
    }

    const sanitizedLines = rawLines.map((lineStr) => {
      const del = ~lineStr.indexOf(" ") ? " " : ","

      return lineStr.trim().split(del).map(fixed) as [number, number]
    })

    for (let i = 0; i < sanitizedLines.length - 1; i++) {
      const line = createLineFrom(sanitizedLines[i], sanitizedLines[i + 1])

      lines.push(line)
    }

    console.log(lines)

    return (
      <Form.Item name={"lines"} initialValue={lines} label={"Линии"}>
        <ul>
          {lines.map((line) => (
            <li key={line.x1}>
              ({line.x1}, {line.y1}) ({line.x2}, {line.y2})
            </li>
          ))}
        </ul>
      </Form.Item>
    )
  },
  Floor: () => {
    const floor = useFloor()

    if (!floor) {
      message.error("Заполните поле этаж")
      return null
    }

    return (
      <Form.Item name={"floor"} hidden initialValue={floor}>
        <Input />
      </Form.Item>
    )
  },
}
