import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './top-bar.less';
import IconButton from '../../svgedit2/Canvas/IconButton/IconButton.jsx';
import Icon from '../../svgedit2/Canvas/Icon/Icon.jsx';
import { Button, Modal, Select, Tooltip } from 'antd';
import { styled } from 'styled-components';
import {
  setCampusAction,
  setFloorAction,
  useCorpus,
  useCurrFloorSvg,
  useCurrSchemeStatus,
  useFloor,
  useSchemes,
} from '../../state/editor/slice';
import { useDispatch } from 'react-redux';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RouteToolbar } from './route-toolbar';

const TopBar = () => {
  const dispatch = useDispatch();
  const schemes = useSchemes();
  const currentCampus = useCorpus();
  const currentFloor = useFloor();

  const navigate = useNavigate();

  const [showRouteBar, setShowRouteBar] = useState(false);

  console.log(currentFloor);

  let campuses = [];
  schemes.map((scheme) => {
    if (!campuses.includes(scheme.corpus)) {
      campuses.push(scheme.corpus);
    }
  });
  const schemeValues = campuses.map((corpus) => {
    return { value: corpus, label: corpus };
  });

  const currSchemeStatus = useCurrSchemeStatus();

  let floors = [];

  schemes.map((scheme) => {
    if (scheme.corpus === currentCampus) {
      floors.push(scheme.floor);
    }
  });

  const newFloorValues = floors.map((floor) => {
    return { value: floor, label: floor };
  });

  const [floorValues, setFloorValues] = useState(newFloorValues);

  const handlePlaceChange = (value) => {
    const newFloors = [];
    schemes.map((scheme) => {
      if (scheme.corpus === value) {
        newFloors.push(scheme.floor);
      }
    });
    const newFloorValues = newFloors.map((floor) => {
      return { value: floor, label: floor };
    });

    dispatch(setFloorAction(newFloors[0]));
    dispatch(setCampusAction(value));
    setFloorValues(newFloorValues);
  };

  useEffect(() => {
    let floors = [];

    console.log('schems', schemes);

    schemes.map((scheme) => {
      if (scheme.corpus === currentCampus) {
        floors.push(scheme.floor);
      }
    });

    const newFloorValues = floors.map((floor) => {
      return { value: floor, label: floor };
    });

    setFloorValues(newFloorValues);
  }, [schemes]);

  return (
    <div className="top-bar" style={{ marginLeft: 7 }}>
      <div style={{ flex: 1 }}>
        <div className="top-bar-container" style={{ flex: 1 }}>
          <Icon name={'Logo'} />
          <div
            style={{
              fontSize: 24,
              marginLeft: 6,
              marginRight: -6,
            }}
          ></div>

          <div
            style={{
              marginLeft: 6,
              marginRight: 6,
              fontSize: 24,
              color: '#d9d9d9',
              width: 1,
              height: '85%',
              borderRight: '1px solid',
            }}
          >
            {''}
          </div>

          <IconButton
            icon="Edit"
            text="Редактор"
            onClick={() => navigate('/editor')}
            tooltipPlace={'bottom'}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <div className="top-bar-container">
          <Select
            placeholder="Корпус"
            value={currentCampus}
            style={{ width: 180, fontSize: 18 }}
            onChange={handlePlaceChange}
            options={schemeValues}
          />
          <div
            style={{
              marginLeft: 8,
              marginRight: 16,
              fontSize: 24,
              color: '#d9d9d9',
              width: 1,
              height: '85%',
              borderRight: '1px solid',
            }}
          >
            {''}
          </div>
          <div
            style={{
              marginLeft: 4,
              marginRight: 4,
              fontSize: 18,
              color: '',
            }}
          >
            Этаж:
          </div>
          <Select
            style={{ width: 56, fontSize: 18, paddingTop: 2 }}
            value={currentFloor}
            onChange={(value) => {
              dispatch(setFloorAction(value));
            }}
            //disabled={floorValues.length === 0}
            options={floorValues}
          />
        </div>
        <div
          className="top-bar-container"
          style={{
            height: 38,
            width: 38,
            padding: 4,
            justifyContent: 'center',
            background: showRouteBar ? '#add9ff' : '#fff',
          }}
        >
          <IconButton
            icon="Route"
            text="Создать маршрут"
            onClick={() => {
              setShowRouteBar(!showRouteBar);
            }}
            tooltipPlace={'right'}
          />
        </div>{' '}
      </div>
      <div style={{ flex: 1 }}>
        <div className="top-bar-container" style={{ marginLeft: 'auto' }}>
          <IconButton icon="Avatar" text={'Профиль'} tooltipPlace={'bottom'} />
        </div>
      </div>
      <StyledRouteBar $active={showRouteBar}>
        <RouteToolbar />
      </StyledRouteBar>
    </div>
  );
};

const StyledRouteBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
  margin-inline: auto;
  transition: 0.3s;
  background-color: #fff;
  box-shadow: 0 2px 4px 0px #22242814;
  border: 0.5px solid #e9eaef;
  border-radius: 8px;
  padding: 8px;
  align-items: center;
  opacity: 0;
  width: fit-content;

  ${(p) =>
    p.$active &&
    `
    top: 66px;
    opacity: 1;
  `}
`;

TopBar.propTypes = {
  svgUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TopBar;

/*

The rect element
<rect x="60" y="10" rx="10" ry="10" width="30" height="30"/>
x The x position of the top left corner of the rectangle.
y The y position of the top left corner of the rectangle.
width The width of the rectangle
height The height of the rectangle
rx The x radius of the corners of the rectangle
ry The y radius of the corners of the rectangle

The circle element
<circle cx="25" cy="75" r="20"/>
r The radius of the circle.
cx The x position of the center of the circle.
cy The y position of the center of the circle.

Ellipse
<ellipse cx="75" cy="75" rx="20" ry="5"/>
rx The x radius of the ellipse.
ry The y radius of the ellipse.
cx The x position of the center of the ellipse.
cy The y position of the center of the ellipse.

Line
<line x1="10" x2="50" y1="110" y2="150"/>
x1 The x position of point 1.
y1 The y position of point 1.
x2 The x position of point 2.
y2 The y position of point 2.

Polyline
<polyline points="60, 110 65, 120 70, 115 75, 130 80, 125 85, 140 90, 135 95, 150 100, 145"/>
points A list of points, each number separated by a space, comma, EOL, or a line feed character.
Each point must contain two numbers, an x coordinate and a y coordinate.
So the list (0,0), (1,1), and (2,2) would be written as 0, 0 1, 1 2, 2.

Polygon
<polygon points="50, 160 55, 180 70, 180 60, 190 65, 205 50, 195 35, 205 40, 190 30, 180 45, 180"/>
points A list of points, each number separated by a space, comma, EOL, or a line feed character.
Each point must contain two numbers, an x coordinate and a y coordinate.
So the list (0,0), (1,1), and (2,2) would be written as 0, 0 1, 1 2, 2.
The drawing then closes the path, so a final straight line would be drawn from (2,2) to (0,0).

Path
<path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" stroke-width="5"/>
d A list of points and other information about how to draw the path. See the Paths section for more information.

*/
