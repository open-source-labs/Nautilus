/**
 * ************************************
 *
 * @module  TabBar.tsx

 * @author David Soerensen and Linda Everswick
 * @date 5/30/20
 * @description Used to display tabs of all open docker-compose files
 *
 * ************************************
 */

import React from 'react';
import Tab from './Tab';
import { SwitchTab } from '../App.d';


interface TabProps {
  openFiles: Array<string>,
  activePath: string,
}


const TabBar: React.FC<TabProps> = ({
  openFiles,
  activePath,
}) => {
  // console.log(openFiles)
  const tabs = openFiles.map((filePath) => (
    <Tab
      key={`${filePath}`}
      filePath={`${filePath}`}
      activePath={activePath}
    />
  ));
  return <div className="tab-bar">{tabs}</div>;
};

export default TabBar;
