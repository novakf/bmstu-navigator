import { CommonFormItems } from "./common-form"

export const GuideForm = () => {
  return (
    <>
      <CommonFormItems.Id />
      <CommonFormItems.SvgId />
      <CommonFormItems.Name />
      <CommonFormItems.Lines />
      <CommonFormItems.Floor />
    </>
  )
}
