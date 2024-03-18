export enum UniverObjectType {
  "Auditorium" = "auditorium",
  "AuditoriumPoint" = "auditorium-point",
  "HallwayPoint" = "hallway-point",
  "Ladder" = "ladder",
  "LadderPoint" = "ladder-point",
  "FloorPoint" = "floor-point",
}

export type UniverObject = {
  name: string
  svgId: string
  type: UniverObjectType
  xCoord?: string
  yCoord?: string
}
