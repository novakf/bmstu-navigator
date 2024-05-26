import { FC, useEffect, useState } from "react"
import {
  setActiveFloorAction,
  useActiveFloor,
  useActiveRoute,
} from "../../state/viewer"
import { useUoItems, useUoLinks } from "../../state/editor/slice"
import {
  UniverObject,
  UniverObjectType,
  UniverPointObject,
} from "../../interfaces"
import { isPoint } from "../../utils"
import styled from "styled-components"
import { buildRouteByPointsOnSvg, clearRouteOnSvg, splitBySteps } from "./utils"
import { findIndex } from "lodash"
import { useDispatch } from "react-redux"

export type Step = {
  type: "vertical" | "horizontal"
  points: UniverPointObject[]
  len: number
  // for horizontal
  floor?: number
  // for vertical
  fromFloor?: number
  toFloor?: number
}

export const RouteStepper: FC = () => {
  const dispatch = useDispatch()
  const uoItems = useUoItems()
  const uoLinks = useUoLinks()
  const activeFloor = useActiveFloor()
  const activeRoute = useActiveRoute()
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    if (!activeRoute) {
      setActiveStep(null)
      setSteps([])
      clearRouteOnSvg()
      return
    }

    const points = activeRoute.pointIds
      .map<UniverObject>((pointId) => uoItems[pointId])
      .filter(isPoint)

    const steps = splitBySteps(points, uoLinks)
    console.log(steps)

    setSteps(steps)

    if (steps[0]) activateStep(steps[0])
  }, [activeRoute])

  useEffect(() => {
    const foundedStep = findIndex(steps, { floor: activeFloor })
    setActiveStep(foundedStep)
  }, [activeFloor, steps])

  const activateStep = (step: Step) => {
    if (step.type === "vertical") return

    dispatch(setActiveFloorAction(step.floor!))

    // ждем dom переключения этажей
    setTimeout(() => {
      buildRouteByPointsOnSvg(step.points)
    }, 200)
  }

  return (
    <Container>
      {steps.map((step, i) => (
        <StyledStep
          key={i}
          $active={activeStep === i}
          $interact={step.type === "horizontal"}
          onClick={() => activateStep(step)}
        >
          {getStepText(step)}
        </StyledStep>
      ))}
    </Container>
  )
}

const getStepText = (step: Step) => {
  if (step.type === "vertical") {
    const dir =
      Number(step.fromFloor) > Number(step.toFloor) ? "Спуститься" : "Подняться"

    return `${dir} с ${step.fromFloor} на ${step.toFloor}`
  } else {
    return `Пройти ${step.len} метров`
  }
}

const Container = styled.div`
  position: fixed;
  z-index: 10000;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  gap: 20px;
`

const StyledStep = styled.div<{ $interact: boolean; $active: boolean }>`
  border: 2px solid lightgray;
  border-radius: 16px;
  background: white;
  padding: 16px;
  white-space: nowrap;
  transition: 0.3s;

  ${(p) =>
    p.$interact &&
    `
    &:hover {
      box-shadow: 0 0 8px lightgray;
      cursor: pointer;
    } 
  `}

  ${(p) =>
    p.$active &&
    `
      border: 2px solid blue;
  `}
`
