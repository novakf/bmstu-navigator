import { CommonFormItems } from "./common-form"

export const LadderPointForm = () => {
  return (
    <>
      <CommonFormItems.Id />
      <CommonFormItems.SvgId />
      <CommonFormItems.Name />
      <CommonFormItems.PointCoords />
      <CommonFormItems.Floor />
    </>
  )
}
