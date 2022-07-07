/**
 * ************************************
 *
 * @module  TabBar.tsx

 * @author David Soerensen and Linda Everswick, Jordan Long, Michael Villamor, Nathan Lovell, Giovanni Rodriguez
 * @date 5/30/20 edited 7/7/22
 * @description Used to display tabs of all open docker-compose files; added redux state management
 *
 * ************************************
 */

import React from 'react';
import Tab from './Tab';
import { useAppSelector } from '../../hooks'

const TabBar: React.FC = () => {
  const openFiles = useAppSelector(state => state.openFiles);
  const activePath = useAppSelector(state => state.filePath);
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
