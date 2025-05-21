/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';

import IconButton from '../../svgedit2/Canvas/IconButton/IconButton';
import { styled } from 'styled-components';

const zoomOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200];

const ZoomBar = () => {
  return (
    <Container>
      <IconButton
        tooltipPlace={'top'}
        icon="Minus"
        text="Уменьшить"
        onClick={() => {}}
      />
      <IconButton onClick={() => {}}>%</IconButton>
      <IconButton
        tooltipPlace={'top'}
        icon="Plus"
        text="Увеличить"
        onClick={() => {}}
      />
    </Container>
  );
};

const Container = styled.div`
  transition: opacity 0.3s;
  position: absolute;
  bottom: 10px;
  right: 16px;
  display: flex;
  flex-direction: row;
  align-self: center;
  z-index: 1;
  background-color: #fff;
  box-shadow: 0 2px 4px 0px #22242814;
  border: 0.5px solid #e9eaef;
  border-radius: 8px;
  padding: 4px;
  height: 38px;
  align-items: center;
  padding-left: 6px;

  button {
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
  }
  button:hover {
    background-color: #e5e5e582;
  }
  button.selected {
    background-color: #e8ecfc;
  }
`;

export default ZoomBar;
