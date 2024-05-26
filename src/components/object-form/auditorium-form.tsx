import { CommonFormItems } from "./common-form"

export const AuditoriumForm = () => {
  return (
    <>
      <CommonFormItems.Id />
      <CommonFormItems.SvgId />
      <CommonFormItems.Name />
      <CommonFormItems.Floor />
    </>
  )
}
