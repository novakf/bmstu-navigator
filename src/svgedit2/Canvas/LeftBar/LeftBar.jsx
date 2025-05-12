import React from 'react';

import IconButton from '../IconButton/IconButton.jsx';
import './LeftBar.less';

import { canvasContext } from '../Context/canvasContext.jsx';

const LeftBar = () => {
  const [canvasState, canvasStateDispatcher] = React.useContext(canvasContext);
  const { canvas, mode } = canvasState;

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

  return (
    <div className="left-bar">
      <div className="left-bar-container">
        <IconButton
          icon="Select"
          className={mode === 'select' ? 'selected' : ''}
          onClick={() => setMode('select')}
        />
        <IconButton
          icon="Ellipse"
          className={mode === 'ellipse' ? 'selected' : ''}
          onClick={() => setMode('ellipse')}
        />
        <IconButton
          icon="Rect"
          className={mode === 'rect' ? 'selected' : ''}
          onClick={() => setMode('rect')}
        />
        <IconButton
          icon="Path"
          className={mode === 'path' ? 'selected' : ''}
          onClick={() => setMode('path')}
        />
        <IconButton
          icon="Line"
          className={mode === 'line' ? 'selected' : ''}
          onClick={() => setMode('line')}
        />
        <IconButton
          icon="Text"
          className={mode === 'text' ? 'selected' : ''}
          onClick={() => setMode('text')}
        />
        <IconButton
          icon="Group"
          onClick={() => {
            canvas.groupSelectedElements();
          }}
        />
      </div>
      <div className="left-bar-container">
        <IconButton
          icon="Undo"
          className={mode === 'undo' ? 'selected' : ''}
          onClick={onClickUndo}
        />
        <IconButton
          icon="Redo"
          className={mode === 'redo' ? 'selected' : ''}
          onClick={onClickRedo}
        />
      </div>
    </div>
  );
};

export default LeftBar;
