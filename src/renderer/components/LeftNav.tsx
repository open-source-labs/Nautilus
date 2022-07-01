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
// import OptionBar from './OptionBar';
import Title from './Title';
import NetworksDropDown from './NetworksDropdown';
// import { FileOpen, Service } from '../App.d';
// import AppState from '../../store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updateOption, updateViewStore } from '../../reducers/appSlice';
// type Props = {
//   service: Service;
//   selectedContainer: string;
//   fileOpen: FileOpen;
//   fileOpened: boolean;
//   currentFilePath: string;
// };
import { Handler } from '../App.d';
// import { color } from 'd3';

const LeftNav: React.FC = ({
}) => {
  const dispatch = useAppDispatch();
  const fileOpened = useAppSelector(state => state.fileOpened)
  const options = useAppSelector((state) => state.options);
  const view = useAppSelector((state) => state.view);
  const dependsOnClass = view === 'depends_on' ? 'option selected' : 'option';

  const handleViewUpdate: Handler = (e) => {
    const view = e.currentTarget.id as 'networks' | 'depends_on';
    // updateView(view);
    dispatch(updateViewStore({view:view}))
  };

  const handleOptionUpdate: Handler = (e) => {
    const option = e.currentTarget.id as 'ports' | 'volumes' | 'selectAll';
    // updateOption(option)
    
      // check if select all should be on or off
    dispatch(updateOption(option));
  };

  // creates an array of jsx elements for each option
  const optionsDisplay = Object.keys(options).map((opt, i) => {
    let title = '';
    // format select all title
    if (opt === 'selectAll') title = ' Select All';
    else if (opt === 'ports') title = 'Ports |';
    else if (opt === 'volumes') title = ' Volumes |';
    // otherwise set title to option name
    // else title = opt;

    return (
      <span
        key={`opt${i}`}
        // if the current option is selected, give it the 'selected' class
        className={
          options[opt as 'selectAll' | 'ports' | 'volumes']
            ? 'option selected'
            : 'option'
        }
        id={opt}
        onClick={handleOptionUpdate}
      >
        {title}
      </span>
    );
  });
  return (
    <div className="left-nav">
      <div className="top-half">
        <Title />
        {fileOpened ? <FileSelector  /> : null}
      </div>
      <ServiceInfo  />
      <NetworksDropDown/>
      <span
          className={dependsOnClass}
          id="depends_on"
          onClick={handleViewUpdate}
        >
          <p>Depends On</p>
        </span>
      <div className="options-flex2">{optionsDisplay}</div>
      <ComposeDeployment/>
      <ClusterDeployment/>
    </div>
  );
};

export default LeftNav;
