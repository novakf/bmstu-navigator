import { CommonFormItems } from "./common-form"

export const LadderPointForm = () => {
  return (
    <>
      <CommonFormItems.Name />
      <CommonFormItems.SvgId />
      <CommonFormItems.PointCoords />
    </>
  )
}
