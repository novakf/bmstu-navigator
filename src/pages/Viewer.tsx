import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FloorChoose } from '../components/viewer/floor-choose';
import { Scheme } from '../components/viewer/scheme';
import { useDispatch } from 'react-redux';
import { initEditor } from '../state/editor/slice';
import { AppDispatch } from '../state';
import { RouteToolbar } from '../components/viewer/route-toolbar';
import { RouteStepper } from '../components/viewer/route-stepper';
import { Button, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/viewer/top-bar';
import ZoomBar from '../components/viewer/zoom-bar';

export const Viewer: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isInit, setIsInit] = useState(false);

  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    dispatch(initEditor());
    setIsInit(true);
  }, []);

  if (!isInit) return null;

  return (
    <Container>
      <TopBar svgUpdate={() => {}} onClose={() => {}} />
      <Scheme zoom={zoom} setZoom={setZoom} />
      <ZoomBar zoom={zoom} setZoom={setZoom} />
      <RouteStepper />
    </Container>
  );
};

const Container = styled.div``;
