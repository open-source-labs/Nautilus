/**
 * ************************************
 *
 * @module  LeftNav.tsx
 * @author
 * @date 3/11/20
 * @description container for the title, the service info and the file open
 *
 * ************************************
 */
import React from 'react';

// IMPORT REACT COMPONENTS
import ServiceInfo from './ServiceInfo';
import FileSelector from './FileSelector';
import ComposeDeployment from './ComposeDeployment';
import ClusterDeployment from './ClusterDeployment';
import Title from './Title';
// import { FileOpen, Service } from '../App.d';
// import AppState from '../../store';
import { useAppSelector } from '../../hooks';

// type Props = {
//   service: Service;
//   selectedContainer: string;
//   fileOpen: FileOpen;
//   fileOpened: boolean;
//   currentFilePath: string;
// };

const LeftNav: React.FC = ({
}) => {
  const fileOpened = useAppSelector(state => state.fileOpened)
  return (
    <div className="left-nav">
      <div className="top-half">
        <Title />
        {fileOpened ? <FileSelector  /> : null}
      </div>
      <ServiceInfo  />
      <ComposeDeployment/>
      <ClusterDeployment/>
    </div>
  );
};

export default LeftNav;
