/**
 * ************************************
 *
 * @module  D3Wrapper.tsx
 * @author
 * @date 3/11/20
 * @description Container to hold all the d3 visualation components
 *
 * ************************************
 */
import React from 'react';
// IMPORT COMPONENTS
import FileSelector from './FileSelector';
import VolumesWrapper from './VolumesWrapper';
import ErrorDisplay from './ErrorDisplay';
import View from './View';

// IMPORT HELPER FUNCTIONS
import colorSchemeIndex from '../helpers/colorSchemeIndex';
import { useAppSelector } from '../../hooks';


// IMPORT TYPES
// import {
//   FileOpen,
//   Services,
//   SetSelectedContainer,
//   Options,
//   ReadOnlyObj,
//   ViewT,
// } from '../App.d';

// type Props = {
//   fileOpen: FileOpen;
//   setSelectedContainer: SetSelectedContainer;
//   fileOpened: boolean;
//   services: Services;
//   options: Options;
//   volumes: ReadOnlyObj;
//   bindMounts: Array<string>;
//   view: ViewT;
//   networks: ReadOnlyObj;
//   selectedNetwork: string;
//   openErrors: string[];
// };

const D3Wrapper: React.FC= (
  // fileOpened,
  // fileOpen,
  // services,
  // setSelectedContainer,
  // options,
  // volumes,
  // bindMounts,
  // view,
  // networks,
  // selectedNetwork,
  // openErrors,
) => {
  // console.log('this is state in d3Wrapper', state);
  const fileOpened = useAppSelector((state) => state.fileOpened);
  const services = useAppSelector((state) => state.services);
  const options = useAppSelector((state) => state.options);
  const volumes = useAppSelector((state) => state.volumes);
  const bindMounts = useAppSelector((state) => state.bindMounts);
  const networks = useAppSelector((state) => state.networks);
  const selectedNetwork = useAppSelector((state) => state.selectedNetwork);
  const openErrors = useAppSelector((state) => state.openErrors);
  const view = useAppSelector((state) => state.view);
  const kubeBool = useAppSelector((state) => state.kubeBool);


  //  console.log('services in d3wrapper: ', services)
  //  console.log('fileOpened', fileOpened);
  // invoke function that returns a function with the closure object for tracking colors
  const getColor = colorSchemeIndex();

  
  return (
    
    <div className="d3-wrapper">
      {/**
       * if a file hasn't been opened
       * ** if errors, display them
       * ** always display open button
       * else display visualizer
       * (yes, this is nested terinary operator)
       */}
      {!fileOpened ? ( //if no file has been opened...
        <div className="error-open-wrapper"> 
          {openErrors.length > 0 ? ( //check if there are any errors
            <ErrorDisplay openErrors={openErrors} /*if there are, render ErrorDisplay *//>
          ) : ( //if there aren't any errors, display the option to open a file
            <></>
          )}
          <FileSelector />
        </div>
      ) : ( //if the file has been opened with no errors, display this:
        <>
          <div className="services-wrapper">
            <View
              services={services}
              options={options}
              view={view}
              networks={networks}
              selectedNetwork={selectedNetwork}
              getColor={getColor}
            />
          </div>
          {kubeBool ? null : 
          <VolumesWrapper
            bindMounts={bindMounts}
            volumes={volumes}
            getColor={getColor}
          /> }
          
        </>
      )}
    </div>
  );
};

export default D3Wrapper;
