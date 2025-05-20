// General imports
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'antd';

import Icon from '../Icon/Icon.jsx';
import './IconButton.less';

const IconButton = ({
  tooltipPlace,
  onClick,
  className,
  icon,
  children,
  text,
}) => {
  const title = text ? <span>{text}</span> : undefined;

  return (
    <button type="button" className={className} onClick={onClick}>
      <Tooltip placement={tooltipPlace || 'right'} title={title}>
        {children ? children : <Icon name={icon} className="OIe-tools-icon" />}
      </Tooltip>
    </button>
  );
};

// Properties restrictions
IconButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
};
IconButton.defaultProps = { className: 'button' };

export default IconButton;
