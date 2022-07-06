/**
 * ************************************
 *
 * @module  LeftNav.tsx
 * @author
 * @date 3/11/20 edited 6/30/22
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
import NetworksDropDown from './NetworksDropdown';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { updateOption, updateViewStore } from '../../reducers/appSlice';
import { Handler } from '../App.d';



const LeftNav: React.FC = ({
}) => {
  const dispatch = useAppDispatch();
  const fileOpened = useAppSelector(state => state.fileOpened)
  const options = useAppSelector((state) => state.options);
  const view = useAppSelector((state) => state.view);

  
  const kubeBool = useAppSelector((state) => state.kubeBool);
  const kubeObj = useAppSelector((state) => state.kubeObj)
  console.log(kubeObj);



  const dependsOnClass = view === 'depends_on' ? 'option selected' : 'option';

  const handleViewUpdate: Handler = (e) => {
    const view = e.currentTarget.id as 'networks' | 'depends_on';
    
    dispatch(updateViewStore({view:view}))
  };

  const handleOptionUpdate: Handler = (e) => {
    const option = e.currentTarget.id as 'ports' | 'volumes' | 'selectAll';
    dispatch(updateOption(option));
  };

  // creates an array of jsx elements for each option
  const optionsDisplay = Object.keys(options).map((opt, i) => {
    let title = '';
    // format select all title
    if (opt === 'selectAll') title = ' Select All';
    else if (opt === 'ports') title = 'Ports ';
    else if (opt === 'volumes') title = ' Volumes ';
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
      {!kubeBool ? <ServiceInfo  /> : null}

      {kubeBool && kubeObj?.kind === 'Deployment' ? 
        <div className='kubeData'>
          <h2 className='kInfo'>Kubernetes Info:</h2>
          <ol className='kInfo2'>
            <ul>Name: {kubeObj.name}</ul>
            <ul>Kind: {kubeObj.kind}</ul>
            <ul>Replicas: {kubeObj.replica}</ul>
          </ol>
        </div> 
        : null}
      {!kubeBool && fileOpened  ? <NetworksDropDown/> : null}
      {!kubeBool && fileOpened ? <div>
        <span
          className={dependsOnClass}
          id="depends_on"
          onClick={handleViewUpdate}
        >
          Depends On
        </span>
        <div className="options-flex2">{optionsDisplay}</div> 
      </div> : null}
      {!kubeBool && fileOpened  ? <ComposeDeployment/> : null}
      {!kubeBool && fileOpened  ? <ClusterDeployment/> : null}
      

    </div>
  );
};

export default LeftNav;
