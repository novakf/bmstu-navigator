import { CommonFormItems } from "./common-form"

export const FloorPointForm = () => {
  return (
    <>
      <CommonFormItems.Name />
      <CommonFormItems.SvgId />
      <CommonFormItems.PointCoords />
    </>
  )
}
