/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';

import './BottomBar.less';
import ColorButton from '../ColorButton/ColorButton.jsx';
import Icon from '../Icon/Icon.jsx';

import { canvasContext } from '../Context/canvasContext.jsx';

const zoomOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200];

const BottomBar = () => {
  const [canvasState, canvasStateDispatcher] = React.useContext(canvasContext);
  const { layerName, mode, zoom, selectedElement } = canvasState;

  const onChangeFillColor = (color) => {
    canvasStateDispatcher({ type: 'color', colorType: 'fill', color });
  };

  const onChangeStrokeColor = (color) => {
    canvasStateDispatcher({ type: 'color', colorType: 'stroke', color });
  };

  const selectedFillColor = selectedElement?.getAttribute('fill');
  const selectedStrokeColor = selectedElement?.getAttribute('stroke');

  const handleZoom = (newZoom) => {
    canvasStateDispatcher({ type: 'zoom', zoom: Number(newZoom) });
  };

  const svgroot = document.getElementById('svgroot');

  if (!svgroot) {
    return;
  }

  svgroot.onwheel = (e) => {
    if (e.ctrlKey) {
      if (e.deltaY < 0) {
        if (zoom < 300) {
          const newZoom = zoom + 5;
          handleZoom(newZoom);
        }
      } else {
        if (zoom > 30) {
          const newZoom = zoom - 5;
          handleZoom(newZoom);
        }
      }
    }
  };

  let fullContext = '';
  if (canvasState.context) {
    let currentChild = canvasState.context;
    do {
      fullContext = `${currentChild.id ?? ''} ${fullContext}`;
      currentChild = currentChild.parentNode;
    } while (currentChild?.id === 'svgcontent');
  }

  return (
    <div className="bottom-bar">
      <div className="bottom-bar-container">
        <ColorButton
          onChange={onChangeFillColor}
          value={selectedFillColor}
          title="Fill"
        />
        <ColorButton
          onChange={onChangeStrokeColor}
          value={selectedStrokeColor}
          title="Stroke"
        />
      </div>
      <div className="bottom-bar-container">
        <Icon name="Zoom" className="OIe-zoom" />
      </div>
    </div>
  );
};

export default BottomBar;
