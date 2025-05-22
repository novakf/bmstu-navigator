import { SVG_ID_SLICE } from './constants';
import {
  LinePointed,
  UniverObject,
  UniverGuideObject,
  UniverPointObject,
  Point,
  UniverObjectType,
  Link,
} from './interfaces';
import { store } from './state';
import { selectUoHolders } from './state/editor/slice';

export const getUOById = (id: string): UniverObject | null => {
  return JSON.parse(localStorage.getItem(id) || 'null');
};

export const isPoint = (uo: UniverObject): uo is UniverPointObject => {
  return uo?.type.endsWith('point');
};

export const isGuide = (uo: UniverObject): uo is UniverGuideObject => {
  return uo?.type === 'guide';
};

export const isConnector = (uo: UniverObject) => {
  return isPoint(uo) || isGuide(uo);
};

export const fixed = (num: string | number) => {
  let tnum;

  if (typeof num === 'string') {
    tnum = Number(num);
  } else {
    tnum = num;
  }

  return Number(tnum.toFixed(2));
};

export const isSearchable = (uo: UniverObject) => {
  return (
    uo.type === UniverObjectType.Auditorium ||
    uo.type === UniverObjectType.Ladder
  );
};

export const createLineFrom = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): LinePointed => {
  return {
    x1,
    y1,
    x2,
    y2,
  };
};

export const disFromPointToLine = (
  x: number,
  y: number,
  line: LinePointed,
  scale: number
): { len: number; x: number; y: number } => {
  const A = x - line.x1;
  const B = y - line.y1;
  const C = line.x2 - line.x1;
  const D = line.y2 - line.y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  const param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = line.x1;
    yy = line.y1;
  } else if (param > 1) {
    xx = line.x2;
    yy = line.y2;
  } else {
    xx = line.x1 + param * C;
    yy = line.y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  const len = Math.sqrt(dx * dx + dy * dy) * scale;
  const roundedLen = +len.toFixed(2);

  return {
    len: roundedLen,
    x: xx,
    y: yy,
  };
};

export const disBetweenPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  scale: number
) => {
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * scale;
  const roundedLen = +len.toFixed(2);

  return roundedLen;
};

export const getUoIdsByHolder = (uo: UniverObject): string[] => {
  const state = store.getState();

  return selectUoHolders(state)[uo.id] || [];
};

export const createHallwayPoint = (
  point: Point & { floor: number; corpus: string }
): UniverPointObject => {
  const svgId = window.svgEditor.getNextId();
  const id = svgId.slice(SVG_ID_SLICE);

  return {
    id,
    svgId,
    type: UniverObjectType.HallwayPoint,
    floor: point.floor,
    corpus: point.corpus,
    name: `gen_${id}`,
    xCoord: point.x,
    yCoord: point.y,
  };
};

export const addHallwayPointToCanvas = (uoPoint: UniverPointObject) => {
  const element = window.svgEditor.addSVGElementsFromJson({
    element: 'circle',
    curStyles: true,
    attr: {
      cx: uoPoint.xCoord,
      cy: uoPoint.yCoord,
      r: 2,
      fill: 'green',
      opacity: 1,
      stroke: 'black',
      id: uoPoint.svgId,
    },
  });

  window.editor.svgCanvas.call('changed', [element]);

  return element;
};

export const createLink = (
  point1: UniverPointObject,
  point2: UniverPointObject,
  scale: number
) => {
  return {
    id: point1.id,
    len: disBetweenPoints(
      point1.xCoord,
      point1.yCoord,
      point2.xCoord,
      point2.yCoord,
      scale
    ),
  };
};

export const connectLinks = (
  container: Record<string, Link[]>,
  point1: UniverPointObject,
  point2: UniverPointObject,
  scale: number
) => {
  if (!container[point1.id]) container[point1.id] = [];
  if (!container[point2.id]) container[point2.id] = [];

  container[point1.id].push(createLink(point2, point1, scale));
  container[point2.id].push(createLink(point1, point2, scale));
};

export const isPointBetweenTwoPoints = (
  pointMiddle: UniverPointObject,
  pointLeft: UniverPointObject,
  pointRight: UniverPointObject
): boolean => {
  return (
    (pointLeft.xCoord < pointMiddle.xCoord &&
      pointRight.xCoord > pointMiddle.yCoord) ||
    (pointLeft.xCoord > pointMiddle.xCoord &&
      pointRight.xCoord < pointMiddle.xCoord) ||
    (pointLeft.yCoord < pointMiddle.yCoord &&
      pointRight.yCoord > pointMiddle.yCoord) ||
    (pointLeft.yCoord > pointMiddle.yCoord &&
      pointRight.yCoord < pointMiddle.yCoord)
  );
};
