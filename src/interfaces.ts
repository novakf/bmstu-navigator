export enum UniverObjectType {
  'Auditorium' = 'auditorium',
  'AuditoriumPoint' = 'auditorium-point',
  'Hallway' = 'hallway',
  'HallwayPoint' = 'hallway-point',
  'Guide' = 'guide',
  'Ladder' = 'ladder',
  'LadderPoint' = 'ladder-point',
  'FloorPoint' = 'floor-point',
}

export type Link = {
  id: string;
  len: number;
};

export type LinePointed = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Point = {
  x: number;
  y: number;
};

export type UniverObject = {
  id: string;
  svgId: string;
  name: string;
  type: UniverObjectType;
  floor: number;
  description?: string;
  // for points
  xCoord?: number;
  yCoord?: number;
  // for guides
  lines?: LinePointed[];
  status?: string;
};

export type UniverPointObject = {
  id: string;
  svgId: string;
  name: string;
  type: UniverObjectType;
  floor: number;
  xCoord: number;
  yCoord: number;
};

export type UniverGuideObject = {
  id: string;
  svgId: string;
  name: string;
  type: UniverObjectType;
  floor: number;
  lines: LinePointed[];
};
