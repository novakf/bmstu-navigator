import { CommonFormItems } from "./common-form"

export const AuditoriumPointForm = () => {
  return (
    <>
      <CommonFormItems.Name />
      <CommonFormItems.SvgId />
      <CommonFormItems.PointCoords />
    </>
  )
}
