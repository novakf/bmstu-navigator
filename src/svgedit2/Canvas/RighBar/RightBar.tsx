import React, { useEffect, useState } from 'react';

import IconButton from '../IconButton/IconButton.jsx';
import './RightBar.less';

import { canvasContext } from '../Context/canvasContext.jsx';
import { styled } from 'styled-components';
import { Button, Input, Select } from 'antd';

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

const RightBar = () => {
  const [canvasState, canvasStateDispatcher] = React.useContext(canvasContext);
  const { canvas, mode, selectedElement } = canvasState;
  const [open, setOpen] = useState(Boolean(selectedElement));
  const [hide, setHide] = useState(false);

  const selectedId = selectedElement?.getAttribute('id');

  useEffect(() => {
    setOpen(Boolean(selectedElement));
  }, [selectedElement]);

  const handleTypeChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const element = selectedElement?.element;

  const univerObjectSelectOptions = [
    { value: UniverObjectType.Auditorium, label: 'Аудитория' },
    {
      value: UniverObjectType.AuditoriumPoint,
      label: 'Точка аудитории (дверь)',
      disabled: element?.tagName !== 'circle',
    },
    { value: UniverObjectType.Guide, label: 'Направляющая' },
    { value: UniverObjectType.Hallway, label: 'Коридор' },
    { value: UniverObjectType.Ladder, label: 'Лестница' },
    {
      value: UniverObjectType.HallwayPoint,
      label: 'Точка коридора',
      disabled: element?.tagName !== 'circle',
    },
    {
      value: UniverObjectType.LadderPoint,
      label: 'Точка лестницы',
      disabled: element?.tagName !== 'circle',
    },
    {
      value: UniverObjectType.FloorPoint,
      label: 'Точка этажа',
      disabled: element?.tagName !== 'circle',
    },
  ];

  return (
    <StyledRightBar $open={open}>
      <div className="right-bar-container">
        <Title>
          Объект{' '}
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>
            {selectedId}
          </span>
        </Title>
        <Select
          style={{ width: 180, fontSize: 18 }}
          onChange={handleTypeChange}
          options={univerObjectSelectOptions}
        />
        <Input />
        <Input />
        <Input />
        <Button type="primary">Нажми на меня</Button>
        <TopButtonsGroup>
          <StyledIconButton
            $hide={hide}
            icon="DownArrow"
            onClick={() => {
              console.log(hide);
              setHide(!hide);
            }}
          />
          <StyledIconButton
            onClick={() => {
              setOpen(false);
            }}
            icon="Exit"
          />
        </TopButtonsGroup>
      </div>
    </StyledRightBar>
  );
};

const StyledRightBar = styled.div<{ $open?: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 20px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  z-index: 1;

  transition: right 0.3s;
  right: ${(p) => (p.$open ? '20px' : '-500px')};
`;

const TopButtonsGroup = styled.div`
  display: flex;
  position: absolute;
  top: 10px;
  right: 10px;
  justify-content: center;
  align-items: center;
`;

const StyledIconButton = styled(IconButton)<{ $hide?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font: unset;
  width: 40px;
  color: #222428;
  background-color: #ffffff00;
  border-radius: 4px;
  height: 40px;
  border: none;
  margin: 2px;
  cursor: pointer;

  .OIe-tools-icon {
    width: 24px;
  }

  &:hover {
    background-color: #e5e5e582;
  }

  img {
    transform: ${(p) => (p.$hide ? 'rotate(0)' : 'rotate(180deg)')};
    transition: transform 0.3s;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-right: 100px;
`;

export default RightBar;
