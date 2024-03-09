import { Button, Form, Select, Space } from "antd"
import { UniverObjectType } from "../interfaces"
import { AuditoriumForm } from "./object-form/auditorium-form"
import { AuditoriumPointForm } from "./object-form/auditorium-point-form"
import { HallwayPointForm } from "./object-form/hallway-point"
import { FC, useState } from "react"
import { useSelectedElement } from "../state/editor/slice"
import { LadderPointForm } from "./object-form/ladder-point"
import { FloorPointForm } from "./object-form/floor-point"

const univerObjectFormMap = {
  [UniverObjectType.Auditorium]: AuditoriumForm,
  [UniverObjectType.AuditoriumPoint]: AuditoriumPointForm,
  [UniverObjectType.HallwayPoint]: HallwayPointForm,
  [UniverObjectType.Ladder]: HallwayPointForm,
  [UniverObjectType.LadderPoint]: LadderPointForm,
  [UniverObjectType.FloorPoint]: FloorPointForm,
}

type Props = {
  onSubmit: () => void
  onCancel: () => void
}

export const GenericUniverObjectForm: FC<Props> = ({ onSubmit, onCancel }) => {
  const selectedElement = useSelectedElement()
  const [currentUOForm, setCurrentUOForm] = useState<UniverObjectType | null>(
    null
  )

  if (!selectedElement) return null

  const element = selectedElement.element

  const selectForm = (value: UniverObjectType) => {
    setCurrentUOForm(value)
  }

  const CurrentUOForm = currentUOForm
    ? univerObjectFormMap[currentUOForm]
    : () => null

  const univerObjectSelectOptions = [
    { value: UniverObjectType.Auditorium, label: "Аудитория" },
    {
      value: UniverObjectType.AuditoriumPoint,
      label: "Точка аудитории (дверь)",
      disabled: element.tagName !== "circle",
    },
    {
      value: UniverObjectType.HallwayPoint,
      label: "Точка коридора",
      disabled: element.tagName !== "circle",
    },
    {
      value: UniverObjectType.LadderPoint,
      label: "Точка лестницы",
      disabled: element.tagName !== "circle",
    },
    {
      value: UniverObjectType.FloorPoint,
      label: "Точка этажа",
      disabled: element.tagName !== "circle",
    },
  ]

  const onFinish = (values: any) => {
    const uoItems = JSON.parse(localStorage.getItem("uoIds") || "[]")

    uoItems.push(values.svgId)
    localStorage.setItem("uoIds", JSON.stringify(uoItems))

    localStorage.setItem(values.svgId, JSON.stringify(values))

    console.log(values)

    onSubmit()
  }

  const cancel = () => {
    onCancel()
  }

  return (
    <Form onFinish={onFinish}>
      <Form.Item name={"type"} label={"Тип объекта"}>
        <Select
          options={univerObjectSelectOptions}
          onChange={selectForm}
          size={"small"}
        />
      </Form.Item>
      <CurrentUOForm />
      <Space align={"end"}>
        <Button onClick={cancel}>Отмена</Button>
        <Button type={"primary"} htmlType="submit">
          Создать
        </Button>
      </Space>
    </Form>
  )
}
