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

export const Viewer: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    dispatch(initEditor());
    setIsInit(true);
  }, []);

  const navigate = useNavigate();

  if (!isInit) return null;

  return (
    <Container>
      <RouteToolbar />
      <Scheme />
      <FloorChoose />
      <RouteStepper />
      <Tooltip title="Редактор">
        <Button
          size="large"
          type="primary"
          icon={<EditOutlined />}
          style={{ position: 'absolute', right: 10, bottom: 10 }}
          onClick={() => navigate('/editor')}
        />
      </Tooltip>
    </Container>
  );
};

const Container = styled.div``;
