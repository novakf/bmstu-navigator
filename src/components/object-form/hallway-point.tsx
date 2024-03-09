import { CommonFormItems } from "./common-form"

export const HallwayPointForm = () => {
  return (
    <>
      <CommonFormItems.Name />
      <CommonFormItems.SvgId />
      <CommonFormItems.PointCoords />
    </>
  )
}
