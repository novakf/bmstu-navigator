import { find } from "lodash"
import { Link, UniverObjectType, UniverPointObject } from "../../interfaces"
import { UoLinks } from "../../state/editor/slice"
import { Step } from "./route-stepper"

export const clearRouteOnSvg = () => {
  const gRoute = document.querySelector(".scheme-container g.route")

  if (!gRoute) return

  gRoute.innerHTML = ""
}

export const buildRouteByPointsOnSvg = (points: UniverPointObject[]) => {
  const gRoute = document.querySelector(".scheme-container g.route")

  if (!gRoute) return

  gRoute.innerHTML = ""

  let startPoint = points[0]
  for (let i = 1; i < points.length; i++) {
    let endPoint = points[i]

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line.setAttribute("x1", String(startPoint.xCoord))
    line.setAttribute("y1", String(startPoint.yCoord))
    line.setAttribute("x2", String(endPoint.xCoord))
    line.setAttribute("y2", String(endPoint.yCoord))
    line.style.stroke = "#000"
    line.style.strokeWidth = "2px"

    gRoute.appendChild(line)

    startPoint = endPoint
  }
}

export const splitBySteps = (points: UniverPointObject[], links: UoLinks) => {
  const steps: Step[] = []

  let curPoints: UniverPointObject[] = []
  for (let i = 0; i < points.length; i++) {
    curPoints.push(points[i])

    if (
      points[i].type === UniverObjectType.LadderPoint &&
      curPoints.length > 1
    ) {
      steps.push({
        type: "horizontal",
        points: curPoints,
        floor: points[i].floor,
        len: computeLenByPoints(curPoints, links),
      })

      curPoints = []

      if (
        points[i + 1] &&
        points[i + 1].type === UniverObjectType.LadderPoint
      ) {
        steps.push({
          type: "vertical",
          points: [points[i], points[i + 1]],
          len: 2,
          fromFloor: points[i].floor,
          toFloor: points[i + 1].floor,
        })

        curPoints = [points[i + 1]]
        i++
      }
    }
  }

  if (curPoints.length) {
    steps.push({
      type: "horizontal",
      points: curPoints,
      floor: curPoints[0].floor,
      len: computeLenByPoints(curPoints, links),
    })
  }

  return steps
}

const computeLenByPoints = (
  points: UniverPointObject[],
  links: UoLinks
): number => {
  let len = 0
  for (let i = 0; i < points.length - 1; i++) {
    const prevPoint = points[i]
    const nextPoint = points[i + 1]

    const link = find(links[prevPoint.id], { id: nextPoint.id })

    len += link?.len ?? 0
  }

  return len
}
