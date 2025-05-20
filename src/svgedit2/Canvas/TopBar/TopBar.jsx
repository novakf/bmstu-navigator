import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import RectTools from './RectTools/RectTools.jsx';
import EllipseTools from './EllipseTools/EllipseTools.jsx';
import CircleTools from './CircleTools/CircleTools.jsx';
import PathTools from './PathTools/PathTools.jsx';
import TextTools from './TextTools/TextTools.jsx';
import GenericTools from './GenericTools/GenericTools.jsx';
import DelDupTools from './DelDupTools/DelDupTools.jsx';
import GroupTools from './GroupTools/GroupTools.jsx';
import AttributesTools from './AttributesTools/AttributesTools.jsx';

import { canvasContext } from '../Context/canvasContext.jsx';

import './TopBar.less';
import IconButton from '../IconButton/IconButton.jsx';
import Icon from '../Icon/Icon.jsx';
import {
  Button,
  Divider,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Upload,
  message,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { styled } from 'styled-components';
import {
  setCampusAction,
  setFloorAction,
  setNewSchemeAction,
  useCorpus,
  useCurrFloorSvg,
  useFloor,
  useSchemes,
} from '../../../state/editor/slice.ts';
import { useDispatch } from 'react-redux';

let index = 0;

const TopBar = ({ svgUpdate, onClose }) => {
  const [canvasState] = React.useContext(canvasContext);
  const { canvas, selectedElement, mode, updated } = canvasState;

  const dispatch = useDispatch();
  const schemes = useSchemes();
  const currentCampus = useCorpus();
  const currentFloor = useFloor();

  let campuses = [];
  schemes.map((scheme) => {
    if (!campuses.includes(scheme.corpus)) {
      campuses.push(scheme.corpus);
    }
  });
  const schemeValues = campuses.map((corpus) => {
    return { value: corpus, label: corpus };
  });

  const currFloorSvg = useCurrFloorSvg();

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

  const campusArray = schemes.map((scheme, i) => scheme.corpus);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickClose = () => {
    if (updated) {
      // eslint-disable-next-line no-alert
      if (
        !window.confirm('A change was not saved, do you really want to exit?')
      )
        return;
    }
    onClose();
  };

  const handleChange = (type, newVal) => {
    const elem = selectedElement;
    switch (type) {
      case 'font-family':
        canvasState.canvas.setFontFamily(newVal);
        break;
      case 'font-size':
        canvasState.canvas.setFontSize(newVal);
        break;
      case 'id':
        // if the user is changing the id, then de-select the element first
        // change the ID, then re-select it with the new ID
        canvasState.canvas.clearSelection();
        elem.id = newVal;
        canvasState.canvas.addToSelection([elem], true);
        break;
      default:
        console.error(`type (${type}) not supported`);
    }
  };

  let ElementTools;
  switch (canvasState.selectedElement?.tagName) {
    case 'rect':
      ElementTools = (
        <RectTools
          canvas={canvas}
          canvasUpdated={updated}
          selectedElement={selectedElement}
          svgUpdate={svgUpdate}
          onClose={onClose}
        />
      );
      break;

    case 'circle':
      ElementTools = (
        <CircleTools
          canvas={canvas}
          canvasUpdated={updated}
          selectedElement={selectedElement}
          svgUpdate={svgUpdate}
          onClose={onClose}
        />
      );
      break;

    case 'ellipse':
      ElementTools = (
        <EllipseTools
          canvas={canvas}
          canvasUpdated={updated}
          selectedElement={selectedElement}
          svgUpdate={svgUpdate}
          onClose={onClose}
        />
      );
      break;

    case 'text':
      ElementTools = (
        <TextTools
          selectedElement={selectedElement}
          handleChange={handleChange}
        />
      );
      break;

    case 'path':
      ElementTools = (
        <PathTools
          canvas={canvas}
          canvasUpdated={updated}
          selectedElement={selectedElement}
          svgUpdate={svgUpdate}
          onClose={onClose}
        />
      );
      break;

    case 'g':
    case 'image':
    case 'line':
    case 'polygon':
    case 'polyline':
    case 'textPath':
    default:
      ElementTools = selectedElement && (
        <AttributesTools
          selectedElement={selectedElement}
          handleChange={handleChange}
          attributes={{}}
        />
      );
  }

  const handlePlaceChange = (value) => {
    dispatch(setCampusAction(value));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [items, setItems] = useState(campusArray);
  const [name, setName] = useState('');
  const [newFloor, setNewFloor] = useState(null);
  const [schemeSvgFile, setSchemeSvgFile] = useState(null);
  const [schemeSvgStr, setSchemeSvgStr] = useState('');
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const addItem = (e) => {
    e.preventDefault();

    //dispatch(setNewSchemeAction({ corpus: name, floors: [newFloor] }));

    setItems([...items, name || `New item ${index++}`]);

    setTimeout(() => {
      var _a;
      (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, 0);
  };

  const handleOk = () => {
    let svgStr = schemeSvgStr;
    if (!schemeSvgFile) {
      // const svg = document.getElementById('svgcontent');
      // svgStr = svg.outerHTML;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '640');
      svg.setAttribute('height', '480');
      svg.setAttributeNS(
        'http://www.w3.org/2000/xmlns/',
        'xmlns',
        'http://www.w3.org/2000/svg'
      );
      svgStr = svg.outerHTML;
    }
    dispatch(
      setNewSchemeAction({
        corpus: name,
        floor: newFloor,
        svgFile: svgStr,
      })
    );
    dispatch(setFloorAction(newFloor));
    dispatch(setCampusAction(name));

    setNewFloor('');
    setSchemeSvgFile(null);
    setSchemeSvgStr('');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let floors = [];

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

  useEffect(() => {
    window.editorNew.load(currFloorSvg);
  }, [currentCampus, currentFloor]);

  return (
    <div className="top-bar">
      <div style={{ flex: 1 }}>
        <div className="top-bar-container" style={{ flex: 1 }}>
          {/* <GenericTools
          canvas={canvas}
          canvasUpdated={updated}
          selectedElement={selectedElement}
          svgUpdate={svgUpdate}
          onClose={onClose}
        />
        <DelDupTools canvas={canvas} />
        <GroupTools
          canvas={canvas}
          multiselected={canvasState.multiselected}
          selectedElement={selectedElement}
        />
        {ElementTools && ElementTools} */}
          <Icon name={'Logo'} />
          <div
            style={{
              fontSize: 24,
              marginLeft: 6,
              marginRight: 4,
            }}
          >
            BMSTU
          </div>

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
          <IconButton icon="Exit" onClick={onClickClose} />
          <IconButton
            icon="Save"
            className={updated ? 'enabled' : 'disabled'}
            onClick={() => {
              svgUpdate(canvas.getSvgString());
            }}
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
            disabled={floorValues.length === 0}
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
          }}
        >
          <IconButton icon="Plus" onClick={() => showModal()} />
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div className="top-bar-container" style={{ marginLeft: 'auto' }}>
          <IconButton icon="Avatar" />
        </div>
      </div>
      <StyledModal
        title="Добавить новый этаж"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Отменить
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Создать
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 4 }}>Название корпуса:</div>
        <Select
          style={{ width: 300 }}
          placeholder="Название корпуса"
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder="Новый корпус"
                  ref={inputRef}
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                  Добавить
                </Button>
              </Space>
            </>
          )}
          options={items.map((item) => ({ label: item, value: item }))}
        />
        <div style={{ marginTop: 10, marginBottom: 4 }}>Выберите этаж:</div>
        <InputNumber
          value={newFloor}
          onChange={(value) => {
            setNewFloor(value);
          }}
        />
        <div style={{ marginTop: 10, marginBottom: 4 }}>
          Загрузите файл (если есть):
        </div>
        <Upload
          action={''}
          onRemove={() => {
            setSchemeSvgFile(null);
          }}
          beforeUpload={(file) => {
            setSchemeSvgFile(file);

            file.text().then((svgText) => {
              setSchemeSvgStr(svgText);
            });

            return false;
          }}
          fileList={schemeSvgFile ? [schemeSvgFile] : []}
        >
          <Button icon={<UploadOutlined />}>Загрузить SVG</Button>
        </Upload>
      </StyledModal>
    </div>
  );
};

TopBar.propTypes = {
  svgUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const StyledModal = styled(Modal)`
  .ant-modal-body {
    overflow-y: hidden !important;
  }
`;

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
