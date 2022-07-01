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
<<<<<<< HEAD
// import { SwitchTab } from '../App.d';
=======
>>>>>>> 036ec09... cleaned up app.d, option bar, service info, tab, tab bar, yamlParser
import { useAppSelector } from '../../hooks'

const TabBar: React.FC = () => {
  const openFiles = useAppSelector(state => state.openFiles);
  const activePath = useAppSelector(state => state.filePath);
<<<<<<< HEAD
  console.log(openFiles);
  // console.log(openFiles)
=======
>>>>>>> 036ec09... cleaned up app.d, option bar, service info, tab, tab bar, yamlParser
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
