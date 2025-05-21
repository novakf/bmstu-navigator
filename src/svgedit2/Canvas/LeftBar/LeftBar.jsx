import React, { useCallback, useEffect, useRef, useState } from 'react';

import IconButton from '../IconButton/IconButton.jsx';
import './LeftBar.less';

import { canvasContext } from '../Context/canvasContext.jsx';
import updateCanvas from '../editor/updateCanvas.js';
import config from '../editor/config.js';

const LeftBar = () => {
  const [canvasState, canvasStateDispatcher] = React.useContext(canvasContext);
  const { canvas, mode, selectedElement, multiselected } = canvasState;

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const moveSelected = (dx, dy) => {
    if (selectedElement || multiselected) {
      // Use grid snap value regardless of zoom level
      const multi = canvas.getZoom() * config.snappingStep;
      dx *= multi;
      dy *= multi;

      canvas.moveSelectedElements(dx, dy);
    }
  };

  const setMode = (newMode) =>
    canvasStateDispatcher({ type: 'mode', mode: newMode });

  const onClickUndo = () => {
    canvas.undoMgr.undo();
    // populateLayers()
  };
  const onClickRedo = () => {
    canvas.undoMgr.redo();
    // populateLayers()
  };

  const onKey = (event) => {
    if (event.ctrlKey && event.key === 'v') {
      const mouseX = mousePosition.x;
      const mouseY = mousePosition.y;

      canvas.cloneSelectedElements(mouseX, mouseY);
    }
  };

  useEffect(() => {
    if (!canvas) return;

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        canvas.cloneSelectedElements(20, 20);
      }
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        onClickUndo(event);
      }
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        onClickRedo(event);
      }
      if (event.ctrlKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        moveSelected(-1, 0);
      }
      if (event.ctrlKey && event.key === 'ArrowRight') {
        event.preventDefault();
        moveSelected(1, 0);
      }
      if (event.ctrlKey && event.key === 'ArrowUp') {
        event.preventDefault();
        moveSelected(0, -1);
      }
      if (event.ctrlKey && event.key === 'ArrowDown') {
        event.preventDefault();
        moveSelected(0, 1);
      }
    });

    return document.removeEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        canvas.cloneSelectedElements(20, 20);
      }
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        onClickUndo(event);
      }
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        onClickRedo(event);
      }
    });
  }, [canvas, selectedElement]);

  const [imgSrc, setimgSrc] = useState(null);
  const imageRef = useRef(null);

  const handleImageChange = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let reader = new FileReader();
    reader.onload = (e) => {
      setimgSrc(e.target?.result);
    };

    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    const imgI = new Image();

    imgI.addEventListener('load', (e) => {
      // create a canvas the same size as the raster image
      const cvs = document.createElement('canvas');
      cvs.width = e.currentTarget.width;
      cvs.height = e.currentTarget.height;
      // load the raster image into the canvas
      cvs.getContext('2d').drawImage(e.currentTarget, 0, 0);
      // retrieve the data: URL
      try {
        let urldata = ';svgedit_url=' + encodeURIComponent(imgSrc);
        urldata = cvs.toDataURL().replace(';base64', urldata + ';base64');
        canvas.setEncodableImages(imgSrc, urldata);
      } catch (e) {
        canvas.setEncodableImages(imgSrc, false);
      }
      canvas.setGoodImage(imgSrc);

      console.log(imgSrc, canvas.getEncodableImages(imgSrc));

      const imgComp = document.createElement('image');
      imgComp.setAttribute('x', '0');
      imgComp.setAttribute('y', '0');
      imgComp.setAttribute('width', e.currentTarget.width);
      imgComp.setAttribute('height', e.currentTarget.height);
      imgComp.setAttribute('id', canvas.getNextId());
      imgComp.setAttribute('xlink:href', imgSrc);

      const svgContent = canvas.getSvgContent();
      const elements = svgContent.querySelector('g');
      elements.insertAdjacentHTML('beforeend', imgComp.outerHTML);

      canvas.changeSvgContent();
      console.log(canvas);
    });
    imgI.addEventListener('error', (e) => {
      console.error(e);
    });
    imgI.setAttribute('src', imgSrc);
  }, [imgSrc]);

  return (
    <div className="left-bar">
      <div className="left-bar-container">
        <IconButton
          icon="Select"
          text="Выбор"
          className={mode === 'select' ? 'selected' : ''}
          onClick={() => setMode('select')}
        />
        <IconButton
          icon="Circle"
          text="Круг"
          className={mode === 'circle' ? 'selected' : ''}
          onClick={() => setMode('circle')}
        />
        <IconButton
          icon="Rect"
          text="Прямоугольник"
          className={mode === 'rect' ? 'selected' : ''}
          onClick={() => setMode('rect')}
        />
        <IconButton
          icon="Path"
          text="Ломаная"
          className={mode === 'path' ? 'selected' : ''}
          onClick={() => setMode('path')}
        />
        <IconButton
          icon="Line"
          text="Прямая"
          className={mode === 'line' ? 'selected' : ''}
          onClick={() => setMode('line')}
        />
        <IconButton
          icon="Text"
          text="Текст"
          className={mode === 'text' ? 'selected' : ''}
          onClick={() => setMode('text')}
        />
        <IconButton
          icon="Group"
          text="Группировка"
          onClick={() => {
            canvas.groupSelectedElements();
          }}
        />
        <IconButton
          icon="Image"
          text="Картинка"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            imageRef.current?.click();
          }}
        />
      </div>
      <div className="left-bar-container">
        <IconButton
          icon="Undo"
          text="Отменить действие"
          className={mode === 'undo' ? 'selected' : ''}
          onClick={onClickUndo}
        />
        <IconButton
          icon="Redo"
          text="Повторить действие"
          className={mode === 'redo' ? 'selected' : ''}
          onClick={onClickRedo}
        />
      </div>
      <input
        style={{ display: 'none' }}
        ref={imageRef}
        type="file"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default LeftBar;
