import { UniverObject } from "./interfaces"

// const uoIsPoint = (uo) => {
//   //
// }

export const getUOById = (id: string): UniverObject | null => {
  return JSON.parse(localStorage.getItem(id) || "null")
}
