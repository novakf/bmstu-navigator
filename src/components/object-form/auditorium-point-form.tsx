import { CommonFormItems } from "./common-form"

export const AuditoriumPointForm = () => {
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
