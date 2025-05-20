import { UniverObject } from "../../interfaces"
import { CommonFormItems } from "./common-form"

export const HallwayPointForm = () => {
  return (
    <>
      <CommonFormItems.Id />
      <CommonFormItems.SvgId />
      <CommonFormItems.Name />
      <CommonFormItems.PointCoords />
      <CommonFormItems.Floor />
      <CommonFormItems.Corpus />
    </>
  )
}
