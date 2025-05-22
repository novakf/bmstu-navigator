import { CheckOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Input, Space, message } from 'antd';
import { ChangeEventHandler, useEffect, useState } from 'react';
import {
  addUoToHolderAction,
  setUoItemsAction,
  setUoLinksAction,
  useCorpus,
  useFloor,
  useScale,
  useSelectedElement,
  useUoHolders,
  useUoItems,
  useUoLinks,
} from '../../state/editor/slice';
import styled from 'styled-components';
import {
  addHallwayPointToCanvas,
  connectLinks,
  createHallwayPoint,
  createLink,
  disBetweenPoints,
  disFromPointToLine,
  getUoIdsByHolder,
  isConnector,
  isGuide,
  isPoint,
  isPointBetweenTwoPoints,
} from '../../utils';
import { Link, UniverPointObject } from '../../interfaces';
import { matches, remove, sortBy } from 'lodash';
import { useDispatch } from 'react-redux';

export const UOLinkToolbar = ({
  modeActive,
  setModeActive,
}: {
  modeActive?: boolean;
  setModeActive?: (v: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const uoItems = useUoItems();
  const uoLinks = useUoLinks();
  const floor = useFloor();
  const corpus = useCorpus()
  const scale = useScale();
  const [leftNodeId, setLeftNodeId] = useState('');
  const [rightNodeId, setRightNodeId] = useState('');
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [leftNodeError, setLeftNodeError] = useState(false);
  const [rightNodeError, setRightNodeError] = useState(false);
  const [weightError, setWeightError] = useState(false);
  const se = useSelectedElement();
  const selectedUoId = se?.uo?.id;

  useEffect(() => {
    if (!modeActive) return;
    if (!selectedUoId) return;
    if (!scale) return;

    if (!leftNodeId) {
      setLeftNodeId(selectedUoId);
      return;
    }

    if (rightNodeId) {
      setLeftNodeId(selectedUoId);
      setRightNodeId('');
      return;
    }

    setRightNodeId(selectedUoId);

    if (isPoint(uoItems[selectedUoId]) && isPoint(uoItems[leftNodeId])) {
      const left = uoItems[leftNodeId];
      const right = uoItems[selectedUoId];

      const width = (right.xCoord ?? 0) - (left.xCoord ?? 0);
      const height = (right.yCoord ?? 0) - (left.yCoord ?? 0);
      const distance = Math.sqrt(height ** 2 + width ** 2) * scale;

      setWeight(+distance.toFixed(2));
    }
  }, [selectedUoId]);

  // const toggleMode = () => {
  //   setModeActive(!modeActive);
  // };

  const linkNodes = () => {
    if (!scale) {
      message.error('Заполните масштаб');
      return;
    }

    if (!floor) {
      message.error('Заполните этаж');
      return;
    }

    if (!corpus) {
      message.error('Заполните корпус');
      return;
    }

    if (!leftNodeId || !rightNodeId) {
      message.error('Заполните поля связки');
      return;
    }

    const left = uoItems[leftNodeId];
    const right = uoItems[rightNodeId];
    console.log(left, right);

    if (!isConnector(left) && !isConnector(right)) {
      message.error('Хотя бы один из узлов должен быть коннектором');
      return;
    }

    if (isConnector(left) && isConnector(right)) {
      if (isPoint(left) && isPoint(right)) {
        const updatedLinks: Record<string, Link[]> = structuredClone(uoLinks);

        connectLinks(updatedLinks, left, right, scale);

        dispatch(
          setUoLinksAction({
            ...uoLinks,
            ...updatedLinks,
          })
        );
      } else if (isGuide(left) && isGuide(right)) {
        //
      } else {
        const guide = isGuide(left) ? left : isGuide(right) ? right : null;
        const point = isPoint(left) ? left : isPoint(right) ? right : null;

        if (!guide || !point) throw new Error('not point, not guide');

        let hallwayPointProto = { len: Infinity, x: 0, y: 0 };
        for (const line of guide.lines) {
          const dis = disFromPointToLine(
            point.xCoord,
            point.yCoord,
            line,
            scale
          );

          if (dis.len < hallwayPointProto.len) {
            hallwayPointProto = dis;
          }
        }

        const hallwayPoint = createHallwayPoint({
          ...hallwayPointProto,
          floor,
          corpus,
        });
        addHallwayPointToCanvas(hallwayPoint);

        const guidePoints = getUoIdsByHolder(guide).map(
          (pointId) => uoItems[pointId] as UniverPointObject
        );

        const sortedGuidePoints = sortBy(guidePoints, (gp) =>
          disBetweenPoints(
            gp.xCoord,
            gp.yCoord,
            point.xCoord,
            point.yCoord,
            scale
          )
        );

        const firstNearest = sortedGuidePoints[0];
        let secondNearest: UniverPointObject | undefined;

        for (let i = 1; i < sortedGuidePoints.length; i++) {
          let pSecondNearest = sortedGuidePoints[i];

          if (
            isPointBetweenTwoPoints(hallwayPoint, firstNearest, pSecondNearest)
          ) {
            secondNearest = pSecondNearest;
            break;
          }
        }

        const updatedLinks: Record<string, Link[]> = structuredClone(uoLinks);
        connectLinks(updatedLinks, hallwayPoint, point, scale);

        if (firstNearest && secondNearest) {
          connectLinks(updatedLinks, firstNearest, hallwayPoint, scale);
          connectLinks(updatedLinks, secondNearest, hallwayPoint, scale);

          // делаем разрыв, потому что точка вставляется между
          remove(updatedLinks[firstNearest.id], { id: secondNearest.id });
          remove(updatedLinks[secondNearest.id], { id: firstNearest.id });
        } else if (firstNearest) {
          connectLinks(updatedLinks, firstNearest, hallwayPoint, scale);
        }

        dispatch(
          setUoLinksAction({
            ...uoLinks,
            ...updatedLinks,
          })
        );

        dispatch(addUoToHolderAction([guide.id, hallwayPoint.id]));

        dispatch(
          setUoItemsAction({
            ...uoItems,
            [hallwayPoint.id]: hallwayPoint,
          })
        );
      }
    } else {
      const connector = isConnector(left) ? left : right;
      const real = isConnector(left) ? right : left;

      dispatch(addUoToHolderAction([real.id, connector.id]));
    }

    setLeftNodeId('');
    setRightNodeId('');
    setWeight(undefined);

    if (setModeActive) {
      setModeActive(false);
    }

    message.success('Связь создана');
  };

  const changeLeftNode: ChangeEventHandler<HTMLInputElement> = (e) => {
    setLeftNodeId(e.target.value.trim());
  };

  const changeRightNode: ChangeEventHandler<HTMLInputElement> = (e) => {
    setRightNodeId(e.target.value.trim());
  };

  const changeWeight: ChangeEventHandler<HTMLInputElement> = (e) => {
    setWeight(+e.target.value.trim());
  };

  return (
    <Space>
      {/* <Button
        type={modeActive ? 'primary' : 'default'}
        icon={<LinkOutlined />}
        onClick={toggleMode}
      /> */}
      <>
        <NodeInput
          placeholder="ID объекта 1"
          value={leftNodeId}
          onChange={changeLeftNode}
          status={leftNodeError ? 'error' : ''}
        />
        <NodeInput
          placeholder="ID объекта 2"
          value={rightNodeId}
          onChange={changeRightNode}
          status={rightNodeError ? 'error' : ''}
        />
        <NodeInput
          placeholder={'Вес'}
          value={weight}
          onChange={changeWeight}
          type={'number'}
          status={weightError ? 'error' : ''}
        />
        <Button
          icon={<CheckOutlined />}
          onClick={linkNodes}
          disabled={leftNodeError || rightNodeError || weightError}
        />
      </>
    </Space>
  );
};

const NodeInput = styled(Input)`
  width: 100px;
`;
