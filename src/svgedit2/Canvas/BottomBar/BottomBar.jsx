/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';

import './BottomBar.less';
import ColorButton from '../ColorButton/ColorButton.jsx';
import Icon from '../Icon/Icon.jsx';

import { canvasContext } from '../Context/canvasContext.jsx';
import IconButton from '../IconButton/IconButton';

const zoomOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200];

const BottomBar = () => {
  const [canvasState, canvasStateDispatcher] = React.useContext(canvasContext);
  const { layerName, mode, zoom, selectedElement, canvas } = canvasState;

  const onChangeFillColor = (color) => {
    canvasStateDispatcher({ type: 'color', colorType: 'fill', color });
  };

  const onChangeStrokeColor = (color) => {
    canvasStateDispatcher({ type: 'color', colorType: 'stroke', color });
  };

  const selectedFillColor = selectedElement?.getAttribute('fill');
  const selectedStrokeColor = selectedElement?.getAttribute('stroke');

  const handleZoom = (newZoom, event) => {
    canvasStateDispatcher({ type: 'zoom', zoom: Number(newZoom), event });
  };

  useEffect(() => {
    if (!selectedElement) {
      canvasStateDispatcher({
        type: 'color',
        colorType: 'fill',
        color: '#ff0000',
      });
    }
  }, [selectedElement]);

  const svgroot = document.getElementById('svgroot');

  if (!svgroot) {
    return;
  }

  const element = svgroot;

  const workarea = document.getElementsByClassName('workarea')[0];

  svgroot.onwheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();

      if (e.deltaY < 0) {
        if (zoom < 500) {
          const newZoom = zoom + 5;
          handleZoom(newZoom, e);
        }
      } else {
        if (zoom > 10) {
          const newZoom = zoom - 5;
          handleZoom(newZoom, e);
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
      <div
        className="bottom-bar-container"
        style={{ opacity: selectedFillColor || selectedStrokeColor ? 1 : 0 }}
      >
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
      <div
        className="bottom-bar-container"
        style={{
          opacity: selectedElement ? 1 : 0,
          marginRight: 'auto',
          marginLeft: 4,
          zIndex: 0,
        }}
      >
        <IconButton
          tooltipPlace={'top'}
          icon="Foreground"
          onClick={() => {
            canvas.moveToTopSelectedElement();
          }}
        />
        <IconButton
          tooltipPlace={'top'}
          icon="Background"
          onClick={() => {
            canvas.moveToBottomSelectedElement();
          }}
        />
      </div>
      <div className="bottom-bar-container">
        <IconButton
          tooltipPlace={'top'}
          icon="Minus"
          onClick={() => handleZoom(zoom - 10)}
        />
        <IconButton>{zoom}%</IconButton>
        <IconButton
          tooltipPlace={'top'}
          icon="Plus"
          onClick={() => handleZoom(zoom + 10)}
        />
      </div>
    </div>
  );
};

export default BottomBar;
