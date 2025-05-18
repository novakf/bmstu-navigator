// General consts
import React from 'react';
import PropTypes from 'prop-types';

const group = './images/group_elements.svg';
const ungroup = './images/ungroup.svg';
const undo = './images/undo.svg';
const redo = './images/redo.svg';
const select = './images/select.svg';
const line = './images/line.svg';
const circle = './images/circle.svg';
const ellipse = './images/ellipse.svg';
const square = './images/square.svg';
const rect = './images/rect.svg';
const save = './images/save.svg';
const text = './images/text.svg';
const del = './images/delete.svg';
const clone = './images/clone.svg';
const path = './images/path.svg';
const alignBottom = './images/align_bottom.svg';
const alignCenter = './images/align_center.svg';
const alignTop = './images/align_top.svg';
const alignLeft = './images/align_left.svg';
const alignRight = './images/align_right.svg';
const alignMiddle = './images/align_middle.svg';
const align = './images/align.svg';
const moveBottom = './images/move_bottom.svg';
const moveTop = './images/move_top.svg';
const bold = './images/bold.svg';
const italic = './images/italic.svg';
const fill = './images/fill.svg';
const stroke = './images/stroke.svg';
const fontSize = './images/fontsize.svg';
const noColor = './images/no_color.svg';
const zoom = './images/zoom.svg';
const close = './images/close.svg';
const exit = './images/exit.svg';
const palette = './images/palette.svg';
const plus = './images/plus.svg';
const minus = './images/minus.svg';
const downArrow = './images/down_arrow.svg';
const image = './images/image.svg';

const logo = './images/logo-bmstu.png';
const avatar = './images/avatar.png';

const Icon = ({ name, ...otherProps }) => {
  switch (name) {
    case 'Select':
      return <img src={select} alt="select" {...otherProps} />;
    case 'Line':
      return <img src={line} alt="line" {...otherProps} />;
    case 'Circle':
      return <img src={circle} alt="circle" {...otherProps} />;
    case 'Ellipse':
      return <img src={ellipse} alt="ellipse" {...otherProps} />;
    case 'Text':
      return <img src={text} alt="text" {...otherProps} />;
    case 'Delete':
      return <img src={del} alt="delete" {...otherProps} />;
    case 'Clone':
      return <img src={clone} alt="clone" {...otherProps} />;
    case 'Path':
      return <img src={path} alt="path" {...otherProps} />;
    case 'Square':
      return <img src={square} alt="square" {...otherProps} />;
    case 'Rect':
      return <img src={rect} alt="rect" {...otherProps} />;
    case 'Close':
      return <img src={close} alt="close" {...otherProps} />;
    case 'Save':
      return <img src={save} alt="save" {...otherProps} />;
    case 'Undo':
      return <img src={undo} alt="undo" {...otherProps} />;
    case 'Redo':
      return <img src={redo} alt="redo" {...otherProps} />;
    case 'Group':
      return <img src={group} alt="group" {...otherProps} />;
    case 'Ungroup':
      return <img src={ungroup} alt="group" {...otherProps} />;
    case 'AlignBottom':
      return <img src={alignBottom} alt="group" {...otherProps} />;
    case 'AlignCenter':
      return <img src={alignCenter} alt="group" {...otherProps} />;
    case 'AlignTop':
      return <img src={alignTop} alt="group" {...otherProps} />;
    case 'AlignLeft':
      return <img src={alignLeft} alt="group" {...otherProps} />;
    case 'AlignRight':
      return <img src={alignRight} alt="group" {...otherProps} />;
    case 'AlignMiddle':
      return <img src={alignMiddle} alt="group" {...otherProps} />;
    case 'Align':
      return <img src={align} alt="group" {...otherProps} />;
    case 'MoveBottom':
      return <img src={moveBottom} alt="group" {...otherProps} />;
    case 'MoveTop':
      return <img src={moveTop} alt="group" {...otherProps} />;
    case 'Bold':
      return <img src={bold} alt="group" {...otherProps} />;
    case 'Italic':
      return <img src={italic} alt="group" {...otherProps} />;
    case 'Fill':
      return <img src={fill} alt="group" {...otherProps} />;
    case 'Stroke':
      return <img src={stroke} alt="group" {...otherProps} />;
    case 'FontSize':
      return <img src={fontSize} alt="group" {...otherProps} />;
    case 'NoColor':
      return <img src={noColor} alt="group" {...otherProps} />;
    case 'Zoom':
      return <img src={zoom} alt="group" {...otherProps} />;
    case 'Exit':
      return <img src={exit} alt="exit" {...otherProps} />;
    case 'Palette':
      return <img src={palette} alt="palette" {...otherProps} />;
    case 'Plus':
      return <img src={plus} alt="plus" {...otherProps} />;
    case 'Minus':
      return <img src={minus} alt="minus" {...otherProps} />;
    case 'Image':
      return <img src={image} alt="image" {...otherProps} />;
    case 'DownArrow':
      return (
        <img
          src={downArrow}
          alt="arrow"
          {...otherProps}
          style={{ width: 18 }}
        />
      );
    case 'Logo':
      return (
        <img
          src={logo}
          alt="logo"
          {...otherProps}
          width={28}
          style={{ margin: '0 4px 0 4px' }}
        />
      );
    case 'Avatar':
      return <img src={avatar} alt="avatar" {...otherProps} width={40} />;
    default:
      return <img src={group} alt="group" {...otherProps} />;
  }
};

// Properties restriction
Icon.propTypes = { name: PropTypes.string.isRequired };

export default Icon;
