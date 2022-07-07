/**
 * ************************************
 *
 * @module  OptionBar.tsx

 * @author Tyler Hurtt, Michael Villamor
 * @date 3/11/20 edited 7/7/22
 * @description Used to display toggle options. Refactored into a draggable bar, moved all buttons to left nav
 *
 * ************************************
 */
import React from 'react';

const OptionBar: React.FC = () => {


  return (
    <div className="option-bar">
      <div className="views flex">
      </div>
      <div className="titles flex">
        <div className="vl"></div>   
      </div>
    </div>
  );
};

export default OptionBar;
